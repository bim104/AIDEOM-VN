import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Bai06() {
  // 1. Khai báo 8 bộ trọng số tương ứng với 8 chỉ số của đề bài
  const [inputs, setInputs] = useState({
    w_grdp: 0.15,
    w_fdi: 0.10,
    w_digital: 0.15,
    w_ai: 0.15,
    w_labor: 0.10,
    w_rd: 0.15,
    w_internet: 0.10,
    w_gini: 0.10
  });

  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSliderChange = (field, val) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(val) || 0 }));
  };

  const runTOPSISAnalysis = () => {
    setLoading(true);
    setHasError(false);
    
    // 💡 FIX LỖI ĐEN MÀN HÌNH: Hạ cờ trạng thái ngay lập tức khi bấm nút chạy lại
    setIsCalculated(false);
    setResData(null);

    // Chuẩn bị dữ liệu gửi đi (ép kiểu Float chuẩn xác)
    const sanitized = {
      w_grdp: parseFloat(inputs.w_grdp),
      w_fdi: parseFloat(inputs.w_fdi),
      w_digital: parseFloat(inputs.w_digital),
      w_ai: parseFloat(inputs.w_ai),
      w_labor: parseFloat(inputs.w_labor),
      w_rd: parseFloat(inputs.w_rd),
      w_internet: parseFloat(inputs.w_internet),
      w_gini: parseFloat(inputs.w_gini)
    };

    fetch('http://localhost:8000/api/bai06/topsis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitized)
    })
    .then(res => {
      if (!res.ok) throw new Error("Cổng Backend Bài 6 không phản hồi");
      return res.json();
    })
    .then(data => {
      if (data && data.success) {
        setResData(data);
        setIsCalculated(true); // Chỉ bật giao diện khi đã có dữ liệu an toàn
      } else {
        setIsCalculated(false);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error("Lỗi API Bài 6:", err);
      setLoading(false);
      setHasError(true);
      setIsCalculated(false);
    });
  };

  const COLORS = ['#2a9d8f', '#264653', '#e9c46a', '#f4a261', '#e76f51', '#457b9d'];

  return (
    <div style={{ color: '#ffffff', maxWidth: '1400px', margin: '0 auto', paddingBottom: '30px' }}>
      
      {/* Tiêu đề */}
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', margin: '0 0 5px 0', fontWeight: 'bold' }}>BÀI 6 — ĐÁNH GIÁ NĂNG LỰC SỐ HÓA 6 VÙNG KINH TẾ (TOPSIS 8 TIÊU CHÍ)</h1>
      </div>

      {/* Khối tóm tắt mô hình */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
        <div style={{ fontSize: '14px', color: '#aaa', marginBottom: '8px' }}><b>Thuật toán TOPSIS 8 chiều (Tiêu chí Gini xử lý nghịch thế)</b></div>
        <div style={{ fontSize: '16px', color: '#34d399', fontWeight: 'bold' }}>
          {"C_i^* = S_i^- / (S_i^+ + S_i^-)"}
        </div>
        <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '6px 0 0 0', lineHeight: '1.5' }}>
          Mô hình đánh giá dựa trên khoảng cách Euclide tới giải pháp lý tưởng. <b>Lưu ý:</b> Chỉ số Gini được thuật toán tự động nhận diện là tiêu chí tác động tiêu cực (càng thấp càng tốt) để tính toán điểm ưu tiên chính xác.
        </p>
      </div>

      {/* Form cấu hình 8 thanh trượt trọng số */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', color: '#38bdf8', borderBottom: '1px solid #232936', paddingBottom: '12px' }}>🎛️ Thiết lập ma trận trọng số tiêu chí (8 Chỉ số vĩ mô)</h3>
        
        {/* Dòng trọng số 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#aaa' }}>GRDP/người: {inputs.w_grdp}</label>
            <input type="range" min="0" max="1" step="0.05" value={inputs.w_grdp} onChange={e => handleSliderChange('w_grdp', e.target.value)} style={{ width: '100%', accentColor: '#2563eb', marginTop: '8px' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#aaa' }}>Vốn FDI: {inputs.w_fdi}</label>
            <input type="range" min="0" max="1" step="0.05" value={inputs.w_fdi} onChange={e => handleSliderChange('w_fdi', e.target.value)} style={{ width: '100%', accentColor: '#2563eb', marginTop: '8px' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#aaa' }}>Digital Index: {inputs.w_digital}</label>
            <input type="range" min="0" max="1" step="0.05" value={inputs.w_digital} onChange={e => handleSliderChange('w_digital', e.target.value)} style={{ width: '100%', accentColor: '#2563eb', marginTop: '8px' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#aaa' }}>AI Readiness: {inputs.w_ai}</label>
            <input type="range" min="0" max="1" step="0.05" value={inputs.w_ai} onChange={e => handleSliderChange('w_ai', e.target.value)} style={{ width: '100%', accentColor: '#2563eb', marginTop: '8px' }} />
          </div>
        </div>

        {/* Dòng trọng số 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '25px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#aaa' }}>Lao động ĐT (%): {inputs.w_labor}</label>
            <input type="range" min="0" max="1" step="0.05" value={inputs.w_labor} onChange={e => handleSliderChange('w_labor', e.target.value)} style={{ width: '100%', accentColor: '#2563eb', marginTop: '8px' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#aaa' }}>R&D/GRDP (%): {inputs.w_rd}</label>
            <input type="range" min="0" max="1" step="0.05" value={inputs.w_rd} onChange={e => handleSliderChange('w_rd', e.target.value)} style={{ width: '100%', accentColor: '#2563eb', marginTop: '8px' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#aaa' }}>Tỷ lệ Internet (%): {inputs.w_internet}</label>
            <input type="range" min="0" max="1" step="0.05" value={inputs.w_internet} onChange={e => handleSliderChange('w_internet', e.target.value)} style={{ width: '100%', accentColor: '#2563eb', marginTop: '8px' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#aaa' }}>Hệ số Gini: {inputs.w_gini}</label>
            <input type="range" min="0" max="1" step="0.05" value={inputs.w_gini} onChange={e => handleSliderChange('w_gini', e.target.value)} style={{ width: '100%', accentColor: '#2563eb', marginTop: '8px' }} />
          </div>
        </div>

        <button onClick={runTOPSISAnalysis} disabled={loading} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'block', width: '200px' }}>
          {loading ? '⏳ Đang tính toán...' : '▶️ Chạy mô hình'}
        </button>
      </div>

      {hasError && (
        <div style={{ color: '#f43f5e', padding: '15px', backgroundColor: '#2d141a', borderRadius: '6px', marginBottom: '20px', fontWeight: 'bold' }}>
          ⚠️ Lỗi hệ thống: Kết nối API Bài 6 thất bại. Hãy kiểm tra Backend log.
        </div>
      )}

      {/* Điều kiện ẩn vùng kết quả */}
      {!isCalculated ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#161a25', borderRadius: '8px', border: '1px dashed #232936', color: '#64748b' }}>
          💡 Vui lòng phân bổ trọng số tiêu chí và nhấn nút <b>"Chạy mô hình"</b> để trích xuất thứ hạng năng lực số của 6 vùng miền.
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '20px', marginBottom: '30px' }}>
            
            {/* Biểu đồ cột ngang điểm C* */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px' }}>📊 Chỉ số Closeness Coefficient (C*)</h4>
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <BarChart data={resData.ranking_results} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                    <XAxis dataKey="region_name_vi" stroke="#94a3b8" fontSize={10} interval={0} angle={-15} textAnchor="end" />
                    <YAxis stroke="#94a3b8" domain={[0, 1]} />
                    <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff' }} />
                    <Bar dataKey="closeness" radius={[4, 4, 0, 0]} name="Điểm C*">
                      {resData.ranking_results.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bảng xếp hạng chi tiết */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#38bdf8' }}>📋 Thứ hạng năng lực phát triển (Ranked Regions)</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8', textAlign: 'left' }}>
                    <th style={{ padding: '10px 5px' }}>Thứ hạng</th>
                    <th style={{ padding: '10px 5px' }}>Vùng kinh tế</th>
                    <th style={{ padding: '10px 5px' }}>S+ (Best)</th>
                    <th style={{ padding: '10px 5px' }}>S- (Worst)</th>
                    <th style={{ padding: '10px 5px', textAlign: 'right' }}>Điểm C*</th>
                  </tr>
                </thead>
                <tbody>
                  {resData.ranking_results.map((row) => (
                    <tr key={row.rank} style={{ borderBottom: '1px solid #232936', backgroundColor: row.rank <= 2 ? '#1e293b' : 'transparent' }}>
                      <td style={{ padding: '12px 5px', fontWeight: 'bold', color: row.rank <= 2 ? '#ffb703' : '#fff' }}>
                        {row.rank === 1 ? '🥇 ' : row.rank === 2 ? '🥈 ' : ''}{row.rank}
                      </td>
                      <td style={{ padding: '12px 5px', fontWeight: 'bold' }}>{row.region_name_vi}</td>
                      <td style={{ padding: '12px 5px', color: '#f43f5e' }}>{row.s_pos.toFixed(4)}</td>
                      <td style={{ padding: '12px 5px', color: '#34d399' }}>{row.s_neg.toFixed(4)}</td>
                      <td style={{ padding: '12px 5px', textAlign: 'right', fontWeight: 'bold', color: '#38bdf8' }}>{row.closeness.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Khối nhận xét chính sách */}
          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '4px solid #38bdf8', borderRadius: '8px', padding: '25px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#fff' }}>💡 Diễn giải & Hàm ý chính sách Regional Development</h3>
            <div style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: '1.7' }}>
              <p><b>1. Phân tích nhóm dẫn đầu:</b><br />
              Hai vùng <b>Đông Nam Bộ</b> và <b>Đồng bằng sông Hồng</b> tiếp tục giữ vững vị thế đầu tàu. Điểm C* tiệm cận mức cao nhờ sự vượt trội đồng thời ở cả GRDP/người, hạ tầng số và năng lực nghiên cứu phát triển (R&D).</p>
              
              <p style={{ marginTop: '15px' }}><b>2. Tác động của chỉ số Gini:</b><br />
              Trong mô hình TOPSIS này, Gini là biến số cân bằng. Những vùng có sự phát triển kinh tế nhanh nhưng đi kèm bất bình đẳng cao sẽ bị thuật toán "kéo lùi" điểm Closeness, thúc đẩy hàm ý chính sách về phát triển số hóa bao trùm, không để ai bị bỏ lại phía sau.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}