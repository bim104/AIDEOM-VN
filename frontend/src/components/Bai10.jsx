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
    <div style={{ color: '#1e293b', maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px', fontFamily: 'sans-serif' }}>
      
      {/* Banner Tiêu đề */}
      <div style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)', border: '1px solid #bae6fd', borderRadius: '12px', padding: '30px 35px', marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: '24px', margin: 0, fontWeight: 'bold', letterSpacing: '0.5px', color: '#0369a1', textTransform: 'uppercase' }}>
            BÀI 10 - QUY HOẠCH NGẪU NHIÊN HAI GIAI ĐOẠN DƯỚI BẤT ĐỊNH
          </h1>
          <p style={{ fontSize: '14px', color: '#0284c7', margin: '8px 0 0 0', fontWeight: '600' }}>
            Giai đoạn 3: Ra quyết định linh hoạt dưới các kịch bản tương lai (SP)
          </p>
        </div>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(2,132,199,0.08) 0%, transparent 70%)' }}></div>
      </div>

      {/* Mô hình toán học */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '3px solid #0284c7', borderRadius: '8px', padding: '20px', marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🔀</span> Mô hình toán học
        </h3>
        <div style={{ backgroundColor: '#f8fafc', padding: '15px 20px', borderRadius: '6px', border: '1px solid #e2e8f0', overflowX: 'auto', marginBottom: '12px' }}>
          <p style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '26px', color: '#334155', margin: 0, whiteSpace: 'nowrap', letterSpacing: '0.5px', textAlign: 'center' }}>
            <b style={{ color: '#0f172a' }}>Max &Sigma;<sub>j</sub>&beta;<sub>j</sub>x<sub>j</sub> + &Sigma;<sub>s</sub>p<sub>s</sub>&Sigma;<sub>j</sub>&beta;<sub>j</sub><sup>s</sup>y<sub>j</sub><sup>s</sup></b>
          </p>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: '1.6', textAlign: 'center' }}>
          Mô hình gồm quyết định first-stage x<sub>j</sub> trước khi biết kịch bản và quyết định second-stage y<sub>j</sub><sup>s</sup> sau khi kịch bản xảy ra. Ràng buộc quan trọng: y<sub>AI</sub><sup>s</sup> &le; 0,5x<sub>H</sub>.
        </p>
      </div>

      {/* 4 Khối KPI (Chuyển sang dạng thẻ nền trắng có viền) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #0284c7', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '30px', margin: '0 0 5px 0', fontWeight: 'bold', color: '#0284c7' }}>{resData ? formatSmart(resData.sp_value) : '--'}</h2>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Giá trị SP</p>
        </div>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #059669', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '30px', margin: '0 0 5px 0', fontWeight: 'bold', color: '#059669' }}>{resData ? formatSmart(resData.vss) : '--'}</h2>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>VSS</p>
        </div>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #d97706', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '30px', margin: '0 0 5px 0', fontWeight: 'bold', color: '#d97706' }}>{resData ? formatSmart(resData.evpi) : '--'}</h2>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>EVPI</p>
        </div>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #dc2626', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '30px', margin: '0 0 5px 0', fontWeight: 'bold', color: '#dc2626' }}>{resData ? formatSmart(resData.max_regret) : '--'}</h2>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Regret xấu nhất</p>
        </div>
      </div>

      {/* Dòng 1: Form & Chart First-stage */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2.8fr', gap: '25px', marginBottom: '30px' }}>
        
        {/* Khối tham số */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', color: '#0f172a', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>⚙️ Tham số mô hình</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#475569', fontWeight: '600' }}>Ngân sách first-stage (tỷ VND)</label>
              <input type="number" value={inputs.budget_first} onChange={e => handleInputChange('budget_first', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', marginTop: '6px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#475569', fontWeight: '600' }}>Ngân sách second-stage mỗi kịch bản</label>
              <input type="number" value={inputs.budget_second} onChange={e => handleInputChange('budget_second', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', marginTop: '6px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#475569', fontWeight: '600' }}>Ràng buộc AI theo nhân lực: y_AI &le; ratio &times; x_H</label>
              <input type="number" step="0.1" value={inputs.ai_h_ratio} onChange={e => handleInputChange('ai_h_ratio', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', marginTop: '6px', outline: 'none' }} />
            </div>
          </div>
          <button onClick={calculateStochastic} disabled={loading} style={{ width: '100%', marginTop: '25px', background: 'linear-gradient(to right, #2563eb, #1d4ed8)', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'opacity 0.2s', opacity: loading ? 0.7 : 1 }}>
            {loading ? '⏳ Đang phân tích kịch bản...' : '▶ Chạy mô hình Stochastic'}
          </button>
        </div>

        {/* Khối biểu đồ so sánh */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '20px', fontWeight: '600' }}>📊 So sánh quyết định first-stage</h4>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={resData?.first_stage_table || []} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="item" stroke="#475569" fontSize={12} fontWeight="bold" />
                <YAxis stroke="#475569" fontSize={12} fontWeight="bold" label={{ value: 'Ngân sách first stage (tỷ VND)', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 12 }} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '13px', color: '#1e293b' }} />
                <Bar dataKey="sp" fill="#0ea5e9" name="Stochastic (SP)" barSize={35} radius={[4, 4, 0, 0]} />
                <Bar dataKey="ev" fill="#f43f5e" name="Expected Value (EV)" barSize={35} radius={[4, 4, 0, 0]} />
                <Bar dataKey="robust" fill="#d97706" name="Robust" barSize={35} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {isCalculated && resData && (
        <>
          {/* Dòng 2: Cấu trúc kịch bản & Value Chart */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2.8fr', gap: '25px', marginBottom: '30px' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', overflowX: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '15px', fontWeight: '600' }}>📋 Cấu trúc kịch bản</h4>
              <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', backgroundColor: '#f1f5f9' }}>
                    <th style={{ padding: '12px 10px', borderRadius: '6px 0 0 0' }}>Kịch bản</th>
                    <th style={{ padding: '12px 10px' }}>TG %</th>
                    <th style={{ padding: '12px 10px' }}>FDI</th>
                    <th style={{ padding: '12px 10px' }}>XK %</th>
                    <th style={{ padding: '12px 10px', borderRadius: '0 6px 0 0' }}>Xác suất</th>
                  </tr>
                </thead>
                <tbody>
                  {(resData.scenarios || []).map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: i % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                      <td style={{ padding: '10px', fontWeight: '600', color: '#0f172a' }}>{row.name}</td>
                      <td style={{ padding: '10px', color: '#475569' }}>{row.tg}</td>
                      <td style={{ padding: '10px', color: '#475569' }}>{row.fdi}</td>
                      <td style={{ padding: '10px', color: '#475569' }}>{row.export}</td>
                      <td style={{ padding: '10px', fontWeight: 'bold', color: '#0284c7' }}>{row.prob}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '20px', fontWeight: '600' }}>📊 So sánh Giá trị kỳ vọng: SP - EV - EEV - WS</h4>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={resData.value_chart || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" fontSize={12} fontWeight="bold" />
                    <YAxis stroke="#475569" fontSize={12} fontWeight="bold" domain={[0, 100000]} label={{ value: 'Giá trị kỳ vọng', angle: -90, position: 'insideLeft', fill: '#475569' }} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px' }} formatter={(val) => [formatSmart(val), "Giá trị mục tiêu"]} />
                    <Bar dataKey="value" fill="#0ea5e9" name="Giá trị mục tiêu" barSize={60} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Dòng 3: Recourse Chart & Bảng Quyết định */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr', gap: '25px', marginBottom: '30px' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '20px', fontWeight: '600' }}>📊 Second-stage recourse của lời giải SP (Phản ứng theo từng kịch bản)</h4>
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                  <BarChart data={resData.recourse_chart || []} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="scenario" stroke="#475569" fontSize={12} fontWeight="bold" />
                    <YAxis stroke="#475569" fontSize={12} fontWeight="bold" label={{ value: 'Ngân sách recourse (tỷ VND)', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 12 }} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '13px', color: '#1e293b' }} />
                    <Bar dataKey="y_I" stackId="a" fill="#0ea5e9" name="Hạ tầng số" barSize={55} />
                    <Bar dataKey="y_D" stackId="a" fill="#f43f5e" name="Chuyển đổi số" />
                    <Bar dataKey="y_AI" stackId="a" fill="#d97706" name="Trí tuệ nhân tạo" />
                    <Bar dataKey="y_H" stackId="a" fill="#10b981" name="Nhân lực số" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #0284c7', borderRadius: '8px', padding: '20px', overflowX: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '15px', fontWeight: '600' }}>📋 Bảng quyết định First-stage (Chi tiết)</h4>
              <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', backgroundColor: '#f1f5f9' }}>
                    <th style={{ padding: '12px 10px', borderRadius: '6px 0 0 0' }}>Hạng mục</th>
                    <th style={{ padding: '12px 10px', textAlign: 'right' }}>SP</th>
                    <th style={{ padding: '12px 10px', textAlign: 'right' }}>EV</th>
                    <th style={{ padding: '12px 10px', textAlign: 'right', borderRadius: '0 6px 0 0' }}>Robust</th>
                  </tr>
                </thead>
                <tbody>
                  {(resData.first_stage_table || []).map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: i % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                      <td style={{ padding: '10px', fontWeight: '600', color: '#0f172a' }}>{row.item}</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#0284c7', fontWeight: 'bold' }}>{formatSmart(row.sp)}</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#f43f5e', fontWeight: 'bold' }}>{formatSmart(row.ev)}</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#d97706', fontWeight: 'bold' }}>{formatSmart(row.robust)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 10.6 Nhận xét và hàm ý chính sách */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #059669', borderRadius: '8px', padding: '25px', marginBottom: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', color: '#0f172a', marginBottom: '20px', fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🏛️</span> 10.6. Nhận xét và Hàm ý chính sách (Quy hoạch ngẫu nhiên)
            </h3>
            
            <div style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.8' }}>
              
              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <b style={{ color: '#0284c7', fontSize: '14.5px', display: 'block', marginBottom: '8px' }}>
                  a) So với lời giải xác định, lời giải SP có xu hướng đầu tư H nhiều hơn hay ít hơn? Vì sao?
                </b>
                <p style={{ margin: 0, textAlign: 'justify' }}>
                  <b style={{ color: '#0f172a' }}>Xu hướng đầu tư:</b> Lời giải Quy hoạch ngẫu nhiên (SP) luôn có xu hướng phân bổ ngân sách cho Nhân lực số (H) <b style={{ color: '#0f172a' }}>nhiều hơn và kiên định hơn</b> so với lời giải xác định (EV) dựa trên kịch bản trung bình.<br />
                  <b style={{ color: '#0f172a' }}>Nguyên nhân:</b> Lời giải xác định (EV) chỉ nhìn thấy một tương lai trung bình yên bình, do đó nó bị hấp dẫn bởi lợi nhuận ngắn hạn và vắt kiệt ngân sách vào hệ thống máy móc, hạ tầng công nghệ lõi (K, AI). Ngược lại, mô hình ngẫu nhiên (SP) tối ưu hóa trên mọi kịch bản, bao gồm cả rủi ro khủng hoảng cực đoan. Khi kịch bản xấu xảy ra, máy móc và công nghệ vật lý trở thành "chi phí chìm" không thể tự xoay xở. Chỉ có Vốn nhân lực (H) mới tạo ra <i>"Tính linh hoạt bù đắp" (Recourse Flexibility)</i>, cho phép nền kinh tế chuyển đổi công năng và gượng dậy. Do đó, thuật toán SP tự động "mua bảo hiểm" bằng cách tăng dự trữ vốn con người ngay từ Giai đoạn 1 (First-stage).
                </p>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <b style={{ color: '#059669', fontSize: '14.5px', display: 'block', marginBottom: '8px' }}>
                  b) VSS dương nói lên điều gì về giá trị của tư duy xác suất trong hoạch định chính sách Việt Nam?
                </b>
                <p style={{ margin: 0, textAlign: 'justify' }}>
                  <b style={{ color: '#0f172a' }}>Bản chất của VSS:</b> Giá trị của giải pháp ngẫu nhiên (VSS &gt; 0) đo lường chính xác bằng tiền <b style={{ color: '#0f172a' }}>khoản thiệt hại kinh tế khổng lồ</b> mà quốc gia sẽ phải gánh chịu nếu chỉ nhắm mắt lập kế hoạch dựa trên một dự báo "cơ sở" duy nhất.<br />
                  <b style={{ color: '#0f172a' }}>Hàm ý hoạch định:</b> Con số này là minh chứng toán học cho thấy tư duy lập kế hoạch 5 năm tuyến tính cứng nhắc (Deterministic Planning) đã lỗi thời trong kỷ nguyên VUCA (Biến động, Bất định, Phức tạp, Mơ hồ). Tư duy xác suất đòi hỏi Chính phủ không bao giờ được "bỏ tất cả trứng vào một giỏ kịch bản". Thay vào đó, phải xây dựng các chính sách có độ chống chịu cao (Robustness) đa nhánh và luôn thiết kế sẵn các gói ngân sách dự phòng (Second-stage recourse) để sẵn sàng kích hoạt ngay khi bối cảnh kinh tế vĩ mô đảo chiều.
                </p>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <b style={{ color: '#d97706', fontSize: '14.5px', display: 'block', marginBottom: '8px' }}>
                  c) Bài học từ đại dịch COVID-19 và bão Yagi: Liệu Việt Nam có đang “dưới đầu tư” vào nhân lực số như một hàng hóa bảo hiểm?
                </b>
                <p style={{ margin: 0, textAlign: 'justify' }}>
                  <b style={{ color: '#0f172a' }}>Thực tiễn cú sốc:</b> Khi đại dịch COVID-19 làm đứt gãy chuỗi cung ứng vật lý, hay siêu bão Yagi (2024) tàn phá diện rộng hệ thống hạ tầng điện - đường - khu công nghiệp ở miền Bắc (Vốn K), toàn bộ cỗ máy kinh tế truyền thống bị tê liệt. Trong bối cảnh đó, chỉ những cấu phần dựa trên <b style={{ color: '#0f172a' }}>Nhân lực số và Kinh tế tri thức</b> mới có khả năng duy trì hoạt động từ xa, đảm bảo tính liên tục của hệ thống (Business Continuity).<br />
                  <b style={{ color: '#0f172a' }}>Đánh giá mức đầu tư:</b> Rõ ràng Việt Nam đang <b style={{ color: '#0f172a' }}>"dưới đầu tư" (Underinvesting) nghiêm trọng</b> vào nhân lực số. Tư duy truyền thống vẫn nhìn nhận chi phí giáo dục và đào tạo số là "chi tiêu xã hội" (Social Cost) thay vì một <b style={{ color: '#0f172a' }}>"Hàng hóa bảo hiểm vĩ mô" (Macroeconomic Insurance Good)</b>. Bài học đắt giá rút ra là: Hạ tầng vật chất có thể bị quét sạch sau một đêm bởi thiên tai hoặc dịch bệnh, nhưng năng lực trí tuệ và kỹ năng số của con người là tài sản chống chịu rủi ro (Anti-fragile) duy nhất không thể bị phá hủy, quyết định tốc độ tái thiết quốc gia sau khủng hoảng.
                </p>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}