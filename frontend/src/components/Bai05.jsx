import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Bai05() {
  const [inputs, setInputs] = useState({
    total_budget: 250,
    min_impact_score: 50
  });

  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [hasError, setHasError] = useState(false);

  const runMIPOptimization = () => {
    setLoading(true);
    setHasError(false);
    setIsCalculated(false); 
    setResData(null);

    const sanitizedInputs = {
      total_budget: parseFloat(inputs.total_budget) || 0,
      min_impact_score: parseFloat(inputs.min_impact_score) || 0
    };

    fetch('http://localhost:8000/api/bai05/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitizedInputs)
    })
    .then(res => {
      if (!res.ok) throw new Error("Cổng Backend phản hồi lỗi");
      return res.json();
    })
    .then(data => {
      if (data && data.success) {
        setResData(data);
        setIsCalculated(true); 
      } else {
        setResData(data);
        setIsCalculated(false);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error("Lỗi kết nối API Bài 5:", err);
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
      
      {/* Tiêu đề */}
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', margin: '0 0 5px 0', fontWeight: 'bold' }}>BÀI 5 — LỰA CHỌN DANH MỤC 15 DỰ ÁN SỐ HÓA BẰNG QUY HOẠCH NGUYÊN HỖN HỢP MIP</h1>
        
      </div>

      {/* Tóm tắt lý thuyết */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
        <div style={{ fontSize: '14px', color: '#aaa', marginBottom: '8px' }}><b>Mô hình Quy hoạch nguyên hỗn hợp (Mixed-Integer Programming - Knapsack mở rộng)</b></div>
        <div style={{ fontSize: '16px', color: '#34d399', fontWeight: 'bold' }}>
          {"Max Z = ∑ (Benefit_i × x_i) với x_i ∈ {0, 1}"}
        </div>
        <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', marginTop: '6px' }}>
          {"Ràng buộc ngân sách phát triển công nghệ: ∑ (Cost_i × x_i) ≤ B (Mặc định B = 250 tỷ VND)"}<br />
          {"Ràng buộc logic kỹ thuật: loại trừ nhau giữa P01 và P02 (x₁ + x₂ ≤ 1); điều kiện tiên quyết dự án P06 phụ thuộc vào P02 (x₆ ≤ x₂)"}
        </div>
      </div>

      {/* Khối nhập thông số kịch bản */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#38bdf8', borderBottom: '1px solid #232936', paddingBottom: '10px' }}>🎛️ Thiết lập giới hạn tổng vốn đầu tư công nghệ</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#aaa' }}>Hạn mức Ngân sách cấp (tỷ VND)</label>
            <input type="number" value={inputs.total_budget} onChange={e => handleInputChange('total_budget', e.target.value)} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '10px', borderRadius: '4px', boxSizing: 'border-box', marginTop: '6px' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#aaa' }}>Điểm tác động tối thiểu kỳ vọng</label>
            <input type="number" value={inputs.min_impact_score} onChange={e => handleInputChange('min_impact_score', e.target.value)} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '10px', borderRadius: '4px', boxSizing: 'border-box', marginTop: '6px' }} />
          </div>
        </div>

        <button onClick={runMIPOptimization} disabled={loading} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', width: '200px' }}>
          {loading ? '⏳ Đang phân tích...' : '▶️ Chạy mô hình'}
        </button>
      </div>

      {hasError && (
        <div style={{ color: '#f43f5e', padding: '15px', backgroundColor: '#2d141a', borderRadius: '6px', marginBottom: '20px', fontWeight: 'bold' }}>
          ⚠️ Lỗi hệ thống: Kết nối API thất bại. Hãy chắc chắn backend app.py đã include_router bài 5.
        </div>
      )}

      {resData && resData.success === false && (
        <div style={{ color: '#f43f5e', padding: '20px', backgroundColor: '#2d141a', borderRadius: '8px', fontWeight: 'bold', marginBottom: '20px' }}>
          ⚠️ {resData.message}
        </div>
      )}

      {/* Điều kiện ẩn vùng kết quả */}
      {!isCalculated ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#161a25', borderRadius: '8px', border: '1px dashed #232936', color: '#64748b' }}>
          💡 Vui lòng thiết lập quỹ ngân sách và bấm nút <b>"Chạy mô hình"</b> để tìm phương án chọn danh mục dự án số hóa tối ưu.
        </div>
      ) : (
        <>
          {/* Khối KPI kết quả tổng quát */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
            <div style={{ backgroundColor: '#2a9d8f', padding: '25px', borderRadius: '8px' }}>
              <h2 style={{ fontSize: '32px', margin: 0, fontWeight: 'bold' }}>{resData?.max_benefit_score} Điểm</h2>
              <p style={{ margin: '8px 0 0 0', color: '#e6f4f1', fontSize: '13px' }}>Tổng điểm giá trị tác động vĩ mô đạt đỉnh (Z*)</p>
            </div>
            <div style={{ backgroundColor: '#118ab2', padding: '25px', borderRadius: '8px' }}>
              <h2 style={{ fontSize: '32px', margin: 0, fontWeight: 'bold' }}>{resData?.total_spent} / {inputs.total_budget} Tỷ</h2>
              <p style={{ margin: '8px 0 0 0', color: '#e0f2fe', fontSize: '13px' }}>Thực tế ngân sách giải ngân tối ưu</p>
            </div>
          </div>

          {/* Khối danh sách bảng chi tiết dự án và đồ thị độ nhạy */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1.3fr', gap: '20px', marginBottom: '25px' }}>
            
            {/* Bảng danh sách dự án nhị phân */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', overflowX: 'auto' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#38bdf8' }}>📋 Trạng thái phê duyệt danh mục 15 dự án số vĩ mô</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8', textAlign: 'left' }}>
                    <th style={{ padding: '8px 4px' }}>Mã số</th>
                    <th style={{ padding: '8px 4px' }}>Tên dự án số hóa công nghệ</th>
                    <th style={{ padding: '8px 4px' }}>Vốn (Tỷ)</th>
                    <th style={{ padding: '8px 4px' }}>Điểm số</th>
                    <th style={{ padding: '8px 4px', textAlign: 'center' }}>Quyết định (x)</th>
                  </tr>
                </thead>
                <tbody>
                  {resData.project_table.map((row) => (
                    <tr key={row.id} style={{ borderBottom: '1px solid #232936', backgroundColor: row.statusCode === 1 ? '#1e293b' : 'transparent' }}>
                      <td style={{ padding: '10px 4px', fontWeight: 'bold' }}>{row.id}</td>
                      <td style={{ padding: '10px 4px' }}>{row.name}</td>
                      <td style={{ padding: '10px 4px' }}>{row.cost}</td>
                      <td style={{ padding: '10px 4px', fontWeight: 'bold', color: '#ffbb28' }}>{row.benefit}</td>
                      <td style={{ padding: '10px 4px', textAlign: 'center' }}>
                        <span style={{ backgroundColor: row.statusCode === 1 ? '#065f46' : '#3f3f46', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Đồ thị độ nhạy biên Z*(B) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '14px' }}>📈 Biên độ nhạy: Lợi ích tăng trưởng khi mở rộng ngân sách</h4>
                <div style={{ width: '100%', height: 220 }}>
                  <ResponsiveContainer>
                    <LineChart data={resData.sensitivity_curve}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                      <XAxis dataKey="budget" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff' }} />
                      <Line type="monotone" dataKey="benefit" stroke="#ffb703" strokeWidth={3} name="Tổng điểm Benefit Z*" dot={{ fill: '#ffb703', r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Khối mô tả logic ràng buộc */}
              <div style={{ backgroundColor: '#1c2434', borderRadius: '8px', padding: '20px', borderLeft: '4px solid #ffbb28' }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '13px' }}>📢 Trạng thái kích hoạt Luật Logic:</h5>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: '1.6' }}>
                  • Do tính chất loại trừ (Conflict Rule), hệ thống tự động kiểm tra và chỉ chọn tối đa 1 trong 2 siêu dự án chiến lược là <b>P01 (Mạng 5G)</b> hoặc <b>P02 (BigData Hub)</b> để tránh lãng phí kép đầu tư công.<br />
                  • Siêu máy tính <b>P06</b> được kiểm soát chặt chẽ, chỉ phê duyệt khi trung tâm dữ liệu nền tảng <b>P02</b> đã được thông qua.
                </p>
              </div>
            </div>

          </div>

          {/* Diễn giải chính sách */}
          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '4px solid #2a9d8f', borderRadius: '8px', padding: '25px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#fff' }}>💡 Hàm ý quản trị danh mục đầu tư công nghệ</h3>
            <div style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: '1.7' }}>
              <p><b>1. Tính hiệu quả của phương pháp phân bổ nguyên nhị phân (0-1):</b><br />
              Khác với quy hoạch tuyến tính thông thường (cho phép đầu tư phân đoạn như kiểu đổ vào dự án 0.5 hay 0.7 nguồn vốn), bài toán thực tế đòi hỏi dự án phải được xây dựng trọn vẹn hoặc không làm gì cả. Thuật toán MIP đã giải quyết xuất sắc bằng cách lựa chọn tổ hợp các dự án có mật độ điểm lợi ích trên một đơn vị chi phí đầu tư cao nhất để tối đa hóa hiệu năng sử dụng dòng tiền của ngân sách Chính phủ.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}