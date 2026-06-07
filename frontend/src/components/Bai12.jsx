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

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        padding: '10px 20px',
        backgroundColor: activeTab === id ? '#2563eb' : '#1e293b',
        color: activeTab === id ? '#ffffff' : '#94a3b8',
        border: 'none',
        borderRadius: '6px 6px 0 0',
        fontWeight: activeTab === id ? 'bold' : 'normal',
        cursor: 'pointer',
        marginRight: '5px',
        borderBottom: activeTab === id ? '2px solid #60a5fa' : '2px solid transparent',
        transition: 'all 0.2s'
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ color: '#ffffff', maxWidth: '1400px', margin: '0 auto', paddingBottom: '30px', fontFamily: 'sans-serif' }}>

      {/* Tiêu đề trang */}
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase' }}>BÀI 12 - ĐỒ ÁN TÍCH HỢP MÔ HÌNH AIDEOM-VN</h1>
      </div>

      {/* Mô hình toán học */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
        <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '15px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #232936', paddingBottom: '12px' }}>
          <span style={{ fontSize: '16px' }}>🔀</span> Mô hình tích hợp AIDEOM-VN
        </div>
        <div style={{ fontSize: '26px', color: '#fff', fontFamily: '"Times New Roman", Times, serif', marginBottom: '12px', marginTop: '15px' }}>
          AIDEOM-VN = M1 + M2 + M3 + M4 + M5 + M6
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
          Dashboard tích hợp 6 module: dự báo macro, đánh giá sẵn sàng số, tối ưu phân bổ, mô phỏng lao động, đánh giá rủi ro và hỗ trợ ra quyết định theo 5 kịch bản chính sách S1-S5.
        </p>
      </div>

      {/* 4 Khối KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '25px' }}>
        <div style={{ backgroundColor: '#0891b2', padding: '20px', borderRadius: '6px' }}>
          <h2 style={{ fontSize: '24px', margin: '0 0 5px 0', fontWeight: 'bold' }}>{resData ? resData.kpi_best : '--'}</h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#e0f2fe' }}>Kịch bản cân bằng tốt nhất</p>
        </div>
        <div style={{ backgroundColor: '#16a34a', padding: '20px', borderRadius: '6px' }}>
          <h2 style={{ fontSize: '24px', margin: '0 0 5px 0', fontWeight: 'bold' }}>{resData ? resData.kpi_gdp : '--'}</h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#d1fae5' }}>GDP cao nhất</p>
        </div>
        <div style={{ backgroundColor: '#eab308', padding: '20px', borderRadius: '6px' }}>
          <h2 style={{ fontSize: '24px', margin: '0 0 5px 0', fontWeight: 'bold', color: '#1e293b' }}>{resData ? resData.kpi_risk : '--'}</h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#475569' }}>Rủi ro thấp nhất</p>
        </div>
        <div style={{ backgroundColor: '#dc2626', padding: '20px', borderRadius: '6px' }}>
          <h2 style={{ fontSize: '24px', margin: '0 0 5px 0', fontWeight: 'bold' }}>{resData ? resData.kpi_labor : '--'}</h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#fee2e2' }}>Lao động tốt nhất</p>
        </div>
      </div>

      {/* Form Điều khiển */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', marginBottom: '25px', overflow: 'hidden' }}>
        <div style={{ backgroundColor: '#334155', padding: '12px 20px', borderBottom: '1px solid #232936' }}>
          <h3 style={{ margin: 0, fontSize: '15px', color: '#fff', fontWeight: '600' }}>Tham số chạy nguyên mẫu</h3>
        </div>
        <div style={{ padding: '20px' }}>
          <form onSubmit={calculateIntegrated} style={{ display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Ngân sách mô phỏng hằng năm, nghìn tỷ VND</label>
              <input
                type="number"
                step="100"
                value={inputs.annual_budget}
                onChange={e => handleInputChange('annual_budget', e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', height: '40px', padding: '0 12px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', outline: 'none' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', boxSizing: 'border-box', height: '40px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              >
                {loading ? '⏳ Đang tổng hợp...' : '▶ Chạy AIDEOM-VN tích hợp'}
              </button>
            </div>
            <div style={{ flex: 1.5, fontSize: '13px', color: '#94a3b8', lineHeight: '1.5', paddingBottom: '2px' }}>
              S1-S4 dùng phân bổ cố định. S5 được mô hình tự chọn theo điểm cân bằng GDP, số hóa, lao động và rủi ro.
            </div>
          </form>
        </div>
      </div>

      {isCalculated && resData && (
        <>
          {/* Hệ thống Tabs */}
          <div style={{ borderBottom: '2px solid #232936', marginBottom: '20px' }}>
            <TabButton id="overview" label="Tổng quan" />
            <TabButton id="allocation" label="Phân bổ" />
            <TabButton id="scenario" label="Kịch bản so sánh" />
            <TabButton id="risk" label="Cảnh báo rủi ro" />
          </div>

          {/* NỘI DUNG TAB 1: TỔNG QUAN */}
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '25px', animation: 'fadeIn 0.5s' }}>
              <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
                <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>So sánh 5 kịch bản theo điểm cân bằng</h4>
                <div style={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer>
                    <BarChart data={resData.scenario_table}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#232936" vertical={false} />
                      <XAxis dataKey="id" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} label={{ value: 'Balanced score', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff', border: '1px solid #334155' }} />
                      <Legend verticalAlign="top" height={36} />
                      <Bar dataKey="score" fill="#38bdf8" name="Điểm cân bằng" barSize={70} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', overflowX: 'auto' }}>
                <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '15px' }}>Cấu trúc 6 module AIDEOM-VN</h4>
                <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8', backgroundColor: '#0f172a' }}>
                      <th style={{ padding: '10px' }}>Module</th>
                      <th style={{ padding: '10px' }}>Tên</th>
                      <th style={{ padding: '10px' }}>Kỹ thuật</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resData.module_table.map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #232936', color: '#cbd5e1' }}>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{row.id}</td>
                        <td style={{ padding: '10px' }}>{row.name}</td>
                        <td style={{ padding: '10px' }}>{row.tech}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* NỘI DUNG TAB 2: PHÂN BỔ */}
          {activeTab === 'allocation' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px', animation: 'fadeIn 0.5s' }}>
              <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
                <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>Phân bổ K-D-AI-H theo 5 kịch bản</h4>
                <div style={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer>
                    <BarChart data={resData.scenario_table}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#232936" vertical={false} />
                      <XAxis dataKey="id" stroke="#94a3b8" fontSize={12} label={{ value: 'Kịch bản chính sách', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                      <YAxis stroke="#94a3b8" fontSize={12} label={{ value: 'Tỷ trọng phân bổ', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff', border: '1px solid #334155' }} />
                      <Legend verticalAlign="top" height={36} />
                      <Bar dataKey="k" stackId="a" fill="#93c5fd" name="K" barSize={70} />
                      <Bar dataKey="d" stackId="a" fill="#fca5a5" name="D" />
                      <Bar dataKey="ai" stackId="a" fill="#fdba74" name="AI" />
                      <Bar dataKey="h" stackId="a" fill="#fde047" name="H" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
                <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>Quỹ đạo GDP mô phỏng 2026-2030</h4>
                <div style={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer>
                    <LineChart data={resData.trajectory_chart} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                      <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} label={{ value: 'Năm', position: 'insideBottom', offset: -10, fill: '#94a3b8' }} />
                      <YAxis stroke="#94a3b8" fontSize={12} domain={[350, 385]} label={{ value: 'GDP mô phỏng', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff', border: '1px solid #334155' }} />
                      <Legend verticalAlign="top" height={36} />
                      <Line type="linear" dataKey="S1" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 3 }} name="S1" />
                      <Line type="linear" dataKey="S2" stroke="#f472b6" strokeWidth={2.5} dot={{ r: 3 }} name="S2" />
                      <Line type="linear" dataKey="S3" stroke="#fb923c" strokeWidth={2.5} dot={{ r: 3 }} name="S3" />
                      <Line type="linear" dataKey="S4" stroke="#facc15" strokeWidth={2.5} dot={{ r: 3 }} name="S4" />
                      <Line type="linear" dataKey="S5" stroke="#4ade80" strokeWidth={2.5} dot={{ r: 3 }} name="S5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* NỘI DUNG TAB 3: KỊCH BẢN SO SÁNH */}
          {activeTab === 'scenario' && (
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '25px', overflowX: 'auto', animation: 'fadeIn 0.5s' }}>
              <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '15px' }}>Bảng tổng hợp kết quả 2030 cho 5 kịch bản</h4>
              <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1100px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8', backgroundColor: '#0f172a' }}>
                    <th style={{ padding: '12px' }}>Kịch bản</th>
                    <th style={{ padding: '12px' }}>K</th>
                    <th style={{ padding: '12px' }}>D</th>
                    <th style={{ padding: '12px' }}>AI</th>
                    <th style={{ padding: '12px' }}>H</th>
                    <th style={{ padding: '12px' }}>Y 2030</th>
                    <th style={{ padding: '12px' }}>Digital Index</th>
                    <th style={{ padding: '12px' }}>AI Readiness</th>
                    <th style={{ padding: '12px' }}>NetJob</th>
                    <th style={{ padding: '12px' }}>Risk</th>
                    <th style={{ padding: '12px' }}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {resData.scenario_table.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #232936', color: '#cbd5e1' }}>
                      <td style={{ padding: '12px' }}>{row.name}</td>
                      <td style={{ padding: '12px' }}>{row.k}%</td>
                      <td style={{ padding: '12px' }}>{row.d}%</td>
                      <td style={{ padding: '12px' }}>{row.ai}%</td>
                      <td style={{ padding: '12px' }}>{row.h}%</td>
                      <td style={{ padding: '12px' }}>{formatTableNumber(row.y2030, 4)}</td>
                      <td style={{ padding: '12px' }}>{formatTableNumber(row.dig_idx, 4)}</td>
                      <td style={{ padding: '12px' }}>{formatTableNumber(row.ai_ready, 4)}</td>
                      <td style={{ padding: '12px' }}>{formatTableNumber(row.net_job, 4)}</td>
                      <td style={{ padding: '12px' }}>{row.risk_text}</td>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{formatTableNumber(row.score, 4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* NỘI DUNG TAB 4: CẢNH BÁO RỦI RO */}
          {activeTab === 'risk' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '20px', marginBottom: '25px', animation: 'fadeIn 0.5s' }}>
              <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '2px solid #ef4444', borderRadius: '8px', padding: '20px' }}>
                <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>Cảnh báo rủi ro theo kịch bản</h4>
                <div style={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer>
                    <BarChart data={resData.risk_chart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#232936" vertical={false} />
                      <XAxis dataKey="scenario" stroke="#94a3b8" fontSize={12} label={{ value: 'Kịch bản', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                      <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 60]} label={{ value: 'Điểm rủi ro', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff', border: '1px solid #334155' }} />
                      <Legend verticalAlign="top" height={36} />
                      <Bar dataKey="cyber" fill="#93c5fd" name="Cyber risk" barSize={20} />
                      <Bar dataKey="emission" fill="#fca5a5" name="Emission risk" barSize={20} />
                      <Bar dataKey="dep" fill="#fdba74" name="Dependency risk" barSize={20} />
                      <Bar dataKey="score" fill="#fde047" name="Risk score" barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '2px solid #06b6d4', borderRadius: '8px', padding: '20px', overflowX: 'auto' }}>
                <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '15px' }}>Khuyến nghị chính sách theo kịch bản</h4>
                <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', textAlign: 'left', lineHeight: '1.6' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8', backgroundColor: '#0f172a' }}>
                      <th style={{ padding: '10px', width: '10%' }}>Kịch bản</th>
                      <th style={{ padding: '10px', width: '90%' }}>Khuyến nghị</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resData.recommendation_table.map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #232936', color: '#cbd5e1' }}>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{row.scenario}</td>
                        <td style={{ padding: '10px' }}>{row.recom}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 12.5 KHỐI NHẬN XÉT HÀM Ý CHÍNH SÁCH */}
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #22c55e', borderRadius: '8px', padding: '25px', marginBottom: '25px' }}>
            <h3 style={{ fontSize: '16px', color: '#22c55e', marginBottom: '20px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              🏛️ 12.5. Nhận xét và Hàm ý chính sách AIDEOM-VN
            </h3>

            <div style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: '1.8' }}>
              <div style={{ marginBottom: '20px' }}>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  a) Sức mạnh của tư duy Tích hợp đa chiều (M1 - M6):
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify' }}>
                  AIDEOM-VN không phải là một mô hình đơn lẻ mà là một hệ sinh thái. Nếu chỉ dựa vào M1 (Macro) hay M3 (Tối ưu biên), ta sẽ dễ dàng rơi vào kịch bản <b>S3 (Đột phá AI)</b> để lấy GDP cao nhất, nhưng bỏ qua thảm họa thất nghiệp ở M5 (Lao động) và M6 (Rủi ro). Mô hình tổng thể giúp nhà hoạch định nhìn thấy sự đánh đổi (trade-off) toàn diện: Tăng trưởng không thể tách rời An sinh.
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  b) Vì sao kịch bản S5 là lựa chọn tối ưu nhất?
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify' }}>
                  Kịch bản <b>S5 - Tối ưu cân bằng (30% K, 20% D, 20% AI, 30% H)</b> đạt điểm cân bằng cao ({resData.scenario_table[4].score}). S5 không cố đẩy GDP lên cao nhất bằng mọi giá như S3, nhưng vẫn giữ được tốc độ tăng trưởng cực mạnh nhờ cấu phần 20% AI. Yếu tố cốt lõi là 30% ngân sách được điều hướng kiên quyết vào <b>H (Nhân lực số)</b> - đóng vai trò như chiếc đệm giảm xóc khổng lồ, hấp thụ mọi biến động thất nghiệp do AI tạo ra.
                </p>
              </div>

              <div>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  c) Lộ trình triển khai thực tiễn:
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify', marginBottom: 0 }}>
                  Chính phủ cần thiết lập cơ chế giải ngân theo chốt chặn (Milestone-based). Trong 3 năm đầu, ưu tiên giải ngân tỷ trọng lớn cho Hạ tầng D và Nhân lực H. Khi chỉ số AI Readiness (M2) của các Vùng kinh tế vượt ngưỡng an toàn, mới bắt đầu mở van tín dụng ồ ạt cho khối doanh nghiệp ứng dụng AI. Mọi quyết định cấp vốn đều phải tuân thủ điều kiện: "Tốc độ sa thải không được vượt quá năng lực tái đào tạo của hệ thống".
                </p>
              </div>
            </div>
          </div>

          {/* 12.6 ĐỊNH HƯỚNG PHÁT TRIỂN TƯƠNG LAI CỦA ĐỒ ÁN */}
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #a855f7', borderRadius: '8px', padding: '25px' }}>
            <h3 style={{ fontSize: '16px', color: '#a855f7', marginBottom: '20px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              🚀 12.6. Định hướng phát triển và Nâng cấp mô hình (Future Works)
            </h3>

            <div style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: '1.8' }}>

              <div style={{ marginBottom: '20px' }}>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  a) Công bố quốc tế (SCIE Q2-Q3) dựa trên use-case thực tiễn (Ví dụ: Ngành Chế biến chế tạo):
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify' }}>
                  Mô hình AIDEOM-VN cung cấp một nền tảng định lượng mạnh mẽ để xây dựng các bài báo học thuật đạt chuẩn Q2/Q3 (trên các tạp chí như <i>Socio-Economic Planning Sciences</i> hoặc <i>Technological Forecasting and Social Change</i>). <br />
                  <b>Đề xuất đề tài:</b> "Tối ưu hóa chuyển dịch công nghệ và phân bổ lao động: Khung phân tích đa mục tiêu ứng dụng cho ngành Chế biến chế tạo Việt Nam". <br />
                  Bài báo sẽ cô lập và trích xuất trực tiếp Module M3 (Tối ưu Pareto NSGA-II) và Module M5 (Mô phỏng NetJob bằng quy hoạch tuyến tính) để chứng minh tính hiệu quả của chính sách "kép" (vừa kích thích năng suất AI, vừa bảo hộ an sinh thông qua đào tạo lại) trước các cú sốc tự động hóa.
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  b) Mở rộng hệ thống sang mô hình Cân bằng Tổng thể (CGE) hoặc DSGE-AI:
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify' }}>
                  AIDEOM-VN hiện tại đang sử dụng các mô hình tối ưu hóa định lượng và quy hoạch động từng phần. Để mô phỏng được sự <b>cân bằng tổng thể</b> của cả nền kinh tế, định hướng tiếp theo là nhúng mô hình vào khung <b>DSGE</b> (Dynamic Stochastic General Equilibrium) tích hợp biến công nghệ AI. <br />
                  Khi đó, các biến số vĩ mô như Lạm phát, Lãi suất, Mức lương thực tế và Cú sốc năng suất công nghệ sẽ được nội sinh hóa. Cơ chế thị trường (thanh toán bù trừ - market clearing) sẽ tự động điều chỉnh khi có sự can thiệp từ ngân sách Chính phủ, giúp dự báo chính xác hơn phản ứng của thị trường tự do.
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  c) Tích hợp dữ liệu thời gian thực (Real-time Data Integration):
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify' }}>
                  Thay vì sử dụng các tham số tĩnh để mô phỏng định kỳ theo năm, hệ thống AIDEOM-VN có thể được nâng cấp bằng cách xây dựng các API Pipelines kết nối trực tiếp với <i>Open Data Portal Việt Nam</i>, dữ liệu vĩ mô từ <i>Vietstock</i>, và dữ liệu xuất nhập khẩu của <i>Tổng cục Hải quan</i>. <br />
                  Bằng cách áp dụng bộ lọc Kalman (Kalman Filter) hoặc thuật toán cập nhật Bayes (Bayesian Updating), mô hình sẽ tự động hiệu chỉnh (calibrate) các hệ số kỹ thuật số và rủi ro lao động theo <b>tần suất tháng/quý</b>. Điều này sẽ biến AIDEOM-VN thành một <b>Bản sao số (Digital Twin)</b> thực thụ phục vụ điều hành kinh tế vĩ mô.
                </p>
              </div>

              <div>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  d) Nâng cấp môi trường Học Tăng Cường thành Multi-Agent RL (MARL):
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify', marginBottom: 0 }}>
                  Môi trường Q-Learning ở Bài 11 hiện chỉ có một Agent duy nhất đóng vai trò là "Chính phủ tổng thể". Để phản ánh sát nhất sự phức tạp trong thực tế hoạch định chính sách, hệ thống có thể mở rộng thành <b>Multi-Agent Reinforcement Learning (MARL)</b>. <br />
                  Trong đó, các Agent đại diện cho các cơ quan khác nhau: <b>Agent 1 (Bộ Tài chính - MOF)</b> tập trung tối đa hóa thu ngân sách và GDP; <b>Agent 2 (Bộ LĐ-TB&XH - MOLISA)</b> tập trung tối thiểu hóa thất nghiệp và phân bổ quỹ đào tạo; <b>Agent 3 (Bộ TT&TT - MIC)</b> tối đa hóa chỉ số chuyển đổi số quốc gia. Các Agent này sẽ tương tác trong một trò chơi Hợp tác - Cạnh tranh (Cooperative-Competitive Game) thông qua các thuật toán nâng cao như MAPPO (Multi-Agent PPO) để tìm ra điểm cân bằng Nash trong chính sách công.
                </p>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}