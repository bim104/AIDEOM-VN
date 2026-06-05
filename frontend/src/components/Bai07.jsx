import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

// =========================================================================
// 1. CẤU PHẦN ĐỒ HỌA 3D PARETO NATIVE TRỰC QUAN CAO + TƯƠNG TÁC HOVER TOOLTIP
// =========================================================================
function Pareto3DScatter({ data }) {
  const canvasRef = useRef(null);
  // Khởi tạo góc xoay phối cảnh chuẩn xác theo ảnh mẫu 328180
  const [rotation, setRotation] = useState({ x: 20, y: -55 });
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const projectedPointsRef = useRef([]);

  // Hàm định dạng hiển thị số thực thập phân Việt Nam
  const formatSmart = (num) => {
    if (num === undefined || num === null) return "--";
    let str = num.toFixed(2).replace('.', ',');
    let parts = str.split(',');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(',');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || data.length === 0) return;
    const ctx = canvas.getContext('2d');
    
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Tính toán biên dữ liệu min/max để chuẩn hóa tọa độ hộp
    const growths = data.map(d => d.growth);
    const inclusives = data.map(d => d.inclusive);
    const emissions = data.map(d => d.emission);

    const minG = Math.min(...growths), maxG = Math.max(...growths);
    const minI = Math.min(...inclusives), maxI = Math.max(...inclusives);
    const minE = Math.min(...emissions), maxE = Math.max(...emissions);

    const project = (x3d, y3d, z3d) => {
      const radX = (rotation.x * Math.PI) / 180;
      const radY = (rotation.y * Math.PI) / 180;

      // Xoay quanh trục không gian Y
      let x1 = x3d * Math.cos(radY) - z3d * Math.sin(radY);
      let z1 = x3d * Math.sin(radY) + z3d * Math.cos(radY);

      // Xoay quanh trục không gian X
      let y2 = y3d * Math.cos(radX) - z1 * Math.sin(radX);
      let z2 = y3d * Math.sin(radX) + z1 * Math.cos(radX);

      const distance = 500;
      const scaleProject = distance / (distance + z2);
      
      const x2d = width / 2 + x1 * scaleProject;
      const y2d = height / 2 + y2 * scaleProject;

      return { x: x2d, y: y2d, depth: z2 };
    };

    const size = 95; // Độ dài cạnh hộp lập phương bao cảnh

    const drawLine = (p1, p2, color = '#232936', width = 1, isDash = false) => {
      ctx.beginPath(); ctx.lineWidth = width; ctx.strokeStyle = color;
      if (isDash) ctx.setLineDash([3, 3]);
      else ctx.setLineDash([]);
      ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      ctx.setLineDash([]);
    };

    // Khởi tạo các đỉnh khung lập phương 3D
    const vertices = [
      {x: -size, y: -size, z: -size}, {x: size, y: -size, z: -size},
      {x: size, y: size, z: -size}, {x: -size, y: size, z: -size},
      {x: -size, y: -size, z: size}, {x: size, y: -size, z: size},
      {x: size, y: size, z: size}, {x: -size, y: size, z: size}
    ].map(v => project(v.x, v.y, v.z));

    const connections = [
      [0,1], [1,2], [2,3], [3,0], [4,5], [5,6],
      [6,7], [7,4], [0,4], [1,5], [2,6], [3,7]
    ];
    connections.forEach(([a, b]) => drawLine(vertices[a], vertices[b], '#475569', 1));

    // Nâng cấp chi tiết: Vẽ hệ thống lưới sàn phụ dày hơn cho khớp chuẩn báo cáo học thuật
    for (let i = -3; i <= 3; i += 1) {
      let ratio = i / 3;
      drawLine(project(-size, size, ratio * size), project(size, size, ratio * size), '#1e293b', 1, true);
      drawLine(project(ratio * size, size, -size), project(ratio * size, size, size), '#1e293b', 1, true);
    }

    // Nhãn văn bản định hướng trục không gian địa lý
    ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 11px sans-serif';
    const labelGrowth = project(size + 15, size, size);
    ctx.fillText('Tăng trưởng GDP ➔', labelGrowth.x, labelGrowth.y);

    const labelInclusive = project(-size - 95, size, size + 10);
    ctx.fillText('➔ Bao trùm / bất bình đẳng', labelInclusive.x, labelInclusive.y);

    const labelEmission = project(-size, -size - 15, -size);
    ctx.fillText('Phát thải', labelEmission.x, labelEmission.y);

    // Vẽ vạch và số định vị trục đứng phát thải
    ctx.font = '9px sans-serif'; ctx.fillStyle = '#64748b';
    [0, 0.25, 0.5, 0.75, 1].forEach(h => {
      const zVal = -size + h * (size * 2);
      const ptTick = project(-size, zVal, -size);
      const tickLabel = Math.round(3000 - h * 3000);
      ctx.fillText(tickLabel.toString(), ptTick.x - 28, ptTick.y + 3);
      drawLine(project(-size, zVal, -size), project(-size + 5, zVal, -size), '#475569', 1);
    });

    // Tính toán mảng tọa độ 2D của tập nghiệm Pareto công nghệ
    const points = data.map(p => {
      const x3d = ((p.growth - minG) / (maxG - minG || 1)) * (size * 2) - size;
      const y3d = -(((p.inclusive - minI) / (maxI - minI || 1)) * (size * 2) - size);
      const z3d = ((p.emission - minE) / (maxE - minE || 1)) * (size * 2) - size;
      
      return {
        ...project(x3d, y3d, z3d),
        raw: p
      };
    });

    // Lưu mảng điểm chiếu vào Ref để hàm MouseMove có thể truy vấn thời gian thực
    projectedPointsRef.current = points;

    // Sắp xếp chiều sâu (Z-buffer sorting) tránh hiện tượng lỗi che khuất điểm không gian
    const sortedPoints = [...points].sort((a, b) => b.depth - a.depth);

    sortedPoints.forEach(pt => {
      ctx.beginPath();
      // Thêm hiệu ứng phát sáng biên mờ (Glow blur) cho các nút đỉnh quan trọng
      ctx.shadowBlur = 5;
      if (pt.raw.id === 3) {
        ctx.shadowColor = '#fbbf24';
        ctx.fillStyle = '#ea580c'; // Hình thoi cam vàng tối ưu TOPSIS
        ctx.moveTo(pt.x, pt.y - 9);
        ctx.lineTo(pt.x + 9, pt.y);
        ctx.lineTo(pt.x, pt.y + 9);
        ctx.lineTo(pt.x - 9, pt.y);
        ctx.closePath(); ctx.fill();
        ctx.lineWidth = 1.5; ctx.strokeStyle = '#ffffff'; ctx.stroke();
      } else if (pt.raw.id === 5) {
        ctx.shadowColor = '#22c55e';
        ctx.arc(pt.x, pt.y, 7.5, 0, 2 * Math.PI); // Vòng tròn xanh nghiệm tăng trưởng
        ctx.fillStyle = '#22c55e'; ctx.fill();
        ctx.lineWidth = 1.5; ctx.strokeStyle = '#ffffff'; ctx.stroke();
      } else {
        ctx.shadowColor = '#38bdf8';
        ctx.arc(pt.x, pt.y, 4.5, 0, 2 * Math.PI); // Các nghiệm Pareto cơ sở
        ctx.fillStyle = '#0284c7'; ctx.fill();
        ctx.lineWidth = 0.8; ctx.strokeStyle = '#ffffff'; ctx.stroke();
      }
      ctx.shadowBlur = 0; // Trả lập trạng thái Blur gốc
    });

  }, [rotation, data]);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
    setHoveredPoint(null); // Tắt tạm tooltip khi đang thực hiện thao tác kéo xoay không gian
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDragging.current) {
      // Logic tính toán vector góc quay camera khi nhấn giữ chuột
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;
      
      setRotation(prev => ({
        x: Math.max(-90, Math.min(90, prev.x - deltaY * 0.4)),
        y: prev.y + deltaX * 0.4
      }));

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    } else {
      // 🛠️ THUẬT TOÁN KIỂM TRA VA CHẠM HOVER (RAYCASTING PROXIMITY CHECK)
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let foundPoint = null;
      let minDistance = 10; // Ngưỡng bán kính kích hoạt Tooltip tính bằng Pixel

      projectedPointsRef.current.forEach(pt => {
        const dist = Math.sqrt((pt.x - mouseX) ** 2 + (pt.y - mouseY) ** 2);
        if (dist < minDistance) {
          minDistance = dist;
          foundPoint = {
            ...pt.raw,
            x: pt.x,
            y: pt.y
          };
        }
      });

      setHoveredPoint(foundPoint); // Đẩy thông tin điểm bắt trúng vào State
    }
  };

  const handleMouseUp = () => { isDragging.current = false; };

  return (
    <div 
      onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging.current ? 'grabbing' : 'pointer', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}
    >
      <canvas ref={canvasRef} width={500} height={320} style={{ background: 'transparent' }} />
      
      {/* ----- KHỐI ĐIỀU TIẾT HOVER TOOLTIP NATIVE ĐA MỤC TIÊU KHÔNG CRASH ----- */}
      {hoveredPoint && (
        <div style={{
          position: 'absolute',
          left: `${hoveredPoint.x + 15}px`,
          top: `${hoveredPoint.y - 10}px`,
          backgroundColor: '#1e293b',
          border: `1px solid ${hoveredPoint.id === 3 ? '#fbbf24' : hoveredPoint.id === 5 ? '#22c55e' : '#38bdf8'}`,
          borderRadius: '6px',
          padding: '10px 14px',
          zIndex: 100,
          fontSize: '12px',
          color: '#f8fafc',
          boxShadow: '0 10px 20px -3px rgba(0, 0, 0, 0.6), 0 4px 8px -2px rgba(0, 0, 0, 0.6)',
          pointerEvents: 'none', // Chống hiện tượng nhiễu vòng lặp hover mouse
          minWidth: '240px',
          lineHeight: '1.6'
        }}>
          <div style={{ fontWeight: 'bold', borderBottom: '1px solid #334155', paddingBottom: '5px', marginBottom: '6px', color: '#fff', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
            <span>Nghiệm Pareto #{hoveredPoint.id}</span>
            <span style={{ color: hoveredPoint.id === 3 ? '#fbbf24' : hoveredPoint.id === 5 ? '#22c55e' : '#38bdf8' }}>{hoveredPoint.tag}</span>
          </div>
          <div>📈 <b>Tăng trưởng f₁(x):</b> {formatSmart(hoveredPoint.growth)} tỷ VND</div>
          <div>⚖️ <b>Bao trùm f₂(x):</b> {hoveredPoint.inclusive.toFixed(4).replace('.', ',')}</div>
          <div>🌱 <b>Phát thải f₃(x):</b> {formatSmart(hoveredPoint.emission)}</div>
          <div>🛡️ <b>Rủi ro dữ liệu f₄(x):</b> {hoveredPoint.risk.toFixed(4).replace('.', ',')}</div>
        </div>
      )}

      {/* Chú thích bản đồ chỉ tiêu */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px', fontSize: '11.5px', color: '#cbd5e1' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#0284c7', border: '0.5px solid #fff' }}></span>
          <span>Tập Pareto</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#ea580c', transform: 'rotate(45deg)', border: '0.5px solid #fff' }}></span>
          <span>Nghị định Thỏa hiệp (TOPSIS)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', border: '0.5px solid #fff' }}></span>
          <span>Tăng trưởng cao nhất</span>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 2. LINH KIỆN ĐIỀU HÀNH CHÍNH BÀI 7 (DARK THEME)
// =========================================================================
export default function Bai07() {
  const [inputs, setInputs] = useState({
    total_budget: 50000, region_floor: 5000, region_ceiling: 12000, human_floor: 12000, 
    gamma: 0.002, lam: 0.68, pop_size: 100, n_gen: 200, seed: 42
  });

  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  const handleInputChange = (field, val) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(val) || 0 }));
  };

  const calculateNSGA = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/bai7/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputs)
    })
    .then(res => res.json())
    .then(data => {
      if (data && data.success) {
        setResData(data);
        setIsCalculated(true);
      } else {
        alert(data.message || "Lỗi mô hình đa mục tiêu hoặc cấu hình không khả thi.");
      }
      setLoading(false);
    })
    .catch(err => {
      console.error("Lỗi dòng liên thông Bài 7:", err);
      setLoading(false);
    });
  };

  const COLORS = ['#38bdf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#fb7185'];

  const formatSmart = (num) => {
    if (num === undefined || num === null) return "--";
    let str = num.toString().replace('.', ',');
    let parts = str.split(',');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(',');
  };

  const formatComma = (num) => {
    if (num === undefined || num === null) return "--";
    return typeof num === 'number' ? num.toFixed(4).replace('.', ',') : num;
  };

  const formatPercent = (num) => {
    if (num === undefined || num === null) return "--";
    return num.toString().replace(".", ",") + "%";
  };

  const getParallelData = () => {
    if (!resData || !resData.pareto_table) return [];
    const table = resData.pareto_table;

    const gVals = table.map(t => t.growth), minG = Math.min(...gVals), maxG = Math.max(...gVals);
    const iVals = table.map(t => t.inclusive), minI = Math.min(...iVals), maxI = Math.max(...iVals);
    const eVals = table.map(t => t.emission), minE = Math.min(...eVals), maxE = Math.max(...eVals);
    const rVals = table.map(t => t.risk), minR = Math.min(...rVals), maxR = Math.max(...rVals);

    const axes = ["Tăng trưởng f₁", "Bao trùm f₂", "Phát thải f₃", "Rủi ro mạng f₄"];
    
    return axes.map((axis, axisIdx) => {
      const row = { name: axis };
      table.forEach((sol) => {
        let normVal = 0;
        if (axisIdx === 0) normVal = ((sol.growth - minG) / (maxG - minG || 1)) * 100;
        if (axisIdx === 1) normVal = ((sol.inclusive - minI) / (maxI - minI || 1)) * 100;
        if (axisIdx === 2) normVal = ((sol.emission - minE) / (maxE - minE || 1)) * 100;
        if (axisIdx === 3) normVal = ((sol.risk - minR) / (maxR - minR || 1)) * 100;
        row[`sol_${sol.id}`] = normVal;
      });
      return row;
    });
  };

  return (
    <div style={{ color: '#ffffff', maxWidth: '1400px', margin: '0 auto', paddingBottom: '30px', fontFamily: 'sans-serif' }}>
      
      {/* Tiêu đề trang */}
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase' }}>BÀI 7 — TỐI ƯU ĐA MỤC TIÊU PARETO VỚI THUẬT TOÁN DI TRUYỀN NSGA-II</h1>
      </div>

      {/* Khối mô hình toán học */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '3px solid #38bdf8', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🔢</span> Mô hình toán học
        </h3>
        <div style={{ backgroundColor: '#0f172a', padding: '15px 20px', borderRadius: '6px', overflowX: 'auto', marginBottom: '12px' }}>
          <p style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '26px', color: '#cbd5e1', margin: 0, whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>
            <b style={{color: '#fff'}}>Max <i>f</i><sub>1</sub>(x), &nbsp; Min <i>f</i><sub>2</sub>(x), &nbsp; Min <i>f</i><sub>3</sub>(x), &nbsp; Min <i>f</i><sub>4</sub>(x)</b>
          </p>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
          Mô hình tối ưu đồng thời bốn mục tiêu: tăng trưởng GDP, bao trùm vùng miền, giảm phát thải và giảm rủi ro dữ liệu ròng. NSGA-II tạo tập nghiệm Pareto thay vì một nghiệm tối ưu duy nhất.
        </p>
      </div>

      {/* Tham số điều khiển & KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2.8fr', gap: '20px', marginBottom: '30px' }}>
        
        {/* Form nhập liệu */}
        <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#38bdf8', borderBottom: '1px solid #232936', paddingBottom: '8px' }}>⚙️ Tham số NSGA-II và ràng buộc</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '3px' }}>Ngân sách tổng, tỷ VND</label>
              <input type="number" value={inputs.total_budget} onChange={e => handleInputChange('total_budget', e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '3px' }}>Sàn mỗi vùng</label>
                <input type="number" value={inputs.region_floor} onChange={e => handleInputChange('region_floor', e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '3px' }}>Trần mỗi vùng</label>
                <input type="number" value={inputs.region_ceiling} onChange={e => handleInputChange('region_ceiling', e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '3px' }}>Sàn nhân lực số</label>
              <input type="number" value={inputs.human_floor} onChange={e => handleInputChange('human_floor', e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '3px' }}>&gamma;</label>
                <input type="number" step="0.001" value={inputs.gamma} onChange={e => handleInputChange('gamma', e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '3px' }}>&lambda;</label>
                <input type="number" step="0.01" value={inputs.lam} onChange={e => handleInputChange('lam', e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '3px' }}>pop_size</label>
                <input type="number" value={inputs.pop_size} onChange={e => handleInputChange('pop_size', e.target.value)} style={{ width: '100%', padding: '5px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '3px' }}>n_gen</label>
                <input type="number" value={inputs.n_gen} onChange={e => handleInputChange('n_gen', e.target.value)} style={{ width: '100%', padding: '5px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '3px' }}>seed</label>
                <input type="number" value={inputs.seed} onChange={e => handleInputChange('seed', e.target.value)} style={{ width: '100%', padding: '5px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} />
              </div>
            </div>
          </div>
          <button onClick={calculateNSGA} disabled={loading} style={{ width: '100%', marginTop: '15px', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '11px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            {loading ? '⏳ Đang phân tích mô hình...' : '▶️ Chạy NSGA-II'}
          </button>
        </div>

        {/* Khối KPI */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div style={{ backgroundColor: '#17a2b8', padding: '20px', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px' }}>
            <h2 style={{ fontSize: '32px', margin: 0, fontWeight: 'bold' }}>{resData ? resData.pareto_count : '--'}</h2>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#e0f2fe' }}>Số nghiệm Pareto</p>
          </div>
          <div style={{ backgroundColor: '#28a745', padding: '20px', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px' }}>
            <h2 style={{ fontSize: '32px', margin: 0, fontWeight: 'bold' }}>{resData ? formatSmart(resData.compromise_growth) : '--'}</h2>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#d1fae5' }}>Tăng trưởng nghiệm thỏa hiệp</p>
          </div>
          <div style={{ backgroundColor: '#ffc107', padding: '20px', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px' }}>
            <h2 style={{ fontSize: '32px', margin: 0, fontWeight: 'bold', color: '#212529' }}>{resData ? formatSmart(resData.topsis_score) : '--'}</h2>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#343a40' }}>Điểm TOPSIS</p>
          </div>
          <div style={{ backgroundColor: '#dc3545', padding: '20px', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px' }}>
            <h2 style={{ fontSize: '32px', margin: 0, fontWeight: 'bold' }}>{resData ? formatSmart(resData.high_growth) : '--'}</h2>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#fee2e2' }}>Tăng trưởng cao nhất</p>
          </div>
        </div>

      </div>

      {isCalculated && resData && (
        <>
          {/* Khu vực đồ thị hoành tráng */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
            
            {/* Khối 1: Đồ họa Scatter 3D cải tiến nâng cao có TƯƠNG TÁC HOVER CHỐNG SẬP */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>📈 Scatter 3D tập Pareto: tăng trưởng - bao trùm - môi trường</h4>
              <Pareto3DScatter data={resData.pareto_table} />
            </div>

            {/* Khối 2: Parallel Coordinates */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>📈 Parallel coordinates cho 4 mục tiêu</h4>
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                  <LineChart data={getParallelData()} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff', border: '1px solid #232936' }} />
                    
                    {(resData.pareto_table || []).map((sol) => {
                      let strokeColor = "rgba(148, 163, 184, 0.15)";
                      let strokeW = 1;
                      if (sol.id === 3) { strokeColor = "#ea580c"; strokeW = 4; }
                      else if (sol.id === 5) { strokeColor = "#22c55e"; strokeW = 3; }
                      
                      return (
                        <Line 
                          key={sol.id} type="linear" dataKey={`sol_${sol.id}`} 
                          stroke={strokeColor} strokeWidth={strokeW} dot={sol.id === 3 || sol.id === 5} activeDot={false}
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Biểu đồ nguồn lực theo hạng mục */}
          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
            <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>📊 Tổng ngân sách theo hạng mục - nghiệm thỏa hiệp</h4>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={resData.item_chart || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#232936" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff', border: '1px solid #232936' }} formatter={(value) => [formatSmart(value), "Ngân sách"]} />
                  <Bar dataKey="value" fill="#7dd3fc" name="Ngân sách theo hạng mục, tỷ VND" radius={[4, 4, 0, 0]} barSize={55} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Khu vực ma trận số liệu không gian địa lý */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr', gap: '20px', marginBottom: '25px' }}>
            
            {/* Ma trận phân bổ nghiệm thỏa hiệp */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>📋 Ma trận phân bổ nghiệm thỏa hiệp</h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8', backgroundColor: '#0f172a' }}>
                      <th style={{ padding: '8px' }}>Vùng</th>
                      <th style={{ padding: '8px', textAlign: 'center' }}>I</th>
                      <th style={{ padding: '8px', textAlign: 'center' }}>D</th>
                      <th style={{ padding: '8px', textAlign: 'center' }}>AI</th>
                      <th style={{ padding: '8px', textAlign: 'center' }}>H</th>
                      <th style={{ padding: '8px', textAlign: 'center' }}>Tổng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(resData.allocation_table || []).map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #232936' }}>
                        <td style={{ padding: '8px', color: '#cbd5e1' }}>{row.region}</td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>{formatSmart(row.i)}</td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>{formatSmart(row.d)}</td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>{formatSmart(row.ai)}</td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>{formatSmart(row.h)}</td>
                        <td style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold', color: '#fff' }}>{formatSmart(row.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bảng hạng mục ưu tiên */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>📋 Hạng mục ưu tiên ở từng vùng</h4>
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8', backgroundColor: '#0f172a', textAlign: 'left' }}>
                    <th style={{ padding: '8px' }}>Vùng</th>
                    <th style={{ padding: '8px' }}>Ưu tiên</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Ngân sách</th>
                  </tr>
                </thead>
                <tbody>
                  {(resData.preferred_table || []).map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #232936' }}>
                      <td style={{ padding: '8px', color: '#cbd5e1' }}>{row.region}</td>
                      <td style={{ padding: '8px', color: '#fbbf24', fontWeight: '500' }}>{row.item}</td>
                      <td style={{ padding: '8px', fontWeight: 'bold', color: '#34d399', textAlign: 'right' }}>{formatSmart(row.budget)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* Chi phí cơ hội vĩ mô */}
          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '3px solid #ef4444', borderRadius: '4px', padding: '20px', marginBottom: '25px' }}>
            <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '12px' }}>⚖️ Chi phí cơ hội của nghiệm tăng trưởng cao nhất</h4>
            <div style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: '1.75', whiteSpace: 'pre-line' }}>
              {resData.opportunity_comment}
            </div>
          </div>

          {/* Một số nghiệm Pareto tiêu biểu */}
          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
            <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>📋 Một số nghiệm Pareto tiêu biểu</h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8', backgroundColor: '#0f172a' }}>
                    <th style={{ padding: '10px' }}>#</th>
                    <th style={{ padding: '10px' }}>Tăng trưởng f₁</th>
                    <th style={{ padding: '10px' }}>Bao trùm f₂</th>
                    <th style={{ padding: '10px' }}>Phát thải f₃ f₃</th>
                    <th style={{ padding: '10px' }}>Rủi ro dữ liệu ròng f₄</th>
                  </tr>
                </thead>
                <tbody>
                  {(resData.pareto_table || []).map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #232936', backgroundColor: row.id === 3 ? 'rgba(56, 189, 248, 0.05)' : 'transparent' }}>
                      <td style={{ padding: '10px', fontWeight: 'bold' }}>{row.id}</td>
                      <td style={{ padding: '10px', fontWeight: 'bold', color: row.id === 3 ? '#38bdf8' : '#ffffff' }}>{formatSmart(row.growth)}</td>
                      <td style={{ padding: '10px' }}>{formatSmart(row.inclusive)}</td>
                      <td style={{ padding: '10px' }}>{formatSmart(row.emission)}</td>
                      <td style={{ padding: '10px' }}>{formatSmart(row.risk)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 7.5 Nhận xét và hàm ý chính sách */}
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #38bdf8', borderRadius: '8px', padding: '25px', marginBottom: '25px' }}>
            <h3 style={{ fontSize: '16px', color: '#38bdf8', marginBottom: '20px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              🏛️ 7.5. Nhận xét và Hàm ý chính sách (Tối ưu hóa đa mục tiêu NSGA-II)
            </h3>
            
            <div style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: '1.8' }}>
              
              <div style={{ marginBottom: '20px' }}>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  a) Khi quan sát đường biên Pareto, em thấy đánh đổi giữa tăng trưởng và bao trùm có rõ ràng không? Mức đánh đổi đó nói lên điều gì về cơ cấu kinh tế Việt Nam?
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify' }}>
                  <b>Tính rõ ràng của sự đánh đổi:</b> Rất rõ ràng. Trên đồ thị, Đường biên Pareto (Pareto Frontier) giữa Tăng trưởng (Growth) và Bao trùm xã hội (Inclusion) tạo thành một đường cong lồi sắc nét. Không có bất kỳ điểm nghiệm nào có thể đồng thời tối đa hóa cả hai mục tiêu này mà không làm suy giảm mục tiêu kia.<br />
                  <b>Phản ánh cơ cấu kinh tế Việt Nam:</b> Mức đánh đổi (Trade-off) sâu sắc này phơi bày đặc trưng phân cực không gian lớn của nền kinh tế Việt Nam. Các vùng lõi (Đông Nam Bộ, Đồng bằng sông Hồng) có <i>Lợi thế tích tụ (Agglomeration Economies)</i> và hệ số sinh lời cận biên khổng lồ. Để tăng 1% điểm bao trùm cho các vùng sâu vùng xa (Tây Nguyên, Tây Bắc), ngân sách phải gánh chịu chi phí phát triển hạ tầng đắt đỏ nhưng thiếu hụt <i>Tính kinh tế nhờ quy mô (Economies of Scale)</i>, buộc phải hy sinh một lượng lớn GDP. Mô hình chứng minh rằng tăng trưởng bao trùm là một quá trình rất tốn kém về mặt tài khóa.
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  b) Trọng số (0,40; 0,25; 0,20; 0,15) có phản ánh đúng ưu tiên hiện tại (Đại hội XIII) không? Điều chỉnh thế nào để phù hợp COP26 và 127/QĐ-TTg?
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify' }}>
                  <b>Sự phù hợp với Đại hội XIII:</b> Bộ trọng số hiện tại cơ bản phản ánh đúng tư duy chiến lược trung hạn: Đặt Tăng trưởng kinh tế (0.40) làm trọng tâm hàng đầu để vượt bẫy thu nhập trung bình, tiếp sau đó là Đột phá số hóa (0.25).<br />
                  <b>Điều chỉnh cho COP26 và 127/QĐ-TTg:</b> Để bám sát <b>Cam kết Net-Zero (COP26)</b> và <b>Chiến lược AI Quốc gia (127/QĐ-TTg)</b>, hàm mục tiêu cần được tái cấu trúc triệt để. <br />
                  1. Cần giảm nhẹ trọng số Tăng trưởng thuần túy xuống 0.30, đồng thời nâng trọng số Kiểm soát phát thải/Rủi ro môi trường từ 0.15 lên 0.25. Việc này sẽ "ép" thuật toán NSGA-II loại bỏ các cụm dự án công nghiệp nặng để ưu tiên vốn cho công nghệ xanh. <br />
                  2. Cần tách biến "Công nghệ số" thành 2 mục tiêu độc lập: Hạ tầng ICT cơ bản và Trí tuệ nhân tạo lõi (Core AI), gán trọng số cực cao cho Core AI nhằm định tuyến dòng vốn vào R&D thay vì chỉ nhập khẩu và ứng dụng máy móc như hiện tại.
                </p>
              </div>

              <div>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  c) Vai trò của NSGA-II ở đây có gì khác so với LP đơn mục tiêu? Nó có thay thế được quyết định chính trị không?
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify', marginBottom: 0 }}>
                  <b>Khác biệt thuật toán:</b> Quy hoạch tuyến tính (LP) đơn mục tiêu (như ở Bài 4) mang tính chất cực đoan, nó hội tụ về một điểm tối ưu tuyệt đối duy nhất, ép buộc nhà hoạch định phải chấp nhận một kịch bản "được ăn cả ngã về không". Ngược lại, thuật toán tiến hóa <b>NSGA-II</b> duy trì sự đa dạng của quần thể nghiệm, vẽ ra một phổ các lựa chọn <i>Bất khả úy (Non-dominated solutions)</i> trên đường biên Pareto.<br />
                  <b>Về việc thay thế quyết định chính trị:</b> Câu trả lời là <b>Hoàn toàn KHÔNG</b>. NSGA-II chỉ thực hiện một nhiệm vụ duy nhất: <i>Định lượng hóa cái giá của sự đánh đổi (Opportunity Cost)</i>. Nó cho biết "Nếu muốn thêm 5% an sinh, quốc gia phải mất đi bao nhiêu tỷ GDP". Việc quyết định chọn điểm nghiệm nào trên đường biên Pareto hoàn toàn phụ thuộc vào <b>Hàm thỏa dụng xã hội (Social Welfare Function)</b> và ý chí chính trị của cơ quan điều hành tại từng thời điểm lịch sử. Mô hình AIDEOM-VN là Hệ thống hỗ trợ ra quyết định (Decision Support System), không phải là chủ thể thay thế tư duy con người.
                </p>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}