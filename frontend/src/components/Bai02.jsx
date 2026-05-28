import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Bai02() {
  const [inputs, setInputs] = useState({
    total_budget: 100,
    min_x1: 25, min_x2: 15, min_x3: 20, min_x4: 10,
    c1: 0.85, c2: 1.20, c3: 0.95, c4: 1.35,
    strategic_ratio: 0.35
  });

  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [hasError, setHasError] = useState(false);

  const runOptimization = () => {
    setLoading(true);
    setHasError(false);
    setIsCalculated(false);
    setResData(null); 

    // Ép kiểu số thực (Float) chuẩn xác cho tất cả tham số trước khi gửi qua API
    const sanitizedInputs = {
      total_budget: parseFloat(inputs.total_budget) || 0,
      min_x1: parseFloat(inputs.min_x1) || 0,
      min_x2: parseFloat(inputs.min_x2) || 0,
      min_x3: parseFloat(inputs.min_x3) || 0,
      min_x4: parseFloat(inputs.min_x4) || 0,
      c1: parseFloat(inputs.c1) || 0,
      c2: parseFloat(inputs.c2) || 0,
      c3: parseFloat(inputs.c3) || 0,
      c4: parseFloat(inputs.c4) || 0,
      strategic_ratio: parseFloat(inputs.strategic_ratio) || 0,
    };
    
    fetch('http://localhost:8000/api/bai2/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitizedInputs)
    })
    .then(res => {
      if (!res.ok) throw new Error("Mạng internet hoặc Backend gặp sự cố");
      return res.json();
    })
    .then(data => {
      setResData(data);
      setLoading(false);
      if (data && data.success) {
        setIsCalculated(true);
      } else {
        setIsCalculated(false); // Ẩn vùng kết quả nếu Backend báo hệ ràng buộc bất khả thi
      }
    })
    .catch(err => {
      console.error("Lỗi kết nối API Bài 2:", err);
      setLoading(false);
      setHasError(true);
      setIsCalculated(false);
    });
  };

  const handleInputChange = (field, val) => {
    setInputs(prev => ({ ...prev, [field]: val }));
  };

  return (
    <div style={{ color: '#ffffff', maxWidth: '1400px', margin: '0 auto', paddingBottom: '30px' }}>
      
      {/* Tiêu đề trang */}
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', margin: '0 0 5px 0', fontWeight: 'bold' }}>BÀI 2 — PHÂN BỔ NGÂN SÁCH ĐƠN GIẢN THEO 4 HẠNG MỤC ĐẦU TƯ SỐ</h1>
        
      </div>

      {/* Tóm tắt mô hình toán học */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#aaa', fontSize: '14px', marginBottom: '10px' }}>
          <b>Mô hình toán học (Quy hoạch tuyến tính LP)</b>
        </div>
        <div style={{ fontSize: '18px', color: '#34d399', fontWeight: 'bold', marginBottom: '10px' }}>
          Max Z = 0.85·x₁ + 1.20·x₂ + 0.95·x₃ + 1.35·x₄ (Tối đa hóa GDP tăng thêm)
        </div>
        <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
          Ràng buộc ngân sách tổng: x₁ + x₂ + x₃ + x₄ ≤ B (Mặc định B = 100 nghìn tỷ)<br />
          Ràng buộc sàn tối thiểu: x₁ ≥ 25 (Hạ tầng), x₂ ≥ 15 (AI), x₃ ≥ 20 (Nhân lực), x₄ ≥ 10 (R&D)<br />
          Ràng buộc công nghệ chiến lược: x₂ + x₄ ≥ 35% · (Tổng ngân sách)
        </div>
      </div>

      {/* Khu vực bảng Form tinh chỉnh tham số đầu vào động */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '25px', marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', color: '#38bdf8', borderBottom: '1px solid #232936', paddingBottom: '10px' }}>🎛️ Tinh chỉnh tham số đầu vào động</h3>
        
        {/* Dòng 1: Ngân sách tổng & Các hệ số hàm mục tiêu */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#aaa', display: 'block', marginBottom: '5px' }}>Ngân sách tổng (B)</label>
            <input type="number" value={inputs.total_budget} onChange={e => handleInputChange('total_budget', e.target.value)} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#aaa', display: 'block', marginBottom: '5px' }}>Hệ số c1 (Hạ tầng)</label>
            <input type="number" step="0.01" value={inputs.c1} onChange={e => handleInputChange('c1', e.target.value)} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#aaa', display: 'block', marginBottom: '5px' }}>Hệ số c2 (AI)</label>
            <input type="number" step="0.01" value={inputs.c2} onChange={e => handleInputChange('c2', e.target.value)} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#aaa', display: 'block', marginBottom: '5px' }}>Hệ số c3 (Nhân lực)</label>
            <input type="number" step="0.01" value={inputs.c3} onChange={e => handleInputChange('c3', e.target.value)} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#aaa', display: 'block', marginBottom: '5px' }}>Hệ số c4 (R&D)</label>
            <input type="number" step="0.01" value={inputs.c4} onChange={e => handleInputChange('c4', e.target.value)} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', boxSizing: 'border-box' }} />
          </div>
        </div>

        {/* Dòng 2: Các mức sàn tối thiểu & Tỷ lệ chiến lược */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px', marginBottom: '25px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#aaa', display: 'block', marginBottom: '5px' }}>Sàn x1 (Hạ tầng)</label>
            <input type="number" value={inputs.min_x1} onChange={e => handleInputChange('min_x1', e.target.value)} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#aaa', display: 'block', marginBottom: '5px' }}>Sàn x2 (AI)</label>
            <input type="number" value={inputs.min_x2} onChange={e => handleInputChange('min_x2', e.target.value)} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#aaa', display: 'block', marginBottom: '5px' }}>Sàn x3 (Nhân lực)</label>
            <input type="number" value={inputs.min_x3} onChange={e => handleInputChange('min_x3', e.target.value)} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#aaa', display: 'block', marginBottom: '5px' }}>Sàn x4 (R&D)</label>
            <input type="number" value={inputs.min_x4} onChange={e => handleInputChange('min_x4', e.target.value)} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#aaa', display: 'block', marginBottom: '5px' }}>Tỷ lệ chiến lược</label>
            <input type="number" step="0.01" value={inputs.strategic_ratio} onChange={e => handleInputChange('strategic_ratio', e.target.value)} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', boxSizing: 'border-box' }} />
          </div>
        </div>

        <button onClick={runOptimization} disabled={loading} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'block', width: '200px' }}>
          {loading ? '⏳ Đang tính toán...' : '▶️ Chạy mô hình'}
        </button>
      </div>

      {/* Thông báo lỗi kết nối vật lý hạ tầng hoặc sập container mạng */}
      {hasError && (
        <div style={{ color: '#f43f5e', padding: '15px', backgroundColor: '#2d141a', borderRadius: '6px', marginBottom: '20px', fontWeight: 'bold' }}>
          ⚠️ Lỗi hệ thống: Không thể kết nối với cổng dịch vụ Backend. Vui lòng kiểm tra trạng thái Docker Container.
        </div>
      )}

      {/* Thông báo lỗi nghiệp vụ toán học phản hồi từ Backend */}
      {resData && resData.success === false && (
        <div style={{ color: '#f43f5e', padding: '20px', backgroundColor: '#2d141a', borderRadius: '8px', fontWeight: 'bold', marginBottom: '20px' }}>
          ⚠️ {resData.message}
        </div>
      )}

      {/* Điều kiện kiểm soát hiển thị kết quả đầu ra */}
      {!isCalculated ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#161a25', borderRadius: '8px', border: '1px dashed #232936', color: '#64748b' }}>
          💡 Vui lòng cấu hình các ràng buộc đầu tư công và nhấn nút <b>"Chạy mô hình"</b> ở trên để giải toán.
        </div>
      ) : (
        <>
          {/* Cặp thẻ KPI hiển thị kết quả */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
            <div style={{ backgroundColor: '#2a9d8f', padding: '25px', borderRadius: '8px' }}>
              <h2 style={{ fontSize: '32px', margin: 0, fontWeight: 'bold' }}>{resData?.max_gdp_gain?.toLocaleString()} Nghìn tỷ</h2>
              <p style={{ margin: '8px 0 0 0', color: '#e6f4f1', fontSize: '13px' }}>Tổng GDP tăng thêm tối đa (Z*)</p>
            </div>
            <div style={{ backgroundColor: '#118ab2', padding: '25px', borderRadius: '8px' }}>
              <h2 style={{ fontSize: '32px', margin: 0, fontWeight: 'bold' }}>{resData?.shadow_price_budget}</h2>
              <p style={{ margin: '8px 0 0 0', color: '#e0f2fe', fontSize: '13px' }}>Giá đối ngẫu Ngân sách tổng (Shadow Price)</p>
            </div>
          </div>

          {/* Biểu đồ phân bổ vốn và Đồ thị độ nhạy tuyến tính */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '20px', marginBottom: '25px' }}>
            
            {/* Bảng phân bổ vốn tối ưu */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#38bdf8' }}>📋 Phân bổ ngân sách tối ưu đạt đỉnh</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8', textAlign: 'left' }}>
                    <th style={{ padding: '10px 5px' }}>Hạng mục công việc</th>
                    <th style={{ padding: '10px 5px' }}>Biến số</th>
                    <th style={{ padding: '10px 5px' }}>Mức phân bổ tối ưu</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #232936' }}>
                    <td style={{ padding: '12px 5px' }}>Hạ tầng số quốc gia</td>
                    <td>x₁</td>
                    <td style={{ color: '#38bdf8', fontWeight: 'bold' }}>{resData?.allocation?.x1_infrastructure} Nghìn tỷ</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #232936' }}>
                    <td style={{ padding: '12px 5px' }}>Trí tuệ nhân tạo (AI) & Dữ liệu lớn</td>
                    <td>x₂</td>
                    <td style={{ color: '#38bdf8', fontWeight: 'bold' }}>{resData?.allocation?.x2_ai_data} Nghìn tỷ</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #232936' }}>
                    <td style={{ padding: '12px 5px' }}>Phát triển vốn Nhân lực số</td>
                    <td>x₃</td>
                    <td style={{ color: '#38bdf8', fontWeight: 'bold' }}>{resData?.allocation?.x3_human_resources} Nghìn tỷ</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #232936' }}>
                    <td style={{ padding: '12px 5px' }}>Nghiên cứu & Phát triển (R&D) Công nghệ</td>
                    <td>x₄</td>
                    <td style={{ color: '#38bdf8', fontWeight: 'bold' }}>{resData?.allocation?.x4_rd_tech} Nghìn tỷ</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Đồ thị đường cong phân tích độ nhạy */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px' }}>📈 Phân tích độ nhạy: Đường cong tăng trưởng GDP Gain Z*(B)</h4>
              <div style={{ width: '100%', height: 220 }}>
                {resData?.sensitivity_curve && (
                  <ResponsiveContainer>
                    <LineChart data={resData.sensitivity_curve}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                      <XAxis dataKey="budget" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff' }} />
                      <Line type="monotone" dataKey="gdp_gain" stroke="#ffb703" strokeWidth={3} name="GDP Gain kỳ vọng (Z*)" dot={{ fill: '#ffb703', r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Nhận xét kinh tế vĩ mô */}
          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '4px solid #2a9d8f', borderRadius: '8px', padding: '25px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#fff' }}>💡    Diễn giải & Hàm ý chính sách vĩ mô</h3>
            <div style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: '1.7' }}>
              <p><b>1. Ý nghĩa của Giá đối ngẫu (Shadow Price):</b><br />
              Giá đối ngẫu của ràng buộc ngân sách tổng đạt mức <b>{resData?.shadow_price_budget}</b>. Điều này mang hàm ý kinh tế vĩ mô sâu sắc: nếu nới lỏng hoặc phân bổ thêm 1 tỷ VND vào quỹ đầu tư công nghệ, tổng lượng GDP Gain kỳ vọng mang lại cho nền kinh tế quốc gia sẽ tăng tuyến tính tương ứng thêm {resData?.shadow_price_budget} tỷ VND.</p>
              
              <p style={{ marginTop: '15px' }}><b>2. Đánh đổi trong chiến lược cấu trúc phân bổ vốn:</b><br />
              Mặc dù Nghiên cứu & Phát triển R&D Công nghệ ($x_4$) sở hữu hệ số sinh lợi vĩ mô cao nhất (1.35), thuật toán buộc phải ép phân bổ dòng tiền về mức tối thiểu an toàn để dồn lực lượng dòng vốn dư thừa sang phân nhóm AI nhằm thỏa mãn ràng buộc tích lũy tỷ lệ công nghệ chiến lược đạt mức tối thiểu 35% do Chính phủ quy định.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}