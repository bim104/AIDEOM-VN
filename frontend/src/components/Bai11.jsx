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
    <div style={{ color: '#1e293b', maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px', fontFamily: 'sans-serif' }}>
      
      {/* Banner Tiêu đề */}
      <div style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)', border: '1px solid #bae6fd', borderRadius: '12px', padding: '30px 35px', marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: '24px', margin: 0, fontWeight: 'bold', letterSpacing: '0.5px', color: '#0369a1', textTransform: 'uppercase' }}>
            BÀI 11 - Q-LEARNING CHO CHÍNH SÁCH KINH TẾ THÍCH NGHI
          </h1>
          <p style={{ fontSize: '14px', color: '#0284c7', margin: '8px 0 0 0', fontWeight: '600' }}>
            Giai đoạn 4: Trí tuệ nhân tạo tự hành & Chính sách thích nghi
          </p>
        </div>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(2,132,199,0.08) 0%, transparent 70%)' }}></div>
      </div>

      {/* Mô hình toán học */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '3px solid #0284c7', borderRadius: '8px', padding: '20px', marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🎮</span> Mô hình toán học Học Tăng Cường
        </h3>
        <div style={{ backgroundColor: '#f8fafc', padding: '15px 20px', borderRadius: '6px', border: '1px solid #e2e8f0', overflowX: 'auto', marginBottom: '12px' }}>
          <p style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '26px', color: '#334155', margin: 0, whiteSpace: 'nowrap', letterSpacing: '0.5px', textAlign: 'center' }}>
            <b style={{ color: '#0f172a' }}>Q(s,a) &larr; Q(s,a) + &alpha; [r + &gamma; max<sub>a'</sub>Q(s',a') &minus; Q(s,a)]</b>
          </p>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: '1.6', textAlign: 'center' }}>
          Nền kinh tế được mô hình hóa như một tiến trình Quyết định Markov (MDP) gồm 81 trạng thái (State) và 5 hành động chính sách (Action). Agent học chính sách tối ưu bằng phương pháp Epsilon-greedy Q-learning qua nhiều Episode.
        </p>
      </div>

      {/* 4 Khối KPI Đồng bộ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #0284c7', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '30px', margin: '0 0 5px 0', fontWeight: 'bold', color: '#0284c7' }}>{resData ? formatInt(resData.kpi_episodes) : '--'}</h2>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Số episode train</p>
        </div>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #059669', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '30px', margin: '0 0 5px 0', fontWeight: 'bold', color: '#059669' }}>{resData ? formatSmart(resData.kpi_final_reward) : '--'}</h2>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Reward TB 100 ep cuối</p>
        </div>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #d97706', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '24px', margin: '0 0 5px 0', fontWeight: 'bold', color: '#d97706', lineHeight: '1.2' }}>{resData ? resData.kpi_best_policy : '--'}</h2>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Policy tốt nhất eval</p>
        </div>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #dc2626', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '30px', margin: '0 0 5px 0', fontWeight: 'bold', color: '#dc2626' }}>{resData ? formatSmart(resData.kpi_vn_reward) : '--'}</h2>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Reward VN 2026</p>
        </div>
      </div>

      {/* Dòng 1: Form & Bảng Action + Learning Curve */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2.8fr', gap: '25px', marginBottom: '30px' }}>
        
        {/* Cột trái: Form và Không gian hành động */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', color: '#0f172a', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>⚙️ Tham số Q-learning</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#475569', fontWeight: '600' }}>Episodes</label>
                  <input type="number" step="500" value={inputs.episodes} onChange={e => handleInputChange('episodes', e.target.value)} style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', marginTop: '6px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#475569', fontWeight: '600' }}>Eval episodes</label>
                  <input type="number" step="50" value={inputs.eval_episodes} onChange={e => handleInputChange('eval_episodes', e.target.value)} style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', marginTop: '6px', outline: 'none' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div><label style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>&alpha;</label><input type="number" step="0.01" value={inputs.alpha} onChange={e => handleInputChange('alpha', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', marginTop: '4px', outline: 'none' }} /></div>
                <div><label style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>&gamma;</label><input type="number" step="0.01" value={inputs.gamma} onChange={e => handleInputChange('gamma', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', marginTop: '4px', outline: 'none' }} /></div>
                <div><label style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>Seed</label><input type="number" step="1" value={inputs.seed} onChange={e => handleInputChange('seed', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', marginTop: '4px', outline: 'none' }} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div><label style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>&epsilon; start</label><input type="number" step="0.05" value={inputs.eps_start} onChange={e => handleInputChange('eps_start', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', marginTop: '4px', outline: 'none' }} /></div>
                <div><label style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>&epsilon; end</label><input type="number" step="0.01" value={inputs.eps_end} onChange={e => handleInputChange('eps_end', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', marginTop: '4px', outline: 'none' }} /></div>
                <div><label style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>&epsilon; decay</label><input type="number" step="500" value={inputs.eps_decay_episodes} onChange={e => handleInputChange('eps_decay_episodes', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', marginTop: '4px', outline: 'none' }} /></div>
              </div>
            </div>
            <button onClick={calculateQLearning} disabled={loading} style={{ width: '100%', marginTop: '25px', background: 'linear-gradient(to right, #2563eb, #1d4ed8)', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'opacity 0.2s', opacity: loading ? 0.7 : 1 }}>
              {loading ? '⏳ Đang huấn luyện Agent...' : '▶ Train Q-learning'}
            </button>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
            <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '15px', fontWeight: '600' }}>Không gian hành động (Action Space)</h4>
            <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', backgroundColor: '#f1f5f9' }}>
                  <th style={{ padding: '10px', borderRadius: '6px 0 0 0' }}>Action</th>
                  <th style={{ padding: '10px' }}>K</th>
                  <th style={{ padding: '10px' }}>D</th>
                  <th style={{ padding: '10px' }}>AI</th>
                  <th style={{ padding: '10px', borderRadius: '0 6px 0 0' }}>H</th>
                </tr>
              </thead>
              <tbody>
                {(resData?.action_table || []).map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: i % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                    <td style={{ padding: '10px', fontWeight: '600', color: '#0f172a' }}>{row.action}</td>
                    <td style={{ padding: '10px', color: '#475569' }}>{row.k}</td>
                    <td style={{ padding: '10px', color: '#475569' }}>{row.d}</td>
                    <td style={{ padding: '10px', color: '#475569' }}>{row.ai}</td>
                    <td style={{ padding: '10px', color: '#475569' }}>{row.h}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cột phải: Learning Curve */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '20px', fontWeight: '600' }}>📈 Learning curve (Đường cong học tập)</h4>
          <div style={{ width: '100%', height: 450 }}>
            <ResponsiveContainer>
              <LineChart data={resData?.learning_curve || []} margin={{ top: 10, right: 10, left: 0, bottom: 15 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="episode" stroke="#475569" fontSize={12} fontWeight="bold" label={{ value: 'Episode', position: 'insideBottom', offset: -10, fill: '#475569' }} />
                <YAxis stroke="#475569" fontSize={12} fontWeight="bold" domain={[-1.6, -1.25]} label={{ value: 'Average reward', angle: -90, position: 'insideLeft', fill: '#475569' }} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ color: '#1e293b' }} />
                <Line type="linear" dataKey="reward" stroke="#0ea5e9" strokeWidth={3} dot={false} name="Reward trung bình mỗi 100 episodes" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {isCalculated && resData && (
        <>
          {/* Dòng 2: So sánh Policy & Action Count */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr', gap: '25px', marginBottom: '30px' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '20px', fontWeight: '600' }}>📊 So sánh π* với Rule-based Policies</h4>
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                  <BarChart data={resData.eval_table || []} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="policy" stroke="#475569" fontSize={12} fontWeight="bold" />
                    <YAxis stroke="#475569" fontSize={12} fontWeight="bold" label={{ value: 'Reward tích lũy trung bình', angle: -90, position: 'insideLeft', fill: '#475569' }} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px' }} formatter={(val) => [formatSmart(val), "Reward"]} />
                    <Legend wrapperStyle={{ color: '#1e293b' }} />
                    <Bar dataKey="avg" fill="#059669" name="Average cumulative reward" barSize={70} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '20px', fontWeight: '600' }}>📊 Tần suất Action được chọn trong 81 trạng thái</h4>
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                  <BarChart data={resData.action_count_chart || []} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="action" stroke="#475569" fontSize={12} fontWeight="bold" />
                    <YAxis stroke="#475569" fontSize={12} fontWeight="bold" label={{ value: 'Số trạng thái', angle: -90, position: 'insideLeft', fill: '#475569' }} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                    <Legend wrapperStyle={{ color: '#1e293b' }} />
                    <Bar dataKey="count" fill="#0ea5e9" name="Số trạng thái chọn action" barSize={55} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bảng Policy Sample */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #d97706', borderRadius: '8px', padding: '20px', marginBottom: '30px', overflowX: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '15px', fontWeight: '600' }}>📋 Chính sách π*(s) tại 5 trạng thái khởi đầu điển hình</h4>
            <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', backgroundColor: '#f1f5f9' }}>
                  <th style={{ padding: '12px 10px', borderRadius: '6px 0 0 0' }}>Trạng thái</th>
                  <th style={{ padding: '12px 10px' }}>Mô tả</th>
                  <th style={{ padding: '12px 10px' }}>π*(s)</th>
                  <th style={{ padding: '12px 10px' }}>Phân bổ K-D-AI-H</th>
                  <th style={{ padding: '12px 10px', borderRadius: '0 6px 0 0' }}>Q max</th>
                </tr>
              </thead>
              <tbody>
                {(resData.policy_sample_table || []).map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: i % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 'bold', color: '#0f172a' }}>{row.state}</td>
                    <td style={{ padding: '12px 10px', color: '#475569' }}>{row.desc}</td>
                    <td style={{ padding: '12px 10px', fontWeight: 'bold', color: '#0284c7' }}>{row.policy}</td>
                    <td style={{ padding: '12px 10px', color: '#475569' }}>{row.alloc}</td>
                    <td style={{ padding: '12px 10px', color: '#d97706', fontWeight: 'bold' }}>{formatSmart(row.q_max, 0, 4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Dòng cuối: Trajectory Table & Eval Table */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1.3fr', gap: '25px', marginBottom: '30px' }}>
            
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #0284c7', borderRadius: '8px', padding: '20px', overflowX: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '15px', fontWeight: '600' }}>📋 Quỹ đạo mô phỏng VN 2026 theo π*</h4>
              <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', backgroundColor: '#f1f5f9' }}>
                    <th style={{ padding: '10px', borderRadius: '6px 0 0 0' }}>Năm</th>
                    <th style={{ padding: '10px' }}>State</th>
                    <th style={{ padding: '10px' }}>Action</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>Reward</th>
                    <th style={{ padding: '10px' }}>GDP growth</th>
                    <th style={{ padding: '10px', borderRadius: '0 6px 0 0' }}>U risk</th>
                  </tr>
                </thead>
                <tbody>
                  {(resData.trajectory_table || []).map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: i % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                      <td style={{ padding: '10px', fontWeight: 'bold', color: '#0f172a' }}>{row.year}</td>
                      <td style={{ padding: '10px', color: '#475569' }}>{row.state}</td>
                      <td style={{ padding: '10px', fontWeight: 'bold', color: '#0ea5e9' }}>{row.action}</td>
                      <td style={{ padding: '10px', textAlign: 'right', fontWeight: '500', color: '#059669' }}>{formatSmart(row.reward)}</td>
                      <td style={{ padding: '10px', color: '#475569' }}>{row.gdp_growth}</td>
                      <td style={{ padding: '10px', color: '#475569' }}>{row.u_risk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #dc2626', borderRadius: '8px', padding: '20px', overflowX: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '15px', fontWeight: '600' }}>📋 Kết quả đánh giá chính sách (100 runs)</h4>
              <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', backgroundColor: '#f1f5f9' }}>
                    <th style={{ padding: '10px', borderRadius: '6px 0 0 0' }}>Policy</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>Avg reward</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>Std</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>Min</th>
                    <th style={{ padding: '10px', textAlign: 'right', borderRadius: '0 6px 0 0' }}>Max</th>
                  </tr>
                </thead>
                <tbody>
                  {(resData.eval_table || []).map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: i % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                      <td style={{ padding: '10px', fontWeight: 'bold', color: '#0f172a' }}>{row.policy}</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#059669', fontWeight: '600' }}>{formatSmart(row.avg)}</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#475569' }}>{formatSmart(row.std)}</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#dc2626' }}>{formatSmart(row.min)}</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#0284c7' }}>{formatSmart(row.max)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 11.4 Nhận xét và hàm ý chính sách */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #0284c7', borderRadius: '8px', padding: '25px', marginBottom: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', color: '#0f172a', marginBottom: '20px', fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🏛️</span> 11.4. Nhận xét và Hàm ý chính sách (Học Tăng Cường Q-Learning)
            </h3>
            
            <div style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.8' }}>
              
              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <b style={{ color: '#0284c7', fontSize: '14.5px', display: 'block', marginBottom: '8px' }}>
                  a) Khi nền kinh tế ở trạng thái (GDP growth thấp, D thấp, U cao), chính sách &pi;*(s) chọn hành động gì? Có khớp với “quick win” không?
                </b>
                <p style={{ margin: 0, textAlign: 'justify' }}>
                  <b style={{ color: '#0f172a' }}>Hành động của &pi;*(s):</b> Tại trạng thái đình đốn (Tăng trưởng thấp, Hạ tầng số kém, Thất nghiệp cao), thuật toán Q-Learning sẽ luôn học được cách chọn hành động <b style={{ color: '#0f172a' }}>"Bơm vốn mồi cơ sở" (Tập trung toàn lực vào D và H)</b> thay vì phiêu lưu vào công nghệ lõi AI.<br />
                  <b style={{ color: '#0f172a' }}>Sự phù hợp với "Quick Win":</b> Hoàn toàn khớp với chiến lược "Quick Win" (Thắng lợi nhanh). Khi U cao, ưu tiên sinh tử của Chính phủ là tạo việc làm. Việc giải ngân vào Hạ tầng số cơ bản (D) - như kéo cáp quang, xây trạm 5G - là các dự án thâm dụng lao động, giúp hấp thụ ngay lập tức lượng người thất nghiệp. Đồng thời, việc chi cho Đào tạo (H) tạo ra nguồn thu nhập hỗ trợ an sinh, sinh ra <i>"Hiệu ứng số nhân" (Multiplier Effect)</i> kích cầu tiêu dùng nội địa, giúp GDP thoát đáy nhanh chóng. Nhảy cóc đầu tư AI lúc này là tự sát vĩ mô vì hạ tầng (D) chưa đủ để hấp thụ công nghệ.
                </p>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <b style={{ color: '#059669', fontSize: '14.5px', display: 'block', marginBottom: '8px' }}>
                  b) Khi GDP growth cao, AI cao, U thấp - chính sách chọn gì? Phù hợp với “consolidation” không?
                </b>
                <p style={{ margin: 0, textAlign: 'justify' }}>
                  <b style={{ color: '#0f172a' }}>Hành động của &pi;*(s):</b> Khi nền kinh tế đang bùng nổ (Toàn dụng lao động U thấp, AI phát triển mạnh, GDP tăng nóng), chính sách tối ưu &pi;*(s) sẽ đột ngột chuyển pha sang hành động <b style={{ color: '#0f172a' }}>"Tích lũy phòng vệ" hoặc "Kiểm soát rủi ro"</b> (giảm tỷ trọng K/AI, tăng ngân sách dự phòng và rà soát an ninh mạng).<br />
                  <b style={{ color: '#0f172a' }}>Sự phù hợp với "Consolidation":</b> Rất phù hợp với nguyên lý "Consolidation" (Củng cố hệ thống). Khi nền kinh tế chạy ở công suất tối đa, việc tiếp tục bơm tiền kích thích AI sẽ chỉ gây ra lạm phát chi phí, bong bóng công nghệ và làm cạn kiệt nguồn nhân lực chất lượng cao. Thuật toán hiểu rằng "phần thưởng" (Reward) thu thêm từ việc cố đẩy GDP lên cao hơn nữa sẽ bị triệt tiêu bởi "hình phạt" (Penalty) do rủi ro sụp đổ hệ thống (Cyber-risk) hoặc khủng hoảng khí thải. Do đó, củng cố hệ thống là bước đi khôn ngoan nhất để bảo vệ thành quả.
                </p>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <b style={{ color: '#d97706', fontSize: '14.5px', display: 'block', marginBottom: '8px' }}>
                  c) “AI không thay thế quyết định chính trị - xã hội”. Em sẽ tích hợp &pi;* vào quy trình hoạch định chính sách Việt Nam thế nào?
                </b>
                <p style={{ margin: 0, textAlign: 'justify' }}>
                  <b style={{ color: '#0f172a' }}>Cơ chế Human-in-the-loop (Con người trong vòng lặp):</b> Để không vi phạm nguyên tắc tối thượng này, chính sách &pi;*(s) sinh ra từ AI chỉ được đóng vai trò là một <b style={{ color: '#0f172a' }}>"Hệ thống tham mưu siêu tốc" (Decision Support System)</b>, tuyệt đối không phải là cơ chế "Tự động ra lệnh" (Auto-pilot).<br />
                  <b style={{ color: '#0f172a' }}>Quy trình tích hợp thực tiễn:</b> <br />
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