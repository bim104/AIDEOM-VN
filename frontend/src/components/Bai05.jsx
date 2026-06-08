import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Bai05() {
  const [inputs, setInputs] = useState({
    total_budget: 80000, year12_budget: 40000, min_projects: 7, max_projects: 11
  });

  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  const handleInputChange = (field, val) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(val) || 0 }));
  };

  const calculateMIP = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/bai5/calculate', {
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
        alert(data.message || "Lỗi mô hình quy hoạch nguyên hoặc vô nghiệm.");
      }
      setLoading(false);
    })
    .catch(err => {
      console.error("Lỗi kết nối luồng dữ liệu Bài 5:", err);
      setLoading(false);
    });
  };

  const formatDot = (num) => {
    if (num === undefined || num === null) return "--";
    return num.toLocaleString('vi-VN');
  };

  return (
    <div style={{ color: '#1e293b', maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px', fontFamily: 'sans-serif' }}>
      
      {/* Banner Tiêu đề (Light Theme) */}
      <div style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)', border: '1px solid #bae6fd', borderRadius: '12px', padding: '30px 35px', marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: '24px', margin: 0, fontWeight: 'bold', letterSpacing: '0.5px', color: '#0369a1' }}>
            BÀI 5 — QUY HOẠCH NGUYÊN HỖN HỢP LỰA CHỌN DỰ ÁN CHUYỂN ĐỔI SỐ
          </h1>
          <p style={{ fontSize: '14px', color: '#0284c7', margin: '8px 0 0 0', fontWeight: '600' }}>
            Giai đoạn 2: Tối ưu hóa phân bổ Vốn & Danh mục đầu tư
          </p>
        </div>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(2,132,199,0.08) 0%, transparent 70%)' }}></div>
      </div>

      {/* Mô hình toán học */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '3px solid #0284c7', borderRadius: '8px', padding: '20px', marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🔢</span> Mô hình toán học
        </h3>
        <div style={{ backgroundColor: '#f8fafc', padding: '15px 20px', borderRadius: '6px', border: '1px solid #e2e8f0', overflowX: 'auto', marginBottom: '12px' }}>
          <p style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '26px', color: '#334155', margin: 0, whiteSpace: 'nowrap', letterSpacing: '0.5px', textAlign: 'center' }}>
            <b style={{color: '#0f172a'}}>Max <i>Z</i></b> = &Sigma;<sub>i</sub> <i>B</i><sub>i</sub> &middot; <i>y</i><sub>i</sub>, &nbsp;&nbsp; <i>y</i><sub>i</sub> &in; {"{0,1}"}
          </p>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#475569', textAlign: 'center' }}>
          Biến y<sub>i</sub> bằng 1 nếu dự án i được chọn. Mô hình tối đa hóa tổng lợi ích NPV với ràng buộc ngân sách 5 năm, ngân sách năm 1-2, loại trừ, tiên quyết, cân đối lĩnh vực và số lượng dự án.
        </p>
      </div>

      {/* Tham số & KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2.8fr', gap: '25px', marginBottom: '30px' }}>
        
        {/* Form nhập liệu */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>⚙️ Tham số ràng buộc</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Ngân sách tổng 5 năm, tỷ VND</label>
              <input type="number" value={inputs.total_budget} onChange={e => handleInputChange('total_budget', e.target.value)} style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Ngân sách năm 1-2, tỷ VND</label>
              <input type="number" value={inputs.year12_budget} onChange={e => handleInputChange('year12_budget', e.target.value)} style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', outline: 'none' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Số dự án tối thiểu</label>
                <input type="number" value={inputs.min_projects} onChange={e => handleInputChange('min_projects', e.target.value)} style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Số dự án tối đa</label>
                <input type="number" value={inputs.max_projects} onChange={e => handleInputChange('max_projects', e.target.value)} style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', outline: 'none' }} />
              </div>
            </div>
          </div>
          <button onClick={calculateMIP} disabled={loading} style={{ width: '100%', marginTop: '25px', background: 'linear-gradient(to right, #2563eb, #1d4ed8)', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'opacity 0.2s', opacity: loading ? 0.7 : 1 }}>
            {loading ? '⏳ Đang phân tích...' : '▶️ Chạy mô hình MIP'}
          </button>
        </div>

        {/* Khối KPI */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #0284c7', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '36px', margin: 0, fontWeight: 'bold', color: '#0284c7' }}>{resData ? formatDot(resData.z_opt) : '--'}</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Tổng lợi ích Z*</p>
          </div>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #059669', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '36px', margin: 0, fontWeight: 'bold', color: '#059669' }}>{resData ? formatDot(resData.total_cost) : '--'}</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Tổng chi phí</p>
          </div>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #d97706', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '36px', margin: 0, fontWeight: 'bold', color: '#d97706' }}>{resData ? resData.npv_cost_ratio.toString().replace('.', ',') : '--'}</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>NPV/Chi phí</p>
          </div>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #dc2626', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '36px', margin: 0, fontWeight: 'bold', color: '#dc2626' }}>{resData ? resData.project_count : '--'}</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Số dự án chọn</p>
          </div>
        </div>

      </div>

      {isCalculated && resData && (
        <>
          {/* Biểu đồ 1: Lợi ích và chi phí */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '15px', fontWeight: '600' }}>📊 Lợi ích và chi phí của dự án được chọn</h4>
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={resData.selected_projects}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="id" stroke="#475569" fontWeight="bold" fontSize={12} />
                  <YAxis stroke="#475569" fontWeight="bold" fontSize={12} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px' }} formatter={(value) => [formatDot(value), "Giá trị"]} />
                  <Legend wrapperStyle={{ fontSize: '13px', color: '#1e293b' }} />
                  <Bar dataKey="benefit" fill="#0284c7" name="Lợi ích NPV, tỷ VND" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cost" fill="#fb7185" name="Chi phí, tỷ VND" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Khu vực 2 Bảng */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr', gap: '25px', marginBottom: '30px' }}>
            
            {/* Bảng dự án được chọn */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #059669', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '15px', fontWeight: '600' }}>📋 Danh sách dự án được chọn</h4>
              <div style={{ overflowY: 'auto', maxHeight: '380px' }}>
                <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', backgroundColor: '#f1f5f9' }}>
                      <th style={{ padding: '12px 10px', borderRadius: '6px 0 0 0' }}>Mã</th>
                      <th style={{ padding: '12px 10px' }}>Tên dự án</th>
                      <th style={{ padding: '12px 10px' }}>Lĩnh vực</th>
                      <th style={{ padding: '12px 10px', textAlign: 'right' }}>Chi phí</th>
                      <th style={{ padding: '12px 10px', textAlign: 'right' }}>Lợi ích</th>
                      <th style={{ padding: '12px 10px', textAlign: 'right', borderRadius: '0 6px 0 0' }}>NPV/Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resData.selected_projects.map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: i % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                        <td style={{ padding: '10px', fontWeight: 'bold', color: '#0284c7' }}>{row.id}</td>
                        <td style={{ padding: '10px', color: '#0f172a', fontWeight: '500' }}>{row.name}</td>
                        <td style={{ padding: '10px', color: '#475569' }}>{row.sector}</td>
                        <td style={{ padding: '10px', textAlign: 'right', color: '#0f172a' }}>{formatDot(row.cost)}</td>
                        <td style={{ padding: '10px', textAlign: 'right', color: '#059669', fontWeight: 'bold' }}>{formatDot(row.benefit)}</td>
                        <td style={{ padding: '10px', textAlign: 'right', color: '#d97706', fontWeight: 'bold' }}>{(row.benefit / row.cost).toFixed(4).replace('.', ',')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bảng toàn bộ 15 dự án ứng cử */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #d97706', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '15px', fontWeight: '600' }}>📋 Tất cả 15 dự án ứng cử</h4>
              <div style={{ overflowY: 'auto', maxHeight: '380px' }}>
                <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', backgroundColor: '#f1f5f9' }}>
                      <th style={{ padding: '12px 10px', borderRadius: '6px 0 0 0' }}>Mã</th>
                      <th style={{ padding: '12px 10px' }}>Lĩnh vực</th>
                      <th style={{ padding: '12px 10px', textAlign: 'right' }}>Chi phí</th>
                      <th style={{ padding: '12px 10px', textAlign: 'right' }}>Lợi ích</th>
                      <th style={{ padding: '12px 10px', textAlign: 'right', borderRadius: '0 6px 0 0' }}>Tỷ suất</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resData.candidate_table.map((row, i) => {
                      const isChosen = resData.selected_projects.some(p => p.id === row.id);
                      return (
                        <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: isChosen ? 'rgba(5, 150, 105, 0.05)' : (i % 2 === 0 ? 'transparent' : '#f8fafc') }}>
                          <td style={{ padding: '10px', fontWeight: 'bold', color: isChosen ? '#059669' : '#64748b' }}>{row.id} {isChosen && "✓"}</td>
                          <td style={{ padding: '10px', color: '#475569' }}>{row.sector}</td>
                          <td style={{ padding: '10px', textAlign: 'right', color: '#0f172a' }}>{formatDot(row.cost)}</td>
                          <td style={{ padding: '10px', textAlign: 'right', color: '#0f172a' }}>{formatDot(row.benefit)}</td>
                          <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: isChosen ? '#d97706' : '#94a3b8' }}>{row.ratio.toFixed(4).replace('.', ',')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Biểu đồ kịch bản & Khối thông tin bổ trợ */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr', gap: '25px', marginBottom: '30px' }}>
            
            {/* Đồ thị kịch bản */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '15px', fontWeight: '600' }}>📊 So sánh kịch bản ngân sách và rủi ro (tỷ VND)</h4>
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer>
                  <BarChart data={resData.scenario_chart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" fontSize={11} fontWeight="bold" />
                    <YAxis stroke="#475569" fontSize={11} fontWeight="bold" />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px' }} formatter={(value) => [formatDot(value), "Giá trị"]} />
                    <Bar dataKey="value" fill="#0ea5e9" name="Giá trị mục tiêu, tỷ VND" radius={[4, 4, 0, 0]} barSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Khối kịch bản văn bản */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderLeft: '4px solid #ef4444', borderRadius: '6px', padding: '15px' }}>
                <h5 style={{ margin: '0 0 8px 0', fontSize: '13.5px', color: '#b91c1c', fontWeight: 'bold' }}>📋 Kịch bản yêu cầu cả P1 và P2</h5>
                <p style={{ margin: 0, fontSize: '13px', color: '#475569', whiteSpace: 'pre-line', lineHeight: '1.6' }}>{resData.force_both_comment}</p>
              </div>
              <div style={{ backgroundColor: '#ecfeff', border: '1px solid #a5f3fc', borderLeft: '4px solid #06b6d4', borderRadius: '6px', padding: '15px' }}>
                <h5 style={{ margin: '0 0 8px 0', fontSize: '13.5px', color: '#0369a1', fontWeight: 'bold' }}>📈 Nới ngân sách lên 100.000 tỷ VND</h5>
                <p style={{ margin: 0, fontSize: '13px', color: '#475569', whiteSpace: 'pre-line', lineHeight: '1.6' }}>{resData.budget_100_comment}</p>
              </div>
              <div style={{ backgroundColor: '#faf5ff', border: '1px solid #e9d5ff', borderLeft: '4px solid #a855f7', borderRadius: '6px', padding: '15px' }}>
                <h5 style={{ margin: '0 0 8px 0', fontSize: '13.5px', color: '#7e22ce', fontWeight: 'bold' }}>🛡️ Mở rộng rủi ro: tối đa hóa E[Z]</h5>
                <p style={{ margin: 0, fontSize: '13px', color: '#475569', whiteSpace: 'pre-line', lineHeight: '1.6' }}>{resData.risk_comment}</p>
              </div>
            </div>

          </div>

          {/* 5.5 Nhận xét và hàm ý chính sách */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #0284c7', borderRadius: '8px', padding: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', color: '#0f172a', marginBottom: '20px', fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🏛️</span> 5.5. Nhận xét và hàm ý chính sách
            </h3>
            
            <div style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.8' }}>
              
              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <b style={{ color: '#0284c7', fontSize: '14.5px', display: 'block', marginBottom: '8px' }}>
                  a) Vì sao mô hình bỏ qua dự án P15 (Open Data) dù tỷ suất lợi ích/chi phí rất cao? Đây có phải là kết quả mong muốn về mặt chính sách?
                </b>
                <p style={{ margin: 0, textAlign: 'justify' }}>
                  <b style={{ color: '#0f172a' }}>Lý do thuật toán:</b> Khác với thuật toán tham lam (Greedy Algorithm) luôn ưu tiên các dự án có tỷ suất ROI (Lợi ích/Chi phí) cao nhất, thuật toán Quy hoạch nguyên (Integer Programming - bài toán Knapsack) tìm kiếm <b style={{ color: '#0f172a' }}>tổ hợp tối ưu cục diện</b>. P15 bị loại có thể do nó vi phạm trần ngân sách của một nhóm ngành cụ thể, hoặc do kích thước chi phí của nó khi ghép nối với các dự án lớn khác làm vượt mốc ngân sách tổng, buộc thuật toán phải thế chỗ bằng một cụm dự án nhỏ hơn để lấp đầy không gian trống, tối đa hóa tổng giá trị hàm mục tiêu Z*.<br />
                  <b style={{ color: '#0f172a' }}>Góc độ chính sách:</b> Đây <b style={{ color: '#0f172a' }}>không phải là kết quả mong muốn</b>. Dữ liệu mở (Open Data) là loại hàng hóa công cộng tạo ra ngoại ứng tích cực (positive externality) khổng lồ cho toàn bộ hệ sinh thái khởi nghiệp và nghiên cứu, nhưng lợi ích này khó lượng hóa thành con số tài chính trực tiếp trong ngắn hạn. Sự vắng mặt của P15 phản ánh điểm mù của mô hình toán học thuần túy. Để khắc phục, nhà hoạch định cần dùng quyền can thiệp (Human-in-the-loop) bằng cách gán P15 thành "dự án bắt buộc" hoặc áp dụng trọng số chiến lược (Strategic Weight) cao hơn cho dự án này.
                </p>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <b style={{ color: '#059669', fontSize: '14.5px', display: 'block', marginBottom: '8px' }}>
                  b) Ràng buộc “bắt buộc P14 (an ninh mạng)” có làm giảm Z* không? Việc bắt buộc này có hợp lý không?
                </b>
                <p style={{ margin: 0, textAlign: 'justify' }}>
                  <b style={{ color: '#0f172a' }}>Về mặt toán học:</b> Việc gán chặt biến quyết định x<sub>14</sub> = 1 chắc chắn sẽ làm thu hẹp không gian nghiệm khả thi (Feasible Region). Nếu P14 không nằm trong tập hợp lời giải tối ưu tự do ban đầu (do chi phí cao nhưng lợi ích trực tiếp thấp), việc ép buộc chọn nó sẽ lấy mất không gian ngân sách của các dự án sinh lời khác, dẫn đến <b style={{ color: '#0f172a' }}>sự suy giảm của tổng lợi ích tối đa Z*</b>.<br />
                  <b style={{ color: '#0f172a' }}>Về mặt thực tiễn:</b> Việc bắt buộc này là <b style={{ color: '#0f172a' }}>hoàn toàn hợp lý và mang tính sống còn</b>. An ninh mạng không trực tiếp làm tăng GDP hay năng suất, mà nó đóng vai trò là "chi phí bảo hiểm" (Insurance Premium) để bảo vệ toàn bộ hạ tầng. Phần giá trị Z* bị giảm đi chính là phí bảo hiểm mà quốc gia phải trả. Nếu loại bỏ P14 để lấy Z* cao hơn trên giấy, toàn bộ hệ thống số hóa có thể sụp đổ khi đối mặt với rủi ro tấn công mạng (Cyber-attack), đưa giá trị thực tế của mọi dự án khác về con số 0.
                </p>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <b style={{ color: '#d97706', fontSize: '14.5px', display: 'block', marginBottom: '8px' }}>
                  c) Mô hình giả định các dự án độc lập về lợi ích, nhưng trên thực tế P8 (AI) và P13 (bán dẫn) có lợi ích cộng hưởng. Làm thế nào để mô hình hóa hiệu ứng cộng hưởng này?
                </b>
                <p style={{ margin: 0, textAlign: 'justify' }}>
                  Để mô hình hóa hiệu ứng cộng hưởng (Synergy) giữa P8 và P13, ta cần phá vỡ giả định tuyến tính bằng cách đưa thêm một <b style={{ color: '#0f172a' }}>biến phụ thuộc logic</b> vào mô hình Quy hoạch nguyên.<br />
                  <b style={{ color: '#0f172a' }}>Cách thiết lập toán học:</b><br />
                  1. Gọi x<sub>8</sub> và x<sub>13</sub> là hai biến quyết định nhị phân (1 nếu chọn, 0 nếu không chọn).<br />
                  2. Khởi tạo một biến nhị phân mới y<sub>8,13</sub>, đại diện cho trạng thái "cả hai dự án cùng được chọn".<br />
                  3. Bổ sung giá trị cộng hưởng vào hàm mục tiêu: + S &times; y<sub>8,13</sub> (trong đó S là lợi ích thặng dư tăng thêm khi có hệ sinh thái đồng bộ).<br />
                  4. Thêm 3 ràng buộc tuyến tính (Linear Constraints) để ép biến y<sub>8,13</sub> hoạt động như cổng logic AND:<br />
                  &nbsp;&nbsp;&nbsp;• y<sub>8,13</sub> &le; x<sub>8</sub><br />
                  &nbsp;&nbsp;&nbsp;• y<sub>8,13</sub> &le; x<sub>13</sub><br />
                  &nbsp;&nbsp;&nbsp;• y<sub>8,13</sub> &ge; x<sub>8</sub> + x<sub>13</sub> - 1<br />
                  Bằng cách này, solver sẽ tự hiểu rằng nếu nó chọn cả P8 và P13, nó sẽ được cộng thêm một phần thưởng S rất lớn vào hàm mục tiêu Z*, từ đó tự động ưu tiên giải ngân cho các cụm dự án có tính liên kết hệ sinh thái cao.
                </p>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}