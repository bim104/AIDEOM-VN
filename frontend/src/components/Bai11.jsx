import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Bai11() {
  const [inputs, setInputs] = useState({
    episodes: 10000,
    alpha: 0.10,
    gamma: 0.95,
    eps_start: 1.0,
    eps_end: 0.05,
    eps_decay_episodes: 5000,
    eval_episodes: 300,
    seed: 42
  });

  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  const handleInputChange = (field, val) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(val) || 0 }));
  };

  const calculateQLearning = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/bai11/calculate', {
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
          alert("Lỗi mô hình Q-learning.");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi:", err);
        setLoading(false);
      });
  };

  // Hàm format số âm / dương đúng chuẩn Việt Nam (vd: -1,2613)
  const formatSmart = (num, minDec = 4, maxDec = 4) => {
    if (num === undefined || num === null) return "--";
    return Number(num).toLocaleString('vi-VN', { minimumFractionDigits: minDec, maximumFractionDigits: maxDec });
  };

  // Hàm xử lý giá trị không thập phân (vd: 10.000)
  const formatInt = (num) => {
    if (num === undefined || num === null) return "--";
    return Number(num).toLocaleString('vi-VN');
  };

  return (
    <div style={{ color: '#ffffff', maxWidth: '1400px', margin: '0 auto', paddingBottom: '30px', fontFamily: 'sans-serif' }}>
      
      {/* Tiêu đề trang */}
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase' }}>BÀI 11 - Q-LEARNING CHO CHÍNH SÁCH KINH TẾ THÍCH NGHI</h1>
      </div>

      {/* Mô hình toán học */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '3px solid #38bdf8', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🎮</span> Mô hình toán học Học Tăng Cường
        </h3>
        <div style={{ backgroundColor: '#0f172a', padding: '15px 20px', borderRadius: '6px', overflowX: 'auto', marginBottom: '12px' }}>
          <p style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '26px', color: '#cbd5e1', margin: 0, whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>
            <b style={{ color: '#fff' }}>Q(s,a) &larr; Q(s,a) + &alpha; [r + &gamma; max<sub>a'</sub>Q(s',a') &minus; Q(s,a)]</b>
          </p>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
          Nền kinh tế được mô hình hóa như một tiến trình Quyết định Markov (MDP) gồm 81 trạng thái (State) và 5 hành động chính sách (Action). Agent học chính sách tối ưu bằng phương pháp Epsilon-greedy Q-learning qua nhiều Episode.
        </p>
      </div>

      {/* 4 Khối KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '25px' }}>
        <div style={{ backgroundColor: '#0891b2', padding: '20px', borderRadius: '6px' }}>
          <h2 style={{ fontSize: '30px', margin: '0 0 5px 0', fontWeight: 'bold' }}>{resData ? formatInt(resData.kpi_episodes) : '--'}</h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#e0f2fe' }}>Số episode train</p>
        </div>
        <div style={{ backgroundColor: '#16a34a', padding: '20px', borderRadius: '6px' }}>
          <h2 style={{ fontSize: '30px', margin: '0 0 5px 0', fontWeight: 'bold' }}>{resData ? formatSmart(resData.kpi_final_reward) : '--'}</h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#d1fae5' }}>Reward TB 100 ep cuối</p>
        </div>
        <div style={{ backgroundColor: '#eab308', padding: '20px', borderRadius: '6px' }}>
          <h2 style={{ fontSize: '24px', margin: '0 0 5px 0', fontWeight: 'bold', color: '#1e293b' }}>{resData ? resData.kpi_best_policy : '--'}</h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#475569' }}>Policy tốt nhất khi eval</p>
        </div>
        <div style={{ backgroundColor: '#dc2626', padding: '20px', borderRadius: '6px' }}>
          <h2 style={{ fontSize: '30px', margin: '0 0 5px 0', fontWeight: 'bold' }}>{resData ? formatSmart(resData.kpi_vn_reward) : '--'}</h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#fee2e2' }}>Reward VN 2026</p>
        </div>
      </div>

      {/* Dòng 1: Form & Bảng Action + Learning Curve */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2.8fr', gap: '20px', marginBottom: '25px' }}>
        
        {/* Form bên trái */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#94a3b8', fontWeight: '600' }}>Tham số Q-learning</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#fff', fontWeight: 'bold' }}>Episodes</label>
                  <input type="number" step="500" value={inputs.episodes} onChange={e => handleInputChange('episodes', e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#fff', fontWeight: 'bold' }}>Eval episodes</label>
                  <input type="number" step="50" value={inputs.eval_episodes} onChange={e => handleInputChange('eval_episodes', e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <div><label style={{ fontSize: '11px', color: '#fff', fontWeight: 'bold' }}>&alpha;</label><input type="number" step="0.01" value={inputs.alpha} onChange={e => handleInputChange('alpha', e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} /></div>
                <div><label style={{ fontSize: '11px', color: '#fff', fontWeight: 'bold' }}>&gamma;</label><input type="number" step="0.01" value={inputs.gamma} onChange={e => handleInputChange('gamma', e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} /></div>
                <div><label style={{ fontSize: '11px', color: '#fff', fontWeight: 'bold' }}>Seed</label><input type="number" step="1" value={inputs.seed} onChange={e => handleInputChange('seed', e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <div><label style={{ fontSize: '11px', color: '#fff', fontWeight: 'bold' }}>&epsilon; start</label><input type="number" step="0.05" value={inputs.eps_start} onChange={e => handleInputChange('eps_start', e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} /></div>
                <div><label style={{ fontSize: '11px', color: '#fff', fontWeight: 'bold' }}>&epsilon; end</label><input type="number" step="0.01" value={inputs.eps_end} onChange={e => handleInputChange('eps_end', e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} /></div>
                <div><label style={{ fontSize: '11px', color: '#fff', fontWeight: 'bold' }}>&epsilon; decay</label><input type="number" step="500" value={inputs.eps_decay_episodes} onChange={e => handleInputChange('eps_decay_episodes', e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} /></div>
              </div>
            </div>
            <button onClick={calculateQLearning} disabled={loading} style={{ width: '100%', marginTop: '20px', backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
              {loading ? '⏳ Đang huấn luyện Agent...' : '▶ Train Q-learning'}
            </button>
          </div>

          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', overflowX: 'auto' }}>
            <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '15px' }}>Không gian hành động</h4>
            <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8', backgroundColor: '#0f172a' }}>
                  <th style={{ padding: '8px' }}>Action</th>
                  <th style={{ padding: '8px' }}>K</th><th style={{ padding: '8px' }}>D</th><th style={{ padding: '8px' }}>AI</th><th style={{ padding: '8px' }}>H</th>
                </tr>
              </thead>
              <tbody>
                {(resData?.action_table || []).map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #232936', color: '#cbd5e1' }}>
                    <td style={{ padding: '8px', fontWeight: '500' }}>{row.action}</td>
                    <td style={{ padding: '8px' }}>{row.k}</td><td style={{ padding: '8px' }}>{row.d}</td>
                    <td style={{ padding: '8px' }}>{row.ai}</td><td style={{ padding: '8px' }}>{row.h}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Biểu đồ Learning Curve bên phải */}
        <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
          <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>Learning curve</h4>
          <div style={{ width: '100%', height: 420 }}>
            <ResponsiveContainer>
              <LineChart data={resData?.learning_curve || []} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                <XAxis dataKey="episode" stroke="#94a3b8" fontSize={11} label={{ value: 'Episode', position: 'insideBottom', offset: -10, fill: '#94a3b8' }} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[-1.6, -1.25]} label={{ value: 'Average reward', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff', border: '1px solid #334155' }} />
                <Legend verticalAlign="top" height={36} />
                <Line type="linear" dataKey="reward" stroke="#38bdf8" strokeWidth={2.5} dot={false} name="Reward trung bình mỗi 100 episodes" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {isCalculated && resData && (
        <>
          {/* Dòng 2: So sánh Policy & Action Count */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr', gap: '20px', marginBottom: '25px' }}>
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>So sánh π* với rule-based policies</h4>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={resData.eval_table || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232936" vertical={false} />
                    <XAxis dataKey="policy" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} label={{ value: 'Reward tích lũy trung bình', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff', border: '1px solid #334155' }} formatter={(val) => [formatSmart(val), "Reward"]} />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="avg" fill="#93c5fd" name="Average cumulative reward" barSize={70} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>Tần suất action được chọn trong 81 trạng thái</h4>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={resData.action_count_chart || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232936" vertical={false} />
                    <XAxis dataKey="action" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} label={{ value: 'Số trạng thái', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff', border: '1px solid #334155' }} />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="count" fill="#93c5fd" name="Số trạng thái chọn action" barSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bảng Policy Sample */}
          <div style={{ backgroundColor: '#161a25', border: '1px solid #38bdf8', borderRadius: '8px', padding: '20px', marginBottom: '25px', overflowX: 'auto' }}>
            <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '15px' }}>Chính sách π*(s) tại 5 trạng thái khởi đầu</h4>
            <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8', backgroundColor: '#0f172a' }}>
                  <th style={{ padding: '10px' }}>Trạng thái</th>
                  <th style={{ padding: '10px' }}>Mô tả</th>
                  <th style={{ padding: '10px' }}>π*(s)</th>
                  <th style={{ padding: '10px' }}>Phân bổ K-D-AI-H</th>
                  <th style={{ padding: '10px' }}>Q max</th>
                </tr>
              </thead>
              <tbody>
                {(resData.policy_sample_table || []).map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #232936', color: '#cbd5e1' }}>
                    <td style={{ padding: '10px', fontWeight: '500' }}>{row.state}</td>
                    <td style={{ padding: '10px' }}>{row.desc}</td>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{row.policy}</td>
                    <td style={{ padding: '10px' }}>{row.alloc}</td>
                    <td style={{ padding: '10px' }}>{formatSmart(row.q_max, 0, 4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Dòng cuối: Trajectory Table & Eval Table */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1.3fr', gap: '20px', marginBottom: '25px' }}>
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', overflowX: 'auto' }}>
              <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '15px' }}>Quỹ đạo mô phỏng VN 2026 theo π*</h4>
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8', backgroundColor: '#0f172a' }}>
                    <th style={{ padding: '8px' }}>Năm</th>
                    <th style={{ padding: '8px' }}>State</th>
                    <th style={{ padding: '8px' }}>Action</th>
                    <th style={{ padding: '8px' }}>Reward</th>
                    <th style={{ padding: '8px' }}>GDP growth</th>
                    <th style={{ padding: '8px' }}>U risk</th>
                  </tr>
                </thead>
                <tbody>
                  {(resData.trajectory_table || []).map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #232936', color: '#cbd5e1' }}>
                      <td style={{ padding: '8px' }}>{row.year}</td>
                      <td style={{ padding: '8px' }}>{row.state}</td>
                      <td style={{ padding: '8px', fontWeight: 'bold', color: '#38bdf8' }}>{row.action}</td>
                      <td style={{ padding: '8px' }}>{formatSmart(row.reward)}</td>
                      <td style={{ padding: '8px' }}>{row.gdp_growth}</td>
                      <td style={{ padding: '8px' }}>{row.u_risk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ backgroundColor: '#161a25', border: '1px solid #ef4444', borderRadius: '8px', padding: '20px', overflowX: 'auto' }}>
              <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '15px' }}>Kết quả đánh giá chính sách</h4>
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8', backgroundColor: '#0f172a' }}>
                    <th style={{ padding: '8px' }}>Policy</th>
                    <th style={{ padding: '8px' }}>Avg reward</th>
                    <th style={{ padding: '8px' }}>Std</th>
                    <th style={{ padding: '8px' }}>Min</th>
                    <th style={{ padding: '8px' }}>Max</th>
                  </tr>
                </thead>
                <tbody>
                  {(resData.eval_table || []).map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #232936', color: '#cbd5e1' }}>
                      <td style={{ padding: '8px', fontWeight: 'bold' }}>{row.policy}</td>
                      <td style={{ padding: '8px', color: '#34d399' }}>{formatSmart(row.avg)}</td>
                      <td style={{ padding: '8px' }}>{formatSmart(row.std)}</td>
                      <td style={{ padding: '8px' }}>{formatSmart(row.min)}</td>
                      <td style={{ padding: '8px' }}>{formatSmart(row.max)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 11.4 Nhận xét và hàm ý chính sách */}
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #38bdf8', borderRadius: '8px', padding: '25px', marginBottom: '25px' }}>
            <h3 style={{ fontSize: '16px', color: '#38bdf8', marginBottom: '20px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              🏛️ 11.4. Nhận xét và Hàm ý chính sách (Học Tăng Cường Q-Learning)
            </h3>
            
            <div style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: '1.8' }}>
              
              <div style={{ marginBottom: '20px' }}>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  a) Khi nền kinh tế ở trạng thái (GDP growth thấp, D thấp, U cao), chính sách &pi;*(s) chọn hành động gì? Có khớp với “quick win” không?
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify' }}>
                  <b>Hành động của &pi;*(s):</b> Tại trạng thái đình đốn (Tăng trưởng thấp, Hạ tầng số kém, Thất nghiệp cao), thuật toán Q-Learning sẽ luôn học được cách chọn hành động <b>"Bơm vốn mồi cơ sở" (Tập trung toàn lực vào D và H)</b> thay vì phiêu lưu vào công nghệ lõi AI.<br />
                  <b>Sự phù hợp với "Quick Win":</b> Hoàn toàn khớp với chiến lược "Quick Win" (Thắng lợi nhanh). Khi U cao, ưu tiên sinh tử của Chính phủ là tạo việc làm. Việc giải ngân vào Hạ tầng số cơ bản (D) - như kéo cáp quang, xây trạm 5G - là các dự án thâm dụng lao động, giúp hấp thụ ngay lập tức lượng người thất nghiệp. Đồng thời, việc chi cho Đào tạo (H) tạo ra nguồn thu nhập hỗ trợ an sinh, sinh ra <i>"Hiệu ứng số nhân" (Multiplier Effect)</i> kích cầu tiêu dùng nội địa, giúp GDP thoát đáy nhanh chóng. Nhảy cóc đầu tư AI lúc này là tự sát vĩ mô vì hạ tầng (D) chưa đủ để hấp thụ công nghệ.
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  b) Khi GDP growth cao, AI cao, U thấp - chính sách chọn gì? Phù hợp với “consolidation” không?
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify' }}>
                  <b>Hành động của &pi;*(s):</b> Khi nền kinh tế đang bùng nổ (Toàn dụng lao động U thấp, AI phát triển mạnh, GDP tăng nóng), chính sách tối ưu &pi;*(s) sẽ đột ngột chuyển pha sang hành động <b>"Tích lũy phòng vệ" hoặc "Kiểm soát rủi ro"</b> (giảm tỷ trọng K/AI, tăng ngân sách dự phòng và rà soát an ninh mạng).<br />
                  <b>Sự phù hợp với "Consolidation":</b> Rất phù hợp với nguyên lý "Consolidation" (Củng cố hệ thống). Khi nền kinh tế chạy ở công suất tối đa, việc tiếp tục bơm tiền kích thích AI sẽ chỉ gây ra lạm phát chi phí, bong bóng công nghệ và làm cạn kiệt nguồn nhân lực chất lượng cao. Thuật toán hiểu rằng "phần thưởng" (Reward) thu thêm từ việc cố đẩy GDP lên cao hơn nữa sẽ bị triệt tiêu bởi "hình phạt" (Penalty) do rủi ro sụp đổ hệ thống (Cyber-risk) hoặc khủng hoảng khí thải. Do đó, củng cố hệ thống là bước đi khôn ngoan nhất để bảo vệ thành quả.
                </p>
              </div>

              <div>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  c) “AI không thay thế quyết định chính trị - xã hội”. Em sẽ tích hợp &pi;* vào quy trình hoạch định chính sách Việt Nam thế nào?
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify', marginBottom: 0 }}>
                  <b>Cơ chế Human-in-the-loop (Con người trong vòng lặp):</b> Để không vi phạm nguyên tắc tối thượng này, chính sách &pi;*(s) sinh ra từ AI chỉ được đóng vai trò là một <b>"Hệ thống tham mưu siêu tốc" (Decision Support System)</b>, tuyệt đối không phải là cơ chế "Tự động ra lệnh" (Auto-pilot).<br />
                  <b>Quy trình tích hợp thực tiễn:</b> <br />
                  1. <i>Bộ/Ngành (Con người)</i>: Thiết lập <b>Hàm phần thưởng (Reward Function)</b>. Việc ưu tiên cứu Tăng trưởng (GDP) hay bảo vệ An sinh (U) là lựa chọn mang tính ý chí chính trị, đạo đức và hiến pháp mà AI không có quyền quyết định.<br />
                  2. <i>Mô hình AIDEOM-VN (AI)</i>: Nhận hàm phần thưởng, chạy mô phỏng hàng triệu kịch bản (Episodes) để tính toán <i>Chi phí cơ hội (Opportunity Cost)</i> và đưa ra bộ ba kịch bản Tốt nhất/Xấu nhất/Cơ sở.<br />
                  3. <i>Quốc hội & Chính phủ (Con người)</i>: Cầm trên tay bản đồ rủi ro do AI cung cấp, đối chiếu với bối cảnh địa chính trị, sự đồng thuận của nhân dân (Social Consensus) để bấm nút quyết định cuối cùng. AI lượng hóa sự đánh đổi, nhưng con người chịu trách nhiệm về lịch sử.
                </p>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}