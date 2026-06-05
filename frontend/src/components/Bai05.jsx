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
    <div style={{ color: '#ffffff', maxWidth: '1400px', margin: '0 auto', paddingBottom: '30px', fontFamily: 'sans-serif' }}>
      
      {/* Tiêu đề */}
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase' }}>BÀI 5 — QUY HOẠCH NGUYÊN HỖN HỢP LỰA CHỌN DỰ ÁN CHUYỂN ĐỔI SỐ</h1>
      </div>

      {/* Mô hình toán học */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '3px solid #38bdf8', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🔢</span> Mô hình toán học
        </h3>
        <div style={{ backgroundColor: '#0f172a', padding: '15px 20px', borderRadius: '6px', overflowX: 'auto', marginBottom: '12px' }}>
          <p style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '26px', color: '#cbd5e1', margin: 0, whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>
            <b style={{color: '#fff'}}>Max <i>Z</i></b> = &Sigma;<sub>i</sub> <i>B</i><sub>i</sub> &middot; <i>y</i><sub>i</sub>, &nbsp;&nbsp; <i>y</i><sub>i</sub> &in; {"{0,1}"}
          </p>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
          Biến y<sub>i</sub> bằng 1 nếu dự án i được chọn. Mô hình tối đa hóa tổng lợi ích NPV với ràng buộc ngân sách 5 năm, ngân sách năm 1-2, loại trừ, tiên quyết, cân đối lĩnh vực và số lượng dự án.
        </p>
      </div>

      {/* Tham số & KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2.8fr', gap: '20px', marginBottom: '30px' }}>
        
        {/* Form nhập liệu */}
        <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', color: '#38bdf8', borderBottom: '1px solid #232936', paddingBottom: '10px' }}>⚙️ Tham số ràng buộc</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Ngân sách tổng 5 năm, tỷ VND</label>
              <input type="number" value={inputs.total_budget} onChange={e => handleInputChange('total_budget', e.target.value)} style={{ width: '100%', padding: '7px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Ngân sách năm 1-2, tỷ VND</label>
              <input type="number" value={inputs.year12_budget} onChange={e => handleInputChange('year12_budget', e.target.value)} style={{ width: '100%', padding: '7px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Số dự án tối thiểu</label>
                <input type="number" value={inputs.min_projects} onChange={e => handleInputChange('min_projects', e.target.value)} style={{ width: '100%', padding: '7px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Số dự án tối đa</label>
                <input type="number" value={inputs.max_projects} onChange={e => handleInputChange('max_projects', e.target.value)} style={{ width: '100%', padding: '7px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} />
              </div>
            </div>
          </div>
          <button onClick={calculateMIP} disabled={loading} style={{ width: '100%', marginTop: '18px', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            {loading ? '⏳ Đang phân tích...' : '▶️ Chạy mô hình MIP'}
          </button>
        </div>

        {/* Khối KPI */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div style={{ backgroundColor: '#17a2b8', padding: '20px', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px' }}>
            <h2 style={{ fontSize: '34px', margin: 0, fontWeight: 'bold' }}>{resData ? formatDot(resData.z_opt) : '--'}</h2>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#e0f2fe' }}>Tổng lợi ích Z*</p>
          </div>
          <div style={{ backgroundColor: '#28a745', padding: '20px', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px' }}>
            <h2 style={{ fontSize: '34px', margin: 0, fontWeight: 'bold' }}>{resData ? formatDot(resData.total_cost) : '--'}</h2>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#d1fae5' }}>Tổng chi phí</p>
          </div>
          <div style={{ backgroundColor: '#ffc107', padding: '20px', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px' }}>
            <h2 style={{ fontSize: '34px', margin: 0, fontWeight: 'bold', color: '#212529' }}>{resData ? resData.npv_cost_ratio.toString().replace('.', ',') : '--'}</h2>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#343a40' }}>NPV/Chi phí</p>
          </div>
          <div style={{ backgroundColor: '#dc3545', padding: '20px', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px' }}>
            <h2 style={{ fontSize: '34px', margin: 0, fontWeight: 'bold' }}>{resData ? resData.project_count : '--'}</h2>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#fee2e2' }}>Số dự án chọn</p>
          </div>
        </div>

      </div>

      {isCalculated && resData && (
        <>
          {/* Biểu đồ 1: Lợi ích và chi phí */}
          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
            <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>📊 Lợi ích và chi phí của dự án được chọn</h4>
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={resData.selected_projects}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#232936" vertical={false} />
                  <XAxis dataKey="id" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff', border: '1px solid #232936' }} formatter={(value) => [formatDot(value), "Giá trị"]} />
                  <Legend />
                  <Bar dataKey="benefit" fill="#38bdf8" name="Lợi ích NPV, tỷ VND" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cost" fill="#fb7185" name="Chi phí, tỷ VND" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Khu vực 2 Bảng */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr', gap: '20px', marginBottom: '25px' }}>
            
            {/* Bảng dự án được chọn */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '3px solid #34d399', borderRadius: '4px', padding: '20px' }}>
              <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>📋 Danh sách dự án được chọn</h4>
              <div style={{ overflowY: 'auto', maxHeight: '350px' }}>
                <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8', backgroundColor: '#0f172a' }}>
                      <th style={{ padding: '8px' }}>Mã</th>
                      <th style={{ padding: '8px' }}>Tên dự án</th>
                      <th style={{ padding: '8px' }}>Lĩnh vực</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Chi phí</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Lợi ích</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>NPV/Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resData.selected_projects.map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #232936' }}>
                        <td style={{ padding: '8px', fontWeight: 'bold', color: '#38bdf8' }}>{row.id}</td>
                        <td style={{ padding: '8px' }}>{row.name}</td>
                        <td style={{ padding: '8px', color: '#cbd5e1' }}>{row.sector}</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>{formatDot(row.cost)}</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>{formatDot(row.benefit)}</td>
                        <td style={{ padding: '8px', textAlign: 'right', color: '#fbbf24', fontWeight: '600' }}>{(row.benefit / row.cost).toFixed(4).replace('.', ',')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bảng toàn bộ 15 dự án ứng cử */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '3px solid #fbbf24', borderRadius: '4px', padding: '20px' }}>
              <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>📋 Tất cả 15 dự án ứng cử</h4>
              <div style={{ overflowY: 'auto', maxHeight: '350px' }}>
                <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8', backgroundColor: '#0f172a' }}>
                      <th style={{ padding: '8px' }}>Mã</th>
                      <th style={{ padding: '8px' }}>Lĩnh vực</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Chi phí</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Lợi ích</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Tỷ suất</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resData.candidate_table.map((row, i) => {
                      const isChosen = resData.selected_projects.some(p => p.id === row.id);
                      return (
                        <tr key={i} style={{ borderBottom: '1px solid #232936', backgroundColor: isChosen ? 'rgba(52, 211, 153, 0.05)' : 'transparent' }}>
                          <td style={{ padding: '8px', fontWeight: 'bold', color: isChosen ? '#34d399' : '#94a3b8' }}>{row.id} {isChosen && "✓"}</td>
                          <td style={{ padding: '8px', color: '#cbd5e1' }}>{row.sector}</td>
                          <td style={{ padding: '8px', textAlign: 'right' }}>{formatDot(row.cost)}</td>
                          <td style={{ padding: '8px', textAlign: 'right' }}>{formatDot(row.benefit)}</td>
                          <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold', color: '#fbbf24' }}>{row.ratio.toFixed(4).replace('.', ',')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Biểu đồ kịch bản & Khối thông tin bổ trợ */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr', gap: '20px', marginBottom: '25px' }}>
            
            {/* Đồ thị kịch bản */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '15px' }}>📊 So sánh kịch bản ngân sách và rủi ro ( tỷ VND)</h4>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={resData.scenario_chart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232936" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff' }} formatter={(value) => [formatDot(value), "Giá trị"]} />
                    <Bar dataKey="value" fill="#7dd3fc" name="Giá trị mục tiêu, tỷ VND" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Khối kịch bản văn bản */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderLeft: '4px solid #ef4444', borderRadius: '4px', padding: '15px' }}>
                <h5 style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#f87171', fontWeight: 'bold' }}>📋 Kịch bản yêu cầu cả P1 và P2</h5>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#cbd5e1', whiteSpace: 'pre-line', lineHeight: '1.5' }}>{resData.force_both_comment}</p>
              </div>
              <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderLeft: '4px solid #06b6d4', borderRadius: '4px', padding: '15px' }}>
                <h5 style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#38bdf8', fontWeight: 'bold' }}>📈 Nới ngân sách lên 100.000 tỷ VND</h5>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#cbd5e1', whiteSpace: 'pre-line', lineHeight: '1.5' }}>{resData.budget_100_comment}</p>
              </div>
              <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderLeft: '4px solid #a78bfa', borderRadius: '4px', padding: '15px' }}>
                <h5 style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#a78bfa', fontWeight: 'bold' }}>🛡️ Mở rộng rủi ro: tối đa hóa E[Z]</h5>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#cbd5e1', whiteSpace: 'pre-line', lineHeight: '1.5' }}>{resData.risk_comment}</p>
              </div>
            </div>

          </div>

          {/* 5.5 Nhận xét và hàm ý chính sách */}
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #38bdf8', borderRadius: '8px', padding: '25px' }}>
            <h3 style={{ fontSize: '16px', color: '#38bdf8', marginBottom: '20px', fontWeight: 'bold', textTransform: 'uppercase' }}>🏛️ 5.5. Nhận xét và hàm ý chính sách</h3>
            
            <div style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: '1.8' }}>
              
              <div style={{ marginBottom: '20px' }}>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  a) Vì sao mô hình bỏ qua dự án P15 (Open Data) dù tỷ suất lợi ích/chi phí rất cao? Đây có phải là kết quả mong muốn về mặt chính sách?
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify' }}>
                  <b>Lý do thuật toán:</b> Khác với thuật toán tham lam (Greedy Algorithm) luôn ưu tiên các dự án có tỷ suất ROI (Lợi ích/Chi phí) cao nhất, thuật toán Quy hoạch nguyên (Integer Programming - bài toán Knapsack) tìm kiếm <b>tổ hợp tối ưu cục diện</b>. P15 bị loại có thể do nó vi phạm trần ngân sách của một nhóm ngành cụ thể, hoặc do kích thước chi phí của nó khi ghép nối với các dự án lớn khác làm vượt mốc ngân sách tổng, buộc thuật toán phải thế chỗ bằng một cụm dự án nhỏ hơn để lấp đầy không gian trống, tối đa hóa tổng giá trị hàm mục tiêu Z*.<br />
                  <b>Góc độ chính sách:</b> Đây <b>không phải là kết quả mong muốn</b>. Dữ liệu mở (Open Data) là loại hàng hóa công cộng tạo ra ngoại ứng tích cực (positive externality) khổng lồ cho toàn bộ hệ sinh thái khởi nghiệp và nghiên cứu, nhưng lợi ích này khó lượng hóa thành con số tài chính trực tiếp trong ngắn hạn. Sự vắng mặt của P15 phản ánh điểm mù của mô hình toán học thuần túy. Để khắc phục, nhà hoạch định cần dùng quyền can thiệp (Human-in-the-loop) bằng cách gán P15 thành "dự án bắt buộc" hoặc áp dụng trọng số chiến lược (Strategic Weight) cao hơn cho dự án này.
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  b) Ràng buộc “bắt buộc P14 (an ninh mạng)” có làm giảm Z* không? Việc bắt buộc này có hợp lý không?
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify' }}>
                  <b>Về mặt toán học:</b> Việc gán chặt biến quyết định x<sub>14</sub> = 1 chắc chắn sẽ làm thu hẹp không gian nghiệm khả thi (Feasible Region). Nếu P14 không nằm trong tập hợp lời giải tối ưu tự do ban đầu (do chi phí cao nhưng lợi ích trực tiếp thấp), việc ép buộc chọn nó sẽ lấy mất không gian ngân sách của các dự án sinh lời khác, dẫn đến <b>sự suy giảm của tổng lợi ích tối đa Z*</b>.<br />
                  <b>Về mặt thực tiễn:</b> Việc bắt buộc này là <b>hoàn toàn hợp lý và mang tính sống còn</b>. An ninh mạng không trực tiếp làm tăng GDP hay năng suất, mà nó đóng vai trò là "chi phí bảo hiểm" (Insurance Premium) để bảo vệ toàn bộ hạ tầng. Phần giá trị Z* bị giảm đi chính là phí bảo hiểm mà quốc gia phải trả. Nếu loại bỏ P14 để lấy Z* cao hơn trên giấy, toàn bộ hệ thống số hóa có thể sụp đổ khi đối mặt với rủi ro tấn công mạng (Cyber-attack), đưa giá trị thực tế của mọi dự án khác về con số 0.
                </p>
              </div>

              <div>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  c) Mô hình giả định các dự án độc lập về lợi ích, nhưng trên thực tế P8 (AI) và P13 (bán dẫn) có lợi ích cộng hưởng. Làm thế nào để mô hình hóa hiệu ứng cộng hưởng này?
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify', marginBottom: 0 }}>
                  Để mô hình hóa hiệu ứng cộng hưởng (Synergy) giữa P8 và P13, ta cần phá vỡ giả định tuyến tính bằng cách đưa thêm một <b>biến phụ thuộc logic</b> vào mô hình Quy hoạch nguyên.<br />
                  <b>Cách thiết lập toán học:</b><br />
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