import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Bai12() {
  const [inputs, setInputs] = useState({
    annual_budget: 1000
  });

  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleInputChange = (field, val) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(val) || 0 }));
  };

  const calculateIntegrated = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch('http://localhost:8000/api/bai12/calculate', {
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
          alert("Lỗi mô hình tích hợp AIDEOM-VN.");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi:", err);
        setLoading(false);
      });
  };

  const formatTableNumber = (num, decimals = 4) => {
    if (num === undefined || num === null) return "--";
    let parts = num.toFixed(decimals).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(',');
  };

  // Component Nút điều hướng kiểu dáng Segmented Pill hiện đại
  const PillButton = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        padding: '10px 24px',
        backgroundColor: activeTab === id ? '#ffffff' : 'transparent',
        color: activeTab === id ? '#2563eb' : '#64748b',
        border: 'none',
        borderRadius: '20px',
        fontWeight: activeTab === id ? 'bold' : '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: activeTab === id ? '0 4px 10px rgba(0,0,0,0.08)' : 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        outline: 'none'
      }}
    >
      <span>{icon}</span> {label}
    </button>
  );

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '30px', color: '#334155' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* --- HEADER & CONTROL PANEL (HỢP NHẤT) --- */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '30px', marginBottom: '30px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ display: 'inline-block', backgroundColor: '#eff6ff', color: '#2563eb', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px', letterSpacing: '0.5px' }}>
                GIAI ĐOẠN 4
              </div>
              <h1 style={{ fontSize: '28px', margin: 0, fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
                HỆ SINH THÁI TÍCH HỢP AIDEOM-VN
              </h1>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '8px 0 0 0' }}>
                Mô hình ra quyết định tự hành đa kịch bản (Macro, AI Readiness, Labor, Risk).
              </p>
            </div>

            {/* Khối Form Control đặt ngang hàng với Tiêu đề */}
            <form onSubmit={calculateIntegrated} style={{ display: 'flex', gap: '15px', alignItems: 'center', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                  Ngân sách mô phỏng (Tỷ VNĐ)
                </label>
                <input
                  type="number"
                  step="100"
                  value={inputs.annual_budget}
                  onChange={e => handleInputChange('annual_budget', e.target.value)}
                  style={{ width: '180px', height: '40px', padding: '0 15px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#0f172a', fontWeight: 'bold', outline: 'none', fontSize: '15px' }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{ height: '40px', marginTop: '18px', padding: '0 25px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)' }}
              >
                {loading ? '⏳ ĐANG XỬ LÝ...' : '🚀 CHẠY MÔ HÌNH'}
              </button>
            </form>
          </div>
        </div>

        {/* --- GLOBAL KPIs (Thẻ nổi mềm mại) --- */}
        {isCalculated && resData && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '16px', backgroundColor: '#eff6ff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px' }}>🎯</div>
              <div>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Tối ưu Cân bằng</p>
                <h2 style={{ fontSize: '26px', margin: '4px 0 0 0', fontWeight: '900', color: '#2563eb' }}>{resData.kpi_best}</h2>
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '16px', backgroundColor: '#ecfdf5', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px' }}>📈</div>
              <div>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: '600' }}>GDP Cao nhất</p>
                <h2 style={{ fontSize: '26px', margin: '4px 0 0 0', fontWeight: '900', color: '#059669' }}>{resData.kpi_gdp}</h2>
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '16px', backgroundColor: '#fffbeb', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px' }}>🛡️</div>
              <div>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Rủi ro Thấp nhất</p>
                <h2 style={{ fontSize: '26px', margin: '4px 0 0 0', fontWeight: '900', color: '#d97706' }}>{resData.kpi_risk}</h2>
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '16px', backgroundColor: '#fef2f2', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px' }}>👥</div>
              <div>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Lao động Tốt nhất</p>
                <h2 style={{ fontSize: '26px', margin: '4px 0 0 0', fontWeight: '900', color: '#dc2626' }}>{resData.kpi_labor}</h2>
              </div>
            </div>
          </div>
        )}

        {isCalculated && resData && (
          <>
            {/* --- MENU ĐIỀU HƯỚNG TRUNG TÂM (SEGMENTED CONTROL) --- */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
              <div style={{ display: 'inline-flex', backgroundColor: '#e2e8f0', padding: '6px', borderRadius: '25px', gap: '5px' }}>
                <PillButton id="overview" label="Tổng quan" icon="🧭" />
                <PillButton id="allocation" label="Phân bổ Vốn" icon="💰" />
                <PillButton id="scenario" label="Ma trận Kịch bản" icon="📊" />
                <PillButton id="risk" label="Kiểm soát Rủi ro" icon="🚨" />
              </div>
            </div>

            {/* =========================================================
                TAB 1: TỔNG QUAN
            ========================================================= */}
            {activeTab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', animation: 'fadeIn 0.4s' }}>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.04)' }}>
                  <h4 style={{ fontSize: '16px', color: '#0f172a', marginBottom: '25px', fontWeight: '800' }}>So sánh Điểm Cân bằng 5 Kịch bản</h4>
                  <div style={{ width: '100%', height: 320 }}>
                    <ResponsiveContainer>
                      <BarChart data={resData.scenario_table}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="id" stroke="#64748b" fontSize={13} fontWeight="bold" axisLine={false} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="score" fill="#6366f1" name="Điểm tổng hợp" barSize={60} radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.04)' }}>
                  <h4 style={{ fontSize: '16px', color: '#0f172a', marginBottom: '20px', fontWeight: '800' }}>Cấu trúc 6 Module Cốt lõi</h4>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ color: '#94a3b8', borderBottom: '2px solid #f1f5f9' }}>
                          <th style={{ padding: '15px 10px', fontWeight: 'bold' }}>ID</th>
                          <th style={{ padding: '15px 10px', fontWeight: 'bold' }}>Tên Phân hệ</th>
                          <th style={{ padding: '15px 10px', fontWeight: 'bold' }}>Công nghệ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resData.module_table.map((row, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <td style={{ padding: '15px 10px', fontWeight: '800', color: '#3b82f6' }}>{row.id}</td>
                            <td style={{ padding: '15px 10px', color: '#1e293b', fontWeight: '600' }}>{row.name}</td>
                            <td style={{ padding: '15px 10px', color: '#64748b' }}>{row.tech}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Khối Nhận xét chung nằm trải dài phía dưới */}
                <div style={{ gridColumn: '1 / -1', backgroundColor: '#1e293b', borderRadius: '24px', padding: '35px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', color: '#f8fafc' }}>
                  <h3 style={{ fontSize: '18px', color: '#38bdf8', margin: '0 0 20px 0', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>💡</span> Tầm nhìn Chiến lược AIDEOM-VN
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '14.5px', lineHeight: '1.8', color: '#cbd5e1' }}>
                    <p style={{ margin: 0 }}>
                      Mô hình chứng minh rằng kịch bản <b>S5 (Tối ưu cân bằng)</b> là sự lựa chọn hoàn hảo nhất cho bối cảnh Việt Nam. S5 không theo đuổi GDP cực đoan như S3 (đẩy mạnh AI nhưng gây thảm họa việc làm), mà trích xuất 30% ngân sách cho <b>Vốn Nhân lực (H)</b>.
                    </p>
                    <p style={{ margin: 0 }}>
                      Lớp đệm nhân lực số này hấp thụ toàn bộ cú sốc sa thải từ tự động hóa, đồng thời tạo ra hiệu ứng lan tỏa (Spillover Effect) giúp tỷ suất sinh lời của Hạ tầng số (D) và Trí tuệ nhân tạo (AI) được cộng hưởng mạnh mẽ hơn trong dài hạn.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================
                TAB 2: PHÂN BỔ VỐN
            ========================================================= */}
            {activeTab === 'allocation' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', animation: 'fadeIn 0.4s' }}>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.04)' }}>
                  <h4 style={{ fontSize: '16px', color: '#0f172a', marginBottom: '25px', fontWeight: '800' }}>Tỷ trọng Phân bổ K-D-AI-H</h4>
                  <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                      <BarChart data={resData.scenario_table}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="id" stroke="#64748b" fontSize={13} fontWeight="bold" axisLine={false} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                        <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: '20px' }} />
                        <Bar dataKey="k" stackId="a" fill="#94a3b8" name="Vật chất (K)" barSize={60} />
                        <Bar dataKey="d" stackId="a" fill="#3b82f6" name="Hạ tầng (D)" />
                        <Bar dataKey="ai" stackId="a" fill="#f59e0b" name="Công nghệ (AI)" />
                        <Bar dataKey="h" stackId="a" fill="#10b981" name="Nhân lực (H)" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.04)' }}>
                  <h4 style={{ fontSize: '16px', color: '#0f172a', marginBottom: '25px', fontWeight: '800' }}>Quỹ đạo GDP Mô phỏng (2026 - 2030)</h4>
                  <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                      <LineChart data={resData.trajectory_chart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="year" stroke="#64748b" fontSize={13} fontWeight="bold" axisLine={false} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={12} domain={[350, 385]} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                        <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: '20px' }} />
                        <Line type="monotone" dataKey="S1" stroke="#cbd5e1" strokeWidth={3} dot={false} name="S1" />
                        <Line type="monotone" dataKey="S2" stroke="#93c5fd" strokeWidth={3} dot={false} name="S2" />
                        <Line type="monotone" dataKey="S3" stroke="#fcd34d" strokeWidth={3} dot={false} name="S3" />
                        <Line type="monotone" dataKey="S4" stroke="#a78bfa" strokeWidth={3} dot={false} name="S4" />
                        <Line type="monotone" dataKey="S5" stroke="#10b981" strokeWidth={4} dot={{ r: 4, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} name="S5 (Tối ưu)" activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================
                TAB 3: MA TRẬN KỊCH BẢN
            ========================================================= */}
            {activeTab === 'scenario' && (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.04)', overflowX: 'auto', animation: 'fadeIn 0.4s' }}>
                <h4 style={{ fontSize: '16px', color: '#0f172a', marginBottom: '20px', fontWeight: '800' }}>Bảng Phân tích Tham số Đa chiều (Đến năm 2030)</h4>
                <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1100px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                      <th style={{ padding: '16px 12px', fontWeight: 'bold' }}>Kịch bản</th>
                      <th style={{ padding: '16px 12px', fontWeight: 'bold' }}>Cơ cấu (K-D-AI-H)</th>
                      <th style={{ padding: '16px 12px', fontWeight: 'bold' }}>Y (Sản lượng)</th>
                      <th style={{ padding: '16px 12px', fontWeight: 'bold' }}>Digital Index</th>
                      <th style={{ padding: '16px 12px', fontWeight: 'bold' }}>AI Ready</th>
                      <th style={{ padding: '16px 12px', fontWeight: 'bold' }}>NetJob</th>
                      <th style={{ padding: '16px 12px', fontWeight: 'bold' }}>Rủi ro</th>
                      <th style={{ padding: '16px 12px', fontWeight: 'bold' }}>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resData.scenario_table.map((row, i) => {
                      const isBest = row.id === 'S5';
                      return (
                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: isBest ? '#f0fdf4' : 'transparent', transition: 'all 0.2s' }}>
                          <td style={{ padding: '16px 12px', fontWeight: '800', color: isBest ? '#059669' : '#0f172a' }}>
                            {row.name} {isBest && '🌟'}
                          </td>
                          <td style={{ padding: '16px 12px', color: '#475569' }}>
                            <span style={{ color: '#94a3b8' }}>{row.k}%</span> - <span style={{ color: '#3b82f6' }}>{row.d}%</span> - <span style={{ color: '#f59e0b' }}>{row.ai}%</span> - <span style={{ color: '#10b981' }}>{row.h}%</span>
                          </td>
                          <td style={{ padding: '16px 12px', fontWeight: '600', color: '#1e293b' }}>{formatTableNumber(row.y2030, 2)}</td>
                          <td style={{ padding: '16px 12px', color: '#64748b' }}>{formatTableNumber(row.dig_idx, 3)}</td>
                          <td style={{ padding: '16px 12px', color: '#64748b' }}>{formatTableNumber(row.ai_ready, 3)}</td>
                          <td style={{ padding: '16px 12px', fontWeight: 'bold', color: row.net_job < 0 ? '#ef4444' : '#10b981' }}>
                            {row.net_job > 0 ? '+' : ''}{formatTableNumber(row.net_job, 2)}
                          </td>
                          <td style={{ padding: '16px 12px', color: '#64748b' }}>
                            <span style={{ padding: '4px 10px', borderRadius: '12px', backgroundColor: row.risk_text.includes('Cao') ? '#fee2e2' : row.risk_text.includes('Trung bình') ? '#fef3c7' : '#ecfdf5', color: row.risk_text.includes('Cao') ? '#b91c1c' : row.risk_text.includes('Trung bình') ? '#b45309' : '#047857', fontSize: '12px', fontWeight: 'bold' }}>
                              {row.risk_text}
                            </span>
                          </td>
                          <td style={{ padding: '16px 12px', fontWeight: '900', color: isBest ? '#059669' : '#6366f1', fontSize: '15px' }}>
                            {formatTableNumber(row.score, 4)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* =========================================================
                TAB 4: KIỂM SOÁT RỦI RO
            ========================================================= */}
            {activeTab === 'risk' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', animation: 'fadeIn 0.4s' }}>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.04)' }}>
                  <h4 style={{ fontSize: '16px', color: '#0f172a', marginBottom: '25px', fontWeight: '800' }}>Biểu đồ Mật độ Rủi ro (Risk Density)</h4>
                  <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                      <BarChart data={resData.risk_chart}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="scenario" stroke="#64748b" fontSize={13} fontWeight="bold" axisLine={false} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={12} domain={[0, 60]} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                        <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: '20px' }} />
                        <Bar dataKey="cyber" fill="#3b82f6" name="An ninh mạng" barSize={30} stackId="r" />
                        <Bar dataKey="emission" fill="#ef4444" name="Phát thải" barSize={30} stackId="r" />
                        <Bar dataKey="dep" fill="#f59e0b" name="Phụ thuộc FDI" barSize={30} stackId="r" radius={[8, 8, 0, 0]} />
                        {/* Ẩn Bar tổng điểm để chart stack gọn gàng hơn, dùng tooltip để xem tổng */}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.04)' }}>
                  <h4 style={{ fontSize: '16px', color: '#0f172a', marginBottom: '20px', fontWeight: '800' }}>Khuyến nghị Định tuyến Chính sách</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {resData.recommendation_table.map((row, i) => {
                      const isS5 = row.scenario === 'S5';
                      return (
                        <div key={i} style={{ padding: '16px', borderRadius: '12px', backgroundColor: isS5 ? '#f0fdf4' : '#f8fafc', border: `1px solid ${isS5 ? '#a7f3d0' : '#e2e8f0'}`, display: 'flex', gap: '15px' }}>
                          <div style={{ fontWeight: '900', color: isS5 ? '#059669' : '#475569', fontSize: '16px', minWidth: '35px' }}>
                            {row.scenario}
                          </div>
                          <div style={{ fontSize: '14px', color: '#334155', lineHeight: '1.6' }}>
                            {row.recom}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Khối Future Works trải dài dưới cùng của tab Risk */}
                <div style={{ gridColumn: '1 / -1', backgroundColor: '#f8fafc', borderRadius: '24px', padding: '35px', border: '1px dashed #cbd5e1' }}>
                  <h3 style={{ fontSize: '18px', color: '#6366f1', margin: '0 0 20px 0', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>🚀</span> Định hướng Tương lai (Future Works)
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', fontSize: '14px', color: '#475569', lineHeight: '1.7' }}>
                    <div>
                      <b style={{ color: '#1e293b', display: 'block', marginBottom: '5px' }}>1. Mở rộng Hệ thống DSGE-AI:</b>
                      Nhúng AIDEOM-VN vào khung cân bằng tổng thể ngẫu nhiên động (DSGE). Nội sinh hóa Lạm phát, Lãi suất và Cú sốc công nghệ để mô phỏng cơ chế thanh toán bù trừ thị trường chuẩn xác hơn.
                    </div>
                    <div>
                      <b style={{ color: '#1e293b', display: 'block', marginBottom: '5px' }}>2. Dữ liệu Thời gian thực (Real-time API):</b>
                      Xây dựng Data Pipelines kết nối trực tiếp Open Data Portal. Dùng bộ lọc Kalman (Kalman Filter) cập nhật các hệ số kỹ thuật số tự động, biến AIDEOM thành Bản sao số (Digital Twin).
                    </div>
                    <div>
                      <b style={{ color: '#1e293b', display: 'block', marginBottom: '5px' }}>3. Multi-Agent Reinforcement Learning (MARL):</b>
                      Đưa nhiều Agent vào quy hoạch (Bộ Tài chính, Bộ LĐTBXH, Bộ TTTT) để tương tác và tìm điểm cân bằng Nash thay vì một Agent tổng thể, sát với thực tiễn thương thuyết chính sách.
                    </div>
                    <div>
                      <b style={{ color: '#1e293b', display: 'block', marginBottom: '5px' }}>4. Ứng dụng xuất bản Khoa học (SCIE):</b>
                      Lõi tối ưu NSGA-II và Mô phỏng LP việc làm có đủ hàm lượng học thuật để xuất bản Q2/Q3 quốc tế về chủ đề <i>"Tối ưu hóa chuyển dịch lao động trong kỷ nguyên AI"</i>.
                    </div>
                  </div>
                </div>

              </div>
            )}

            <br></br>
            {/* 12.6 ĐỊNH HƯỚNG PHÁT TRIỂN TƯƠNG LAI CỦA ĐỒ ÁN */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #8b5cf6', borderRadius: '8px', padding: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '16px', color: '#0f172a', marginBottom: '20px', fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>🚀</span> 12.6. Định hướng phát triển và Nâng cấp mô hình (Future Works)
              </h3>

              <div style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.8' }}>

                <div style={{ backgroundColor: '#faf5ff', padding: '20px', borderRadius: '8px', border: '1px solid #e9d5ff', marginBottom: '20px' }}>
                  <b style={{ color: '#7e22ce', fontSize: '14.5px', display: 'block', marginBottom: '8px' }}>
                    a) Công bố quốc tế (SCIE Q2-Q3) dựa trên use-case thực tiễn (Ví dụ: Ngành Chế biến chế tạo):
                  </b>
                  <p style={{ margin: 0, textAlign: 'justify' }}>
                    Mô hình AIDEOM-VN cung cấp một nền tảng định lượng mạnh mẽ để xây dựng các bài báo học thuật đạt chuẩn Q2/Q3 (trên các tạp chí như <i>Socio-Economic Planning Sciences</i> hoặc <i>Technological Forecasting and Social Change</i>). <br />
                    <b style={{ color: '#0f172a' }}>Đề xuất đề tài:</b> "Tối ưu hóa chuyển dịch công nghệ và phân bổ lao động: Khung phân tích đa mục tiêu ứng dụng cho ngành Chế biến chế tạo Việt Nam". <br />
                    Bài báo sẽ cô lập và trích xuất trực tiếp Module M3 (Tối ưu Pareto NSGA-II) và Module M5 (Mô phỏng NetJob bằng quy hoạch tuyến tính) để chứng minh tính hiệu quả của chính sách "kép" (vừa kích thích năng suất AI, vừa bảo hộ an sinh thông qua đào tạo lại) trước các cú sốc tự động hóa.
                  </p>
                </div>

                <div style={{ backgroundColor: '#faf5ff', padding: '20px', borderRadius: '8px', border: '1px solid #e9d5ff', marginBottom: '20px' }}>
                  <b style={{ color: '#7e22ce', fontSize: '14.5px', display: 'block', marginBottom: '8px' }}>
                    b) Mở rộng hệ thống sang mô hình Cân bằng Tổng thể (CGE) hoặc DSGE-AI:
                  </b>
                  <p style={{ margin: 0, textAlign: 'justify' }}>
                    AIDEOM-VN hiện tại đang sử dụng các mô hình tối ưu hóa định lượng và quy hoạch động từng phần. Để mô phỏng được sự <b style={{ color: '#0f172a' }}>cân bằng tổng thể</b> của cả nền kinh tế, định hướng tiếp theo là nhúng mô hình vào khung <b style={{ color: '#0f172a' }}>DSGE</b> (Dynamic Stochastic General Equilibrium) tích hợp biến công nghệ AI. <br />
                    Khi đó, các biến số vĩ mô như Lạm phát, Lãi suất, Mức lương thực tế và Cú sốc năng suất công nghệ sẽ được nội sinh hóa. Cơ chế thị trường (thanh toán bù trừ - market clearing) sẽ tự động điều chỉnh khi có sự can thiệp từ ngân sách Chính phủ, giúp dự báo chính xác hơn phản ứng của thị trường tự do.
                  </p>
                </div>

                <div style={{ backgroundColor: '#faf5ff', padding: '20px', borderRadius: '8px', border: '1px solid #e9d5ff', marginBottom: '20px' }}>
                  <b style={{ color: '#7e22ce', fontSize: '14.5px', display: 'block', marginBottom: '8px' }}>
                    c) Tích hợp dữ liệu thời gian thực (Real-time Data Integration):
                  </b>
                  <p style={{ margin: 0, textAlign: 'justify' }}>
                    Thay vì sử dụng các tham số tĩnh để mô phỏng định kỳ theo năm, hệ thống AIDEOM-VN có thể được nâng cấp bằng cách xây dựng các API Pipelines kết nối trực tiếp với <i>Open Data Portal Việt Nam</i>, dữ liệu vĩ mô từ <i>Vietstock</i>, và dữ liệu xuất nhập khẩu của <i>Tổng cục Hải quan</i>. <br />
                    Bằng cách áp dụng bộ lọc Kalman (Kalman Filter) hoặc thuật toán cập nhật Bayes (Bayesian Updating), mô hình sẽ tự động hiệu chỉnh (calibrate) các hệ số kỹ thuật số và rủi ro lao động theo <b style={{ color: '#0f172a' }}>tần suất tháng/quý</b>. Điều này sẽ biến AIDEOM-VN thành một <b style={{ color: '#0f172a' }}>Bản sao số (Digital Twin)</b> thực thụ phục vụ điều hành kinh tế vĩ mô.
                  </p>
                </div>

                <div style={{ backgroundColor: '#faf5ff', padding: '20px', borderRadius: '8px', border: '1px solid #e9d5ff' }}>
                  <b style={{ color: '#7e22ce', fontSize: '14.5px', display: 'block', marginBottom: '8px' }}>
                    d) Nâng cấp môi trường Học Tăng Cường thành Multi-Agent RL (MARL):
                  </b>
                  <p style={{ margin: 0, textAlign: 'justify' }}>
                    Môi trường Q-Learning ở Bài 11 hiện chỉ có một Agent duy nhất đóng vai trò là "Chính phủ tổng thể". Để phản ánh sát nhất sự phức tạp trong thực tế hoạch định chính sách, hệ thống có thể mở rộng thành <b style={{ color: '#0f172a' }}>Multi-Agent Reinforcement Learning (MARL)</b>. <br />
                    Trong đó, các Agent đại diện cho các cơ quan khác nhau: <b style={{ color: '#0f172a' }}>Agent 1 (Bộ Tài chính - MOF)</b> tập trung tối đa hóa thu ngân sách và GDP; <b style={{ color: '#0f172a' }}>Agent 2 (Bộ LĐ-TB&XH - MOLISA)</b> tập trung tối thiểu hóa thất nghiệp và phân bổ quỹ đào tạo; <b style={{ color: '#0f172a' }}>Agent 3 (Bộ TT&TT - MIC)</b> tối đa hóa chỉ số chuyển đổi số quốc gia. Các Agent này sẽ tương tác trong một trò chơi Hợp tác - Cạnh tranh (Cooperative-Competitive Game) thông qua các thuật toán nâng cao như MAPPO (Multi-Agent PPO) để tìm ra điểm cân bằng Nash trong chính sách công.
                  </p>
                </div>

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}