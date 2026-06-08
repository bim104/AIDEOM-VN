import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Bai02() {
  const [inputs, setInputs] = useState({
    total_budget: 100, min_i: 25, min_ai: 15, min_h: 20, min_rd: 10, strategic_ratio: 0.35
  });

  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  const handleInputChange = (field, val) => setInputs(prev => ({ ...prev, [field]: parseFloat(val) || 0 }));

  const calculateLP = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/bai2/calculate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(inputs)
    })
    .then(res => res.json())
    .then(data => {
      if (data && data.success) { setResData(data); setIsCalculated(true); } 
      else { alert(data.message || "Lỗi mô hình hoặc Vô nghiệm"); }
      setLoading(false);
    })
    .catch(err => { console.error("Lỗi:", err); setLoading(false); });
  };

  // Cập nhật lại màu sắc đồ thị cho Light Theme
  const COLORS = ['#0284c7', '#059669', '#d97706', '#dc2626'];

  const formatNum = (num) => {
    if (num === 0) return "-0";
    return num.toString().replace(".", ",");
  };

  return (
    <div style={{ color: '#1e293b', maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px', fontFamily: 'sans-serif' }}>
      
      {/* Khối Banner Tiêu đề đồng bộ với Bai01 */}
      <div style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)', border: '1px solid #bae6fd', borderRadius: '12px', padding: '30px 35px', marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: '24px', margin: 0, fontWeight: 'bold', letterSpacing: '0.5px', color: '#0369a1' }}>
            BÀI 2 — PHÂN BỔ NGÂN SÁCH SỐ (LINEAR PROGRAMMING)
          </h1>
          <p style={{ fontSize: '14px', color: '#0284c7', margin: '8px 0 0 0', fontWeight: '600' }}>
            Giai đoạn 2: Tối ưu hóa phân bổ Vốn & Nguồn lực
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
          <p style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '24px', color: '#334155', margin: 0, whiteSpace: 'nowrap', letterSpacing: '0.5px', textAlign: 'center' }}>
            <b style={{color: '#0f172a'}}>Max <i>Z</i></b> = 0.85<i>x</i><sub>1</sub> + 1.20<i>x</i><sub>2</sub> + 0.95<i>x</i><sub>3</sub> + 1.35<i>x</i><sub>4</sub>
          </p>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#475569', textAlign: 'center' }}>
          Trong đó x₁ là hạ tầng số, x₂ là AI và dữ liệu, x₃ là nhân lực số, x₄ là R&D công nghệ. Đơn vị: nghìn tỷ VND.
        </p>
      </div>

      {/* THẺ KPI TRẠNG THÁI MÔ HÌNH */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #0284c7', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Z* Tối ưu</div>
          <h2 style={{ fontSize: '32px', margin: '6px 0 0 0', fontWeight: 'bold', color: '#0284c7' }}>{resData ? resData.z_opt.toString().replace(".", ",") : '--'}</h2>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Đơn vị: Nghìn tỷ VND</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #059669', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Ngân sách tổng</div>
          <h2 style={{ fontSize: '32px', margin: '6px 0 0 0', fontWeight: 'bold', color: '#059669' }}>{inputs.total_budget}</h2>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Đơn vị: Nghìn tỷ VND</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #d97706', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Trạng thái mô hình</div>
          <h2 style={{ fontSize: '24px', margin: '14px 0 0 0', fontWeight: 'bold', color: '#d97706' }}>{resData ? resData.status : '--'}</h2>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '25px', marginBottom: '30px' }}>
        {/* Điều khiển tham số */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>⚙️ Tham số ràng buộc</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {Object.keys(inputs).map(key => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '13px', color: '#475569', fontWeight: '500' }}>
                  {key === 'total_budget' && 'Ngân sách tổng'}
                  {key === 'min_i' && 'x₁ min (Hạ tầng)'}
                  {key === 'min_ai' && 'x₂ min (AI & Data)'}
                  {key === 'min_h' && 'x₃ min (Nhân lực)'}
                  {key === 'min_rd' && 'x₄ min (R&D)'}
                  {key === 'strategic_ratio' && 'Tỷ trọng chiến lược'}
                </label>
                <input 
                  type="number" value={inputs[key]} onChange={e => handleInputChange(key, e.target.value)} 
                  style={{ width: '80px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', outline: 'none' }} 
                />
              </div>
            ))}
          </div>
          <button onClick={calculateLP} disabled={loading} style={{ width: '100%', marginTop: '25px', background: 'linear-gradient(to right, #2563eb, #1d4ed8)', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'opacity 0.2s', opacity: loading ? 0.7 : 1 }}>
            {loading ? '⏳ Đang giải bài toán...' : '▶️ Chạy mô hình LP'}
          </button>
        </div>

        {/* Phân bổ tối ưu */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>📊 Phân bổ tối ưu ngân sách</h4>
          {isCalculated && resData ? (
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <BarChart data={resData.allocation_chart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="factor" stroke="#475569" fontSize={12} fontWeight="bold" />
                  <YAxis stroke="#475569" fontSize={12} fontWeight="bold" />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {resData.allocation_chart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
             <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px dashed #cbd5e1' }}>Bấm chạy mô hình để xem biểu đồ</div>
          )}
        </div>
      </div>

      {isCalculated && resData && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '35px' }}>
            {/* Phân tích độ nhạy */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>📈 Phân tích độ nhạy Z*(B)</h4>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <LineChart data={resData.sensitivity_chart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="budget" stroke="#475569" fontSize={12} fontWeight="bold" label={{ value: "Ngân sách", position: "insideBottomRight", offset: -5, fill: "#475569", fontSize: 12 }} />
                    <YAxis stroke="#475569" fontSize={12} fontWeight="bold" domain={['dataMin', 'dataMax']} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                    <Line type="monotone" dataKey="z" stroke="#0284c7" strokeWidth={3} dot={{ fill: '#ffffff', stroke: '#0284c7', strokeWidth: 2, r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bảng giá đối ngẫu */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>⚖️ Giá đối ngẫu của ràng buộc (Shadow Price)</h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                      <th style={{ padding: '12px 10px', borderRadius: '6px 0 0 0' }}>Ràng buộc</th>
                      <th style={{ padding: '12px 10px' }}>Shadow price</th>
                      <th style={{ padding: '12px 10px', borderRadius: '0 6px 0 0' }}>Slack / Surplus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(resData.shadow_table || []).map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: idx % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                        <td style={{ padding: '10px', color: '#0f172a', fontWeight: '500' }}>{row.constraint}</td>
                        <td style={{ padding: '10px', color: '#d97706', fontWeight: 'bold' }}>{formatNum(row.shadow_price)}</td>
                        <td style={{ padding: '10px', color: '#059669', fontWeight: 'bold' }}>{formatNum(row.slack)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: '12.5px', color: '#64748b', marginTop: '15px', lineHeight: '1.6' }}>
                <i>Lưu ý:</i> với các ràng buộc tối thiểu dạng ≥, giá trị Slack/Surplus âm không có nghĩa là vi phạm ràng buộc, mà thể hiện phần vượt mức tối thiểu. Ví dụ, R&D tối thiểu là 10 nhưng mô hình phân bổ 40 thì phần vượt là 30.
              </p>
            </div>
          </div>

          {/* Ý nghĩa chính sách của shadow price */}
          <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '25px', marginBottom: '25px' }}>
            <h3 style={{ fontSize: '15px', color: '#0369a1', margin: '0 0 15px 0', fontWeight: 'bold' }}>💬 Ý nghĩa chính sách của shadow price ngân sách tổng</h3>
            <p style={{ fontSize: '13.5px', color: '#334155', lineHeight: '1.7', margin: '0 0 10px 0' }}>
              Shadow price của ràng buộc ngân sách tổng là <b>{formatNum(resData.shadow_table[0]?.shadow_price)}</b>. Điều này có nghĩa là nếu ngân sách tổng tăng thêm 1 nghìn tỷ VND, GDP kỳ vọng có thể tăng thêm khoảng <b>{formatNum(resData.shadow_table[0]?.shadow_price)}</b> nghìn tỷ VND, trong điều kiện cấu trúc ràng buộc hiện tại không đổi.
            </p>
            <p style={{ fontSize: '13.5px', color: '#334155', lineHeight: '1.7', margin: 0 }}>
              Về mặt chính sách, đây là chỉ báo về giá trị biên của vốn công. Khi shadow price dương, ràng buộc ngân sách đang là một nút thắt thực sự. Tuy nhiên, con số này không nên được hiểu là dự báo tuyệt đối, vì trong thực tế hiệu quả đầu tư còn phụ thuộc vào năng lực giải ngân, chất lượng dự án, độ trễ R&D và hiệu quả quản trị công.
            </p>
          </div>

          {/* Kịch bản x3 >= 30 */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '25px', marginBottom: '35px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h4 style={{ fontSize: '15px', color: '#dc2626', margin: '0 0 20px 0', fontWeight: 'bold' }}>🎓 Kịch bản ưu tiên nhân lực số: x₃ ≥ 30</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px' }}>
              <div style={{ height: '250px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={[
                      { name: "Kịch bản gốc", Z: resData.z_opt },
                      { name: "x₃ ≥ 30", Z: resData.z_scen }
                    ]} 
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#475569" fontSize={12} fontWeight="bold" />
                    <YAxis domain={['dataMin - 1', 'dataMax + 0.5']} stroke="#475569" fontSize={12} fontWeight="bold" label={{ value: 'Z*, nghìn tỷ VND', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 12, dx: 10 }} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                    <Bar dataKey="Z" fill="#0284c7" barSize={80} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.7', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <p style={{ marginBottom: '15px' }}>
                  Khi Chính phủ muốn ưu tiên nhân lực số bằng cách nâng ràng buộc từ x₃ ≥ 20 lên x₃ ≥ 30, bài toán vẫn khả thi. Giá trị tối ưu ban đầu là Z* = <b style={{color: '#0f172a'}}>{formatNum(resData.z_opt)}</b> nghìn tỷ VND, còn trong kịch bản x₃ ≥ 30 là Z* = <b style={{color: '#0f172a'}}>{formatNum(resData.z_scen)}</b> nghìn tỷ VND. Như vậy, Z* giảm khoảng <b style={{color: '#dc2626'}}>{formatNum((resData.z_opt - resData.z_scen).toFixed(2))}</b> nghìn tỷ VND.
                </p>
                <p style={{ margin: 0 }}>
                  Về ý nghĩa chính sách, nếu Z* giảm, đây là chi phí đánh đổi ngắn hạn khi chuyển thêm ngân sách sang nhân lực số, vốn có hệ số tác động trực tiếp thấp hơn R&D hoặc AI. Tuy nhiên, ưu tiên này có thể hợp lý trong dài hạn vì thiếu hụt kỹ sư AI là một nút thắt làm giảm khả năng hấp thụ công nghệ.
                </p>
              </div>
            </div>
          </div>

          {/* ----- 2.5 THẢO LUẬN CHÍNH SÁCH ----- */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #059669', borderRadius: '8px', padding: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#0f172a', fontWeight: 'bold', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase' }}>
              <span style={{ fontSize: '18px' }}>🏛️</span> 2.5. THẢO LUẬN CHÍNH SÁCH VĨ MÔ
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '13.5px', color: '#475569', lineHeight: '1.7' }}>
              
              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <b style={{ color: '#0284c7', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                  a) Khi ngân sách tổng tăng thêm 1 tỷ VND, GDP kỳ vọng tăng thêm bao nhiêu? Đây có phải là cận trên hợp lý của chi phí cơ hội của vốn công?
                </b>
                <p style={{ margin: 0 }}>
                  Dựa vào Shadow Price của ràng buộc ngân sách tổng, khi ngân sách tăng 1 đơn vị (nghìn tỷ), Z* (GDP kỳ vọng) tăng thêm 1,35 đơn vị. Suy ra <b style={{ color: '#0f172a' }}>tăng 1 tỷ VND thì GDP kỳ vọng tăng 1,35 tỷ VND</b>.<br/>
                  Đây được xem là <b style={{ color: '#0f172a' }}>cận trên lý thuyết hợp lý</b> cho chi phí cơ hội của vốn công trong bài toán phân bổ này, vì nó đại diện cho tỷ suất sinh lời cận biên cao nhất (từ R&D) mà Chính phủ phải từ bỏ nếu không đầu tư. Tuy nhiên trong thực tế, tỷ lệ giải ngân, năng lực hấp thụ vốn và độ trễ chính sách sẽ làm giảm con số này.
                </p>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <b style={{ color: '#059669', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                  b) Vì sao R&D có hệ số tác động cao nhất nhưng lại có ràng buộc tối thiểu thấp nhất?
                </b>
                <p style={{ margin: 0 }}>
                  R&D có hệ số tác động lên Z cao nhất (1.35) vì nó tạo ra giá trị thặng dư đột phá và sở hữu trí tuệ lõi. Tuy nhiên, ràng buộc tối thiểu thấp nhất (x₄ ≥ 10) phản ánh thực tế về <b style={{ color: '#0f172a' }}>mức độ rủi ro thất bại cao, thời gian hoàn vốn dài (độ trễ), và năng lực hấp thụ vốn của khối nhà nước thường thấp hơn</b> so với việc xây dựng hạ tầng cơ bản. Bắt buộc đầu tư tỷ trọng quá lớn vào R&D khi chưa đủ nền tảng nhân lực và hạ tầng sẽ dễ dẫn đến lãng phí ngân sách.
                </p>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <b style={{ color: '#d97706', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                  c) Trong thực tiễn quản lý, tỷ lệ 35% công nghệ chiến lược (AI + R&D) có khả thi không khi NSNN Việt Nam 2025 ưu tiên hạ tầng giao thông và an sinh xã hội?
                </b>
                <p style={{ margin: 0 }}>
                  Trong bối cảnh NSNN ưu tiên cao độ cho hạ tầng giao thông và an sinh xã hội, con số 35% ngân sách số dành riêng cho AI và R&D công nghệ lõi là một <b style={{ color: '#0f172a' }}>tham vọng rất lớn và khó khả thi nếu chỉ dựa vào nguồn vốn đầu tư công truyền thống</b>.<br/>
                  Để đạt được tỷ lệ này mà không làm gián đoạn các ưu tiên quốc gia khác, Chính phủ cần <b style={{ color: '#0f172a' }}>xã hội hóa nguồn lực</b>, huy động vốn từ khu vực tư nhân (PPP), thu hút các quỹ đầu tư mạo hiểm quốc tế, hoặc lồng ghép trực tiếp các yếu tố R&D/AI vào chính các dự án hạ tầng lớn (ví dụ: phát triển hệ thống giao thông thông minh - ITS).
                </p>
              </div>

            </div>
          </div>

        </>
      )}
    </div>
  );
}