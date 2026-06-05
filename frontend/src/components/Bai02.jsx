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

  const COLORS = ['#38bdf8', '#34d399', '#fbbf24', '#f87171'];

  // Đổi dấu chấm thành dấu phẩy giống ảnh mẫu
  const formatNum = (num) => {
    if (num === 0) return "-0";
    return num.toString().replace(".", ",");
  };

  return (
    <div style={{ color: '#ffffff', maxWidth: '1400px', margin: '0 auto', paddingBottom: '30px', fontFamily: 'sans-serif' }}>
      
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase' }}>BÀI 2 — Phân bổ ngân sách số (Linear Programming)</h1>
      </div>

      {/* KHỐI MỚI BỔ SUNG: Mô hình toán học */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '3px solid #38bdf8', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🔢</span> Mô hình toán học
        </h3>
        <div style={{ backgroundColor: '#0f172a', padding: '15px 20px', borderRadius: '6px', overflowX: 'auto', marginBottom: '12px' }}>
          <p style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '24px', color: '#cbd5e1', margin: 0, whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>
            <b style={{color: '#fff'}}>Max <i>Z</i></b> = 0.85<i>x</i><sub>1</sub> + 1.20<i>x</i><sub>2</sub> + 0.95<i>x</i><sub>3</sub> + 1.35<i>x</i><sub>4</sub>
          </p>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
          Trong đó x₁ là hạ tầng số, x₂ là AI và dữ liệu, x₃ là nhân lực số, x₄ là R&D công nghệ. Đơn vị: nghìn tỷ VND.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#0284c7', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '32px' }}>{resData ? resData.z_opt.toString().replace(".", ",") : '--'}</h3>
          <p style={{ margin: 0, fontSize: '14px' }}>Z* tối ưu (nghìn tỷ)</p>
        </div>
        <div style={{ backgroundColor: '#059669', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '32px' }}>{inputs.total_budget}</h3>
          <p style={{ margin: 0, fontSize: '14px' }}>Ngân sách (nghìn tỷ)</p>
        </div>
        <div style={{ backgroundColor: '#d97706', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '24px', lineHeight: '38px' }}>{resData ? resData.status : '--'}</h3>
          <p style={{ margin: 0, fontSize: '14px' }}>Trạng thái mô hình</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '30px' }}>
        {/* Điều khiển tham số */}
        <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', color: '#38bdf8' }}>⚙️ Tham số ràng buộc</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {Object.keys(inputs).map(key => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '13px', color: '#cbd5e1' }}>
                  {key === 'total_budget' && 'Ngân sách tổng'}
                  {key === 'min_i' && 'x₁ min (Hạ tầng)'}
                  {key === 'min_ai' && 'x₂ min (AI & Data)'}
                  {key === 'min_h' && 'x₃ min (Nhân lực)'}
                  {key === 'min_rd' && 'x₄ min (R&D)'}
                  {key === 'strategic_ratio' && 'Tỷ trọng chiến lược'}
                </label>
                <input 
                  type="number" value={inputs[key]} onChange={e => handleInputChange(key, e.target.value)} 
                  style={{ width: '80px', padding: '5px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} 
                />
              </div>
            ))}
          </div>
          <button onClick={calculateLP} disabled={loading} style={{ width: '100%', marginTop: '20px', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            {loading ? '⏳ Đang giải bài toán...' : '▶️ Chạy mô hình LP'}
          </button>
        </div>

        {/* Phân bổ tối ưu */}
        <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
          <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>📊 Phân bổ tối ưu ngân sách</h4>
          {isCalculated && resData ? (
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <BarChart data={resData.allocation_chart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                  <XAxis dataKey="factor" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff', border: '1px solid #232936' }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {resData.allocation_chart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
             <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>Bấm chạy mô hình để xem biểu đồ</div>
          )}
        </div>
      </div>

      {isCalculated && resData && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            {/* Phân tích độ nhạy */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>📈 Phân tích độ nhạy Z*(B)</h4>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <LineChart data={resData.sensitivity_chart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                    <XAxis dataKey="budget" stroke="#94a3b8" label={{ value: "Ngân sách", position: "insideBottomRight", offset: -5, fill: "#94a3b8" }} />
                    <YAxis stroke="#94a3b8" domain={['dataMin', 'dataMax']} />
                    <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff', border: '1px solid #232936' }} />
                    <Line type="monotone" dataKey="z" stroke="#38bdf8" strokeWidth={3} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bảng giá đối ngẫu */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>⚖️ Giá đối ngẫu của ràng buộc</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #232936', color: '#94a3b8', textAlign: 'left' }}>
                    <th style={{ padding: '8px' }}>Ràng buộc</th>
                    <th style={{ padding: '8px' }}>Shadow price</th>
                    <th style={{ padding: '8px' }}>Slack / Surplus</th>
                  </tr>
                </thead>
                <tbody>
                  {(resData.shadow_table || []).map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #232936' }}>
                      <td style={{ padding: '8px', color: '#fff' }}>{row.constraint}</td>
                      <td style={{ padding: '8px', color: '#fbbf24' }}>{formatNum(row.shadow_price)}</td>
                      <td style={{ padding: '8px', color: '#34d399' }}>{formatNum(row.slack)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '15px' }}>
                Lưu ý: với các ràng buộc tối thiểu dạng ≥, giá trị Slack/Surplus âm không có nghĩa là vi phạm ràng buộc, mà thể hiện phần vượt mức tối thiểu. Ví dụ, R&D tối thiểu là 10 nhưng mô hình phân bổ 40 thì phần vượt là 30 nghìn tỷ VND.
              </p>
            </div>
          </div>

          {/* Ý nghĩa chính sách của shadow price */}
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #38bdf8', borderRadius: '8px', padding: '25px', marginTop: '20px' }}>
            <h3 style={{ fontSize: '16px', color: '#38bdf8', marginBottom: '15px', fontWeight: 'bold' }}>💬 Ý nghĩa chính sách của shadow price ngân sách tổng</h3>
            <p style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: '1.7', marginBottom: '10px' }}>
              Shadow price của ràng buộc ngân sách tổng là {formatNum(resData.shadow_table[0]?.shadow_price)}. Điều này có nghĩa là nếu ngân sách tổng tăng thêm 1 nghìn tỷ VND, GDP kỳ vọng có thể tăng thêm khoảng {formatNum(resData.shadow_table[0]?.shadow_price)} nghìn tỷ VND, trong điều kiện cấu trúc ràng buộc hiện tại không đổi.
            </p>
            <p style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: '1.7', margin: 0 }}>
              Về mặt chính sách, đây là chỉ báo về giá trị biên của vốn công trong bài toán phân bổ ngân sách số. Khi shadow price của ngân sách tổng dương, ràng buộc ngân sách đang là một nút thắt thực sự: tăng thêm nguồn lực ngân sách có thể tạo thêm lợi ích kinh tế kỳ vọng. Tuy nhiên, con số này không nên được hiểu là dự báo tuyệt đối, vì trong thực tế hiệu quả đầu tư còn phụ thuộc vào năng lực giải ngân, chất lượng dự án, độ trễ của R&D, năng lực hấp thụ công nghệ và hiệu quả quản trị công.
            </p>
          </div>

          {/* Kịch bản x3 >= 30 */}
          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginTop: '20px' }}>
            <h4 style={{ fontSize: '14px', color: '#f87171', marginBottom: '20px', fontWeight: 'bold' }}>🎓 Kịch bản ưu tiên nhân lực số: x₃ ≥ 30</h4>
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
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#232936" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis domain={['dataMin - 1', 'dataMax + 0.5']} stroke="#94a3b8" fontSize={12} label={{ value: 'Z*, nghìn tỷ VND tăng GDP kỳ vọng', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12, dx: 10 }} />
                    <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{ backgroundColor: '#161a25', color: '#fff', border: '1px solid #232936' }} />
                    <Bar dataKey="Z" fill="#38bdf8" barSize={80} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: '1.7', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <p style={{ marginBottom: '15px' }}>
                  Khi Chính phủ muốn ưu tiên nhân lực số bằng cách nâng ràng buộc từ x₃ ≥ 20 lên x₃ ≥ 30, bài toán vẫn khả thi. Giá trị tối ưu ban đầu là Z* = {formatNum(resData.z_opt)} nghìn tỷ VND tăng GDP kỳ vọng, còn trong kịch bản x₃ ≥ 30 là Z* = {formatNum(resData.z_scen)} nghìn tỷ VND. Như vậy, Z* giảm khoảng {formatNum((resData.z_opt - resData.z_scen).toFixed(2))} nghìn tỷ VND.
                </p>
                <p style={{ margin: 0 }}>
                  Về ý nghĩa chính sách, nếu Z* giảm, đây là chi phí đánh đổi ngắn hạn khi chuyển thêm ngân sách sang nhân lực số, vốn có hệ số tác động trực tiếp thấp hơn R&D hoặc AI. Tuy nhiên, ưu tiên này có thể hợp lý trong dài hạn vì thiếu hụt kỹ sư AI là một nút thắt làm giảm khả năng hấp thụ công nghệ. Nếu không đầu tư đủ cho nhân lực số, các khoản đầu tư vào AI, dữ liệu và R&D có thể không tạo ra hiệu quả như kỳ vọng.
                </p>
              </div>
            </div>
          </div>

          {/* ----- 2.5 THẢO LUẬN CHÍNH SÁCH ----- */}
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #38bdf8', borderRadius: '8px', padding: '25px', marginTop: '20px' }}>
            <h3 style={{ fontSize: '16px', color: '#38bdf8', marginBottom: '15px', fontWeight: 'bold', textTransform: 'uppercase' }}>🏛️ 2.5. Thảo luận chính sách</h3>
            
            <div style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: '1.7' }}>
              <div style={{ marginBottom: '15px' }}>
                <b style={{ color: '#fff' }}>a) Khi ngân sách tổng tăng thêm 1 tỷ VND, GDP kỳ vọng tăng thêm bao nhiêu? Đây có phải là cận trên hợp lý của chi phí cơ hội của vốn công?</b>
                <p style={{ marginTop: '5px' }}>Dựa vào Shadow Price của ràng buộc ngân sách tổng, khi ngân sách tăng 1 đơn vị (nghìn tỷ), Z* (GDP kỳ vọng) tăng thêm 1,35 đơn vị. Suy ra <b>tăng 1 tỷ VND thì GDP kỳ vọng tăng 1,35 tỷ VND</b>.<br/>
                Đây được xem là <b>cận trên lý thuyết hợp lý</b> cho chi phí cơ hội của vốn công trong bài toán phân bổ này, vì nó đại diện cho tỷ suất sinh lời cận biên cao nhất (từ R&D) mà Chính phủ phải từ bỏ nếu không đầu tư. Tuy nhiên trong thực tế, tỷ lệ giải ngân, năng lực hấp thụ vốn và độ trễ chính sách sẽ làm giảm con số này.</p>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <b style={{ color: '#fff' }}>b) Vì sao R&D có hệ số tác động cao nhất nhưng lại có ràng buộc tối thiểu thấp nhất?</b>
                <p style={{ marginTop: '5px' }}>R&D có hệ số tác động lên Z cao nhất (1.35) vì nó tạo ra giá trị thặng dư đột phá và sở hữu trí tuệ lõi. Tuy nhiên, ràng buộc tối thiểu thấp nhất (x₄ ≥ 10) phản ánh thực tế về <b>mức độ rủi ro thất bại cao, thời gian hoàn vốn dài (độ trễ), và năng lực hấp thụ vốn của khối nhà nước thường thấp hơn</b> so với việc xây dựng hạ tầng cơ bản. Bắt buộc đầu tư tỷ trọng quá lớn vào R&D khi chưa đủ nền tảng nhân lực và hạ tầng sẽ dễ dẫn đến lãng phí ngân sách.</p>
              </div>

              <div>
                <b style={{ color: '#fff' }}>c) Trong thực tiễn quản lý, tỷ lệ 35% công nghệ chiến lược (AI + R&D) có khả thi không khi ngân sách nhà nước Việt Nam 2025 ưu tiên hạ tầng giao thông và an sinh xã hội?</b>
                <p style={{ marginTop: '5px', marginBottom: '0' }}>Trong bối cảnh NSNN 2025 ưu tiên cao độ cho hạ tầng giao thông và an sinh xã hội, con số 35% ngân sách số dành riêng cho AI và R&D công nghệ lõi là một <b>tham vọng rất lớn và khó khả thi nếu chỉ dựa vào nguồn vốn đầu tư công truyền thống</b>.<br/>
                Để đạt được tỷ lệ này mà không làm gián đoạn các ưu tiên quốc gia khác, Chính phủ cần <b>xã hội hóa nguồn lực</b>, huy động vốn từ khu vực tư nhân (PPP), thu hút các quỹ đầu tư mạo hiểm quốc tế, hoặc lồng ghép trực tiếp các yếu tố R&D/AI vào chính các dự án hạ tầng lớn (ví dụ: phát triển hệ thống giao thông thông minh - ITS).</p>
              </div>
            </div>
          </div>

        </>
      )}
    </div>
  );
}