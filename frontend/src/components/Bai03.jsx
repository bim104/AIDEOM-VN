import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Bai03() {
  const [inputs, setInputs] = useState({
    w_growth: 0.15, w_prod: 0.15, w_spillover: 0.20,
    w_export: 0.15, w_employment: 0.10, w_ai: 0.20, w_risk: 0.15
  });

  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  const applyPreset = (presetType) => {
    let preset = {};
    if (presetType === 'default') {
      preset = { w_growth: 0.15, w_prod: 0.15, w_spillover: 0.20, w_export: 0.15, w_employment: 0.10, w_ai: 0.20, w_risk: 0.15 };
    } else if (presetType === 'growth') {
      preset = { w_growth: 0.35, w_prod: 0.25, w_spillover: 0.10, w_export: 0.20, w_employment: 0.05, w_ai: 0.05, w_risk: 0.00 };
    } else if (presetType === 'inclusive') {
      preset = { w_growth: 0.05, w_prod: 0.05, w_spillover: 0.25, w_export: 0.05, w_employment: 0.30, w_ai: 0.10, w_risk: 0.20 };
    }
    setInputs(preset);
  };

  const handleWeightChange = (field, val) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(val) || 0 }));
  };

  const calculatePriorityScore = () => {
    setLoading(true);

    const sanitizedWeights = {
      w_growth: parseFloat(inputs.w_growth) || 0,
      w_prod: parseFloat(inputs.w_prod) || 0,
      w_spillover: parseFloat(inputs.w_spillover) || 0,
      w_export: parseFloat(inputs.w_export) || 0,
      w_employment: parseFloat(inputs.w_employment) || 0,
      w_ai: parseFloat(inputs.w_ai) || 0,
      w_risk: parseFloat(inputs.w_risk) || 0
    };

    fetch('http://localhost:8000/api/bai3/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputs)
    })
    .then(res => res.json())
    .then(data => {
      setResData(data);
      setLoading(false);
      if (data && data.success) setIsCalculated(true);
    })
    .catch(err => {
      console.error("Lỗi gọi API Bài 3:", err);
      setLoading(false);
    });
  };

  const COLORS = ['#38bdf8', '#00c49f', '#ffbb28', '#ff8042', '#a4de6c', '#d0ed57', '#ff6b6b', '#8e44ad', '#2c3e50', '#16a085'];

  return (
    <div style={{ color: '#ffffff', maxWidth: '1400px', margin: '0 auto', paddingBottom: '30px' }}>
      
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', margin: '0 0 5px 0', fontWeight: 'bold' }}>BÀI 3 — TÍNH CHỈ SỐ ƯU TIÊN NGÀNH PRIORITY CHO 10 NGÀNH VIỆT NAM</h1>
      </div>

      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
        <div style={{ fontSize: '14px', color: '#aaa', marginBottom: '10px' }}><b>Mô hình Định lượng Đa tiêu chí (MCDM)</b></div>
        <div style={{ fontSize: '16px', color: '#34d399', fontFamily: 'serif', fontWeight: 'bold' }}>
          {"Priority = a₁·Growth + a₂·Productivity + a₃·Spillover + a₄·Export + a₅·Employment + a₆·AIReadiness + a₇·AutomationRisk"}
        </div>
        <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '8px 0 0 0' }}>
          * Hệ số Automation Risk được xử lý đảo dấu (chuẩn hóa nghịch thế) để đảm bảo ngành có rủi ro tự động hóa cao sẽ nhận điểm ưu tiên thấp hơn khi hướng tới tính bền vững.
        </p>
      </div>

      {/* Khối tinh chỉnh trọng số chính sách */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #232936', paddingBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', color: '#38bdf8' }}>🎛️ Phân bổ trọng số chính sách (Tổng các hệ số sẽ tự động chuẩn hóa về 1.0)</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => applyPreset('default')} style={{ backgroundColor: '#334155', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Mặc định chuyên gia</button>
            <button onClick={() => applyPreset('growth')} style={{ backgroundColor: '#1e3a8a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Định hướng tăng trưởng</button>
            <button onClick={() => applyPreset('inclusive')} style={{ backgroundColor: '#065f46', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Định hướng bao trùm</button>
          </div>
        </div>

        {/* Thanh trượt tinh chỉnh thông số đầu vào */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '25px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#aaa' }}>Tăng trưởng (Growth): {inputs.w_growth}</label>
            <input type="range" min="0" max="1" step="0.05" value={inputs.w_growth} onChange={e => handleWeightChange('w_growth', e.target.value)} style={{ width: '100%', accentColor: '#ff4b4b' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#aaa' }}>Năng suất (Productivity): {inputs.w_prod}</label>
            <input type="range" min="0" max="1" step="0.05" value={inputs.w_prod} onChange={e => handleWeightChange('w_prod', e.target.value)} style={{ width: '100%', accentColor: '#ff4b4b' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#aaa' }}>Hệ số lan tỏa (Spillover): {inputs.w_spillover}</label>
            <input type="range" min="0" max="1" step="0.05" value={inputs.w_spillover} onChange={e => handleWeightChange('w_spillover', e.target.value)} style={{ width: '100%', accentColor: '#ff4b4b' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#aaa' }}>Xuất khẩu (Export): {inputs.w_export}</label>
            <input type="range" min="0" max="1" step="0.05" value={inputs.w_export} onChange={e => handleWeightChange('w_export', e.target.value)} style={{ width: '100%', accentColor: '#ff4b4b' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '25px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#aaa' }}>Việc làm (Employment): {inputs.w_employment}</label>
            <input type="range" min="0" max="1" step="0.05" value={inputs.w_employment} onChange={e => handleWeightChange('w_employment', e.target.value)} style={{ width: '100%', accentColor: '#ff4b4b' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#aaa' }}>Sẵn sàng AI (AI Readiness): {inputs.w_ai}</label>
            <input type="range" min="0" max="1" step="0.05" value={inputs.w_ai} onChange={e => handleWeightChange('w_ai', e.target.value)} style={{ width: '100%', accentColor: '#ff4b4b' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#aaa' }}>Rủi ro tự động hóa (Risk): {inputs.w_risk}</label>
            <input type="range" min="0" max="1" step="0.05" value={inputs.w_risk} onChange={e => handleWeightChange('w_risk', e.target.value)} style={{ width: '100%', accentColor: '#ff4b4b' }} />
          </div>
        </div>

        <button onClick={calculatePriorityScore} disabled={loading} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', width: '200px' }}>
          {loading ? '⏳ Đang phân tích...' : '▶️ Chạy mô hình'}
        </button>
      </div>

      {/* Cơ chế ẩn kết quả, chỉ xuất hiện khi click nút */}
      {!isCalculated ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#161a25', borderRadius: '8px', border: '1px dashed #232936', color: '#64748b' }}>
          💡 Vui lòng lựa chọn hoặc thiết lập ma trận trọng số chính sách và bấm nút <b>"Chạy mô hình"</b> để trích xuất thứ hạng ưu tiên số của 10 ngành kinh tế.
        </div>
      ) : (
        <>
          {/* Bố cục chia đôi: Trái đồ thị cột dọc xếp hạng, Phải bảng điểm số chi tiết */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.6fr', gap: '20px', marginBottom: '30px' }}>
            
            {/* Biểu đồ cột Recharts */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#fff' }}>📊 Chỉ số ưu tiên phát triển số hóa (Priority Score) giảm dần</h4>
              <div style={{ width: '100%', height: 380 }}>
                <ResponsiveContainer>
                  <BarChart data={resData.ranking_results} layout="vertical" margin={{ left: 15, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                    <XAxis type="number" stroke="#94a3b8" domain={[0, 1]} />
                    <YAxis dataKey="sector_name_vi" type="category" stroke="#94a3b8" fontSize={11} width={130} />
                    <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff' }} />
                    <Bar dataKey="Priority" radius={[0, 4, 4, 0]}>
                      {resData.ranking_results.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bảng xếp hạng thứ tự giảm dần */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#38bdf8' }}>📋 Bảng tổng hợp xếp hạng ưu tiên đầu tư số công nghệ quốc gia</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8', textAlign: 'left' }}>
                    <th style={{ padding: '10px 5px' }}>Thứ hạng</th>
                    <th style={{ padding: '10px 5px' }}>Tên ngành kinh tế</th>
                    <th style={{ padding: '10px 5px', textAlign: 'right' }}>Điểm số Priority (Z)</th>
                  </tr>
                </thead>
                <tbody>
                  {resData.ranking_results.map((row) => (
                    <tr key={row.rank} style={{ borderBottom: '1px solid #232936', backgroundColor: row.rank <= 3 ? '#1e293b' : 'transparent' }}>
                      <td style={{ padding: '11px 5px', fontWeight: 'bold', color: row.rank <= 3 ? '#ffbb28' : '#fff' }}>
                        {row.rank === 1 ? '🥇 ' : row.rank === 2 ? '🥈 ' : row.rank === 3 ? '🥉 ' : ''}{row.rank}
                      </td>
                      <td style={{ padding: '11px 5px' }}>{row.sector_name_vi}</td>
                      <td style={{ padding: '11px 5px', textAlign: 'right', fontWeight: 'bold', color: '#34d399' }}>{row.Priority.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Khối diễn giải và khuyến nghị chính sách */}
          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '4px solid #38bdf8', borderRadius: '8px', padding: '25px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#fff' }}>💡 Diễn giải & Hàm ý chính sách Governance</h3>
            <div style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: '1.7' }}>
              <p><b>1. Phân tích nhóm Top-3 ưu tiên chiến lược:</b><br />
              Tùy thuộc vào bộ trọng số Đạt lựa chọn, thứ tự Top-3 ngành dẫn đầu sẽ dịch chuyển một cách rõ rệt. Khi áp dụng bộ trọng số mặc định hoặc định hướng tăng trưởng, ngành <b>Công nghiệp chế biến, chế tạo</b> và <b>CNTT-Truyền thông</b> thường chiếm giữ ngôi vương nhờ quy mô xuất khẩu khổng lồ và hệ số lan tỏa chuỗi cung ứng cực lớn, hoàn toàn đồng điệu với định hướng đổi mới mô hình tăng trưởng của Nghị quyết số 57-NQ/TW[cite: 167, 168, 206, 207]. Ngược lại, kịch bản bao trùm xã hội sẽ đẩy ngành <b>Nông-Lâm-Thủy sản</b> lên cao hơn nhằm bảo vệ an sinh cho khối lượng lớn lao động phổ thông[cite: 167, 175].</p>
              
              <p style={{ marginTop: '15px' }}><b>2. Nghịch lý ngành Khai khoáng:</b><br />
              Mô hình toán học đã giải thích thành công một thực tế quản trị vĩ mô: Dù ngành Khai khoáng sở hữu năng suất lao động thô ở mức cao nhất sàn (1.290,5 triệu VND/người), ngành này vẫn đứng ở top dưới về mức độ ưu tiên công nghệ số[cite: 167, 208]. Nguyên nhân là do hệ số lan tỏa công nghệ sang các khu vực kinh tế khác rất thấp (0.30), tỷ suất giải quyết việc làm kém và mang rủi ro tự động hóa cao (55%)[cite: 167, 208].</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}