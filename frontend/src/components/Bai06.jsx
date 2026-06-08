import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Bai06() {
  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  const calculateTOPSIS = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/bai6/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(data => {
      if (data && data.success) {
        setResData(data);
        setIsCalculated(true);
      } else {
        alert("Lỗi không thể khởi chạy thuật toán TOPSIS.");
      }
      setLoading(false);
    })
    .catch(err => {
      console.error("Lỗi liên thông luồng dữ liệu Bài 6:", err);
      setLoading(false);
    });
  };

  const formatComma = (num, digits = 4) => {
    if (num === undefined || num === null) return "--";
    return typeof num === 'number' ? num.toFixed(digits).replace('.', ',') : num;
  };

  // Cập nhật lại màu sắc Badge Rank cho nền sáng
  const getRankBadgeClass = (rank) => {
    const val = Number(rank);
    if (val === 1) return { backgroundColor: '#10b981', color: '#ffffff', textAlign: 'center', fontWeight: 'bold', padding: '6px', borderRadius: '4px' };
    if (val === 2) return { backgroundColor: '#34d399', color: '#ffffff', textAlign: 'center', fontWeight: 'bold', padding: '6px', borderRadius: '4px' };
    if (val === 3) return { backgroundColor: '#fbbf24', color: '#ffffff', textAlign: 'center', fontWeight: 'bold', padding: '6px', borderRadius: '4px' };
    return { backgroundColor: '#f1f5f9', color: '#64748b', textAlign: 'center', fontWeight: '600', padding: '6px', borderRadius: '4px' };
  };

  return (
    <div style={{ color: '#1e293b', maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px', fontFamily: 'sans-serif' }}>
      
      {/* Khối Banner Tiêu đề */}
      <div style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)', border: '1px solid #bae6fd', borderRadius: '12px', padding: '30px 35px', marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: '24px', margin: 0, fontWeight: 'bold', letterSpacing: '0.5px', color: '#0369a1' }}>
            BÀI 6 - TOPSIS XẾP HẠNG 6 VÙNG KINH TẾ THEO MỨC ĐỘ ƯU TIÊN ĐẦU TƯ AI
          </h1>
          <p style={{ fontSize: '14px', color: '#0284c7', margin: '8px 0 0 0', fontWeight: '600' }}>
            Giai đoạn 3: Phân tích Đa tiêu chí (MCDM) & Ra quyết định
          </p>
        </div>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(2,132,199,0.08) 0%, transparent 70%)' }}></div>
      </div>

      {/* Mô hình toán học */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '3px solid #0284c7', borderRadius: '8px', padding: '20px', marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🔢</span> Mô hình toán học
        </h3>
        <div style={{ backgroundColor: '#f8fafc', padding: '15px 20px', borderRadius: '6px', border: '1px solid #e2e8f0', overflowX: 'auto', marginBottom: '12px' }}>
          <p style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '26px', color: '#334155', margin: 0, whiteSpace: 'nowrap', letterSpacing: '0.5px', textAlign: 'center' }}>
            <b style={{color: '#0f172a'}}><i>C</i><sub>i</sub><sup>*</sup></b> = <i>S</i><sub>i</sub><sup>-</sup> / (<i>S</i><sub>i</sub><sup>+</sup> + <i>S</i><sub>i</sub><sup>-</sup>)
          </p>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#475569', textAlign: 'center' }}>
          TOPSIS xếp hạng các vùng theo mức độ gần với phương án lý tưởng dương và xa phương án lý tưởng âm. Gini được xem là tiêu chí chi phí, các tiêu chí còn lại là tiêu chí lợi ích.
        </p>
      </div>

      {/* Điều khiển & KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2.8fr', gap: '25px', marginBottom: '30px' }}>
        
        {/* Bộ điều khiển */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '25px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#0f172a', fontWeight: 'bold' }}>🎛️ Bộ trọng số chuyên gia</h3>
          <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', marginBottom: '25px', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px dashed #cbd5e1', textAlign: 'center', fontWeight: '600' }}>
            w = [0.10, 0.10, 0.15, 0.20, 0.15, 0.15, 0.05, 0.10]
          </p>
          <button onClick={calculateTOPSIS} disabled={loading} style={{ width: '100%', background: 'linear-gradient(to right, #2563eb, #1d4ed8)', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'opacity 0.2s', opacity: loading ? 0.7 : 1 }}>
            {loading ? '⏳ Đang phân tích...' : '▶️ Chạy mô hình TOPSIS'}
          </button>
        </div>

        {/* Khối KPI */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #0284c7', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '22px', margin: 0, fontWeight: 'bold', lineHeight: '1.3', color: '#0284c7' }}>{resData ? resData.top_expert : '--'}</h2>
            <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Top 1 trọng số chuyên gia</p>
          </div>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #059669', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '32px', margin: 0, fontWeight: 'bold', color: '#059669' }}>{resData ? formatComma(resData.max_score) : '--'}</h2>
            <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Điểm TOPSIS cao nhất</p>
          </div>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #d97706', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '22px', margin: 0, fontWeight: 'bold', color: '#d97706', lineHeight: '1.3' }}>{resData ? resData.top_entropy : '--'}</h2>
            <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Top 1 Entropy</p>
          </div>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #dc2626', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '26px', margin: 0, fontWeight: 'bold', color: '#dc2626' }}>{resData ? resData.stability : '--'}</h2>
            <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Khả năng Ổn định Top-3</p>
          </div>
        </div>
      </div>

      {isCalculated && resData && (
        <>
          {/* Đồ thị và Bảng trọng số tiêu chí */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr', gap: '25px', marginBottom: '30px' }}>
            
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '15px', fontWeight: '600' }}>📊 Xếp hạng TOPSIS theo trọng số chuyên gia</h4>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={resData.expert_ranking || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis type="number" stroke="#475569" domain={[0, 1]} fontSize={12} fontWeight="bold" />
                    <YAxis dataKey="region" type="category" stroke="#475569" fontSize={11} width={130} fontWeight="600" />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px' }} formatter={(value) => [value ? value.toString().replace('.', ',') : '', 'Điểm C*']} />
                    <Bar dataKey="c_star" fill="#0284c7" radius={[0, 4, 4, 0]} barSize={22} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '15px', fontWeight: '600' }}>📊 Bảng trọng số tiêu chí</h4>
              <div style={{ overflowY: 'auto', maxHeight: '300px' }}>
                <table style={{ width: '100%', fontSize: '12.5px', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', backgroundColor: '#f1f5f9' }}>
                      <th style={{ padding: '10px', borderRadius: '6px 0 0 0' }}>Tiêu chí</th>
                      <th style={{ padding: '10px' }}>Loại</th>
                      <th style={{ padding: '10px', textAlign: 'right' }}>Expert</th>
                      <th style={{ padding: '10px', textAlign: 'right' }}>Entropy</th>
                      <th style={{ padding: '10px', textAlign: 'right', borderRadius: '0 6px 0 0' }}>AHP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(resData.criteria_weights || []).map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: i % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                        <td style={{ padding: '10px', color: '#0f172a', fontWeight: '500' }}>{row.criterion}</td>
                        <td style={{ padding: '10px', color: row.type === 'Cost' ? '#dc2626' : '#059669', fontWeight: '600' }}>{row.type}</td>
                        <td style={{ padding: '10px', textAlign: 'right', color: '#475569' }}>{typeof row.expert === 'number' ? row.expert.toString().replace('.', ',') : row.expert}</td>
                        <td style={{ padding: '10px', textAlign: 'right', color: '#475569' }}>{typeof row.entropy === 'number' ? row.entropy.toString().replace('.', ',') : row.entropy}</td>
                        <td style={{ padding: '10px', textAlign: 'right', color: '#475569' }}>{typeof row.ahp === 'number' ? row.ahp.toString().replace('.', ',') : row.ahp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Bảng xếp hạng chi tiết */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '30px' }}>
            
            {/* Rank Expert */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '15px', fontWeight: '600' }}>📋 Bảng xếp hạng trọng số chuyên gia</h4>
              <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', backgroundColor: '#f1f5f9' }}>
                    <th style={{ padding: '10px', borderRadius: '6px 0 0 0' }}>Rank</th>
                    <th style={{ padding: '10px' }}>Vùng</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>Cᵢ*</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>S+</th>
                    <th style={{ padding: '10px', textAlign: 'right', borderRadius: '0 6px 0 0' }}>S-</th>
                  </tr>
                </thead>
                <tbody>
                  {(resData.expert_ranking || []).map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: i % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                      <td style={{ padding: '10px', fontWeight: 'bold', color: '#0284c7' }}>#{row.rank}</td>
                      <td style={{ padding: '10px', color: '#0f172a', fontWeight: '500' }}>{row.region}</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#059669', fontWeight: 'bold' }}>{formatComma(row.c_star)}</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#475569' }}>{formatComma(row.s_plus)}</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#475569' }}>{formatComma(row.s_minus)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* So sánh Entropy */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '15px', fontWeight: '600' }}>📋 So sánh với trọng số Entropy</h4>
              <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', backgroundColor: '#f1f5f9' }}>
                    <th style={{ padding: '10px', borderRadius: '6px 0 0 0' }}>Vùng</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>Rank Expert</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>Rank Entropy</th>
                    <th style={{ padding: '10px', textAlign: 'center', borderRadius: '0 6px 0 0' }}>Thay đổi</th>
                  </tr>
                </thead>
                <tbody>
                  {(resData.method_comparison || []).map((row, i) => {
                    const changeStr = String(row.change || '');
                    const color = changeStr.includes('-') ? '#dc2626' : changeStr === '0' ? '#64748b' : '#059669';
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: i % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                        <td style={{ padding: '10px', color: '#0f172a', fontWeight: '500' }}>{row.region}</td>
                        <td style={{ padding: '10px', textAlign: 'center', color: '#475569' }}>{row.rank_expert}</td>
                        <td style={{ padding: '10px', textAlign: 'center', color: '#475569' }}>{row.rank_entropy}</td>
                        <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: color }}>{row.change}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

          {/* Phân tích độ nhạy & Heatmap thứ hạng */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '25px', marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '10px', fontWeight: '600' }}>📈 Phân tích độ nhạy theo trọng số AI Readiness</h4>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
              Trọng số w_AI thay đổi từ 0,10 đến 0,40. Các trọng số còn lại được chuẩn hóa để tổng không đổi (= 1).
            </p>
            
            <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '30px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', backgroundColor: '#f1f5f9' }}>
                  <th style={{ padding: '12px 10px', borderRadius: '6px 0 0 0' }}>Trọng số w_AI</th>
                  <th style={{ padding: '12px 10px' }}>Top 1</th>
                  <th style={{ padding: '12px 10px' }}>Top 2</th>
                  <th style={{ padding: '12px 10px', borderRadius: '0 6px 0 0' }}>Top 3</th>
                </tr>
              </thead>
              <tbody>
                {(resData.sensitivity_data || []).map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: i % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                    <td style={{ padding: '10px', fontWeight: 'bold', color: '#0284c7' }}>{typeof row.w_ai === 'number' ? row.w_ai.toFixed(2).replace('.', ',') : row.w_ai}</td>
                    <td style={{ padding: '10px', color: '#0f172a', fontWeight: '500' }}>{row.top_1}</td>
                    <td style={{ padding: '10px', color: '#475569' }}>{row.top_2}</td>
                    <td style={{ padding: '10px', color: '#475569' }}>{row.top_3}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h5 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '15px', fontWeight: '600' }}>🗺️ Heatmap biến động thứ hạng vùng theo w_AI</h5>
            <div style={{ overflowX: 'auto', marginBottom: '15px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1', color: '#475569' }}>
                    <th style={{ padding: '12px 10px', textAlign: 'left', borderRadius: '6px 0 0 0' }}>Vùng kinh tế</th>
                    <th style={{ padding: '12px 10px', textAlign: 'center' }}>w_AI=0,10</th>
                    <th style={{ padding: '12px 10px', textAlign: 'center' }}>w_AI=0,15</th>
                    <th style={{ padding: '12px 10px', textAlign: 'center' }}>w_AI=0,20</th>
                    <th style={{ padding: '12px 10px', textAlign: 'center' }}>w_AI=0,25</th>
                    <th style={{ padding: '12px 10px', textAlign: 'center' }}>w_AI=0,30</th>
                    <th style={{ padding: '12px 10px', textAlign: 'center' }}>w_AI=0,35</th>
                    <th style={{ padding: '12px 10px', textAlign: 'center', borderRadius: '0 6px 0 0' }}>w_AI=0,40</th>
                  </tr>
                </thead>
                <tbody>
                  {(resData.heatmap_matrix || []).map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: i % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 'bold', color: '#0f172a' }}>{row.region}</td>
                      <td style={{ padding: '8px' }}><div style={getRankBadgeClass(row.r1)}>{row.r1}</div></td>
                      <td style={{ padding: '8px' }}><div style={getRankBadgeClass(row.r2)}>{row.r2}</div></td>
                      <td style={{ padding: '8px' }}><div style={getRankBadgeClass(row.r3)}>{row.r3}</div></td>
                      <td style={{ padding: '8px' }}><div style={getRankBadgeClass(row.r4)}>{row.r4}</div></td>
                      <td style={{ padding: '8px' }}><div style={getRankBadgeClass(row.r5)}>{row.r5}</div></td>
                      <td style={{ padding: '8px' }}><div style={getRankBadgeClass(row.r6)}>{row.r6}</div></td>
                      <td style={{ padding: '8px' }}><div style={getRankBadgeClass(row.r7)}>{row.r7}</div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
              <i>Nhận xét:</i> Top-3 ổn định khi thay đổi trọng số AI Readiness, cho thấy nhóm vùng dẫn đầu có nền tảng tương đối vững chắc trên nhiều tiêu chí khác nhau, không chỉ phụ thuộc vào AI.
            </p>
          </div>

          {/* Đồ thị tích hợp đa phương pháp và AHP */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr', gap: '25px', marginBottom: '35px' }}>
            
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '15px', fontWeight: '600' }}>📊 So sánh điểm số đa phương pháp (Top-3)</h4>
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                  <BarChart data={resData.chart_data || []} margin={{ bottom: 15 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" fontSize={11} fontWeight="bold" interval={0} label={{ value: "Top-3 theo trọng số chuyên gia", position: "insideBottom", offset: -5, fill: "#475569", fontSize: 12 }} />
                    <YAxis stroke="#475569" fontSize={11} fontWeight="bold" domain={[0, 1.0]} label={{ value: "Điểm C*", angle: -90, position: "insideLeft", fill: "#475569", fontSize: 12 }} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '13px', color: '#1e293b' }} />
                    <Bar dataKey="Expert" fill="#0ea5e9" name="Expert" radius={[4, 4, 0, 0]} barSize={40} />
                    <Bar dataKey="Entropy" fill="#f43f5e" name="Entropy" radius={[4, 4, 0, 0]} barSize={40} />
                    <Bar dataKey="AHP" fill="#d946ef" name="AHP" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div>
                <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '15px', fontWeight: '600' }}>📋 Kết quả xếp hạng theo AHP</h4>
                <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', backgroundColor: '#f1f5f9' }}>
                      <th style={{ padding: '10px', borderRadius: '6px 0 0 0' }}>Rank</th>
                      <th style={{ padding: '10px' }}>Vùng</th>
                      <th style={{ padding: '10px', textAlign: 'right', borderRadius: '0 6px 0 0' }}>Điểm TOPSIS-AHP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(resData.ahp_table || []).map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: i % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                        <td style={{ padding: '10px', fontWeight: 'bold', color: '#d97706' }}>#{row.rank}</td>
                        <td style={{ padding: '10px', color: '#0f172a', fontWeight: '500' }}>{row.region}</td>
                        <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#059669' }}>{formatComma(row.score, 4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize: '13px', color: '#475569', borderTop: '1px solid #e2e8f0', paddingTop: '15px', marginTop: '15px' }}>
                Hệ số nhất quán (Consistency Ratio - CR) của ma trận AHP: <span style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '14px' }}>{resData.ahp_cr}</span>
                <br />
                <span style={{ fontSize: '12px', color: '#64748b' }}>(CR &lt; 0.1 cho thấy đánh giá cặp của chuyên gia là hợp lý và nhất quán).</span>
              </div>
            </div>

          </div>

          {/* 6.5 Nhận xét và hàm ý chính sách */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #0284c7', borderRadius: '8px', padding: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', color: '#0f172a', marginBottom: '20px', fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🏛️</span> 6.5. Nhận xét và Hàm ý chính sách (Đánh giá Đa tiêu chí)
            </h3>
            
            <div style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.8' }}>
              
              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <b style={{ color: '#0284c7', fontSize: '14.5px', display: 'block', marginBottom: '8px' }}>
                  a) Vùng nào dẫn đầu theo TOPSIS với trọng số chuyên gia? Đây có phải vùng nên triển khai trung tâm AI quốc gia đầu tiên không?
                </b>
                <p style={{ margin: 0, textAlign: 'justify' }}>
                  <b style={{ color: '#0f172a' }}>Kết quả TOPSIS:</b> Hai vùng <b style={{ color: '#0f172a' }}>Đông Nam Bộ</b> (hạt nhân TP.HCM) và <b style={{ color: '#0f172a' }}>Đồng bằng sông Hồng</b> (hạt nhân Hà Nội) luôn dẫn đầu tuyệt đối do vượt trội về hạ tầng dữ liệu và nguồn nhân lực công nghệ cao.<br />
                  <b style={{ color: '#0f172a' }}>Hàm ý triển khai:</b> Đây <b style={{ color: '#0f172a' }}>chắc chắn là nơi phải đặt trung tâm AI quốc gia đầu tiên</b>. Dưới góc độ kinh tế học đô thị, ngành AI đòi hỏi <i>Lợi thế tích tụ (Agglomeration Economies)</i> cực kỳ lớn. Triển khai AI ở những vùng dẫn đầu này giúp tận dụng tối đa hệ sinh thái khởi nghiệp sẵn có, chuỗi cung ứng linh kiện và viện nghiên cứu máy tính lõi, từ đó thu được tỷ suất hoàn vốn (ROI) nhanh nhất và giảm thiểu rủi ro thất bại của dự án tiên phong.
                </p>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <b style={{ color: '#059669', fontSize: '14.5px', display: 'block', marginBottom: '8px' }}>
                  b) Khi dùng trọng số Entropy, vùng nào có sự thay đổi xếp hạng lớn nhất? Vì sao?
                </b>
                <p style={{ margin: 0, textAlign: 'justify' }}>
                  <b style={{ color: '#0f172a' }}>Sự thay đổi:</b> Các vùng có xuất phát điểm thấp như <b style={{ color: '#0f172a' }}>Tây Nguyên</b> hoặc <b style={{ color: '#0f172a' }}>ĐBSCL</b> thường bị rớt hạng mạnh nhất khi chuyển từ trọng số chuyên gia sang trọng số Entropy.<br />
                  <b style={{ color: '#0f172a' }}>Bản chất thuật toán:</b> Phương pháp Entropy cấp trọng số cực kỳ lớn cho những tiêu chí có độ phân tán (variance) cao giữa các vùng (ví dụ: Số lượng bằng sáng chế AI, Lượng vốn FDI công nghệ cao). Vì Tây Nguyên và ĐBSCL có các chỉ số này gần như bằng 0 (tạo ra khoảng cách khổng lồ so với Đông Nam Bộ), thuật toán Entropy sẽ trừng phạt rất nặng sự yếu kém này, làm điểm khoảng cách tới giải pháp lý tưởng âm (Negative Ideal Solution) của họ ngắn lại, dẫn đến rớt hạng thê thảm.
                </p>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <b style={{ color: '#d97706', fontSize: '14.5px', display: 'block', marginBottom: '8px' }}>
                  c) TOPSIS giả định độc lập tuyến tính. Thực tế AI Readiness và Internet penetration tương quan cao. Ảnh hưởng thế nào và cách xử lý?
                </b>
                <p style={{ margin: 0, textAlign: 'justify' }}>
                  <b style={{ color: '#0f172a' }}>Hệ lụy của Đa cộng tuyến (Multi-collinearity):</b> Khi hai tiêu chí có tương quan thuận quá mạnh, việc đưa cả hai vào TOPSIS sẽ gây ra hiện tượng <i>"Tính đúp" (Double Counting)</i> đối với một nhân tố ẩn chung (ví dụ: nền tảng công nghệ cơ bản). Điều này làm thiên lệch kết quả, bơm phồng điểm số một cách giả tạo cho các vùng vốn đã mạnh về hạ tầng mạng, khiến các nỗ lực ở các tiêu chí khác bị lu mờ.<br />
                  <b style={{ color: '#0f172a' }}>Đề xuất xử lý:</b> Về mặt toán học, có hai giải pháp triệt để: <br />
                  1. Chạy thuật toán <b style={{ color: '#0f172a' }}>Phân tích thành phần chính (PCA)</b> để nén các biến tương quan cao thành một trục nhân tố trực giao (độc lập) trước khi đưa vào TOPSIS.<br />
                  2. Thay thế khoảng cách rễ bình phương (Euclidean distance) truyền thống bằng <b style={{ color: '#0f172a' }}>Khoảng cách Mahalanobis</b>, bởi công thức Mahalanobis đã tự động tích hợp ma trận hiệp phương sai để triệt tiêu sự tương quan giữa các biến.
                </p>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <b style={{ color: '#dc2626', fontSize: '14.5px', display: 'block', marginBottom: '8px' }}>
                  d) Dựa trên TOPSIS và Quyết định 127/QĐ-TTg, chọn 3 vùng xây trung tâm AI. Có cần điều chỉnh tiêu chí địa - chính trị không?
                </b>
                <p style={{ margin: 0, textAlign: 'justify' }}>
                  <b style={{ color: '#0f172a' }}>Lựa chọn theo TOPSIS:</b> Mô hình định lượng sẽ ưu tiên 3 vùng: Đông Nam Bộ (Nam), Đồng bằng Sông Hồng (Bắc) và Duyên hải miền Trung (Đà Nẵng).<br />
                  <b style={{ color: '#0f172a' }}>Góc độ Địa - Chính trị:</b> Sự điều chỉnh hệ số địa - chính trị và an ninh quốc gia là <b style={{ color: '#0f172a' }}>bắt buộc</b>. Nếu chỉ tuân theo toán học tối ưu, các nguồn lực công nghệ cao sẽ bị hút cạn về hai đầu đất nước, gây ra hiện tượng <i>"Chảy máu chất xám" (Brain Drain)</i> cục bộ. Việc chủ đích đặt 1 trong 3 trung tâm AI lớn tại miền Trung (Đà Nẵng) dù điểm TOPSIS có thể thua kém một chút so với vùng lân cận TP.HCM, là nhằm tạo ra một <i>Hiệu ứng lan tỏa không gian (Spatial Spillover Effect)</i>, đảm bảo phát triển kinh tế đa cực, dự phòng rủi ro an ninh mạng phân tán và bảo vệ cấu trúc công bằng xã hội.
                </p>
              </div>

            </div>
          </div>

        </>
      )}
    </div>
  );
}