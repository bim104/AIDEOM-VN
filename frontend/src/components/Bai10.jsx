import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Bai10() {
  const [inputs, setInputs] = useState({
    budget_first: 65000,
    budget_second: 15000,
    ai_h_ratio: 0.5
  });

  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  const handleInputChange = (field, val) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(val) || 0 }));
  };

  const calculateStochastic = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/bai10/calculate', {
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
          alert("Lỗi mô hình quy hoạch ngẫu nhiên.");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi:", err);
        setLoading(false);
      });
  };

  const formatSmart = (num) => {
    if (num === undefined || num === null) return "--";
    return Number(num).toLocaleString('vi-VN', { maximumFractionDigits: 4 });
  };

  return (
    <div style={{ color: '#ffffff', maxWidth: '1400px', margin: '0 auto', paddingBottom: '30px', fontFamily: 'sans-serif' }}>
      
      {/* Tiêu đề trang */}
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase' }}>BÀI 10 - QUY HOẠCH NGẪU NHIÊN HAI GIAI ĐOẠN DƯỚI BẤT ĐỊNH</h1>
      </div>

      {/* Mô hình toán học */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '3px solid #38bdf8', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🔀</span> Mô hình toán học
        </h3>
        <div style={{ backgroundColor: '#0f172a', padding: '15px 20px', borderRadius: '6px', overflowX: 'auto', marginBottom: '12px' }}>
          <p style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '26px', color: '#cbd5e1', margin: 0, whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>
            <b style={{ color: '#fff' }}>Max &Sigma;<sub>j</sub>&beta;<sub>j</sub>x<sub>j</sub> + &Sigma;<sub>s</sub>p<sub>s</sub>&Sigma;<sub>j</sub>&beta;<sub>j</sub><sup>s</sup>y<sub>j</sub><sup>s</sup></b>
          </p>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
          Mô hình gồm quyết định first-stage x<sub>j</sub> trước khi biết kịch bản và quyết định second-stage y<sub>j</sub><sup>s</sup> sau khi kịch bản xảy ra. Ràng buộc quan trọng: y<sub>AI</sub><sup>s</sup> &le; 0,5x<sub>H</sub>.
        </p>
      </div>

      {/* 4 Khối KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '25px' }}>
        <div style={{ backgroundColor: '#0891b2', padding: '20px', borderRadius: '6px' }}>
          <h2 style={{ fontSize: '30px', margin: '0 0 5px 0', fontWeight: 'bold' }}>{resData ? formatSmart(resData.sp_value) : '--'}</h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#e0f2fe' }}>Giá trị SP</p>
        </div>
        <div style={{ backgroundColor: '#16a34a', padding: '20px', borderRadius: '6px' }}>
          <h2 style={{ fontSize: '30px', margin: '0 0 5px 0', fontWeight: 'bold' }}>{resData ? formatSmart(resData.vss) : '--'}</h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#d1fae5' }}>VSS</p>
        </div>
        <div style={{ backgroundColor: '#eab308', padding: '20px', borderRadius: '6px' }}>
          <h2 style={{ fontSize: '30px', margin: '0 0 5px 0', fontWeight: 'bold', color: '#1e293b' }}>{resData ? formatSmart(resData.evpi) : '--'}</h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#475569' }}>EVPI</p>
        </div>
        <div style={{ backgroundColor: '#dc2626', padding: '20px', borderRadius: '6px' }}>
          <h2 style={{ fontSize: '30px', margin: '0 0 5px 0', fontWeight: 'bold' }}>{resData ? formatSmart(resData.max_regret) : '--'}</h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#fee2e2' }}>Regret xấu nhất</p>
        </div>
      </div>

      {/* Dòng 1: Form & Chart First-stage */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2.8fr', gap: '20px', marginBottom: '25px' }}>
        <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#38bdf8', fontWeight: '600' }}>Tham số mô hình</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#fff', fontWeight: 'bold' }}>Ngân sách first-stage, tỷ VND</label>
              <input type="number" value={inputs.budget_first} onChange={e => handleInputChange('budget_first', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#fff', color: '#000', marginTop: '4px' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#fff', fontWeight: 'bold' }}>Ngân sách second-stage mỗi kịch bản, tỷ VND</label>
              <input type="number" value={inputs.budget_second} onChange={e => handleInputChange('budget_second', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#fff', color: '#000', marginTop: '4px' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#fff', fontWeight: 'bold' }}>Ràng buộc AI theo nhân lực: y_AI &le; ratio &times; x_H</label>
              <input type="number" step="0.1" value={inputs.ai_h_ratio} onChange={e => handleInputChange('ai_h_ratio', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#fff', color: '#000', marginTop: '4px' }} />
            </div>
          </div>
          <button onClick={calculateStochastic} disabled={loading} style={{ width: '100%', marginTop: '20px', backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            {loading ? '⏳ Đang phân tích kịch bản...' : '▶ Chạy mô hình stochastic'}
          </button>
        </div>

        <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
          <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>So sánh quyết định first-stage</h4>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={resData?.first_stage_table || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#232936" vertical={false} />
                <XAxis dataKey="item" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} label={{ value: 'Ngân sách first stage, tỷ VND', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff', border: '1px solid #334155' }} />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="sp" fill="#93c5fd" name="SP" barSize={35} />
                <Bar dataKey="ev" fill="#fca5a5" name="EV" barSize={35} />
                <Bar dataKey="robust" fill="#fdba74" name="Robust" barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {isCalculated && resData && (
        <>
          {/* Dòng 2: Cấu trúc kịch bản & Value Chart */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2.8fr', gap: '20px', marginBottom: '25px' }}>
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', overflowX: 'auto' }}>
              <h4 style={{ fontSize: '14px', color: '#38bdf8', marginBottom: '15px' }}>Cấu trúc kịch bản</h4>
              <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8', backgroundColor: '#0f172a' }}>
                    <th style={{ padding: '10px' }}>Kịch bản</th>
                    <th style={{ padding: '10px' }}>TG %</th>
                    <th style={{ padding: '10px' }}>FDI</th>
                    <th style={{ padding: '10px' }}>Xuất khẩu %</th>
                    <th style={{ padding: '10px' }}>Xác suất</th>
                  </tr>
                </thead>
                <tbody>
                  {(resData.scenarios || []).map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #232936', color: '#cbd5e1' }}>
                      <td style={{ padding: '10px' }}>{row.name}</td>
                      <td style={{ padding: '10px' }}>{row.tg}</td>
                      <td style={{ padding: '10px' }}>{row.fdi}</td>
                      <td style={{ padding: '10px' }}>{row.export}</td>
                      <td style={{ padding: '10px' }}>{row.prob}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>So sánh SP - EV - EEV - WS</h4>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={resData.value_chart || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232936" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100000]} label={{ value: 'Giá trị kỳ vọng', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff', border: '1px solid #334155' }} formatter={(val) => [formatSmart(val), "Giá trị mục tiêu"]} />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="value" fill="#93c5fd" name="Giá trị mục tiêu" barSize={70} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Dòng 3: Recourse Chart & Bảng Quyết định */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr', gap: '20px', marginBottom: '25px' }}>
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>Second-stage recourse của lời giải SP</h4>
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                  <BarChart data={resData.recourse_chart || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232936" vertical={false} />
                    <XAxis dataKey="scenario" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} label={{ value: 'Ngân sách recourse, tỷ VND', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff', border: '1px solid #334155' }} />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="y_I" stackId="a" fill="#93c5fd" name="Hạ tầng số" barSize={55} />
                    <Bar dataKey="y_D" stackId="a" fill="#fca5a5" name="Chuyển đổi số" />
                    <Bar dataKey="y_AI" stackId="a" fill="#fdba74" name="Trí tuệ nhân tạo" />
                    <Bar dataKey="y_H" stackId="a" fill="#fde047" name="Nhân lực số" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', overflowX: 'auto' }}>
              <h4 style={{ fontSize: '14px', color: '#38bdf8', marginBottom: '15px' }}>Bảng quyết định first-stage</h4>
              <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8', backgroundColor: '#0f172a' }}>
                    <th style={{ padding: '10px' }}>Hạng mục</th>
                    <th style={{ padding: '10px' }}>SP</th>
                    <th style={{ padding: '10px' }}>EV</th>
                    <th style={{ padding: '10px' }}>Robust</th>
                  </tr>
                </thead>
                <tbody>
                  {(resData.first_stage_table || []).map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #232936', color: '#cbd5e1' }}>
                      <td style={{ padding: '10px', fontWeight: '500' }}>{row.item}</td>
                      <td style={{ padding: '10px' }}>{formatSmart(row.sp)}</td>
                      <td style={{ padding: '10px' }}>{formatSmart(row.ev)}</td>
                      <td style={{ padding: '10px' }}>{formatSmart(row.robust)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 10.6 Nhận xét và hàm ý chính sách */}
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #38bdf8', borderRadius: '8px', padding: '25px', marginBottom: '25px' }}>
            <h3 style={{ fontSize: '16px', color: '#38bdf8', marginBottom: '20px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              🏛️ 10.6. Nhận xét và Hàm ý chính sách (Quy hoạch ngẫu nhiên)
            </h3>
            
            <div style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: '1.8' }}>
              
              <div style={{ marginBottom: '20px' }}>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  a) So với lời giải xác định, lời giải SP có xu hướng đầu tư H nhiều hơn hay ít hơn? Vì sao?
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify' }}>
                  <b>Xu hướng đầu tư:</b> Lời giải Quy hoạch ngẫu nhiên (SP) luôn có xu hướng phân bổ ngân sách cho Nhân lực số (H) <b>nhiều hơn và kiên định hơn</b> so với lời giải xác định (EV) dựa trên kịch bản trung bình.<br />
                  <b>Nguyên nhân:</b> Lời giải xác định (EV) chỉ nhìn thấy một tương lai trung bình yên bình, do đó nó bị hấp dẫn bởi lợi nhuận ngắn hạn và vắt kiệt ngân sách vào hệ thống máy móc, hạ tầng công nghệ lõi (K, AI). Ngược lại, mô hình ngẫu nhiên (SP) tối ưu hóa trên mọi kịch bản, bao gồm cả rủi ro khủng hoảng cực đoan. Khi kịch bản xấu xảy ra, máy móc và công nghệ vật lý trở thành "chi phí chìm" không thể tự xoay xở. Chỉ có Vốn nhân lực (H) mới tạo ra <i>"Tính linh hoạt bù đắp" (Recourse Flexibility)</i>, cho phép nền kinh tế chuyển đổi công năng và gượng dậy. Do đó, thuật toán SP tự động "mua bảo hiểm" bằng cách tăng dự trữ vốn con người ngay từ Giai đoạn 1 (First-stage).
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  b) VSS dương nói lên điều gì về giá trị của tư duy xác suất trong hoạch định chính sách Việt Nam?
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify' }}>
                  <b>Bản chất của VSS:</b> Giá trị của giải pháp ngẫu nhiên (VSS &gt; 0) đo lường chính xác bằng tiền <b>khoản thiệt hại kinh tế khổng lồ</b> mà quốc gia sẽ phải gánh chịu nếu chỉ nhắm mắt lập kế hoạch dựa trên một dự báo "cơ sở" duy nhất.<br />
                  <b>Hàm ý hoạch định:</b> Con số này là minh chứng toán học cho thấy tư duy lập kế hoạch 5 năm tuyến tính cứng nhắc (Deterministic Planning) đã lỗi thời trong kỷ nguyên VUCA (Biến động, Bất định, Phức tạp, Mơ hồ). Tư duy xác suất đòi hỏi Chính phủ không bao giờ được "bỏ tất cả trứng vào một giỏ kịch bản". Thay vào đó, phải xây dựng các chính sách có độ chống chịu cao (Robustness) đa nhánh và luôn thiết kế sẵn các gói ngân sách dự phòng (Second-stage recourse) để sẵn sàng kích hoạt ngay khi bối cảnh kinh tế vĩ mô đảo chiều.
                </p>
              </div>

              <div>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  c) Bài học từ đại dịch COVID-19 và bão Yagi: Liệu Việt Nam có đang “dưới đầu tư” vào nhân lực số như một hàng hóa bảo hiểm?
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify', marginBottom: 0 }}>
                  <b>Thực tiễn cú sốc:</b> Khi đại dịch COVID-19 làm đứt gãy chuỗi cung ứng vật lý, hay siêu bão Yagi (2024) tàn phá diện rộng hệ thống hạ tầng điện - đường - khu công nghiệp ở miền Bắc (Vốn K), toàn bộ cỗ máy kinh tế truyền thống bị tê liệt. Trong bối cảnh đó, chỉ những cấu phần dựa trên <b>Nhân lực số và Kinh tế tri thức</b> mới có khả năng duy trì hoạt động từ xa, đảm bảo tính liên tục của hệ thống (Business Continuity).<br />
                  <b>Đánh giá mức đầu tư:</b> Rõ ràng Việt Nam đang <b>"dưới đầu tư" (Underinvesting) nghiêm trọng</b> vào nhân lực số. Tư duy truyền thống vẫn nhìn nhận chi phí giáo dục và đào tạo số là "chi tiêu xã hội" (Social Cost) thay vì một <b>"Hàng hóa bảo hiểm vĩ mô" (Macroeconomic Insurance Good)</b>. Bài học đắt giá rút ra là: Hạ tầng vật chất có thể bị quét sạch sau một đêm bởi thiên tai hoặc dịch bệnh, nhưng năng lực trí tuệ và kỹ năng số của con người là tài sản chống chịu rủi ro (Anti-fragile) duy nhất không thể bị phá hủy, quyết định tốc độ tái thiết quốc gia sau khủng hoảng.
                </p>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}