import React, { useState, lazy, Suspense } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Cơ chế khóa lỗi: Nạp động Plotly bằng React.lazy để tránh làm sập luồng render chính của Vite
const PlotlyComponent = lazy(() => import('react-plotly.js'));

export default function Bai09() {
  const [inputs, setInputs] = useState({
    total_budget: 30000,
    gamma_retrain_ngành2: 42
  });

  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [hasError, setHasError] = useState(false);

  const runLaborOptimization = () => {
    setLoading(true);
    setHasError(false);
    setIsCalculated(false);
    setResData(null);

    fetch('http://localhost:8000/api/bai09/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputs)
    })
      .then(res => {
        if (!res.ok) throw new Error("Cổng kết nối API Backend Bài 9 bị ngắt");
        return res.json();
      })
      .then(data => {
        if (data && data.success) {
          setResData(data);
          setIsCalculated(true);
        } else {
          setIsCalculated(false);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi liên thông API Bài 9:", err);
        setLoading(false);
        setHasError(true);
        setIsCalculated(false);
      });
  };

  return (
    <div style={{ color: '#1e293b', maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px', fontFamily: 'sans-serif' }}>

      {/* Khối thanh định hướng tiêu đề */}
      <div style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)', border: '1px solid #bae6fd', borderRadius: '12px', padding: '30px 35px', marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: '24px', margin: 0, fontWeight: 'bold', letterSpacing: '0.5px', color: '#0369a1', textTransform: 'uppercase' }}>
            BÀI 9 — MÔ PHỎNG PHÂN BỔ NGÂN SÁCH AN SINH LAO ĐỘNG TRƯỚC TÁC ĐỘNG CỦA AI
          </h1>
          <p style={{ fontSize: '14px', color: '#0284c7', margin: '8px 0 0 0', fontWeight: '600' }}>
            Giai đoạn 3: Phân tích Quy hoạch Tuyến tính Bảo hộ An sinh
          </p>
        </div>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(2,132,199,0.08) 0%, transparent 70%)' }}></div>
      </div>

      {/* Tóm tắt toán học lý thuyết hệ thống */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '3px solid #0284c7', borderRadius: '8px', padding: '20px', marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>📋</span> Phương trình cân bằng động dòng lao động số (NetJob Flows Matrix)
        </h3>
        <div style={{ backgroundColor: '#f8fafc', padding: '15px 20px', borderRadius: '6px', border: '1px solid #e2e8f0', overflowX: 'auto', marginBottom: '12px' }}>
          <p style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '24px', color: '#334155', margin: 0, whiteSpace: 'nowrap', letterSpacing: '0.5px', textAlign: 'center' }}>
            <b style={{ color: '#0f172a' }}>NetJob<sub>i,t</sub></b> = NewJob<sub>i,t</sub><sup>AI</sup> + UpgradeJob<sub>i,t</sub> - DisplacedJob<sub>i,t</sub><sup>Automation</sup>
          </p>
        </div>
        <p style={{ fontSize: '13px', color: '#475569', margin: '0', lineHeight: '1.6', textAlign: 'center' }}>
          Tối ưu hóa phân phối gói tài khóa vĩ mô cho 8 ngành kinh tế cốt lõi, tìm điểm cân bằng cán cân giữa đầu tư kích hoạt công nghệ đột phá và bảo hộ năng lực tái đào tạo thích ứng của nguồn lực lao động Việt Nam.
        </p>
      </div>

      {/* Form cấu hình điều khiển tham số */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', fontWeight: 'bold' }}>
          🎛️ Thiết lập hạn mức Ngân sách Lao động vĩ mô
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
          <div>
            <label style={{ fontSize: '12.5px', color: '#475569', fontWeight: '600' }}>Gói tài khóa ngân sách tổng toàn quốc (tỷ VND)</label>
            <input
              type="number"
              value={inputs.total_budget}
              onChange={e => setInputs({ ...inputs, total_budget: parseFloat(e.target.value) || 0 })}
              style={{ width: '100%', backgroundColor: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px', marginTop: '8px', fontWeight: 'bold', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12.5px', color: '#475569', fontWeight: '600' }}>Ngưỡng kịch bản rủi ro đào tạo ngành 2 (%)</label>
            <input
              type="number"
              value={inputs.gamma_retrain_ngành2}
              onChange={e => setInputs({ ...inputs, gamma_retrain_ngành2: parseFloat(e.target.value) || 0 })}
              style={{ width: '100%', backgroundColor: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px', marginTop: '8px', fontWeight: 'bold', outline: 'none' }}
            />
          </div>
        </div>
        <button
          onClick={runLaborOptimization}
          disabled={loading}
          style={{ width: '100%', background: 'linear-gradient(to right, #2563eb, #1d4ed8)', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'opacity 0.2s', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? '⏳ Đang giải bài toán tối ưu LP...' : '▶️ Chạy mô hình LP Phân bổ'}
        </button>
      </div>

      {hasError && (
        <div style={{ color: '#b91c1c', padding: '15px', backgroundColor: '#fef2f2', borderRadius: '6px', marginBottom: '25px', fontWeight: 'bold', border: '1px solid #fecaca', fontSize: '14px' }}>
          ⚠️ Không thể kết nối hoặc giải thuật toán phân bổ. Vui lòng kiểm tra Docker Backend tệp bai09.py!
        </div>
      )}

      {/* Điều kiện chặn hiển thị giao diện kết quả */}
      {!isCalculated ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1', color: '#64748b', fontSize: '14px' }}>
          💡 Vui lòng nhấp nút <span style={{ color: '#0284c7', fontWeight: 'bold' }}>"Chạy mô hình"</span> để kết xuất đồ thị luồng tương tác đa tầng và hệ luận cứ vĩ mô.
        </div>
      ) : (
        <>
          {/* Hộp thẻ chỉ số KPI nhanh */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #0284c7', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: '28px', margin: '0 0 5px 0', fontWeight: 'bold', color: '#0284c7' }}>{(resData.total_net_jobs / 1000000).toFixed(2)} triệu</h2>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Tổng NetJob</p>
            </div>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #059669', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: '20px', margin: '0 0 5px 0', fontWeight: 'bold', color: '#059669', lineHeight: '1.4' }}>
                {resData.sector_table.reduce((max, s) => s.x_H > max.x_H ? s : max).sector_name}
              </h2>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Ngành đào tạo nhiều nhất</p>
            </div>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #d97706', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: '28px', margin: '0 0 5px 0', fontWeight: 'bold', color: '#d97706' }}>
                {(resData.sector_table.reduce((sum, s) => sum + s.displaced_jobs, 0) / 1000).toFixed(1)} nghìn
              </h2>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Việc làm bị chuyển</p>
            </div>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #dc2626', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: '28px', margin: '0 0 5px 0', fontWeight: 'bold', color: '#dc2626' }}>{inputs.total_budget.toLocaleString()} tỷ</h2>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Ngân sách sử dụng</p>
            </div>
          </div>

          {/* Biểu đồ Bar: Phân bổ x_AI và x_H theo ngành */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>
              📊 Phân bổ tối ưu ngân sách công nghệ (x_AI) và đào tạo (x_H) theo ngành
            </h4>
            <div style={{ width: '100%', height: 350, overflowX: 'auto' }}>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={resData.sector_table} margin={{ top: 20, right: 30, left: 0, bottom: 90 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="sector_name"
                    angle={-35}
                    textAnchor="end"
                    height={100}
                    tick={{ fontSize: 11, fill: '#475569', fontWeight: '600' }}
                    interval={0}
                  />
                  <YAxis stroke="#475569" fontSize={11} fontWeight="bold" />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '13px', color: '#1e293b' }} />
                  <Bar dataKey="x_AI" fill="#0ea5e9" name="Ngân sách AI (tỷ VND)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="x_H" fill="#d97706" name="Ngân sách Đào tạo (tỷ VND)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2 Biểu đồ cạnh nhau: NetJob ròng + Cấu phần việc làm */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '30px' }}>
            {/* NetJob ròng theo từng ngành */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>
                📊 Việc làm ròng (NetJob) theo từng ngành
              </h4>
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={resData.sector_table} margin={{ top: 20, right: 30, left: 0, bottom: 90 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="sector_name"
                      angle={-35}
                      textAnchor="end"
                      height={100}
                      tick={{ fontSize: 10, fill: '#475569', fontWeight: '600' }}
                      interval={0}
                    />
                    <YAxis stroke="#475569" fontSize={11} fontWeight="bold" />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                    <Bar dataKey="net_jobs" fill="#059669" name="NetJob (người)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cấu phần việc làm */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>
                📊 Cấu phần tổng thể thị trường lao động
              </h4>
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={[
                    {
                      name: 'Thống kê tổng',
                      'NewJob': resData.sector_table.reduce((sum, s) => sum + s.new_jobs, 0),
                      'UpgradeJob': resData.sector_table.reduce((sum, s) => sum + s.upgrade_jobs, 0),
                      'DisplacedJob': resData.sector_table.reduce((sum, s) => sum + s.displaced_jobs, 0),
                      'RetrainCapacity': resData.sector_table.reduce((sum, s) => sum + s.retrain_capacity, 0)
                    }
                  ]} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#475569', fontWeight: 'bold' }} />
                    <YAxis stroke="#475569" fontSize={11} fontWeight="bold" />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px', color: '#1e293b' }} />
                    <Bar dataKey="NewJob" fill="#10b981" name="Việc mới (NewJob)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="UpgradeJob" fill="#0ea5e9" name="Nâng cấp (UpgradeJob)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="DisplacedJob" fill="#dc2626" name="Mất việc (Displaced)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="RetrainCapacity" fill="#d97706" name="Năng lực đào tạo lại" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* SƠ ĐỒ LUỒNG SANKEY PHÂN TẦNG CHUẨN */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #0284c7', borderRadius: '8px', padding: '25px', marginBottom: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h4 style={{ width: '100%', margin: '0 0 15px 0', fontSize: '15px', color: '#0f172a', fontWeight: 'bold' }}>
              📊 Sơ đồ luồng Sankey (Swimming Lane) dịch chuyển cơ cấu việc làm vĩ mô Việt Nam
            </h4>

            <div style={{ width: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
              <Suspense fallback={<div style={{ color: '#64748b', padding: '30px', fontWeight: '500' }}>⏳ Đang ánh xạ cấu trúc đa luồng phân cấp ngành...</div>}>
                <PlotlyComponent
                  data={[{
                    type: "sankey",
                    orientation: "h",
                    node: {
                      pad: 15,
                      thickness: 25,
                      line: { color: "#e2e8f0", width: 1 },
                      label: resData.sankey_data.labels,
                      color: [
                        "#0284c7", "#059669", "#d97706", "#dc2626",
                        "#7c3aed", "#db2777", "#ea580c", "#4f46e5", // 8 Ngành gốc (Light theme colors)
                        "#ef4444", // Nút Displaced mất việc
                        "#f59e0b", // Nút Hệ thống Đào tạo lại
                        "#10b981"  // Nút Thị trường việc làm cuối cùng
                      ]
                    },
                    link: {
                      source: resData.sankey_data.sources,
                      target: resData.sankey_data.targets,
                      value: resData.sankey_data.values,
                      color: "rgba(148, 163, 184, 0.25)" // Màu luồng trong suốt nhẹ phù hợp nền trắng
                    }
                  }]}
                  layout={{
                    width: 1000,
                    height: 520,
                    paper_bgcolor: '#ffffff',
                    plot_bgcolor: '#ffffff',
                    font: { color: '#475569', size: 11, family: 'sans-serif', weight: '600' },
                    margin: { l: 20, r: 20, b: 20, t: 20 }
                  }}
                  config={{ displayModeBar: false }}
                />
              </Suspense>
            </div>
          </div>

          {/* Vùng Bảng dữ liệu và Cảnh báo */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '25px', marginBottom: '30px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Định hướng đào tạo ngành chế biến chế tạo */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #0ea5e9', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#0f172a', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  🎯 Ngưỡng đào tạo ngành Chế biến chế tạo
                </h3>
                <p style={{ color: '#475569', fontSize: '13px', margin: '0 0 10px 0', lineHeight: '1.6' }}>
                  Nếu đầu tư AI tập trung vào ngành Công nghiệp chế biến chế tạo, x_AI = 30.000 tỷ VND.
                </p>
                <p style={{ color: '#475569', fontSize: '13px', margin: '0 0 10px 0', lineHeight: '1.6' }}>
                  Khi đó NewJob khoảng 975 nghìn, còn DisplacedJob khoảng 786,24 nghìn.
                </p>
                <p style={{ color: '#475569', fontSize: '13px', margin: '0 0 12px 0', lineHeight: '1.6' }}>
                  Ngưỡng x_H để NetJob ≥ 0 là 0 tỷ VND.<br />
                  Ngưỡng x_H để DisplacedJob ≤ RetrainingCapacity là 24.570 tỷ VND.
                </p>
                <p style={{ color: '#059669', fontSize: '13px', margin: '0', lineHeight: '1.6', fontWeight: 'bold', padding: '10px', backgroundColor: '#ecfdf5', borderRadius: '4px', borderLeft: '3px solid #10b981' }}>
                  Vì vậy, ngưỡng chính sách nên thiết lập ở 24.570 tỷ VND để bảo đảm an sinh xã hội.
                </p>
              </div>

              {/* Kịch bản ràng buộc 5% lao động */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #dc2626', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#0f172a', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  Kịch bản ràng buộc 5% lao động
                </h4>
                <p style={{ color: '#475569', fontSize: '13px', margin: '0 0 10px 0', lineHeight: '1.6' }}>
                  Áp dụng ràng buộc "DisplacedJob_i ≤ 0,05*L" cho khả thi.
                </p>
                <ul style={{ color: '#475569', fontSize: '13px', margin: '0', paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li>Tổng NetJob: <b>1,56 triệu</b></li>
                  <li>Tổng DisplacedJob: <b>54,6 nghìn</b></li>
                  <li>Tổng RetrainingCapacity: <b>{(resData.sector_table.reduce((sum, s) => sum + s.retrain_capacity, 0) / 1000000).toFixed(2)} triệu</b></li>
                </ul>
              </div>

              {/* Chi tiết các ràng buộc kiểm chứng */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #d97706', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#0f172a', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  Chi tiết kiểm chứng ràng buộc
                </h4>
                <table style={{ width: '100%', fontSize: '12.5px', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                      <td style={{ padding: '10px', color: '#475569', fontWeight: '500' }}>1. Tổng NetJob ≥ 0</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#059669', fontWeight: 'bold' }}>✓ THỎA</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px', color: '#475569', fontWeight: '500' }}>2. Tổng Displaced ≤ Tổng RetrainCap</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#059669', fontWeight: 'bold' }}>✓ THỎA</td>
                    </tr>
                    <tr style={{ backgroundColor: '#f8fafc' }}>
                      <td style={{ padding: '10px', color: '#475569', fontWeight: '500' }}>3. Tổng Displaced &lt; 5% nhân lực</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: resData.is_feasible_clause_4 ? '#059669' : '#dc2626', fontWeight: 'bold' }}>
                        {resData.is_feasible_clause_4 ? '✓ THỎA' : '✗ VI PHẠM'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ma trận bảng số liệu chi tiết phân phối cho 8 ngành */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #059669', borderRadius: '8px', padding: '20px', overflowX: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#0f172a', fontWeight: 'bold' }}>
                📋 Ma trận tối ưu hóa phân bổ vốn vĩ mô (x_AI vs x_H) và Biến động dòng việc làm
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'center', minWidth: '800px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', backgroundColor: '#f1f5f9' }}>
                    <th style={{ padding: '12px 10px', textAlign: 'left', borderRadius: '6px 0 0 0' }}>Ngành</th>
                    <th style={{ padding: '12px 10px' }}>LĐ (triệu)</th>
                    <th style={{ padding: '12px 10px' }}>Risk %</th>
                    <th style={{ padding: '12px 10px' }}>x_AI</th>
                    <th style={{ padding: '12px 10px' }}>x_H</th>
                    <th style={{ padding: '12px 10px' }}>NewJob</th>
                    <th style={{ padding: '12px 10px' }}>Upgrade</th>
                    <th style={{ padding: '12px 10px', color: '#dc2626' }}>Displaced</th>
                    <th style={{ padding: '12px 10px', color: '#059669' }}>RetrainCap</th>
                    <th style={{ padding: '12px 10px', color: '#0284c7', borderRadius: '0 6px 0 0' }}>NetJob</th>
                  </tr>
                </thead>
                <tbody>
                  {resData.sector_table.map((row, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: index % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                      <td style={{ padding: '12px 10px', textAlign: 'left', fontWeight: 'bold', color: '#0f172a' }}>{row.sector_name}</td>
                      <td style={{ color: '#475569' }}>{row.L_base.toLocaleString()}</td>
                      <td style={{ color: '#475569' }}>{row.risk_factor}</td>
                      <td style={{ color: '#0ea5e9', fontWeight: '600' }}>{row.x_AI.toLocaleString()}</td>
                      <td style={{ color: '#d97706', fontWeight: '600' }}>{row.x_H.toLocaleString()}</td>
                      <td style={{ color: '#475569' }}>{row.new_jobs.toLocaleString()}</td>
                      <td style={{ color: '#475569' }}>{row.upgrade_jobs.toLocaleString()}</td>
                      <td style={{ color: '#dc2626', fontWeight: '600' }}>{row.displaced_jobs.toLocaleString()}</td>
                      <td style={{ color: '#059669', fontWeight: '600' }}>{row.retrain_capacity.toLocaleString()}</td>
                      <td style={{ fontWeight: 'bold', color: row.net_jobs >= 0 ? '#0284c7' : '#dc2626' }}>
                        {row.net_jobs >= 0 ? '+' : ''}{row.net_jobs.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* 9.5 Nhận xét và hàm ý chính sách */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid #0284c7', borderRadius: '8px', padding: '25px', marginBottom: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', color: '#0f172a', marginBottom: '20px', fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🏛️</span> 9.5. Nhận xét và Hàm ý chính sách (Mô phỏng Lao động & An sinh)
            </h3>
            
            <div style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.8' }}>
              
              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <b style={{ color: '#0284c7', fontSize: '14.5px', display: 'block', marginBottom: '8px' }}>
                  a) Ngành nào cần đầu tư đào tạo lại nhiều nhất theo kết quả tối ưu? Có khớp với cảm nhận thực tế ở Việt Nam không?
                </b>
                <p style={{ margin: 0, textAlign: 'justify' }}>
                  <b style={{ color: '#0f172a' }}>Kết quả mô hình:</b> Ngành <b style={{ color: '#0f172a' }}>Chế biến, chế tạo</b> (Manufacturing) và <b style={{ color: '#0f172a' }}>Bán buôn, bán lẻ</b> luôn chiếm tỷ trọng quỹ đào tạo lại (Retraining Budget) lớn nhất trong mô hình tối ưu.<br />
                  <b style={{ color: '#0f172a' }}>Thực tiễn Việt Nam:</b> Hoàn toàn khớp với thực tế. Đây là hai ngành thâm dụng lao động khổng lồ, dựa chủ yếu vào nhân công giá rẻ, tay nghề thấp. Khi tự động hóa và AI (robot lắp ráp, hệ thống kho bãi thông minh, thanh toán tự động) tràn vào, hàng triệu lao động lắp ráp và nhân viên thu ngân sẽ bị đào thải. Mô hình nhận diện chính xác đây là "tâm chấn" của cuộc khủng hoảng việc làm, buộc thuật toán phải dồn phần lớn quỹ an sinh vào đây để upskill (nâng cao kỹ năng) cho lực lượng này.
                </p>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <b style={{ color: '#059669', fontSize: '14.5px', display: 'block', marginBottom: '8px' }}>
                  b) Ngành Tài chính-Ngân hàng có nguy cơ thay thế 52% nhưng hệ số tạo việc làm mới rất cao. Khuyến nghị chiến lược gì?
                </b>
                <p style={{ margin: 0, textAlign: 'justify' }}>
                  <b style={{ color: '#0f172a' }}>Phân tích cơ cấu:</b> Con số thay thế 52% chủ yếu rơi vào các vị trí thủ công (Giao dịch viên, kiểm tra hồ sơ tín dụng cơ bản). Ngược lại, hệ số tạo việc làm lớn đến từ các vị trí phân tích dữ liệu (Data Analyst), quản trị rủi ro AI và Fintech.<br />
                  <b style={{ color: '#0f172a' }}>Chiến lược khuyến nghị:</b> Mô hình ngụ ý một chiến lược <b style={{ color: '#0f172a' }}>"Tái cơ cấu nội ngành" (Internal Restructuring)</b>. Thay vì sa thải 52% nhân sự cũ và tuyển mới hoàn toàn người làm IT, các ngân hàng cần dùng ngân sách để chuyển đổi kỹ năng (Reskill) chính các giao dịch viên này thành nhân sự dán nhãn dữ liệu tài chính hoặc tư vấn viên công nghệ. Tận dụng <i>Domain Knowledge (kiến thức nghiệp vụ ngành)</i> của họ kết hợp với kỹ năng số mới là con đường tối ưu và nhân văn nhất.
                </p>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <b style={{ color: '#d97706', fontSize: '14.5px', display: 'block', marginBottom: '8px' }}>
                  c) Có nên đầu tư x<sub>AI</sub> vào Nông nghiệp không, vì tạo việc làm thấp (8,5) nhưng lao động dịch chuyển lớn?
                </b>
                <p style={{ margin: 0, textAlign: 'justify' }}>
                  <b style={{ color: '#0f172a' }}>Phản ứng của thuật toán:</b> Mô hình sẽ <b style={{ color: '#0f172a' }}>hạn chế tối đa</b> việc rót vốn x<sub>AI</sub> trực tiếp vào Nông nghiệp ở giai đoạn đầu. Nếu tăng tốc tự động hóa nông nghiệp, số lượng nông dân mất việc sẽ tăng đột biến, trong khi ngành này lại không thể tạo ra đủ vị trí kỹ sư AI để hấp thụ lại họ (hệ số 8.5 rất thấp), dẫn đến NetJob bị âm nặng, phá vỡ ràng buộc an sinh.<br />
                  <b style={{ color: '#0f172a' }}>Hàm ý chính sách:</b> Không "bơm" AI ồ ạt vào Nông nghiệp khi chưa chuẩn bị xong van xả. Chính phủ cần dồn vốn x<sub>AI</sub> vào khối Công nghiệp và Dịch vụ trước để tạo ra một lượng việc làm thặng dư khổng lồ. Chỉ khi các ngành này sẵn sàng "hút" được lượng nông dân mất việc (chuyển dịch cơ cấu lao động nông thôn ra thành thị), ta mới bắt đầu nâng tỷ lệ tự động hóa trong Nông nghiệp.
                </p>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <b style={{ color: '#dc2626', fontSize: '14.5px', display: 'block', marginBottom: '8px' }}>
                  d) “Tốc độ tự động hóa không nên vượt quá năng lực đào tạo lại” được biểu diễn bằng ràng buộc nào? Đề xuất bổ sung?
                </b>
                <p style={{ margin: 0, textAlign: 'justify' }}>
                  <b style={{ color: '#0f172a' }}>Biểu diễn toán học:</b> Phát biểu này chính là <b style={{ color: '#0f172a' }}>Ràng buộc Dòng chảy Việc làm (NetJob Constraint)</b> trong mô hình LP. Cụ thể:<br />
                  <span style={{ color: '#b91c1c', fontFamily: 'monospace', display: 'block', margin: '8px 0', backgroundColor: '#fef2f2', padding: '6px 10px', borderRadius: '4px', border: '1px solid #fecaca' }}>Lao động bị thay thế (Displaced) &minus; Việc làm mới (Created) &le; Năng lực quỹ đào tạo (Retraining Capacity)</span>
                  Nghĩa là, số lượng người mất việc thực tế (sau khi đã trừ đi số người tìm được việc mới do AI tạo ra) tuyệt đối không được vượt quá số "ghế" trong các trung tâm dạy nghề mà ngân sách có thể chi trả.<br />
                  <b style={{ color: '#0f172a' }}>Đề xuất bổ sung:</b> Để đảm bảo an sinh xã hội thực chất, cần bổ sung thêm <b style={{ color: '#0f172a' }}>Ràng buộc Trần thất nghiệp cục bộ (Sectoral Unemployment Cap)</b>. Ràng buộc NetJob tổng thể có thể che đậy việc ngành IT có NetJob +1 triệu, trong khi Dệt may có NetJob -1 triệu (bù trừ bằng 0). Ràng buộc mới sẽ ép: <i>"Mức NetJob âm của bất kỳ ngành i nào cũng không được vượt quá 5% tổng quy mô lao động của chính ngành đó"</i>, nhằm ngăn chặn nguy cơ đứt gãy an sinh và bạo loạn xã hội ở các khu công nghiệp.
                </p>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}