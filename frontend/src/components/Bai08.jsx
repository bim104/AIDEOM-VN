import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Bai08() {
  const [inputs, setInputs] = useState({
    rho: 0.97, crra_gamma: 1.5, utility_type: 'log',
    max_total_invest_rate: 0.55, min_total_invest_rate: 0.12, max_individual_rate: 0.35
  });

  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  const handleInputChange = (field, val) => {
    setInputs(prev => ({ ...prev, [field]: val }));
  };

  const calculateDynamic = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/bai8/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...inputs,
        rho: parseFloat(inputs.rho) || 0.97,
        crra_gamma: parseFloat(inputs.crra_gamma) || 1.5,
        max_total_invest_rate: parseFloat(inputs.max_total_invest_rate) || 0.55,
        min_total_invest_rate: parseFloat(inputs.min_total_invest_rate) || 0.12,
        max_individual_rate: parseFloat(inputs.max_individual_rate) || 0.35
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.success) {
          setResData(data);
          setIsCalculated(true);
        } else {
          alert(data.message || "Lỗi mô hình tối ưu động liên thời gian.");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi dòng dữ liệu Bài 8:", err);
        setLoading(false);
      });
  };

  const formatSmart = (num) => {
    if (num === undefined || num === null) return "--";
    let str = typeof num === 'number' ? num.toFixed(2) : String(num);
    let parts = str.replace('.', ',').split(',');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(',');
  };

  return (
    <div style={{ color: '#ffffff', maxWidth: '1400px', margin: '0 auto', paddingBottom: '30px', fontFamily: 'sans-serif' }}>

      {/* Tiêu đề trang */}
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase' }}>BÀI 8 — TỐI ƯU ĐỘNG PHAN BỔ LIÊN THỜI GIAN GIAI ĐOẠN 2026-2035</h1>
      </div>

      {/* Khối mô hình toán học */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '3px solid #38bdf8', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🔢</span> Cấu trúc mô hình Hamilton động liên thời gian
        </h3>
        <div style={{ backgroundColor: '#0f172a', padding: '15px 20px', borderRadius: '6px', overflowX: 'auto', marginBottom: '12px' }}>
          <p style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '26px', color: '#cbd5e1', margin: 0, whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>
            <b style={{ color: '#fff' }}>Max &Sigma;<sub>t=2026</sub><sup>2035</sup> &rho;<sup>t-2026</sup> &middot; U(C<sub>t</sub>)</b>
          </p>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
          Mô hình tối ưu hóa quỹ đạo phân bổ sản lượng liên thời gian giữa tiêu dùng hiện tại và tái đầu tư vào bốn loại vốn sản xuất: Vốn vật chất (K), Hạ tầng số (D), Trí tuệ nhân tạo (AI) và Vốn nhân lực (H) dựa trên hàm Cobb-Douglas mở rộng.
        </p>
      </div>

      {/* Biến cấu hình đầu vào và Khối hộp KPI số liệu */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2.8fr', gap: '20px', marginBottom: '30px' }}>

        {/* Form cấu hình tham số vĩ mô */}
        <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 18px 0', fontSize: '14px', color: '#38bdf8', borderBottom: '1px solid #232936', paddingBottom: '8px' }}>⚙️ Tham số tối ưu động</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>&rho; - Hệ số chiết khấu</label>
                <input type="number" step="0.01" value={inputs.rho} onChange={e => handleInputChange('rho', e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>&gamma; CRRA</label>
                <input type="number" step="0.1" value={inputs.crra_gamma} onChange={e => handleInputChange('crra_gamma', e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Hàm thỏa dụng xã hội</label>
              <select value={inputs.utility_type} onChange={e => handleInputChange('utility_type', e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}>
                <option value="log">Log utility: U(C) = ln(C)</option>
                <option value="crra">CRRA utility</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
              <div>
                <label style={{ fontSize: '10px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Đầu tư tối đa/Y</label>
                <input type="number" step="0.01" value={inputs.max_total_invest_rate} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} onChange={e => handleInputChange('max_total_invest_rate', e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '10px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Đầu tư tối thiểu/Y</label>
                <input type="number" step="0.01" value={inputs.min_total_invest_rate} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} onChange={e => handleInputChange('min_total_invest_rate', e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '10px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Trần từng loại/Y</label>
                <input type="number" step="0.01" value={inputs.max_individual_rate} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} onChange={e => handleInputChange('max_individual_rate', e.target.value)} />
              </div>
            </div>
          </div>
          <button onClick={calculateDynamic} disabled={loading} style={{ width: '100%', marginTop: '15px', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '11px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            {loading ? '⏳ Đang giải quỹ đạo Bellman...' : '▶️ Chạy tối ưu động'}
          </button>
        </div>

        {/* Khối hộp KPI kết quả số liệu */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px' }}>
          <div style={{ backgroundColor: '#0891b2', padding: '20px', borderRadius: '4px' }}>
            <h2 style={{ fontSize: '32px', margin: 0 }}>{isCalculated && resData ? formatSmart(resData.welfare) : '--'}</h2>
            <p>Welfare tối ưu</p>
          </div>
          <div style={{ backgroundColor: '#16a34a', padding: '20px', borderRadius: '4px' }}>
            <h2 style={{ fontSize: '28px', margin: 0 }}>{isCalculated && resData ? formatSmart(resData.y2035) + ' nghìn tỷ' : '--'}</h2>
            <p>Y năm 2035</p>
          </div>
          <div style={{ backgroundColor: '#eab308', padding: '20px', borderRadius: '4px' }}>
            <h2 style={{ fontSize: '32px', margin: 0 }}>{isCalculated && resData ? formatSmart(resData.h2035) : '--'}</h2>
            <p>Vốn nhân lực 2035</p>
          </div>
          <div style={{ backgroundColor: '#dc2626', padding: '20px', borderRadius: '4px' }}>
            <h2 style={{ fontSize: '32px', margin: 0 }}>{isCalculated && resData ? formatSmart(resData.ai_h) : '--'}</h2>
            <p>AI/H bình quân</p>
          </div>
        </div>

      </div>

      {isCalculated && resData && (
        <>
          {/* Vùng 1: Đồ thị Quỹ đạo Y-C và Đồ thị Quỹ đạo Trạng thái Vốn */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2.8fr', gap: '20px', marginBottom: '25px' }}>

            {/* 1.1 Khối Solver + Biểu đồ Y và C */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '6px', padding: '15px' }}>
                <h5 style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#38bdf8', fontWeight: 'bold' }}>📊 Trạng thái hệ thống Solver</h5>
                <p id="solver-status" style={{ margin: 0, fontSize: '12px', color: '#34d399', fontWeight: '600' }}>{resData.solver_status}</p>
              </div>

              <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '15px', flexGrow: 1 }}>
                <h4 style={{ fontSize: '13px', color: '#fff', marginBottom: '12px' }}>📈 Quỹ đạo Y và C giai đoạn 2026-2035</h4>
                <div style={{ width: '100%', height: 210 }}>
                  <ResponsiveContainer>
                    <LineChart data={resData.trajectory_table.filter(t => t.year >= 2026)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                      <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff' }} />
                      <Legend fontSize={11} />
                      <Line type="monotone" dataKey="Y" stroke="#38bdf8" name="Sản lượng Y" strokeWidth={2.5} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="C" stroke="#34d399" name="Tiêu dùng C" strokeWidth={2.5} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 1.2 Đồ thị Quỹ đạo cấu trúc trạng thái K, D, AI, H */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ fontSize: '13.5px', color: '#fff', marginBottom: '15px' }}>📈 Quỹ đạo tích lũy các trạng thái Vốn sản xuất (K, D, AI, H)</h4>
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer>
                  <LineChart data={resData.state_chart.filter(t => t.year >= 2026)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                    <XAxis dataKey="year" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff' }} />
                    <Legend />
                    <Line type="monotone" dataKey="K" stroke="#94a3b8" name="Vốn cơ giới K" strokeWidth={2} />
                    <Line type="monotone" dataKey="D" stroke="#38bdf8" name="Hạ tầng số D" strokeWidth={2} />
                    <Line type="monotone" dataKey="AI" stroke="#fbbf24" name="Công nghệ AI" strokeWidth={2.5} />
                    <Line type="monotone" dataKey="H" stroke="#a78bfa" name="Nhân lực số H" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Vùng 2: Đồ thị Cú sốc tài khóa 2028 và Đồ thị Tỷ trọng phân bổ đầu tư công */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr', gap: '20px', marginBottom: '25px' }}>

            {/* 2.1 Đồ thị phản ứng cú sốc ngoại sinh năm 2028 */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ fontSize: '13.5px', color: '#fff', marginBottom: '15px' }}>📉 Cú sốc ngoại sinh năm 2028: Sản lượng Y giảm đột ngột 8%</h4>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <LineChart data={resData.shock_chart.filter(t => t.year >= 2026)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                    <XAxis dataKey="year" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff' }} />
                    <Legend fontSize={10} />
                    <Line type="monotone" dataKey="Y_normal" stroke="#38bdf8" name="Y Cơ sở" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="Y_shock" stroke="#ef4444" name="Y Khi có Sốc" strokeWidth={2.5} />
                    <Line type="monotone" dataKey="C_normal" stroke="#34d399" name="C Cơ sở" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="C_shock" stroke="#fbbf24" name="C Khi có Sốc" strokeWidth={2.5} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2.2 Đồ thị tỷ trọng cơ cấu đầu tư tối ưu liên thời gian */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ fontSize: '13.5px', color: '#fff', marginBottom: '15px' }}>📊 Tỷ trọng cơ cấu phân bổ dòng vốn đầu tư tối ưu qua các năm (%)</h4>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <AreaChart data={resData.share_chart.filter(t => t.year >= 2026)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232936" vertical={false} />
                    <XAxis dataKey="year" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" tickFormatter={(v) => `${v}%`} />
                    <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff' }} />
                    <Legend />
                    <Area type="monotone" dataKey="K_share" stackId="1" stroke="#94a3b8" fill="#475569" name="Tỷ trọng Vốn K" />
                    <Area type="monotone" dataKey="D_share" stackId="1" stroke="#38bdf8" fill="#0284c7" name="Tỷ trọng Hạ tầng D" />
                    <Area type="monotone" dataKey="AI_share" stackId="1" stroke="#fbbf24" fill="#b45309" name="Tỷ trọng AI" />
                    <Area type="monotone" dataKey="H_share" stackId="1" stroke="#a78bfa" fill="#6d28d9" name="Tỷ trọng Nhân lực H" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Vùng 3: Bảng so sánh chiến lược và Bảng quỹ đạo tối ưu theo năm */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.9fr', gap: '20px', marginBottom: '25px' }}>

            {/* 3.1 Bảng đối chiếu chiến lược chính sách */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '3px solid #34d399', borderRadius: '4px', padding: '20px' }}>
              <h4 style={{ fontSize: '13.5px', color: '#fff', marginBottom: '15px' }}>⚖️ So sánh hiệu năng các kịch bản chiến lược phân bổ</h4>
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8', backgroundColor: '#0f172a' }}>
                    <th style={{ padding: '8px' }}>Chiến lược</th>
                    <th style={{ padding: '8px' }}>Welfare</th>
                    <th style={{ padding: '8px' }}>Y 2035</th>
                    <th style={{ padding: '8px' }}>H 2035</th>
                  </tr>
                </thead>
                <tbody>
                  {resData.strategy_table.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #232936' }}>
                      <td style={{ padding: '8px', fontWeight: '500', color: i === 0 ? '#38bdf8' : '#fff' }}>{row.strategy}</td>
                      <td style={{ padding: '8px', color: '#fbbf24', fontWeight: 'bold' }}>{row.welfare}</td>
                      <td style={{ padding: '8px', color: '#34d399' }}>{row.y2035}</td>
                      <td style={{ padding: '8px', color: '#cbd5e1' }}>{row.h2035}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 3.2 Bảng chi tiết quỹ đạo tối ưu liên thời gian theo năm */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '3px solid #38bdf8', borderRadius: '4px', padding: '20px' }}>
              <h4 style={{ fontSize: '13.5px', color: '#fff', marginBottom: '15px' }}>📋 Bảng dữ liệu quỹ đạo phân bổ tối ưu theo năm</h4>
              <div style={{ overflowY: 'auto', maxHeight: '250px' }}>
                <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8', backgroundColor: '#0f172a' }}>
                      <th style={{ padding: '8px' }}>Năm</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Y sản lượng</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>C tiêu dùng</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>I_K</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>I_D</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>I_AI</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>I_H</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>AI/H</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resData.trajectory_table.map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #232936' }}>
                        <td style={{ padding: '8px', fontWeight: 'bold', color: '#38bdf8' }}>{row.year}</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>{formatSmart(row.Y)}</td>
                        <td style={{ padding: '8px', textAlign: 'right', color: '#34d399' }}>{formatSmart(row.C)}</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>{formatSmart(row.I_K)}</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>{formatSmart(row.I_D)}</td>
                        <td style={{ padding: '8px', textAlign: 'right', color: '#fbbf24' }}>{formatSmart(row.I_AI)}</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>{formatSmart(row.I_H)}</td>
                        <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>{String(row.AI_H).replace('.', ',')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* 8.4 Nhận xét và hàm ý chính sách */}
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #38bdf8', borderRadius: '8px', padding: '25px', marginBottom: '25px' }}>
            <h3 style={{ fontSize: '16px', color: '#38bdf8', marginBottom: '20px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              🏛️ 8.4. Nhận xét và Hàm ý chính sách (Tối ưu động liên thời gian)
            </h3>
            
            <div style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: '1.8' }}>
              
              <div style={{ marginBottom: '20px' }}>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  a) Quỹ đạo tối ưu của K, D, AI, H có “front-loaded” hay “back-loaded” không? Vì sao mô hình đề xuất như vậy?
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify' }}>
                  <b>Phân tích quỹ đạo:</b> Quỹ đạo tối ưu của mô hình thể hiện sự phân hóa rõ rệt. Vốn vật chất (K), Hạ tầng số (D) và Vốn nhân lực (H) mang tính chất <b>"Front-loaded" (Đầu tư dồn dập ở giai đoạn đầu)</b>. Ngược lại, quỹ đạo của Trí tuệ nhân tạo (AI) mang tính chất <b>"Back-loaded" (Tăng tốc mạnh ở giai đoạn sau)</b>.<br />
                  <b>Cơ sở kinh tế học:</b> Thuật toán quy hoạch động (Dynamic Programming) nhận diện cấu trúc phụ thuộc nhân quả. AI không thể sinh lời độc lập nếu thiếu máy chủ đám mây (D) và kỹ sư vận hành (H). Việc dồn vốn (front-load) vào K, D, H ở những năm đầu 2026-2028 là để xây dựng <i>Năng lực hấp thụ (Absorptive Capacity)</i>. Khi nền tảng này đã đủ độ chín, mô hình mới kích hoạt "back-load" dồn bạo chi cho AI ở giai đoạn 2030-2035 để khai thác hiệu ứng cấp số nhân (Multiplier Effect) lên Tổng năng suất nhân tố (TFP).
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  b) Tỷ lệ đầu tư AI/H theo thời gian có ổn định không? Mô hình ngụ ý gì về tiến trình đào tạo nhân lực và đầu tư AI?
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify' }}>
                  <b>Tính ổn định:</b> Tỷ lệ AI/H <b>hoàn toàn không ổn định</b> mà trượt theo một đường cong phi tuyến. Trong ngắn hạn, tỷ lệ này rất thấp (Ngân sách H áp đảo AI). Trong dài hạn, khi kho dự trữ nhân lực đã tích lũy đủ, tỷ lệ này đảo chiều tăng vọt (Ngân sách AI vượt xa H).<br />
                  <b>Hàm ý chính sách:</b> Mô hình ngụ ý tuyệt đối rằng <b>đào tạo nhân lực (H) phải đi trước một nhịp, hoặc ít nhất là tiến hành đồng thời với quy mô lớn hơn</b> trong giai đoạn bình minh công nghệ. Nếu nghịch đảo tỷ lệ này (nhập khẩu công nghệ AI ồ ạt khi nhân lực chưa sẵn sàng), nền kinh tế sẽ gánh chịu <i>Chi phí hao mòn hệ thống (Systemic Depreciation)</i> rất cao và châm ngòi cho cú sốc thất nghiệp cơ cấu nghiêm trọng.
                </p>
              </div>

              <div>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  c) Hệ số chiết khấu &rho; = 0,97 ngụ ý chính phủ quan tâm dài hạn. Nếu &rho; = 0,90, kết quả đổi thế nào? Đây có phải lý do “dưới đầu tư” R&D?
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify', marginBottom: 0 }}>
                  <b>Phản ứng của mô hình:</b> Hệ số chiết khấu &rho; đo lường sự kiên nhẫn của xã hội (Time Preference). Nếu hạ &rho; xuống 0.90 (tư duy ngắn hạn), mô hình sẽ trừng phạt nặng nề các phần thưởng trong tương lai. Quỹ đạo tối ưu lập tức gạt bỏ các dự án AI hay R&D (vốn đòi hỏi thời gian thai nghén dài) để dồn toàn lực vào Vốn vật chất (K) – như xây cầu, làm đường – nhằm tối đa hóa hàm hữu dụng ngay lập tức trong 1-2 năm đầu.<br />
                  <b>Hệ lụy Kinh tế - Chính trị:</b> Đây chính xác là lời giải thích toán học cho bài toán <i>"Dưới đầu tư" (Underinvestment)</i> vào R&D và giáo dục. Nó phản ánh <b>Chu kỳ kinh tế chính trị (Political Business Cycle)</b>. Các chính quyền với nhiệm kỳ ngắn (3-5 năm) thường có mức &rho; rất thấp (&approx; 0.90). Họ buộc phải theo đuổi các dự án K có thể cắt băng khánh thành ngay để báo cáo thành tích, thay vì đổ tiền vào R&D hay Nhân lực số (H, AI) – những tài sản vô hình mà người kế nhiệm mới được hưởng lợi. Mô hình AIDEOM-VN với &rho; = 0.97 là một khung tư duy kiến tạo nhằm phá vỡ sự thiển cận này.
                </p>
              </div>

            </div>
          </div>

        </>
      )}
    </div>
  );
}