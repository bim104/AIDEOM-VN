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

  // Bộ preset trọng số
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
    fetch('http://localhost:8000/api/bai3/calculate', {
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
        alert("Lỗi tính toán từ server");
      }
      setLoading(false);
    })
    .catch(err => {
      console.error("Lỗi:", err);
      setLoading(false);
    });
  };
  
  const COLORS = ['#38bdf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#fb7185', '#60a5fa', '#f472b6', '#4ade80', '#fb923c'];

  return (
    <div style={{ color: '#ffffff', maxWidth: '1400px', margin: '0 auto', paddingBottom: '30px', fontFamily: 'sans-serif' }}>
      
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>BÀI 3 — TÍNH CHỈ SỐ ƯU TIÊN NGÀNH PRIORITY</h1>
      </div>

      {/* KHỐI MỚI BỔ SUNG: Mô hình toán học */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '3px solid #38bdf8', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🔢</span> Mô hình toán học
        </h3>
        <div style={{ backgroundColor: '#0f172a', padding: '15px 20px', borderRadius: '6px', overflowX: 'auto', marginBottom: '12px' }}>
          <p style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '22px', color: '#cbd5e1', margin: 0, whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>
            <b style={{color: '#fff'}}><i>Priority</i><sub>i</sub></b> = a<sub>1</sub><i>Growth</i><sub>i</sub> + a<sub>2</sub><i>Productivity</i><sub>i</sub> + a<sub>3</sub><i>Spillover</i><sub>i</sub> + a<sub>4</sub><i>Export</i><sub>i</sub> + a<sub>5</sub><i>Employment</i><sub>i</sub> + a<sub>6</sub><i>AI</i><sub>i</sub> + a<sub>7</sub><i>RiskAdjusted</i><sub>i</sub>
          </p>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
          Dữ liệu được chuẩn hóa min-max về thang [0,1]. Chỉ tiêu Risk được đảo dấu để giá trị cao hơn phản ánh mức rủi ro tự động hóa thấp hơn.
        </p>
      </div>

      {/* Điều khiển trọng số */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', color: '#38bdf8' }}>🎛️ Phân bổ trọng số chính sách</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => applyPreset('default')} style={{ backgroundColor: '#334155', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Mặc định</button>
            <button onClick={() => applyPreset('growth')} style={{ backgroundColor: '#1e3a8a', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Tăng trưởng</button>
            <button onClick={() => applyPreset('inclusive')} style={{ backgroundColor: '#065f46', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Bao trùm</button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
          {Object.keys(inputs).map(key => (
            <div key={key}>
              <label style={{ fontSize: '12px', color: '#aaa' }}>{key.replace('w_', '').toUpperCase()}: {inputs[key]}</label>
              <input type="range" min="0" max="1" step="0.05" value={inputs[key]} onChange={e => handleWeightChange(key, e.target.value)} style={{ width: '100%', accentColor: '#38bdf8' }} />
            </div>
          ))}
        </div>
        <button onClick={calculatePriorityScore} disabled={loading} style={{ marginTop: '20px', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
          {loading ? '⏳ Đang phân tích...' : '▶️ Chạy mô hình'}
        </button>
      </div>

      {/* Kết quả hiển thị */}
      {isCalculated && resData && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Đồ thị */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>📊 Chỉ số ưu tiên Priority</h4>
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <BarChart data={resData.allocation_chart || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                    <XAxis type="number" stroke="#94a3b8" domain={[0, 1]} />
                    <YAxis dataKey="factor" type="category" stroke="#94a3b8" fontSize={11} width={130} />
                    <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {(resData.allocation_chart || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bảng độ nhạy */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>📈 Kiểm toán độ nhạy (a₆)</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #232936', color: '#94a3b8', textAlign: 'left' }}>
                    <th style={{ padding: '8px' }}>a₆</th>
                    <th style={{ padding: '8px' }}>Top 1</th>
                    <th style={{ padding: '8px' }}>Top 2</th>
                    <th style={{ padding: '8px' }}>Top 3</th>
                  </tr>
                </thead>
                <tbody>
                  {(resData.sensitivity_heatmap || []).map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #232936' }}>
                      <td style={{ padding: '8px' }}>{row.a6_weight?.toFixed(2) || (row.a6 && row.a6.toFixed(2))}</td>
                      <td style={{ padding: '8px' }}>{row.top_1 || row.top1}</td>
                      <td style={{ padding: '8px' }}>{row.top_2 || row.top2}</td>
                      <td style={{ padding: '8px' }}>{row.top_3 || row.top3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px', marginTop: '20px' }}>
            {/* Xếp hạng 10 ngành theo Priority */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>🏆 Xếp hạng 10 ngành theo Priority</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #232936', color: '#94a3b8', textAlign: 'left' }}>
                    <th style={{ padding: '8px' }}>Hạng</th>
                    <th style={{ padding: '8px' }}>Ngành</th>
                    <th style={{ padding: '8px' }}>Điểm (Priority)</th>
                  </tr>
                </thead>
                <tbody>
                  {(resData.ranking_results || []).map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #232936' }}>
                      <td style={{ padding: '8px', color: '#38bdf8', fontWeight: 'bold' }}>{row.rank || idx + 1}</td>
                      <td style={{ padding: '8px' }}>{row.sector_name_vi || row.name}</td>
                      <td style={{ padding: '8px', color: '#34d399' }}>{row.Priority ? row.Priority.toFixed(4) : "0.0000"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* So sánh hai bộ trọng số chính sách */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>⚖️ So sánh hai bộ trọng số chính sách</h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', whiteSpace: 'nowrap' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #232936', color: '#94a3b8', textAlign: 'left' }}>
                      <th style={{ padding: '8px' }}>Bộ trọng số</th>
                      <th style={{ padding: '8px' }}>Top 1</th>
                      <th style={{ padding: '8px' }}>Top 2</th>
                      <th style={{ padding: '8px' }}>Top 3</th>
                      <th style={{ padding: '8px' }}>Diễn giải</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(resData.comparison || []).map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #232936' }}>
                        <td style={{ padding: '8px', fontWeight: 'bold', color: '#fbbf24' }}>{row.name}</td>
                        <td style={{ padding: '8px' }}>{row.top1 || row.top}</td>
                        <td style={{ padding: '8px' }}>{row.top2 || ""}</td>
                        <td style={{ padding: '8px' }}>{row.top3 || ""}</td>
                        <td style={{ padding: '8px', color: '#cbd5e1' }}>{row.desc || ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Ma trận dữ liệu đã chuẩn hóa min-max */}
          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginTop: '20px' }}>
            <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>🔢 Ma trận dữ liệu đã chuẩn hóa Min-Max</h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', whiteSpace: 'nowrap' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #232936', color: '#94a3b8', textAlign: 'left' }}>
                    {resData.normalized_data && resData.normalized_data.length > 0 && Object.keys(resData.normalized_data[0]).map(key => (
                      <th key={key} style={{ padding: '8px', textTransform: 'capitalize' }}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(resData.normalized_data || []).map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #232936' }}>
                      {Object.values(row).map((val, vIdx) => (
                        <td key={vIdx} style={{ padding: '8px' }}>
                          {typeof val === 'number' ? val.toFixed(4) : val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3.5. Câu hỏi thảo luận chính sách */}
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #38bdf8', borderRadius: '8px', padding: '25px', marginTop: '20px' }}>
            <h3 style={{ fontSize: '16px', color: '#38bdf8', marginBottom: '15px', fontWeight: 'bold', textTransform: 'uppercase' }}>🏛️ 3.5. Thảo luận chính sách (Governance)</h3>
            
            <div style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: '1.7' }}>
              <div style={{ marginBottom: '15px' }}>
                <b style={{ color: '#fff' }}>a) Theo kết quả của em, ba ngành nào nên được ưu tiên đẩy mạnh chuyển đổi số và AI trước? Kết quả này có phù hợp với Nghị quyết 57-NQ/TW không?</b>
                <p style={{ marginTop: '5px' }}>Dựa trên kết quả mô hình tính toán đa tiêu chí (với bộ trọng số mặc định), ba ngành dẫn đầu bảng xếp hạng Priority là: <b>(1) Công nghiệp chế biến chế tạo</b>, <b>(2) CNTT-Truyền thông</b>, và <b>(3) Tài chính-Ngân hàng</b>. <br/>
                Kết quả này hoàn toàn <b>nhất quán và phù hợp</b> với tinh thần của Nghị quyết 57-NQ/TW. Việc ưu tiên vốn mồi công nghệ vào nhóm này sẽ giúp đẩy nhanh dịch chuyển mô hình tăng trưởng từ thâm dụng lao động phổ thông sang nền kinh tế tri thức, thúc đẩy đổi mới sáng tạo và tham gia sâu vào chuỗi giá trị toàn cầu.</p>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <b style={{ color: '#fff' }}>b) Tại sao ngành Khai khoáng có năng suất rất cao nhưng vẫn không nằm trong nhóm ưu tiên?</b>
                <p style={{ marginTop: '5px' }}>Đây là một minh chứng của mô hình định lượng đa mục tiêu. Dù Khai khoáng có năng suất lao động thô cực kỳ cao, nhưng ngành này lại có <b>hệ số lan tỏa (Spillover) rất thấp</b>, mức độ tạo việc làm kém, tăng trưởng có xu hướng âm và rủi ro bị thay thế bởi tự động hóa cao. Do đó, việc đầu tư tài khóa công vào một ngành khép kín, hữu hạn sẽ không mang lại hiệu ứng thặng dư lan tỏa cho cấu trúc của toàn bộ nền kinh tế.</p>
              </div>

              <div>
                <b style={{ color: '#fff' }}>c) Bộ trọng số nên do ai quyết định: chuyên gia kỹ thuật, hội đồng chính sách, hay quy trình đối thoại công khai? Hãy thảo luận trên góc độ governance và tính chính danh chính sách.</b>
                <p style={{ marginTop: '5px', marginBottom: '0' }}>Trên lăng kính quản trị công (Governance), bộ trọng số quyết định phân bổ nguồn lực quốc gia không nên bị độc quyền bởi một nhóm đơn lẻ. Mô hình lý tưởng phải là sự kết hợp đa tầng: <br/>
                • <b>Chuyên gia kỹ thuật:</b> Thiết lập khung toán học, lượng hóa số liệu dựa trên thực chứng.<br/>
                • <b>Hội đồng chính sách:</b> Điều tiết để trọng số không đi lệch khỏi mục tiêu vĩ mô của nhà nước.<br/>
                • <b>Quy trình đối thoại công khai (Public Consultation):</b> Đảm bảo minh bạch, thu thập phản biện từ đại diện các ngành. Sự công khai này chính là chìa khóa tạo ra <b>tính chính danh (legitimacy)</b>, giúp chính sách nhận được sự đồng thuận cao nhất khi thực thi.</p>
              </div>
            </div>
          </div>
          
        </>
      )}
    </div>
  );
}