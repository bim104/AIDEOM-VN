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
  
  // Tối ưu hóa bảng màu cho nền sáng
  const COLORS = ['#0284c7', '#059669', '#d97706', '#dc2626', '#7c3aed', '#db2777', '#2563eb', '#16a34a', '#ea580c', '#4f46e5'];

  return (
    <div style={{ color: '#1e293b', maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px', fontFamily: 'sans-serif' }}>
      
      {/* Khối Banner Tiêu đề */}
      <div style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)', border: '1px solid #bae6fd', borderRadius: '12px', padding: '30px 35px', marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: '24px', margin: 0, fontWeight: 'bold', letterSpacing: '0.5px', color: '#0369a1' }}>
            BÀI 3 — TÍNH CHỈ SỐ ƯU TIÊN NGÀNH PRIORITY
          </h1>
          <p style={{ fontSize: '14px', color: '#0284c7', margin: '8px 0 0 0', fontWeight: '600' }}>
            Giai đoạn 1: Nền tảng Vĩ mô & Đánh giá năng lực cốt lõi
          </p>
        </div>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(2,132,199,0.08) 0%, transparent 70%)' }}></div>
      </div>

      {/* KHỐI MÔ HÌNH TOÁN HỌC */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '3px solid #0284c7', borderRadius: '8px', padding: '20px', marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🔢</span> Mô hình toán học
        </h3>
        <div style={{ backgroundColor: '#f8fafc', padding: '15px 20px', borderRadius: '6px', border: '1px solid #e2e8f0', overflowX: 'auto', marginBottom: '12px' }}>
          <p style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '22px', color: '#334155', margin: 0, whiteSpace: 'nowrap', letterSpacing: '0.5px', textAlign: 'center' }}>
            <b style={{color: '#0f172a'}}><i>Priority</i><sub>i</sub></b> = a<sub>1</sub><i>Growth</i><sub>i</sub> + a<sub>2</sub><i>Productivity</i><sub>i</sub> + a<sub>3</sub><i>Spillover</i><sub>i</sub> + a<sub>4</sub><i>Export</i><sub>i</sub> + a<sub>5</sub><i>Employment</i><sub>i</sub> + a<sub>6</sub><i>AI</i><sub>i</sub> + a<sub>7</sub><i>RiskAdjusted</i><sub>i</sub>
          </p>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#475569', textAlign: 'center' }}>
          Dữ liệu được chuẩn hóa min-max về thang [0,1]. Chỉ tiêu Risk được đảo dấu để giá trị cao hơn phản ánh mức rủi ro tự động hóa thấp hơn.
        </p>
      </div>

      {/* Điều khiển trọng số */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: 'bold' }}>🎛️ Phân bổ trọng số chính sách</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => applyPreset('default')} style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12.5px', fontWeight: '600', transition: 'all 0.2s' }}>Mặc định</button>
            <button onClick={() => applyPreset('growth')} style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12.5px', fontWeight: '600', transition: 'all 0.2s' }}>Tăng trưởng</button>
            <button onClick={() => applyPreset('inclusive')} style={{ backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12.5px', fontWeight: '600', transition: 'all 0.2s' }}>Bao trùm</button>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {Object.keys(inputs).map(key => (
            <div key={key} style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
              <label style={{ fontSize: '12px', color: '#475569', fontWeight: '600', display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>{key.replace('w_', '').toUpperCase()}</span>
                <span style={{ color: '#0284c7' }}>{inputs[key].toFixed(2)}</span>
              </label>
              <input type="range" min="0" max="1" step="0.05" value={inputs[key]} onChange={e => handleWeightChange(key, e.target.value)} style={{ width: '100%', accentColor: '#0284c7' }} />
            </div>
          ))}
        </div>
        
        <button onClick={calculatePriorityScore} disabled={loading} style={{ width: '100%', marginTop: '25px', background: 'linear-gradient(to right, #2563eb, #1d4ed8)', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'opacity 0.2s', opacity: loading ? 0.7 : 1 }}>
          {loading ? '⏳ Đang phân tích dữ liệu...' : '▶️ Chạy mô hình Đánh giá'}
        </button>
      </div>

      {/* Kết quả hiển thị */}
      {isCalculated && resData && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '30px' }}>
            {/* Đồ thị */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>📊 Chỉ số ưu tiên Priority</h4>
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <BarChart data={resData.allocation_chart || []} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis type="number" stroke="#475569" domain={[0, 1]} fontSize={12} fontWeight="bold" />
                    <YAxis dataKey="factor" type="category" stroke="#475569" fontSize={11} width={130} fontWeight="600" />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                      {(resData.allocation_chart || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bảng độ nhạy */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>📈 Kiểm toán độ nhạy (a₆ - Trọng số AI)</h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                      <th style={{ padding: '12px 10px', borderRadius: '6px 0 0 0' }}>Trọng số a₆</th>
                      <th style={{ padding: '12px 10px' }}>Top 1</th>
                      <th style={{ padding: '12px 10px' }}>Top 2</th>
                      <th style={{ padding: '12px 10px', borderRadius: '0 6px 0 0' }}>Top 3</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(resData.sensitivity_heatmap || []).map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: idx % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                        <td style={{ padding: '10px', fontWeight: 'bold', color: '#0284c7' }}>{row.a6_weight?.toFixed(2) || (row.a6 && row.a6.toFixed(2))}</td>
                        <td style={{ padding: '10px', color: '#0f172a' }}>{row.top_1 || row.top1}</td>
                        <td style={{ padding: '10px', color: '#475569' }}>{row.top_2 || row.top2}</td>
                        <td style={{ padding: '10px', color: '#475569' }}>{row.top_3 || row.top3}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '25px', marginBottom: '30px' }}>
            {/* Xếp hạng 10 ngành theo Priority */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>🏆 Xếp hạng 10 ngành theo Priority</h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                      <th style={{ padding: '12px 10px', borderRadius: '6px 0 0 0' }}>Hạng</th>
                      <th style={{ padding: '12px 10px' }}>Ngành</th>
                      <th style={{ padding: '12px 10px', textAlign: 'right', borderRadius: '0 6px 0 0' }}>Điểm (Priority)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(resData.ranking_results || []).map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: idx % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                        <td style={{ padding: '10px', color: '#0284c7', fontWeight: 'bold' }}>#{row.rank || idx + 1}</td>
                        <td style={{ padding: '10px', color: '#0f172a', fontWeight: '500' }}>{row.sector_name_vi || row.name}</td>
                        <td style={{ padding: '10px', color: '#059669', fontWeight: 'bold', textAlign: 'right' }}>{row.Priority ? row.Priority.toFixed(4) : "0.0000"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* So sánh hai bộ trọng số chính sách */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>⚖️ So sánh theo Kịch bản Chính sách</h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                      <th style={{ padding: '12px 10px', borderRadius: '6px 0 0 0' }}>Bộ trọng số</th>
                      <th style={{ padding: '12px 10px' }}>Top 1</th>
                      <th style={{ padding: '12px 10px' }}>Top 2</th>
                      <th style={{ padding: '12px 10px' }}>Top 3</th>
                      <th style={{ padding: '12px 10px', borderRadius: '0 6px 0 0' }}>Diễn giải</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(resData.comparison || []).map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: idx % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                        <td style={{ padding: '10px', fontWeight: 'bold', color: '#d97706' }}>{row.name}</td>
                        <td style={{ padding: '10px', color: '#0f172a', fontWeight: '500' }}>{row.top1 || row.top}</td>
                        <td style={{ padding: '10px', color: '#475569' }}>{row.top2 || ""}</td>
                        <td style={{ padding: '10px', color: '#475569' }}>{row.top3 || ""}</td>
                        <td style={{ padding: '10px', color: '#64748b', fontSize: '12px', lineHeight: '1.5' }}>{row.desc || ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Ma trận dữ liệu đã chuẩn hóa min-max */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>🔢 Ma trận dữ liệu đã chuẩn hóa Min-Max</h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', whiteSpace: 'nowrap' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                    {resData.normalized_data && resData.normalized_data.length > 0 && Object.keys(resData.normalized_data[0]).map((key, i, arr) => (
                      <th key={key} style={{ padding: '10px 8px', textTransform: 'capitalize', borderRadius: i === 0 ? '6px 0 0 0' : i === arr.length - 1 ? '0 6px 0 0' : '0' }}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(resData.normalized_data || []).map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: idx % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                      {Object.values(row).map((val, vIdx) => (
                        <td key={vIdx} style={{ padding: '8px', color: vIdx === 0 ? '#0f172a' : '#475569', fontWeight: vIdx === 0 ? '600' : 'normal' }}>
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
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #059669', borderRadius: '8px', padding: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#0f172a', fontWeight: 'bold', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase' }}>
              <span style={{ fontSize: '18px' }}>🏛️</span> 3.5. Thảo luận chính sách (Governance)
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '13.5px', color: '#475569', lineHeight: '1.7' }}>
              
              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <b style={{ color: '#0284c7', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                  a) Theo kết quả của em, ba ngành nào nên được ưu tiên đẩy mạnh chuyển đổi số và AI trước? Kết quả này có phù hợp với Nghị quyết 57-NQ/TW không?
                </b>
                <p style={{ margin: 0 }}>
                  Dựa trên kết quả mô hình tính toán đa tiêu chí (với bộ trọng số mặc định), ba ngành dẫn đầu bảng xếp hạng Priority là: <b style={{ color: '#0f172a' }}>(1) Công nghiệp chế biến chế tạo</b>, <b style={{ color: '#0f172a' }}>(2) CNTT-Truyền thông</b>, và <b style={{ color: '#0f172a' }}>(3) Tài chính-Ngân hàng</b>. <br/>
                  Kết quả này hoàn toàn <b style={{ color: '#0f172a' }}>nhất quán và phù hợp</b> với tinh thần của Nghị quyết 57-NQ/TW. Việc ưu tiên vốn mồi công nghệ vào nhóm này sẽ giúp đẩy nhanh dịch chuyển mô hình tăng trưởng từ thâm dụng lao động phổ thông sang nền kinh tế tri thức, thúc đẩy đổi mới sáng tạo và tham gia sâu vào chuỗi giá trị toàn cầu.
                </p>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <b style={{ color: '#059669', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                  b) Tại sao ngành Khai khoáng có năng suất rất cao nhưng vẫn không nằm trong nhóm ưu tiên?
                </b>
                <p style={{ margin: 0 }}>
                  Đây là một minh chứng của mô hình định lượng đa mục tiêu. Dù Khai khoáng có năng suất lao động thô cực kỳ cao, nhưng ngành này lại có <b style={{ color: '#0f172a' }}>hệ số lan tỏa (Spillover) rất thấp</b>, mức độ tạo việc làm kém, tăng trưởng có xu hướng âm và rủi ro bị thay thế bởi tự động hóa cao. Do đó, việc đầu tư tài khóa công vào một ngành khép kín, hữu hạn sẽ không mang lại hiệu ứng thặng dư lan tỏa cho cấu trúc của toàn bộ nền kinh tế.
                </p>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <b style={{ color: '#d97706', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                  c) Bộ trọng số nên do ai quyết định: chuyên gia kỹ thuật, hội đồng chính sách, hay quy trình đối thoại công khai? Hãy thảo luận trên góc độ governance và tính chính danh chính sách.
                </b>
                <p style={{ margin: 0 }}>
                  Trên lăng kính quản trị công (Governance), bộ trọng số quyết định phân bổ nguồn lực quốc gia không nên bị độc quyền bởi một nhóm đơn lẻ. Mô hình lý tưởng phải là sự kết hợp đa tầng: <br/>
                  • <b style={{ color: '#0f172a' }}>Chuyên gia kỹ thuật:</b> Thiết lập khung toán học, lượng hóa số liệu dựa trên thực chứng.<br/>
                  • <b style={{ color: '#0f172a' }}>Hội đồng chính sách:</b> Điều tiết để trọng số không đi lệch khỏi mục tiêu vĩ mô của nhà nước.<br/>
                  • <b style={{ color: '#0f172a' }}>Quy trình đối thoại công khai (Public Consultation):</b> Đảm bảo minh bạch, thu thập phản biện từ đại diện các ngành. Sự công khai này chính là chìa khóa tạo ra <b style={{ color: '#0f172a' }}>tính chính danh (legitimacy)</b>, giúp chính sách nhận được sự đồng thuận cao nhất khi thực thi.
                </p>
              </div>
              
            </div>
          </div>
          
        </>
      )}
    </div>
  );
}