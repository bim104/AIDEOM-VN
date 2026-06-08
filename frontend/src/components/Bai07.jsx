import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

// =========================================================================
// 1. CẤU PHẦN ĐỒ HỌA 3D PARETO NATIVE TRỰC QUAN CAO + TƯƠNG TÁC HOVER TOOLTIP (LIGHT THEME)
// =========================================================================
function Pareto3DScatter({ data }) {
  const canvasRef = useRef(null);
  // Khởi tạo góc xoay phối cảnh
  const [rotation, setRotation] = useState({ x: 20, y: -55 });
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const projectedPointsRef = useRef([]);

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

    const growths = data.map(d => d.growth);
    const inclusives = data.map(d => d.inclusive);
    const emissions = data.map(d => d.emission);

    const minG = Math.min(...growths), maxG = Math.max(...growths);
    const minI = Math.min(...inclusives), maxI = Math.max(...inclusives);
    const minE = Math.min(...emissions), maxE = Math.max(...emissions);

    const project = (x3d, y3d, z3d) => {
      const radX = (rotation.x * Math.PI) / 180;
      const radY = (rotation.y * Math.PI) / 180;

      let x1 = x3d * Math.cos(radY) - z3d * Math.sin(radY);
      let z1 = x3d * Math.sin(radY) + z3d * Math.cos(radY);

      let y2 = y3d * Math.cos(radX) - z1 * Math.sin(radX);
      let z2 = y3d * Math.sin(radX) + z1 * Math.cos(radX);

      const distance = 500;
      const scaleProject = distance / (distance + z2);
      
      const x2d = width / 2 + x1 * scaleProject;
      const y2d = height / 2 + y2 * scaleProject;

      return { x: x2d, y: y2d, depth: z2 };
    };

    const size = 95;

    const drawLine = (p1, p2, color = '#cbd5e1', width = 1, isDash = false) => {
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
    // Viền khối 3D màu xám nhạt
    connections.forEach(([a, b]) => drawLine(vertices[a], vertices[b], '#94a3b8', 1));

    // Hệ thống lưới sàn phụ
    for (let i = -3; i <= 3; i += 1) {
      let ratio = i / 3;
      drawLine(project(-size, size, ratio * size), project(size, size, ratio * size), '#e2e8f0', 1, true);
      drawLine(project(ratio * size, size, -size), project(ratio * size, size, size), '#e2e8f0', 1, true);
    }

    // Nhãn trục
    ctx.fillStyle = '#475569'; ctx.font = 'bold 11px sans-serif';
    const labelGrowth = project(size + 15, size, size);
    ctx.fillText('Tăng trưởng GDP ➔', labelGrowth.x, labelGrowth.y);

    const labelInclusive = project(-size - 95, size, size + 10);
    ctx.fillText('➔ Bao trùm / bất bình đẳng', labelInclusive.x, labelInclusive.y);

    const labelEmission = project(-size, -size - 15, -size);
    ctx.fillText('Phát thải', labelEmission.x, labelEmission.y);

    // Vẽ vạch trục đứng phát thải
    ctx.font = '9px sans-serif'; ctx.fillStyle = '#64748b';
    [0, 0.25, 0.5, 0.75, 1].forEach(h => {
      const zVal = -size + h * (size * 2);
      const ptTick = project(-size, zVal, -size);
      const tickLabel = Math.round(3000 - h * 3000);
      ctx.fillText(tickLabel.toString(), ptTick.x - 28, ptTick.y + 3);
      drawLine(project(-size, zVal, -size), project(-size + 5, zVal, -size), '#94a3b8', 1);
    });

    // Tính toán mảng tọa độ 2D của tập nghiệm Pareto
    const points = data.map(p => {
      const x3d = ((p.growth - minG) / (maxG - minG || 1)) * (size * 2) - size;
      const y3d = -(((p.inclusive - minI) / (maxI - minI || 1)) * (size * 2) - size);
      const z3d = ((p.emission - minE) / (maxE - minE || 1)) * (size * 2) - size;
      
      return {
        ...project(x3d, y3d, z3d),
        raw: p
      };
    });

    projectedPointsRef.current = points;

    // Z-buffer sorting
    const sortedPoints = [...points].sort((a, b) => b.depth - a.depth);

    sortedPoints.forEach(pt => {
      ctx.beginPath();
      if (pt.raw.id === 3) {
        ctx.shadowColor = '#fbbf24';
        ctx.fillStyle = '#d97706'; // TOPSIS orange
        ctx.moveTo(pt.x, pt.y - 9);
        ctx.lineTo(pt.x + 9, pt.y);
        ctx.lineTo(pt.x, pt.y + 9);
        ctx.lineTo(pt.x - 9, pt.y);
        ctx.closePath(); ctx.fill();
        ctx.lineWidth = 1.5; ctx.strokeStyle = '#ffffff'; ctx.stroke();
      } else if (pt.raw.id === 5) {
        ctx.shadowColor = '#22c55e';
        ctx.arc(pt.x, pt.y, 7.5, 0, 2 * Math.PI); // Green growth point
        ctx.fillStyle = '#10b981'; ctx.fill();
        ctx.lineWidth = 1.5; ctx.strokeStyle = '#ffffff'; ctx.stroke();
      } else {
        ctx.shadowColor = '#38bdf8';
        ctx.arc(pt.x, pt.y, 4.5, 0, 2 * Math.PI); // Base pareto
        ctx.fillStyle = '#0ea5e9'; ctx.fill();
        ctx.lineWidth = 0.8; ctx.strokeStyle = '#ffffff'; ctx.stroke();
      }
      ctx.shadowBlur = 0; 
    });

  }, [rotation, data]);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
    setHoveredPoint(null); 
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDragging.current) {
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;
      
      setRotation(prev => ({
        x: Math.max(-90, Math.min(90, prev.x - deltaY * 0.4)),
        y: prev.y + deltaX * 0.4
      }));

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    } else {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let foundPoint = null;
      let minDistance = 10; 

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

      setHoveredPoint(foundPoint); 
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
      
      {/* Tooltip Hover (Light Theme) */}
      {hoveredPoint && (
        <div style={{
          position: 'absolute',
          left: `${hoveredPoint.x + 15}px`,
          top: `${hoveredPoint.y - 10}px`,
          backgroundColor: '#ffffff',
          border: `1px solid ${hoveredPoint.id === 3 ? '#fbbf24' : hoveredPoint.id === 5 ? '#10b981' : '#bae6fd'}`,
          borderRadius: '6px',
          padding: '10px 14px',
          zIndex: 100,
          fontSize: '12px',
          color: '#0f172a',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          pointerEvents: 'none', 
          minWidth: '240px',
          lineHeight: '1.6'
        }}>
          <div style={{ fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px', marginBottom: '6px', color: '#0f172a', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
            <span>Nghiệm Pareto #{hoveredPoint.id}</span>
            <span style={{ color: hoveredPoint.id === 3 ? '#d97706' : hoveredPoint.id === 5 ? '#059669' : '#0284c7' }}>{hoveredPoint.tag}</span>
          </div>
          <div>📈 <b>Tăng trưởng f₁:</b> {formatSmart(hoveredPoint.growth)} tỷ VND</div>
          <div>⚖️ <b>Bao trùm f₂:</b> {hoveredPoint.inclusive.toFixed(4).replace('.', ',')}</div>
          <div>🌱 <b>Phát thải f₃:</b> {formatSmart(hoveredPoint.emission)}</div>
          <div>🛡️ <b>Rủi ro f₄:</b> {hoveredPoint.risk.toFixed(4).replace('.', ',')}</div>
        </div>
      )}

      {/* Chú thích */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px', fontSize: '12px', color: '#475569', fontWeight: '500' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0ea5e9' }}></span>
          <span>Tập Pareto</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#d97706', transform: 'rotate(45deg)' }}></span>
          <span>Nghiệm Thỏa hiệp (TOPSIS)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
          <span>Tăng trưởng cao nhất</span>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 2. LINH KIỆN ĐIỀU HÀNH CHÍNH BÀI 7 (LIGHT THEME)
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
    <div style={{ color: '#1e293b', maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px', fontFamily: 'sans-serif' }}>
      
      {/* Banner Tiêu đề */}
      <div style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)', border: '1px solid #bae6fd', borderRadius: '12px', padding: '30px 35px', marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: '24px', margin: 0, fontWeight: 'bold', letterSpacing: '0.5px', color: '#0369a1' }}>
            BÀI 7 — TỐI ƯU ĐA MỤC TIÊU PARETO VỚI THUẬT TOÁN DI TRUYỀN NSGA-II
          </h1>
          <p style={{ fontSize: '14px', color: '#0284c7', margin: '8px 0 0 0', fontWeight: '600' }}>
            Giai đoạn 3: Phân tích Đa tiêu chí (MCDM) & Cân bằng Chiến lược
          </p>
        </div>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(2,132,199,0.08) 0%, transparent 70%)' }}></div>
      </div>

      {/* Khối mô hình toán học */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '3px solid #0284c7', borderRadius: '8px', padding: '20px', marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🔢</span> Mô hình toán học
        </h3>
        <div style={{ backgroundColor: '#f8fafc', padding: '15px 20px', borderRadius: '6px', border: '1px solid #e2e8f0', overflowX: 'auto', marginBottom: '12px' }}>
          <p style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '26px', color: '#334155', margin: 0, whiteSpace: 'nowrap', letterSpacing: '0.5px', textAlign: 'center' }}>
            <b style={{color: '#0f172a'}}>Max <i>f</i><sub>1</sub>(x), &nbsp; Min <i>f</i><sub>2</sub>(x), &nbsp; Min <i>f</i><sub>3</sub>(x), &nbsp; Min <i>f</i><sub>4</sub>(x)</b>
          </p>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#475569', textAlign: 'center' }}>
          Mô hình tối ưu đồng thời bốn mục tiêu: tăng trưởng GDP, bao trùm vùng miền, giảm phát thải và giảm rủi ro dữ liệu ròng. NSGA-II tạo tập nghiệm Pareto thay vì một nghiệm tối ưu duy nhất.
        </p>
      </div>

      {/* Tham số điều khiển & KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2.8fr', gap: '25px', marginBottom: '30px' }}>
        
        {/* Form nhập liệu */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', fontWeight: 'bold' }}>⚙️ Tham số NSGA-II và ràng buộc</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: '600' }}>Ngân sách tổng, tỷ VND</label>
              <input type="number" value={inputs.total_budget} onChange={e => handleInputChange('total_budget', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', outline: 'none' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: '600' }}>Sàn mỗi vùng</label>
                <input type="number" value={inputs.region_floor} onChange={e => handleInputChange('region_floor', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: '600' }}>Trần mỗi vùng</label>
                <input type="number" value={inputs.region_ceiling} onChange={e => handleInputChange('region_ceiling', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', outline: 'none' }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: '600' }}>Sàn nhân lực số</label>
              <input type="number" value={inputs.human_floor} onChange={e => handleInputChange('human_floor', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', outline: 'none' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: '600' }}>&gamma; (Gini)</label>
                <input type="number" step="0.001" value={inputs.gamma} onChange={e => handleInputChange('gamma', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: '600' }}>&lambda; (Độ trễ)</label>
                <input type="number" step="0.01" value={inputs.lam} onChange={e => handleInputChange('lam', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', outline: 'none' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: '600' }}>pop_size</label>
                <input type="number" value={inputs.pop_size} onChange={e => handleInputChange('pop_size', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: '600' }}>n_gen</label>
                <input type="number" value={inputs.n_gen} onChange={e => handleInputChange('n_gen', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: '600' }}>seed</label>
                <input type="number" value={inputs.seed} onChange={e => handleInputChange('seed', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', outline: 'none' }} />
              </div>
            </div>
          </div>
          <button onClick={calculateNSGA} disabled={loading} style={{ width: '100%', marginTop: '20px', background: 'linear-gradient(to right, #2563eb, #1d4ed8)', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'opacity 0.2s', opacity: loading ? 0.7 : 1 }}>
            {loading ? '⏳ Đang mô phỏng di truyền...' : '▶️ Chạy NSGA-II'}
          </button>
        </div>

        {/* Khối KPI */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #0284c7', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '36px', margin: 0, fontWeight: 'bold', color: '#0284c7' }}>{resData ? resData.pareto_count : '--'}</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Số nghiệm Pareto</p>
          </div>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #059669', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '32px', margin: 0, fontWeight: 'bold', color: '#059669' }}>{resData ? formatSmart(resData.compromise_growth) : '--'}</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Tăng trưởng nghiệm thỏa hiệp</p>
          </div>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #d97706', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '32px', margin: 0, fontWeight: 'bold', color: '#d97706' }}>{resData ? formatSmart(resData.topsis_score) : '--'}</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Điểm TOPSIS cao nhất</p>
          </div>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #dc2626', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '32px', margin: 0, fontWeight: 'bold', color: '#dc2626' }}>{resData ? formatSmart(resData.high_growth) : '--'}</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Tăng trưởng (Cực đại)</p>
          </div>
        </div>

      </div>

      {isCalculated && resData && (
        <>
          {/* Khu vực đồ thị hoành tráng */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '30px' }}>
            
            {/* Khối 1: Đồ họa Scatter 3D cải tiến */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '15px', fontWeight: '600' }}>📈 Scatter 3D tập Pareto: Tăng trưởng - Bao trùm - Khí thải</h4>
              <Pareto3DScatter data={resData.pareto_table} />
            </div>

            {/* Khối 2: Parallel Coordinates */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '15px', fontWeight: '600' }}>📈 Parallel Coordinates theo 4 mục tiêu</h4>
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                  <LineChart data={getParallelData()} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" fontSize={12} fontWeight="bold" />
                    <YAxis stroke="#475569" domain={[0, 100]} tickFormatter={(v) => `${v}%`} fontSize={11} fontWeight="bold" />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                    
                    {(resData.pareto_table || []).map((sol) => {
                      let strokeColor = "rgba(148, 163, 184, 0.4)"; // Tăng độ đậm nét base cho nền sáng
                      let strokeW = 1.5;
                      if (sol.id === 3) { strokeColor = "#d97706"; strokeW = 4; } // Cam đậm
                      else if (sol.id === 5) { strokeColor = "#059669"; strokeW = 3; } // Xanh ngọc đậm
                      
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
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '15px', fontWeight: '600' }}>📊 Phân bổ ngân sách theo hạng mục (Nghiệm thỏa hiệp TOPSIS)</h4>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={resData.item_chart || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#475569" fontSize={12} fontWeight="bold" />
                  <YAxis stroke="#475569" fontSize={11} fontWeight="bold" />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px' }} formatter={(value) => [formatSmart(value), "Ngân sách"]} />
                  <Bar dataKey="value" fill="#0ea5e9" name="Ngân sách theo hạng mục, tỷ VND" radius={[4, 4, 0, 0]} barSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Khu vực ma trận số liệu không gian địa lý */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr', gap: '25px', marginBottom: '30px' }}>
            
            {/* Ma trận phân bổ nghiệm thỏa hiệp */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '15px', fontWeight: '600' }}>📋 Ma trận phân bổ nghiệm thỏa hiệp</h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', backgroundColor: '#f1f5f9' }}>
                      <th style={{ padding: '10px', borderRadius: '6px 0 0 0' }}>Vùng</th>
                      <th style={{ padding: '10px', textAlign: 'center' }}>I</th>
                      <th style={{ padding: '10px', textAlign: 'center' }}>D</th>
                      <th style={{ padding: '10px', textAlign: 'center' }}>AI</th>
                      <th style={{ padding: '10px', textAlign: 'center' }}>H</th>
                      <th style={{ padding: '10px', textAlign: 'center', borderRadius: '0 6px 0 0' }}>Tổng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(resData.allocation_table || []).map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: idx % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                        <td style={{ padding: '10px', color: '#0f172a', fontWeight: '500' }}>{row.region}</td>
                        <td style={{ padding: '10px', textAlign: 'center', color: '#475569' }}>{formatSmart(row.i)}</td>
                        <td style={{ padding: '10px', textAlign: 'center', color: '#475569' }}>{formatSmart(row.d)}</td>
                        <td style={{ padding: '10px', textAlign: 'center', color: '#475569' }}>{formatSmart(row.ai)}</td>
                        <td style={{ padding: '10px', textAlign: 'center', color: '#475569' }}>{formatSmart(row.h)}</td>
                        <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: '#0284c7' }}>{formatSmart(row.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bảng hạng mục ưu tiên */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '15px', fontWeight: '600' }}>📋 Hạng mục ưu tiên ở từng vùng</h4>
              <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                    <th style={{ padding: '10px', borderRadius: '6px 0 0 0' }}>Vùng</th>
                    <th style={{ padding: '10px' }}>Ưu tiên</th>
                    <th style={{ padding: '10px', textAlign: 'right', borderRadius: '0 6px 0 0' }}>Ngân sách</th>
                  </tr>
                </thead>
                <tbody>
                  {(resData.preferred_table || []).map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: i % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                      <td style={{ padding: '10px', color: '#0f172a', fontWeight: '500' }}>{row.region}</td>
                      <td style={{ padding: '10px', color: '#d97706', fontWeight: '600' }}>{row.item}</td>
                      <td style={{ padding: '10px', fontWeight: 'bold', color: '#059669', textAlign: 'right' }}>{formatSmart(row.budget)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* Chi phí cơ hội vĩ mô */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #dc2626', borderRadius: '8px', padding: '20px', marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '12px', fontWeight: '600' }}>⚖️ Chi phí cơ hội của nghiệm tăng trưởng cao nhất</h4>
            <div style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.75', whiteSpace: 'pre-line' }}>
              {resData.opportunity_comment}
            </div>
          </div>

          {/* Một số nghiệm Pareto tiêu biểu */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '15px', fontWeight: '600' }}>📋 Bảng trích xuất nghiệm Pareto tiêu biểu</h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', backgroundColor: '#f1f5f9' }}>
                    <th style={{ padding: '12px 10px', borderRadius: '6px 0 0 0' }}>#</th>
                    <th style={{ padding: '12px 10px' }}>Tăng trưởng f₁</th>
                    <th style={{ padding: '12px 10px' }}>Bao trùm f₂</th>
                    <th style={{ padding: '12px 10px' }}>Phát thải f₃</th>
                    <th style={{ padding: '12px 10px', borderRadius: '0 6px 0 0' }}>Rủi ro dữ liệu ròng f₄</th>
                  </tr>
                </thead>
                <tbody>
                  {(resData.pareto_table || []).map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: row.id === 3 ? 'rgba(2, 132, 199, 0.08)' : (i % 2 === 0 ? 'transparent' : '#f8fafc') }}>
                      <td style={{ padding: '10px', fontWeight: 'bold', color: row.id === 3 ? '#0284c7' : '#475569' }}>{row.id}</td>
                      <td style={{ padding: '10px', fontWeight: 'bold', color: row.id === 3 ? '#0284c7' : '#0f172a' }}>{formatSmart(row.growth)}</td>
                      <td style={{ padding: '10px', color: '#475569' }}>{formatSmart(row.inclusive)}</td>
                      <td style={{ padding: '10px', color: '#475569' }}>{formatSmart(row.emission)}</td>
                      <td style={{ padding: '10px', color: '#475569' }}>{formatSmart(row.risk)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 7.5 Nhận xét và hàm ý chính sách */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #0284c7', borderRadius: '8px', padding: '25px', marginBottom: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', color: '#0f172a', marginBottom: '20px', fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🏛️</span> 7.5. Nhận xét và Hàm ý chính sách (Tối ưu hóa đa mục tiêu NSGA-II)
            </h3>
            
            <div style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.8' }}>
              
              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <b style={{ color: '#0284c7', fontSize: '14.5px', display: 'block', marginBottom: '8px' }}>
                  a) Khi quan sát đường biên Pareto, em thấy đánh đổi giữa tăng trưởng và bao trùm có rõ ràng không? Mức đánh đổi đó nói lên điều gì về cơ cấu kinh tế Việt Nam?
                </b>
                <p style={{ margin: 0, textAlign: 'justify' }}>
                  <b style={{ color: '#0f172a' }}>Tính rõ ràng của sự đánh đổi:</b> Rất rõ ràng. Trên đồ thị, Đường biên Pareto (Pareto Frontier) giữa Tăng trưởng (Growth) và Bao trùm xã hội (Inclusion) tạo thành một đường cong lồi sắc nét. Không có bất kỳ điểm nghiệm nào có thể đồng thời tối đa hóa cả hai mục tiêu này mà không làm suy giảm mục tiêu kia.<br />
                  <b style={{ color: '#0f172a' }}>Phản ánh cơ cấu kinh tế Việt Nam:</b> Mức đánh đổi (Trade-off) sâu sắc này phơi bày đặc trưng phân cực không gian lớn của nền kinh tế Việt Nam. Các vùng lõi (Đông Nam Bộ, Đồng bằng sông Hồng) có <i>Lợi thế tích tụ (Agglomeration Economies)</i> và hệ số sinh lời cận biên khổng lồ. Để tăng 1% điểm bao trùm cho các vùng sâu vùng xa (Tây Nguyên, Tây Bắc), ngân sách phải gánh chịu chi phí phát triển hạ tầng đắt đỏ nhưng thiếu hụt <i>Tính kinh tế nhờ quy mô (Economies of Scale)</i>, buộc phải hy sinh một lượng lớn GDP. Mô hình chứng minh rằng tăng trưởng bao trùm là một quá trình rất tốn kém về mặt tài khóa.
                </p>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <b style={{ color: '#059669', fontSize: '14.5px', display: 'block', marginBottom: '8px' }}>
                  b) Trọng số (0,40; 0,25; 0,20; 0,15) có phản ánh đúng ưu tiên hiện tại (Đại hội XIII) không? Điều chỉnh thế nào để phù hợp COP26 và 127/QĐ-TTg?
                </b>
                <p style={{ margin: 0, textAlign: 'justify' }}>
                  <b style={{ color: '#0f172a' }}>Sự phù hợp với Đại hội XIII:</b> Bộ trọng số hiện tại cơ bản phản ánh đúng tư duy chiến lược trung hạn: Đặt Tăng trưởng kinh tế (0.40) làm trọng tâm hàng đầu để vượt bẫy thu nhập trung bình, tiếp sau đó là Đột phá số hóa (0.25).<br />
                  <b style={{ color: '#0f172a' }}>Điều chỉnh cho COP26 và 127/QĐ-TTg:</b> Để bám sát <b>Cam kết Net-Zero (COP26)</b> và <b>Chiến lược AI Quốc gia (127/QĐ-TTg)</b>, hàm mục tiêu cần được tái cấu trúc triệt để. <br />
                  1. Cần giảm nhẹ trọng số Tăng trưởng thuần túy xuống 0.30, đồng thời nâng trọng số Kiểm soát phát thải/Rủi ro môi trường từ 0.15 lên 0.25. Việc này sẽ "ép" thuật toán NSGA-II loại bỏ các cụm dự án công nghiệp nặng để ưu tiên vốn cho công nghệ xanh. <br />
                  2. Cần tách biến "Công nghệ số" thành 2 mục tiêu độc lập: Hạ tầng ICT cơ bản và Trí tuệ nhân tạo lõi (Core AI), gán trọng số cực cao cho Core AI nhằm định tuyến dòng vốn vào R&D thay vì chỉ nhập khẩu và ứng dụng máy móc như hiện tại.
                </p>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <b style={{ color: '#d97706', fontSize: '14.5px', display: 'block', marginBottom: '8px' }}>
                  c) Vai trò của NSGA-II ở đây có gì khác so với LP đơn mục tiêu? Nó có thay thế được quyết định chính trị không?
                </b>
                <p style={{ margin: 0, textAlign: 'justify' }}>
                  <b style={{ color: '#0f172a' }}>Khác biệt thuật toán:</b> Quy hoạch tuyến tính (LP) đơn mục tiêu (như ở Bài 4) mang tính chất cực đoan, nó hội tụ về một điểm tối ưu tuyệt đối duy nhất, ép buộc nhà hoạch định phải chấp nhận một kịch bản "được ăn cả ngã về không". Ngược lại, thuật toán tiến hóa <b>NSGA-II</b> duy trì sự đa dạng của quần thể nghiệm, vẽ ra một phổ các lựa chọn <i>Bất khả úy (Non-dominated solutions)</i> trên đường biên Pareto.<br />
                  <b style={{ color: '#0f172a' }}>Về việc thay thế quyết định chính trị:</b> Câu trả lời là <b style={{ color: '#0f172a' }}>Hoàn toàn KHÔNG</b>. NSGA-II chỉ thực hiện một nhiệm vụ duy nhất: <i>Định lượng hóa cái giá của sự đánh đổi (Opportunity Cost)</i>. Nó cho biết "Nếu muốn thêm 5% an sinh, quốc gia phải mất đi bao nhiêu tỷ GDP". Việc quyết định chọn điểm nghiệm nào trên đường biên Pareto hoàn toàn phụ thuộc vào <b>Hàm thỏa dụng xã hội (Social Welfare Function)</b> và ý chí chính trị của cơ quan điều hành tại từng thời điểm lịch sử. Mô hình AIDEOM-VN là Hệ thống hỗ trợ ra quyết định (Decision Support System), không phải là chủ thể thay thế tư duy con người.
                </p>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}