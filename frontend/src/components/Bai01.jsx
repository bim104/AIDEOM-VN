import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Bai01() {
  const [inputs, setInputs] = useState({
    alpha: 0.33, beta: 0.42, gamma: 0.10, delta: 0.08, theta: 0.07,
    d_2030: 30, ai_2030: 100, h_2030: 35,
    k_growth: 0.06, l_growth: 0.06, tfp_growth: 0.012
  });
  
  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  const executeSimulation = () => {
    setLoading(true);
    setHasError(false);
    setIsCalculated(false);
    setResData(null); 
    
    fetch('http://localhost:8000/api/bai01/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputs)
    })
    .then(res => {
      if (!res.ok) throw new Error("Cổng vật lý API Bài 1 không phản hồi");
      return res.json();
    })
    .then(data => { 
      const finalData = data.data ? data.data : data;
      if (finalData && finalData.macro_table) {
        setResData(finalData); 
        setIsCalculated(true);
      } else {
        setHasError(true);
      }
      setLoading(false); 
    })
    .catch(err => { 
      console.error("Lỗi luồng kết nối Bài 1:", err); 
      setLoading(false);
      setHasError(true);
    });
  };

  const changeParam = (field, value) => {
    const sanitized = typeof value === 'string' ? value.replace(',', '.') : value;
    setInputs(prev => ({ ...prev, [field]: Number(sanitized) || 0 }));
  };

  const getHistoricalData = () => {
    if (!resData || !resData.macro_table) return [];
    return resData.macro_table.filter(item => item && item.year <= 2025);
  };

  return (
    <div style={{ color: '#1e293b', maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px', fontFamily: 'sans-serif' }}>
      
      {/* Khối Banner Tiêu đề (Giao diện Sáng) */}
      <div style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)', border: '1px solid #bae6fd', borderRadius: '12px', padding: '30px 35px', marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: '24px', margin: 0, fontWeight: 'bold', letterSpacing: '0.5px', color: '#0369a1' }}>
            BÀI 1 — HÀM SẢN XUẤT COBB-DOUGLAS MỞ RỘNG VỚI AI VÀ SỐ HÓA
          </h1>
          <p style={{ fontSize: '14px', color: '#0284c7', margin: '8px 0 0 0', fontWeight: '600' }}>
            Giai đoạn 1: Nền tảng Vĩ mô & Đánh giá năng lực cốt lõi
          </p>
        </div>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(2,132,199,0.08) 0%, transparent 70%)' }}></div>
      </div>

      {/* KHỐI MÔ HÌNH TOÁN HỌC (BÀI 1) */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '3px solid #0284c7', borderRadius: '8px', padding: '20px', marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🔢</span> Mô hình toán học tổng quát
        </h3>
        
        <div style={{ backgroundColor: '#f8fafc', padding: '15px 20px', borderRadius: '6px', border: '1px solid #e2e8f0', overflowX: 'auto', marginBottom: '12px' }}>
          <p style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '24px', color: '#334155', margin: 0, whiteSpace: 'nowrap', letterSpacing: '0.5px', textAlign: 'center' }}>
            <b style={{color: '#0f172a'}}><i>Y<sub>t</sub></i></b> = <i>A<sub>t</sub></i> &times; <i>K<sub>t</sub></i><sup>&alpha;</sup> &times; <i>L<sub>t</sub></i><sup>&beta;</sup> &times; <i>D<sub>t</sub></i><sup>&gamma;</sup> &times; <i>AI<sub>t</sub></i><sup>&delta;</sup> &times; <i>H<sub>t</sub></i><sup>&theta;</sup>
          </p>
        </div>
        
        <p style={{ margin: 0, fontSize: '13px', color: '#475569', textAlign: 'center' }}>
          Trong đó: Y<sub>t</sub> là Sản lượng, A<sub>t</sub> là Năng suất nhân tố tổng hợp (TFP), K<sub>t</sub> là Vốn vật chất, L<sub>t</sub> là Lao động, D<sub>t</sub> là Vốn dữ liệu, AI<sub>t</sub> là Mức độ ứng dụng AI, H<sub>t</sub> là Vốn nhân lực.
        </p>
      </div>

      {/* Khối chia đôi nhập liệu */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '25px', marginBottom: '35px' }}>
        
        {/* Panel Nhập liệu */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>Hệ số mô hình và kịch bản 2030</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '15px' }}>
            <div>
              <label style={{ fontSize: '11.5px', color: '#64748b', display: 'block', marginBottom: '6px' }}><b>α - K</b></label>
              <input type="text" defaultValue="0,33" onChange={e => changeParam('alpha', e.target.value)} style={{ width: '100%', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px', boxSizing: 'border-box', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '11.5px', color: '#64748b', display: 'block', marginBottom: '6px' }}><b>β - L</b></label>
              <input type="text" defaultValue="0,42" onChange={e => changeParam('beta', e.target.value)} style={{ width: '100%', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px', boxSizing: 'border-box', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '11.5px', color: '#64748b', display: 'block', marginBottom: '6px' }}><b>γ - D</b></label>
              <input type="text" defaultValue="0,10" onChange={e => changeParam('gamma', e.target.value)} style={{ width: '100%', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px', boxSizing: 'border-box', outline: 'none' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '11.5px', color: '#64748b', display: 'block', marginBottom: '6px' }}><b>δ - AI</b></label>
              <input type="text" defaultValue="0,08" onChange={e => changeParam('delta', e.target.value)} style={{ width: '100%', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px', boxSizing: 'border-box', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '11.5px', color: '#64748b', display: 'block', marginBottom: '6px' }}><b>θ - H</b></label>
              <input type="text" defaultValue="0,07" onChange={e => changeParam('theta', e.target.value)} style={{ width: '100%', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px', boxSizing: 'border-box', outline: 'none' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '15px' }}>
            <div>
              <label style={{ fontSize: '11.5px', color: '#64748b', display: 'block', marginBottom: '6px' }}><b>D 2030 (%)</b></label>
              <input type="number" defaultValue={30} onChange={e => changeParam('d_2030', e.target.value)} style={{ width: '100%', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px', boxSizing: 'border-box', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '11.5px', color: '#64748b', display: 'block', marginBottom: '6px' }}><b>AI 2030</b></label>
              <input type="number" defaultValue={100} onChange={e => changeParam('ai_2030', e.target.value)} style={{ width: '100%', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px', boxSizing: 'border-box', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '11.5px', color: '#64748b', display: 'block', marginBottom: '6px' }}><b>H 2030 (%)</b></label>
              <input type="number" defaultValue={35} onChange={e => changeParam('h_2030', e.target.value)} style={{ width: '100%', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px', boxSizing: 'border-box', outline: 'none' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '25px' }}>
            <div>
              <label style={{ fontSize: '11.5px', color: '#64748b', display: 'block', marginBottom: '6px' }}><b>K tăng/năm</b></label>
              <input type="text" defaultValue="0,06" onChange={e => changeParam('k_growth', e.target.value)} style={{ width: '100%', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px', boxSizing: 'border-box', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '11.5px', color: '#64748b', display: 'block', marginBottom: '6px' }}><b>L tăng/năm</b></label>
              <input type="text" defaultValue="0,06" onChange={e => changeParam('l_growth', e.target.value)} style={{ width: '100%', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px', boxSizing: 'border-box', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '11.5px', color: '#64748b', display: 'block', marginBottom: '6px' }}><b>TFP tăng/năm</b></label>
              <input type="text" defaultValue="0,012" onChange={e => changeParam('tfp_growth', e.target.value)} style={{ width: '100%', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px', boxSizing: 'border-box', outline: 'none' }} />
            </div>
          </div>

          <button onClick={executeSimulation} disabled={loading} style={{ width: '100%', background: 'linear-gradient(to right, #2563eb, #1d4ed8)', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'opacity 0.2s', opacity: loading ? 0.7 : 1 }}>
            {loading ? '⏳ Đang mô phỏng vĩ mô...' : '▶️ Khởi chạy Mô hình'}
          </button>
        </div>

        {/* Bảng thô lịch sử */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', overflowX: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', color: '#0284c7', fontWeight: '600' }}>Dữ liệu đầu vào thực tế Việt Nam (2020-2025)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'center' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', backgroundColor: '#f1f5f9' }}>
                <th style={{ padding: '12px 10px', textAlign: 'left', borderRadius: '6px 0 0 0' }}>Năm</th>
                <th style={{ padding: '12px 10px' }}>GDP (nghìn tỷ)</th>
                <th style={{ padding: '12px 10px' }}>Vốn K</th>
                <th style={{ padding: '12px 10px' }}>Lao động L</th>
                <th style={{ padding: '12px 10px' }}>Số hóa D</th>
                <th style={{ padding: '12px 10px' }}>Trí tuệ AI</th>
                <th style={{ padding: '12px 10px', borderRadius: '0 6px 0 0' }}>Nhân lực H</th>
              </tr>
            </thead>
            <tbody>
              {[
                { y: 2020, g: "8.044,4", k: "16.500", l: "53,6", d: "12,0", ai: "55,6", h: "24,1" },
                { y: 2021, g: "8.487,5", k: "17.800", l: "50,5", d: "12,7", ai: "60,2", h: "26,1" },
                { y: 2022, g: "9.513,3", k: "19.600", l: "51,7", d: "14,3", ai: "65,4", h: "26,2" },
                { y: 2023, g: "10.221,8", k: "21.300", l: "52,4", d: "16,5", ai: "67,0", h: "27,0" },
                { y: 2024, g: "11.511,9", k: "23.500", l: "52,9", d: "18,3", ai: "73,8", h: "28,4" },
                { y: 2025, g: "12.847,6", k: "25.900", l: "53,4", d: "19,5", ai: "80,1", h: "29,2" },
              ].map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: idx % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'left', color: '#0f172a' }}>{row.y}</td>
                  <td style={{ padding: '10px', color: '#059669', fontWeight: 'bold' }}>{row.g}</td>
                  <td style={{ padding: '10px', color: '#1e293b', fontWeight: '500' }}>{row.k}</td>
                  <td style={{ padding: '10px', color: '#1e293b', fontWeight: '500' }}>{row.l}</td>
                  <td style={{ padding: '10px', color: '#1e293b', fontWeight: '500' }}>{row.d}</td>
                  <td style={{ padding: '10px', color: '#1e293b', fontWeight: '500' }}>{row.ai}</td>
                  <td style={{ padding: '10px', color: '#1e293b', fontWeight: '500' }}>{row.h}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {hasError && (
        <div style={{ color: '#b91c1c', padding: '15px', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '6px', marginBottom: '25px', fontSize: '14px' }}>
          ⚠️ <b>Lỗi kết nối:</b> Không thể liên lạc với API `backend/routes/bai01.py`. Vui lòng kiểm tra lại server.
        </div>
      )}

      {/* KHỐI HIỂN THỊ KẾT QUẢ ĐỒ THỊ VÀ KHỐI NGHỊ LUẬN CHÍNH SÁCH */}
      {isCalculated && resData && resData.macro_table && (
        <>
          {/* Cụm Thẻ KPI Kết quả */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #0284c7', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>TFP Trung bình</div>
              <h2 style={{ fontSize: '28px', margin: '6px 0 0 0', fontWeight: 'bold', color: '#0284c7' }}>{resData.tfp_mean.toFixed(4)}</h2>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Giai đoạn đánh giá 2020-2025</div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #059669', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Sai số MAPE</div>
              <h2 style={{ fontSize: '28px', margin: '6px 0 0 0', fontWeight: 'bold', color: '#059669' }}>{resData.mape.toFixed(2)}%</h2>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Độ hội tụ của mô hình dự báo</div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #d97706', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>GDP 2030 Dự báo</div>
              <h2 style={{ fontSize: '28px', margin: '6px 0 0 0', fontWeight: 'bold', color: '#d97706' }}>{resData.gdp_2030_pred.toLocaleString('vi-VN')}</h2>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Đơn vị: Nghìn tỷ VND</div>
            </div>
          </div>

          {/* Đồ thị Recharts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '30px' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>📈 Quỹ đạo TFP (Năng suất nhân tố tổng hợp)</h4>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <LineChart data={getHistoricalData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="year" stroke="#475569" fontSize={12} fontWeight="bold" />
                    <YAxis domain={['auto', 'auto']} stroke="#475569" fontSize={12} fontWeight="bold" />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '13px', color: '#1e293b' }} />
                    <Line type="monotone" dataKey="tfp" stroke="#0284c7" strokeWidth={3} name="TFP (A_t)" dot={{ fill: '#ffffff', stroke: '#0284c7', strokeWidth: 2, r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>⚖️ So sánh GDP Thực tế và Dự báo</h4>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <LineChart data={getHistoricalData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="year" stroke="#475569" fontSize={12} fontWeight="bold" />
                    <YAxis domain={['auto', 'auto']} stroke="#475569" fontSize={12} fontWeight="bold" />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '13px', color: '#1e293b' }} />
                    <Line type="monotone" dataKey="gdp_real" stroke="#059669" strokeWidth={3} name="GDP Thực tế" dot={{ fill: '#ffffff', stroke: '#059669', strokeWidth: 2, r: 4 }} />
                    <Line type="monotone" dataKey="gdp_pred" stroke="#dc2626" strokeWidth={3} name="GDP Dự báo" dot={{ fill: '#ffffff', stroke: '#dc2626', strokeWidth: 2, r: 4 }} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Phân rã và Bảng kết quả */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '25px', marginBottom: '35px' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>📊 Phân rã động lực tăng trưởng</h4>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={resData?.decomposition || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis type="number" stroke="#475569" fontSize={12} fontWeight="bold" unit="%" />
                    <YAxis dataKey="factor" type="category" stroke="#475569" fontSize={12} width={50} fontWeight="bold" />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                    <Bar dataKey="value" fill="#2563eb" name="Tỷ trọng đóng góp (%)" radius={[0, 4, 4, 0]} barSize={25} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', overflowX: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>Bảng chi tiết sai số mô hình</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', backgroundColor: '#f1f5f9' }}>
                    <th style={{ padding: '12px 10px', textAlign: 'left', borderRadius: '6px 0 0 0' }}>Năm</th>
                    <th style={{ padding: '12px 10px', textAlign: 'right' }}>GDP Thực tế</th>
                    <th style={{ padding: '12px 10px', textAlign: 'right' }}>GDP Dự báo</th>
                    <th style={{ padding: '12px 10px', textAlign: 'right' }}>TFP Ước lượng</th>
                    <th style={{ padding: '12px 10px', textAlign: 'right', borderRadius: '0 6px 0 0' }}>Mức sai số</th>
                  </tr>
                </thead>
                <tbody>
                  {getHistoricalData().map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: idx % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                      <td style={{ padding: '10px', fontWeight: 'bold', color: '#0f172a' }}>{row.year}</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#059669', fontWeight: 'bold' }}>{(row.gdp_real || 0).toLocaleString('vi-VN', {minimumFractionDigits: 1})}</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#d97706', fontWeight: 'bold' }}>{(row.gdp_pred || 0).toLocaleString('vi-VN', {minimumFractionDigits: 1})}</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#0284c7', fontWeight: 'bold' }}>{(row.tfp || 0).toFixed(4)}</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: (row.error || 0) > 2 ? '#dc2626' : '#1e293b', fontWeight: 'bold' }}>{(row.error || 0).toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* KHỐI THẢO LUẬN CHÍNH SÁCH VĨ MÔ */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #059669', borderRadius: '8px', padding: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#0f172a', fontWeight: 'bold', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🏛️</span> 1.5. CÂU HỎI THẢO LUẬN CHÍNH SÁCH VĨ MÔ
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '13.5px', color: '#475569', lineHeight: '1.7' }}>
              
              {/* Câu a */}
              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h5 style={{ margin: '0 0 12px 0', color: '#0284c7', fontSize: '14px', fontWeight: '700' }}>
                  a) TFP của Việt Nam có xu hướng tăng hay giảm trong giai đoạn 2020-2025? Điều đó nói lên gì về chất lượng tăng trưởng?
                </h5>
                <p style={{ margin: 0, color: '#475569' }}>
                  • <b style={{ color: '#0f172a' }}>Xu hướng biến động:</b> Dựa trên kết quả tự động phân rã kinh tế lượng, chỉ số Năng suất nhân tố tổng hợp (TFP) của Việt Nam giai đoạn 2020-2025 có xu hướng <b style={{ color: '#0f172a' }}>TĂNG TRƯỞNG LIÊN TỤC VÀ TỊNH TIẾN ỔN ĐỊNH</b> (chạy từ mốc 27.7466 năm 2020 lên sát ngưỡng 34.9136 năm 2025).<br />
                  • <b style={{ color: '#0f172a' }}>Chất lượng tăng trưởng:</b> Quỹ đạo đi lên bền vững này khẳng định chất lượng tăng trưởng vĩ mô của Việt Nam đang dịch chuyển mạnh mẽ từ mô hình thâm dụng truyền thống (chiều rộng) sang mô hình kinh tế tri thức (chiều sâu). Hiệu suất sử dụng nguồn nhân lực số và hiệu quả đầu tư công nghệ số tăng cao đang đóng vai trò làm bệ đỡ nâng đỡ nền sản xuất vĩ mô.
                </p>
              </div>

              {/* Câu b */}
              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h5 style={{ margin: '0 0 12px 0', color: '#059669', fontSize: '14px', fontWeight: '700' }}>
                  b) Trong các yếu tố mới D, AI, H, yếu tố nào đóng góp nhiều nhất cho tăng trưởng giai đoạn vừa qua? Vì sao?
                </h5>
                <p style={{ margin: 0, color: '#475569' }}>
                  • <b style={{ color: '#0f172a' }}>Yếu tố dẫn dắt chính:</b> Trong cụm 3 biến số kinh tế số mới, nhân tố <b style={{ color: '#0f172a' }}>Hạ tầng số D (Kinh tế số/GDP)</b> đóng góp tỷ trọng giá trị tuyệt đối lớn nhất vào quy mô sản lượng, bám sát nút phía sau là <b style={{ color: '#0f172a' }}>Vốn nhân lực số H</b>.<br />
                  • <b style={{ color: '#0f172a' }}>Lý giải nguyên nhân:</b> Hạ tầng kỹ thuật số đóng vai trò là mạch máu vật lý cốt lõi. Giai đoạn 2020-2025 chứng kiến làn sóng phổ cập mạng 4G/5G, phủ sóng cáp quang và xây dựng Data centers diễn ra mạnh mẽ, tạo ra hiệu ứng lan tỏa mạng lưới (Network Effects), trực tiếp cắt giảm chi phí vận hành cho doanh nghiệp. Ngược lại, nhân tố Trí tuệ nhân tạo (AI) dù sở hữu tiềm năng lớn nhưng đóng góp thực tế còn khiêm tốn do nền kinh tế đang ở <b style={{ color: '#0f172a' }}>vùng chân của đường cong hấp thụ công nghệ</b>.
                </p>
              </div>

              {/* Câu c */}
              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h5 style={{ margin: '0 0 12px 0', color: '#d97706', fontSize: '14px', fontWeight: '700' }}>
                  c) Mục tiêu Việt Nam đạt 30% kinh tế số/GDP vào 2030 có khả thi không nếu dựa trên mô hình này? Cần ràng buộc gì?
                </h5>
                <p style={{ margin: 0, color: '#475569' }}>
                  • <b style={{ color: '#0f172a' }}>Đánh giá tính khả thi:</b> Dựa trên mô hình toán học dự báo kịch bản đến năm 2030, mục tiêu cán mốc 30% kinh tế số/GDP là <b style={{ color: '#0f172a' }}>HOÀN TOÀN KHẢ THI</b>, nhưng đi kèm điều kiện biên ngặt nghèo chứ không thể đạt được nếu để thị trường tự vận động.<br />
                  • <b style={{ color: '#0f172a' }}>Hệ ràng buộc bắt buộc:</b> Để bảo đảm đạt mục tiêu, mô hình chỉ ra 3 ràng buộc chính: (1) <i>Tài khóa:</i> Tốc độ giải ngân vốn đầu tư công vào hạ tầng mạng phải duy trì tăng trưởng tối thiểu <b style={{ color: '#0f172a' }}>15%/năm</b>; (2) <i>Nhân lực:</i> Phải khóa chặt bất đẳng thức cung ứng lao động số qua đào tạo (H) đạt tối thiểu <b style={{ color: '#0f172a' }}>35%</b> vào năm 2030; (3) <i>An sinh:</i> Tỷ lệ dịch chuyển mất việc làm do cú sốc tự động hóa GenAI quét qua các ngành thâm dụng phải được khống chế nghiêm ngặt thông qua các quỹ tài khóa tái đào tạo.
                </p>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}