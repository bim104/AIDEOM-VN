import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Bai04() {
  const [inputs, setInputs] = useState({
    total_budget: 50000, region_floor: 5000, region_ceiling: 12000, human_floor: 12000, gamma: 0.002, lam: 0.68
  });

  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  const handleInputChange = (field, val) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(val) || 0 }));
  };

  const calculateRegionLP = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/bai4/calculate', {
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
        alert(data.message || "Lỗi hệ thống hoặc mô hình vô nghiệm.");
      }
      setLoading(false);
    })
    .catch(err => {
      console.error("Lỗi liên thông dòng dữ liệu Bài 4:", err);
      setLoading(false);
    });
  };

  // Cập nhật lại màu sắc cho đồ thị trên nền sáng
  const COLORS = ['#0284c7', '#059669', '#d97706', '#dc2626', '#7c3aed', '#db2777'];

  // Định dạng hiển thị dấu chấm phân tách phần nghìn giống ảnh mẫu
  const formatDot = (num) => {
    if (num === undefined || num === null) return "--";
    return num.toLocaleString('vi-VN', { maximumFractionDigits: 4 });
  };

  // Định dạng dấu phẩy cho tỷ lệ phần trăm
  const formatPercent = (num) => {
    if (!num) return "--";
    return num.toString().replace(".", ",") + "%";
  };

  // Hàm điều tiết màu Heatmap động theo độ lớn giá trị phân bổ (Màu sáng hơn cho Light Theme)
  const getHeatmapBg = (val) => {
    if (val === 0) return 'transparent';
    if (val <= 500) return 'rgba(2, 132, 199, 0.1)'; 
    if (val <= 4500) return 'rgba(2, 132, 199, 0.25)'; 
    if (val <= 7500) return 'rgba(2, 132, 199, 0.5)'; 
    return 'rgba(37, 99, 235, 0.85)'; 
  };

  return (
    <div style={{ color: '#1e293b', maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px', fontFamily: 'sans-serif' }}>
      
      {/* Banner Tiêu đề (Light Theme) */}
      <div style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)', border: '1px solid #bae6fd', borderRadius: '12px', padding: '30px 35px', marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: '24px', margin: 0, fontWeight: 'bold', letterSpacing: '0.5px', color: '#0369a1' }}>
            BÀI 4 — QUY HOẠCH TUYẾN TÍNH PHÂN BỔ NGÂN SÁCH SỐ THEO NGÀNH - VÙNG
          </h1>
          <p style={{ fontSize: '14px', color: '#0284c7', margin: '8px 0 0 0', fontWeight: '600' }}>
            Giai đoạn 2: Tối ưu hóa phân bổ Vốn & Nguồn lực Đa chiều
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
            <b style={{color: '#0f172a'}}>Max <i>Z</i></b> = &Sigma;<sub>r</sub>&Sigma;<sub>j</sub> &beta;<sub>j,r</sub> &middot; <i>x</i><sub>j,r</sub>
          </p>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#475569', textAlign: 'center' }}>
          Biến quyết định x<sub>j,r</sub> là ngân sách phân bổ cho hạng mục j tại vùng r. Mô hình tối đa hóa GDP gain kỳ vọng nhưng vẫn bảo đảm sàn/trần vùng, sàn nhân lực số và ràng buộc công bằng vùng miền.
        </p>
      </div>

      {/* Khu cấu hình đầu vào và Khối KPI số liệu */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2.8fr', gap: '25px', marginBottom: '30px' }}>
        
        {/* Form tham số ràng buộc */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>⚙️ Tham số ràng buộc</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Ngân sách tổng, tỷ VND</label>
              <input type="number" value={inputs.total_budget} onChange={e => handleInputChange('total_budget', e.target.value)} style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', outline: 'none' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Sàn mỗi vùng</label>
                <input type="number" value={inputs.region_floor} onChange={e => handleInputChange('region_floor', e.target.value)} style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Trần mỗi vùng</label>
                <input type="number" value={inputs.region_ceiling} onChange={e => handleInputChange('region_ceiling', e.target.value)} style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', outline: 'none' }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Sàn nhân lực số</label>
              <input type="number" value={inputs.human_floor} onChange={e => handleInputChange('human_floor', e.target.value)} style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', outline: 'none' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: '6px', fontWeight: '600' }}>&gamma; (Hệ số Gini)</label>
                <input type="number" step="0.001" value={inputs.gamma} onChange={e => handleInputChange('gamma', e.target.value)} style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: '6px', fontWeight: '600' }}>&lambda; (Độ trễ)</label>
                <input type="number" step="0.01" value={inputs.lam} onChange={e => handleInputChange('lam', e.target.value)} style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', outline: 'none' }} />
              </div>
            </div>
          </div>
          <button onClick={calculateRegionLP} disabled={loading} style={{ width: '100%', marginTop: '25px', background: 'linear-gradient(to right, #2563eb, #1d4ed8)', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'opacity 0.2s', opacity: loading ? 0.7 : 1 }}>
            {loading ? '⏳ Đang phân tích...' : '▶️ Chạy mô hình LP ngành - vùng'}
          </button>
        </div>

        {/* Khối hộp KPI */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #0284c7', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '36px', margin: 0, fontWeight: 'bold', color: '#0284c7' }}>{resData ? formatDot(resData.z_opt) : '--'}</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Z* tối ưu</p>
          </div>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #059669', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 'bold', lineHeight: '1.4', color: '#059669' }}>{resData ? resData.top_region : '--'}</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Vùng nhận nhiều nhất</p>
          </div>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #d97706', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '36px', margin: 0, fontWeight: 'bold', color: '#d97706' }}>{resData ? formatDot(resData.fairness_cost) : '--'}</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Chi phí công bằng</p>
          </div>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #dc2626', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '36px', margin: 0, fontWeight: 'bold', color: '#dc2626' }}>{resData ? formatPercent(resData.fairness_pct) : '--'}</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>% chi phí công bằng</p>
          </div>
        </div>

      </div>

      {isCalculated && resData && (
        <>
          {/* Khu vực đồ thị Recharts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '30px' }}>
            
            {/* Đồ thị vùng */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '15px', fontWeight: '600' }}>📊 Tổng ngân sách theo vùng (tỷ VND)</h4>
              <div style={{ width: '100%', height: 380 }}>
                <ResponsiveContainer>
                  <BarChart data={resData.region_chart} margin={{ top: 10, right: 10, left: 10, bottom: 90 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" fontSize={11} fontWeight="bold" interval={0} angle={-45} textAnchor="end" height={50} />
                    <YAxis stroke="#475569" fontSize={11} fontWeight="bold" />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px' }} formatter={(value) => [formatDot(value), "Ngân sách"]} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {resData.region_chart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Đồ thị hạng mục */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '15px', fontWeight: '600' }}>📊 Tổng ngân sách theo hạng mục</h4>
              <div style={{ width: '100%', height: 380 }}>
                <ResponsiveContainer>
                  <BarChart data={resData.item_chart} margin={{ top: 10, right: 10, left: 10, bottom: 90 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" fontSize={12} fontWeight="bold" interval={0} angle={-20} textAnchor="end" />
                    <YAxis stroke="#475569" fontSize={11} fontWeight="bold" />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px' }} formatter={(value) => [formatDot(value), "Ngân sách"]} />
                    <Bar dataKey="value" fill="#059669" radius={[4, 4, 0, 0]} barSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Ma trận phân bổ Heatmap chi tiết */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '15px', fontWeight: '600' }}>🗺️ Heatmap phân bổ tối ưu 6 vùng &times; 4 hạng mục</h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', backgroundColor: '#f1f5f9' }}>
                    <th style={{ padding: '12px', borderRadius: '6px 0 0 0' }}>Vùng</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>I - Hạ tầng</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>D - CĐS DN</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>AI</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>H - Nhân lực</th>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#0284c7', borderRadius: '0 6px 0 0' }}>Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {resData.heatmap_table.map((row, idx) => {
                    const isEven = idx % 2 === 0;
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: isEven ? 'transparent' : '#f8fafc' }}>
                        <td style={{ padding: '12px', fontWeight: 'bold', color: '#0f172a' }}>{row.region}</td>
                        <td style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: row.infrastructure > 5000 ? '#fff' : '#0f172a', backgroundColor: getHeatmapBg(row.infrastructure) }}>{formatDot(row.infrastructure)}</td>
                        <td style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: row.digital_transformation > 5000 ? '#fff' : '#0f172a', backgroundColor: getHeatmapBg(row.digital_transformation) }}>{formatDot(row.digital_transformation)}</td>
                        <td style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: row.ai > 5000 ? '#fff' : '#0f172a', backgroundColor: getHeatmapBg(row.ai) }}>{formatDot(row.ai)}</td>
                        <td style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: row.human_resource > 5000 ? '#fff' : '#0f172a', backgroundColor: getHeatmapBg(row.human_resource) }}>{formatDot(row.human_resource)}</td>
                        <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#0284c7' }}>{formatDot(row.total)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Các bảng đối chiếu phụ */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '30px' }}>
            
            {/* Đối chiếu Solver */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #059669', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '15px', fontWeight: '600' }}>📋 Đối chiếu PuLP và CVXPY</h4>
              <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', textAlign: 'left', backgroundColor: '#f1f5f9' }}>
                    <th style={{ padding: '12px 10px', borderRadius: '6px 0 0 0' }}>Chỉ tiêu</th>
                    <th style={{ padding: '12px 10px', borderRadius: '0 6px 0 0' }}>Kết quả</th>
                  </tr>
                </thead>
                <tbody>
                  {resData.solver_comparison.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: i % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                      <td style={{ padding: '10px', color: '#475569' }}>{row.indicator}</td>
                      <td style={{ padding: '10px', fontWeight: 'bold', color: '#059669' }}>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Khối chi phí kinh tế vùng miền */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #dc2626', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '15px', fontWeight: '600' }}>⚖️ Chi phí kinh tế của công bằng vùng miền</h4>
              <div style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.8' }}>
                <p>Mô hình đầy đủ có ràng buộc công bằng vùng miền đạt <span style={{ color: '#0284c7', fontWeight: 'bold' }}>Z* = {formatDot(resData.z_opt)}</span> tỷ VND GDP gain.</p>
                <p>Khi bỏ ràng buộc công bằng C5, mô hình đạt <span style={{ color: '#dc2626', fontWeight: 'bold' }}>Z* = {formatDot(resData.z_no_fair)}</span> tỷ VND GDP gain.</p>
                <p style={{ margin: 0, marginTop: '10px' }}>Vì vậy, chi phí kinh tế của công bằng vùng miền là khoảng <span style={{ color: '#d97706', fontWeight: 'bold' }}>{formatDot(resData.fairness_cost)}</span> tỷ VND GDP gain, tương đương <span style={{ color: '#dc2626', fontWeight: 'bold' }}>{formatPercent(resData.fairness_pct)}</span>. Khoản giảm này phản ánh phần hiệu quả kinh tế ngắn hạn phải đánh đổi để bảo đảm các vùng có mức phát triển số thấp không bị bỏ lại phía sau.</p>
              </div>
            </div>

          </div>

          {/* Bảng Hạng mục ưu tiên */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #0891b2', borderRadius: '8px', padding: '20px', marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '15px', fontWeight: '600' }}>📋 Hạng mục ưu tiên ở từng vùng</h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', textAlign: 'left', backgroundColor: '#f1f5f9' }}>
                    <th style={{ padding: '12px 10px', borderRadius: '6px 0 0 0' }}>Vùng</th>
                    <th style={{ padding: '12px 10px' }}>Hạng mục ưu tiên</th>
                    <th style={{ padding: '12px 10px', textAlign: 'right', borderRadius: '0 6px 0 0' }}>Ngân sách, tỷ VND</th>
                  </tr>
                </thead>
                <tbody>
                  {resData.preferred_items.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: i % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                      <td style={{ padding: '10px', fontWeight: 'bold', color: '#0f172a' }}>{row.region}</td>
                      <td style={{ padding: '10px', color: '#d97706', fontWeight: '500' }}>{row.item}</td>
                      <td style={{ padding: '10px', fontWeight: 'bold', color: '#059669', textAlign: 'right' }}>{formatDot(row.budget)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 🏛️ KHỐI BIỆN LUẬN CHÍNH SÁCH */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #0284c7', borderRadius: '8px', padding: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', color: '#0f172a', marginBottom: '20px', fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🏛️</span> 4.5. Nhận xét và hàm ý chính sách
            </h3>
            <div style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.8' }}>
              
              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <b style={{ color: '#0284c7', fontSize: '14.5px', display: 'block', marginBottom: '8px' }}>a) Nếu bỏ ràng buộc công bằng, vốn sẽ chảy về vùng nào? Tại sao? Hậu quả xã hội dài hạn ra sao?</b>
                <p style={{ margin: 0, textAlign: 'justify' }}>
                  - <b style={{ color: '#0f172a' }}>Dòng chảy của vốn:</b> Nếu gỡ bỏ ràng buộc công bằng (Equity constraint), thuật toán Quy hoạch tuyến tính (Linear Programming) sẽ dồn toàn bộ nguồn lực ngân sách vào một hoặc hai vùng có hệ số năng suất biên (hệ số sinh lời trong hàm mục tiêu) cao nhất – thường là các đầu tàu kinh tế như Đông Nam Bộ và Đồng bằng sông Hồng.<br />
                  - <b style={{ color: '#0f172a' }}>Tại sao:</b> Bản chất của thuật toán LP là tối đa hóa hàm mục tiêu Z. Khi không bị giới hạn bởi các điều kiện phân bổ tối thiểu hay tỷ lệ công bằng, thuật toán sẽ theo đuổi hiệu quả tuyệt đối (Absolute Efficiency), "vắt kiệt" ngân sách vào nơi tạo ra nhiều giá trị nhất trên mỗi đồng vốn bỏ ra.<br />
                  - <b style={{ color: '#0f172a' }}>Hậu quả xã hội dài hạn:</b> Dù Z đạt mức cao nhất về mặt toán học, hệ lụy thực tế sẽ vô cùng nghiêm trọng. Khoảng cách giàu nghèo và chênh lệch phát triển giữa các vùng miền sẽ bị nới rộng thành hố sâu. Các vùng lõi sẽ đối mặt với tình trạng quá tải hạ tầng, kẹt xe, ô nhiễm và lạm phát chi phí; trong khi các vùng rìa bị "chảy máu xám", kiệt quệ tài nguyên, và không thể duy trì được mạng lưới an sinh xã hội cơ bản.
                </p>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <b style={{ color: '#059669', fontSize: '14.5px', display: 'block', marginBottom: '8px' }}>b) Ràng buộc trần ngân sách mỗi vùng (C3) có thể coi như một “chính sách phân quyền”. Nó làm giảm Z* bao nhiêu phần trăm? Mức giảm này có chấp nhận được không?</b>
                <p style={{ margin: 0, textAlign: 'justify' }}>
                  - <b style={{ color: '#0f172a' }}>Về mức giảm Z*:</b> Việc áp đặt thêm bất kỳ ràng buộc nào (như trần ngân sách C3) vào không gian nghiệm đều thu hẹp vùng khả thi (Feasible Region), do đó chắc chắn sẽ làm giảm giá trị tối ưu Z* so với kịch bản tự do tuyệt đối. Mức độ sụt giảm (thường dao động trong khoảng 3% - 8% tùy vào hệ số đầu vào cụ thể của cấu hình) chính là "cái giá của sự công bằng" (Cost of Equity).<br />
                  - <b style={{ color: '#0f172a' }}>Đánh giá mức độ chấp nhận:</b> Mức giảm này là hoàn toàn chấp nhận được và cần thiết. Xét về mặt kinh tế học vĩ mô, trần ngân sách hoạt động như một ngưỡng giới hạn rủi ro "quá tải hấp thụ vốn" (bottleneck). Một địa phương dù có hệ số sinh lời cao trên giấy tờ, nhưng nếu bị bơm quá nhiều vốn trong thời gian ngắn sẽ dẫn đến lãng phí, tham nhũng và hiệu suất sinh lời giảm dần (Diminishing Marginal Returns). Do đó, sự suy giảm một chút của Z* là sự đánh đổi xứng đáng để đổi lấy sự phát triển hài hòa, đa cực và bền vững.
                </p>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <b style={{ color: '#d97706', fontSize: '14.5px', display: 'block', marginBottom: '8px' }}>c) Vùng Tây Nguyên có sàn 5.000 tỷ nhưng hệ số AI rất thấp (0,45). Nên đầu tư vào AI tại Tây Nguyên hay tập trung H và I trước? Mô hình trả lời như thế nào?</b>
                <p style={{ margin: 0, textAlign: 'justify' }}>
                  - <b style={{ color: '#0f172a' }}>Hành vi của mô hình:</b> Khi chạy thuật toán, mô hình sẽ tự động giải quyết bài toán này bằng cách không (hoặc phân bổ mức tối thiểu sát sàn nhất có thể) cho cấu phần AI tại Tây Nguyên. Thay vào đó, để đáp ứng ngưỡng sàn 5.000 tỷ của vùng, mô hình sẽ điều phối dòng vốn vào các cấu phần có hệ số sinh lời tốt hơn tại chính vùng đó, đặc biệt là Hạ tầng kỹ thuật (K, D) và Nhân lực (H).<br />
                  - <b style={{ color: '#0f172a' }}>Bài học chính sách:</b> Kết quả toán học này phản ánh chính xác thực tiễn kinh tế. Với hệ số AI biên chỉ là 0.45, việc cố tình "nhảy cóc" rót tiền vào công nghệ lõi AI tại Tây Nguyên khi hạ tầng kết nối yếu và nhân lực chưa đủ trình độ là sự lãng phí tài khóa. Chính sách khôn ngoan nhất ở giai đoạn đầu là dùng ngân sách để xây dựng móng: Tập trung vào Vốn con người (H) và Hạ tầng số cơ bản (D). Chỉ khi các chỉ số này được nâng cấp, năng lực hấp thụ AI mới tăng lên, tạo tiền đề cho các giai đoạn quy hoạch sau.
                </p>
              </div>

            </div>
          </div>
          
        </>
      )}
    </div>
  );
}