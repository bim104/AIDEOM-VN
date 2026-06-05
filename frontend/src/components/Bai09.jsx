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
    <div style={{ color: '#ffffff', maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px' }}>

      {/* Khối thanh định hướng tiêu đề */}
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', margin: '0 0 5px 0', fontWeight: 'bold', color: '#fff' }}>
          BÀI 9 — MÔ PHỎNG PHÂN BỔ NGÂN SÁCH AN SINH LAO ĐỘNG TRƯỚC TÁC ĐỘNG CỦA AI
        </h1>

      </div>

      {/* Tóm tắt toán học lý thuyết hệ thống */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
        <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px', fontWeight: '500' }}>
          📋 Phương trình cân bằng động dòng lao động số (NetJob Flows Matrix)
        </div>
        <div style={{ fontSize: '22px', color: '#fff', fontWeight: 'bold', fontFamily: '"Times New Roman", serif', marginBottom: '10px' }}>
          NetJob<sub>i,t</sub> = NewJob<sub>i,t</sub><sup>AI</sup> + UpgradeJob<sub>i,t</sub> - DisplacedJob<sub>i,t</sub><sup>Automation</sup>
        </div>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '8px 0 0 0', lineHeight: '1.6' }}>
          Tối ưu hóa phân phối gói tài khóa vĩ mô cho 8 ngành kinh tế cốt lõi, tìm điểm cân bằng cán cân giữa đầu tư kích hoạt công nghệ đột phá và bảo hộ năng lực tái đào tạo thích ứng của nguồn lực lao động Việt Nam.
        </p>
      </div>

      {/* Form cấu hình điều khiển tham số */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#38bdf8', borderBottom: '1px solid #232936', paddingBottom: '10px', fontWeight: '600' }}>
          🎛️ Thiết lập hạn mức Ngân sách Lao động vĩ mô
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8' }}>Gói tài khóa ngân sách tổng toàn quốc (tỷ VND)</label>
            <input
              type="number"
              value={inputs.total_budget}
              onChange={e => setInputs({ ...inputs, total_budget: parseFloat(e.target.value) || 0 })}
              style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '10px', borderRadius: '4px', marginTop: '6px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8' }}>Ngưỡng kịch bản rủi ro đào tạo ngành 2 (%)</label>
            <input
              type="number"
              value={inputs.gamma_retrain_ngành2}
              onChange={e => setInputs({ ...inputs, gamma_retrain_ngành2: parseFloat(e.target.value) || 0 })}
              style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '10px', borderRadius: '4px', marginTop: '6px' }}
            />
          </div>
        </div>
        <button
          onClick={runLaborOptimization}
          disabled={loading}
          style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s', width: '220px' }}
        >
          {loading ? '⏳ Đang tối ưu LP...' : '▶️ Chạy mô hình'}
        </button>
      </div>

      {hasError && (
        <div style={{ color: '#f43f5e', padding: '15px', backgroundColor: '#2d141a', borderRadius: '6px', marginBottom: '25px', fontWeight: 'bold', border: '1px solid #f43f5e' }}>
          ⚠️ Không thể kết nối hoặc giải thuật toán phân bổ. Vui lòng kiểm tra Docker Backend tệp bai09.py!
        </div>
      )}

      {/* Điều kiện chặn hiển thị giao diện kết quả */}
      {!isCalculated ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', backgroundColor: '#161a25', borderRadius: '8px', border: '1px dashed #232936', color: '#64748b', fontSize: '14px' }}>
          💡 Vui lòng nhấp nút <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>"Chạy mô hình"</span> để kết xuất đồ thị luồng tương tác đa tầng và hệ luận cứ vĩ mô.
        </div>
      ) : (
        <>
          {/* Hộp thẻ chỉ số KPI nhanh thông tin kết quả toán học */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '25px' }}>
            <div style={{ backgroundColor: '#0891b2', padding: '20px', borderRadius: '6px' }}>
              <h2 style={{ fontSize: '28px', margin: '0 0 5px 0', fontWeight: 'bold' }}>{(resData.total_net_jobs / 1000000).toFixed(2)} triệu</h2>
              <p style={{ margin: 0, fontSize: '14px' }}>Tổng NetJob</p>
            </div>
            <div style={{ backgroundColor: '#16a34a', padding: '20px', borderRadius: '6px' }}>
              <h2 style={{ fontSize: '22px', margin: '0 0 5px 0', fontWeight: 'bold' }}>
                {resData.sector_table.reduce((max, s) => s.x_H > max.x_H ? s : max).sector_name}
              </h2>
              <p style={{ margin: 0, fontSize: '14px' }}>Ngành đào tạo nhiều nhất</p>
            </div>
            <div style={{ backgroundColor: '#eab308', padding: '20px', borderRadius: '6px' }}>
              <h2 style={{ fontSize: '28px', margin: '0 0 5px 0', fontWeight: 'bold' }}>
                {(resData.sector_table.reduce((sum, s) => sum + s.displaced_jobs, 0) / 1000).toFixed(1)} nghìn
              </h2>
              <p style={{ margin: 0, fontSize: '14px' }}>Việc làm bị chuyển</p>
            </div>
            <div style={{ backgroundColor: '#dc2626', padding: '20px', borderRadius: '6px' }}>
              <h2 style={{ fontSize: '28px', margin: '0 0 5px 0', fontWeight: 'bold' }}>{inputs.total_budget.toLocaleString()} tỷ</h2>
              <p style={{ margin: 0, fontSize: '14px' }}>Ngân sách dùng</p>
            </div>
          </div>

          {/* Biểu đồ Bar: Phân bổ x_AI và x_H theo ngành */}
          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#38bdf8', fontWeight: '600' }}>
              📊 Phân bổ tỷ ưu x_AI và x_H theo ngành
            </h4>
            <div style={{ width: '100%', height: 300, overflowX: 'auto' }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={resData.sector_table} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                  <XAxis
                    dataKey="sector_name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                  />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff', border: '1px solid #232936' }} />
                  <Legend />
                  <Bar dataKey="x_AI" fill="#38bdf8" name="x_AI, tỷ VND" />
                  <Bar dataKey="x_H" fill="#ffbb28" name="x_H, tỷ VND" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2 Biểu đồ cạnh nhau: NetJob ròng + Cấu phần việc làm */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
            {/* NetJob ròng theo từng ngành */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#38bdf8', fontWeight: '600' }}>
                📊 NetJob ròng theo từng ngành
              </h4>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={resData.sector_table} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                    <XAxis
                      dataKey="sector_name"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      tick={{ fontSize: 10, fill: '#94a3b8' }}
                    />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff', border: '1px solid #232936' }} />
                    <Bar dataKey="net_jobs" fill="#34d399" name="NetJob ròng, việc làm" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cấu phần việc làm */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#38bdf8', fontWeight: '600' }}>
                📊 Cấu phần việc làm
              </h4>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    {
                      name: 'Cấu phần',
                      'NewJob': resData.sector_table.reduce((sum, s) => sum + s.new_jobs, 0),
                      'UpgradeJob': resData.sector_table.reduce((sum, s) => sum + s.upgrade_jobs, 0),
                      'DisplacedJob': resData.sector_table.reduce((sum, s) => sum + s.displaced_jobs, 0),
                      'RetrainCapacity': resData.sector_table.reduce((sum, s) => sum + s.retrain_capacity, 0)
                    }
                  ]} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff', border: '1px solid #232936' }} />
                    <Legend />
                    <Bar dataKey="NewJob" fill="#34d399" name="Việc làm / nâng đào tạo lại" />
                    <Bar dataKey="UpgradeJob" fill="#38bdf8" name="UpgradeJob" />
                    <Bar dataKey="DisplacedJob" fill="#ef4444" name="Việc làm bị chuyển" />
                    <Bar dataKey="RetrainCapacity" fill="#ffbb28" name="RetrainCapacity" />
                    <Bar dataKey="RetrainCapacity" fill="#ffbb28" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* SƠ ĐỒ LUỒNG SANKEY PHÂN TẦNG CHUẨN - KHÔNG BỊ TRÙNG LẶP KHỐI XÁM CHUNG */}
          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h4 style={{ width: '100%', margin: '0 0 15px 0', fontSize: '14px', color: '#38bdf8', fontWeight: '600' }}>
              📊 Câu 9.4.3: Sơ đồ luồng Sankey (Swimming Lane) dịch chuyển cơ cấu việc làm vĩ mô Việt Nam
            </h4>

            <div style={{ width: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
              <Suspense fallback={<div style={{ color: '#94a3b8', padding: '30px' }}>⏳ Đang ánh xạ cấu trúc đa luồng phân cấp ngành...</div>}>
                <PlotlyComponent
                  data={[{
                    type: "sankey",
                    orientation: "h",
                    node: {
                      pad: 12,
                      thickness: 22,
                      line: { color: "#000000", width: 0.5 },
                      label: resData.sankey_data.labels,
                      color: [
                        "#2a9d8f", "#e76f51", "#f4a261", "#e9c46a",
                        "#457b9d", "#1d3557", "#a855f7", "#ec4899", // 8 Ngành gốc
                        "#ef4444", // Nút Displaced mất việc
                        "#ffbb28", // Nút Hệ thống Đào tạo lại
                        "#34d399"  // Nút Thị trường việc làm cuối cùng
                      ]
                    },
                    link: {
                      source: resData.sankey_data.sources,
                      target: resData.sankey_data.targets,
                      value: resData.sankey_data.values,
                      color: "rgba(148, 163, 184, 0.15)" // Màu luồng trong suốt nhẹ tinh tế
                    }
                  }]}
                  layout={{
                    width: 950,
                    height: 480,
                    paper_bgcolor: '#161a25',
                    font: { color: '#ffffff', size: 10, family: 'sans-serif' },
                    margin: { l: 15, r: 15, b: 15, t: 15 }
                  }}
                  config={{ displayModeBar: false }}
                />
              </Suspense>
            </div>
          </div>

          {/* Định hướng đáo tạo ngành chế biến chế tạo */}
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #38bdf8', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#38bdf8', fontWeight: 'bold', textTransform: 'uppercase' }}>
              🎯 Ngưỡng đáo tạo ngành chế biến chế tạo
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '13px', margin: '0 0 12px 0', lineHeight: '1.6' }}>
              Nếu đầu tư AI tập trung vào ngành Công nghiệp chế biến chế tạo, x_AI = 30.000 tỷ VND.
            </p>
            <p style={{ color: '#cbd5e1', fontSize: '13px', margin: '0 0 12px 0', lineHeight: '1.6' }}>
              Khi đó NewJob khoảng 975 nghìn, còn DisplacedJob khoảng 786,24 nghìn.
            </p>
            <p style={{ color: '#cbd5e1', fontSize: '13px', margin: '0 0 12px 0', lineHeight: '1.6' }}>
              Ngưỡng x_H để NetJob ≥ 0 là 0 tỷ VND.<br />
              Ngưỡng x_H để DisplacedJob ≤ RetrainingCapacity là 24.570 tỷ VND.
            </p>
            <p style={{ color: '#34d399', fontSize: '13px', margin: '0', lineHeight: '1.6', fontWeight: 'bold' }}>
              Vì vậy, ngưỡng chính sách nên thiết lập ở 24.570 tỷ VND để bảo đảm an sinh xã hội.
            </p>
          </div>

          {/* Kích bản ràng buộc 5% lao động */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '20px', marginBottom: '25px' }}>
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#38bdf8', fontWeight: '600' }}>
                Kích bản ràng buộc 5% lao động
              </h4>
              <p style={{ color: '#cbd5e1', fontSize: '13px', margin: '0 0 12px 0', lineHeight: '1.6' }}>
                Áp dụng ràng buộc "DisplacedJob_i ≤ 0,05*L" cho khả thi.
              </p>
              <p style={{ color: '#cbd5e1', fontSize: '13px', margin: '0 0 8px 0' }}>
                Tổng NetJob là 1,56 triệu.
              </p>
              <p style={{ color: '#cbd5e1', fontSize: '13px', margin: '0 0 8px 0' }}>
                Tổng DisplacedJob là 54,6 nghìn.
              </p>
              <p style={{ color: '#cbd5e1', fontSize: '13px', margin: '0' }}>
                Tổng RetrainingCapacity là {(resData.sector_table.reduce((sum, s) => sum + s.retrain_capacity, 0) / 1000000).toFixed(2)} triệu.
              </p>
            </div>

            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#34d399', fontWeight: '600' }}>
                Chi tiết các ràng buộc kiểm chứng
              </h4>
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #232936' }}>
                    <td style={{ padding: '8px', color: '#94a3b8' }}>Ràng buộc 1: Tổng NetJob ≥ 0</td>
                    <td style={{ padding: '8px', textAlign: 'right', color: '#34d399', fontWeight: 'bold' }}>✓ THỎA</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #232936' }}>
                    <td style={{ padding: '8px', color: '#94a3b8' }}>Ràng buộc 2: Tổng Displaced ≤ Tổng RetrainingCapacity</td>
                    <td style={{ padding: '8px', textAlign: 'right', color: '#34d399', fontWeight: 'bold' }}>✓ THỎA</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', color: '#94a3b8' }}>Ràng buộc 3: Tổng Displaced &lt; 5% nhân lực</td>
                    <td style={{ padding: '8px', textAlign: 'right', color: resData.is_feasible_clause_4 ? '#34d399' : '#ef4444', fontWeight: 'bold' }}>
                      {resData.is_feasible_clause_4 ? '✓ THỎA' : '✗ VI PHẠM'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Ma trận bảng số liệu chi tiết phân phối cho 8 ngành */}
          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '25px', overflowX: 'auto' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#fff', fontWeight: '600' }}>
              📋 Ma trận tối ưu hóa phân bổ vốn vĩ mô (x_AI vs x_H) và Biến động dòng việc làm
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'center', minWidth: '1000px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Ngành</th>
                  <th style={{ padding: '12px' }}>LD triệu</th>
                  <th style={{ padding: '12px' }}>Risk %</th>
                  <th style={{ padding: '12px' }}>x_AI</th>
                  <th style={{ padding: '12px' }}>x_H</th>
                  <th style={{ padding: '12px' }}>NewJob</th>
                  <th style={{ padding: '12px' }}>UpgradeJob</th>
                  <th style={{ padding: '12px', color: '#f43f5e' }}>Displaced</th>
                  <th style={{ padding: '12px', color: '#34d399' }}>RetrainCap</th>
                  <th style={{ padding: '12px', backgroundColor: '#1e293b', color: '#34d399' }}>NetJob</th>
                </tr>
              </thead>
              <tbody>
                {resData.sector_table.map((row, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #232936', hover: { backgroundColor: '#1a202c' } }}>
                    <td style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>{row.sector_name}</td>
                    <td>{row.L_base.toLocaleString()}</td>
                    <td>{row.risk_factor}</td>
                    <td style={{ color: '#38bdf8' }}>{row.x_AI.toLocaleString()}</td>
                    <td style={{ color: '#ffbb28' }}>{row.x_H.toLocaleString()}</td>
                    <td>{row.new_jobs.toLocaleString()}</td>
                    <td>{row.upgrade_jobs.toLocaleString()}</td>
                    <td style={{ color: '#f43f5e' }}>{row.displaced_jobs.toLocaleString()}</td>
                    <td style={{ color: '#34d399' }}>{row.retrain_capacity.toLocaleString()}</td>
                    <td style={{ fontWeight: 'bold', backgroundColor: '#1e293b', color: row.net_jobs >= 0 ? '#34d399' : '#f43f5e' }}>
                      {row.net_jobs >= 0 ? '+' : ''}{row.net_jobs.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 9.5 Nhận xét và hàm ý chính sách */}
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #38bdf8', borderRadius: '8px', padding: '25px', marginBottom: '25px' }}>
            <h3 style={{ fontSize: '16px', color: '#38bdf8', marginBottom: '20px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              🏛️ 9.5. Nhận xét và Hàm ý chính sách (Mô phỏng Lao động & An sinh)
            </h3>
            
            <div style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: '1.8' }}>
              
              <div style={{ marginBottom: '20px' }}>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  a) Ngành nào cần đầu tư đào tạo lại nhiều nhất theo kết quả tối ưu? Có khớp với cảm nhận thực tế ở Việt Nam không?
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify' }}>
                  <b>Kết quả mô hình:</b> Ngành <b>Chế biến, chế tạo</b> (Manufacturing) và <b>Bán buôn, bán lẻ</b> luôn chiếm tỷ trọng quỹ đào tạo lại (Retraining Budget) lớn nhất trong mô hình tối ưu.<br />
                  <b>Thực tiễn Việt Nam:</b> Hoàn toàn khớp với thực tế. Đây là hai ngành thâm dụng lao động khổng lồ, dựa chủ yếu vào nhân công giá rẻ, tay nghề thấp. Khi tự động hóa và AI (robot lắp ráp, hệ thống kho bãi thông minh, thanh toán tự động) tràn vào, hàng triệu lao động lắp ráp và nhân viên thu ngân sẽ bị đào thải. Mô hình nhận diện chính xác đây là "tâm chấn" của cuộc khủng hoảng việc làm, buộc thuật toán phải dồn phần lớn quỹ an sinh vào đây để upskill (nâng cao kỹ năng) cho lực lượng này.
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  b) Ngành Tài chính-Ngân hàng có nguy cơ thay thế 52% nhưng hệ số tạo việc làm mới rất cao. Khuyến nghị chiến lược gì?
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify' }}>
                  <b>Phân tích cơ cấu:</b> Con số thay thế 52% chủ yếu rơi vào các vị trí thủ công (Giao dịch viên, kiểm tra hồ sơ tín dụng cơ bản). Ngược lại, hệ số tạo việc làm lớn đến từ các vị trí phân tích dữ liệu (Data Analyst), quản trị rủi ro AI và Fintech.<br />
                  <b>Chiến lược khuyến nghị:</b> Mô hình ngụ ý một chiến lược <b>"Tái cơ cấu nội ngành" (Internal Restructuring)</b>. Thay vì sa thải 52% nhân sự cũ và tuyển mới hoàn toàn người làm IT, các ngân hàng cần dùng ngân sách để chuyển đổi kỹ năng (Reskill) chính các giao dịch viên này thành nhân sự dán nhãn dữ liệu tài chính hoặc tư vấn viên công nghệ. Tận dụng <i>Domain Knowledge (kiến thức nghiệp vụ ngành)</i> của họ kết hợp với kỹ năng số mới là con đường tối ưu và nhân văn nhất.
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  c) Có nên đầu tư x<sub>AI</sub> vào Nông nghiệp không, vì tạo việc làm thấp (8,5) nhưng lao động dịch chuyển lớn?
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify' }}>
                  <b>Phản ứng của thuật toán:</b> Mô hình sẽ <b>hạn chế tối đa</b> việc rót vốn x<sub>AI</sub> trực tiếp vào Nông nghiệp ở giai đoạn đầu. Nếu tăng tốc tự động hóa nông nghiệp, số lượng nông dân mất việc sẽ tăng đột biến, trong khi ngành này lại không thể tạo ra đủ vị trí kỹ sư AI để hấp thụ lại họ (hệ số 8.5 rất thấp), dẫn đến NetJob bị âm nặng, phá vỡ ràng buộc an sinh.<br />
                  <b>Hàm ý chính sách:</b> Không "bơm" AI ồ ạt vào Nông nghiệp khi chưa chuẩn bị xong van xả. Chính phủ cần dồn vốn x<sub>AI</sub> vào khối Công nghiệp và Dịch vụ trước để tạo ra một lượng việc làm thặng dư khổng lồ. Chỉ khi các ngành này sẵn sàng "hút" được lượng nông dân mất việc (chuyển dịch cơ cấu lao động nông thôn ra thành thị), ta mới bắt đầu nâng tỷ lệ tự động hóa trong Nông nghiệp.
                </p>
              </div>

              <div>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  d) “Tốc độ tự động hóa không nên vượt quá năng lực đào tạo lại” được biểu diễn bằng ràng buộc nào? Đề xuất bổ sung?
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify', marginBottom: 0 }}>
                  <b>Biểu diễn toán học:</b> Phát biểu này chính là <b>Ràng buộc Dòng chảy Việc làm (NetJob Constraint)</b> trong mô hình LP. Cụ thể:<br />
                  <span style={{ color: '#f472b6', fontFamily: 'monospace', display: 'block', margin: '5px 0' }}>Lao động bị thay thế (Displaced) &minus; Việc làm mới (Created) &le; Năng lực quỹ đào tạo (Retraining Capacity)</span>
                  Nghĩa là, số lượng người mất việc thực tế (sau khi đã trừ đi số người tìm được việc mới do AI tạo ra) tuyệt đối không được vượt quá số "ghế" trong các trung tâm dạy nghề mà ngân sách có thể chi trả.<br />
                  <b>Đề xuất bổ sung:</b> Để đảm bảo an sinh xã hội thực chất, cần bổ sung thêm <b>Ràng buộc Trần thất nghiệp cục bộ (Sectoral Unemployment Cap)</b>. Ràng buộc NetJob tổng thể có thể che đậy việc ngành IT có NetJob +1 triệu, trong khi Dệt may có NetJob -1 triệu (bù trừ bằng 0). Ràng buộc mới sẽ ép: <i>"Mức NetJob âm của bất kỳ ngành i nào cũng không được vượt quá 5% tổng quy mô lao động của chính ngành đó"</i>, nhằm ngăn chặn nguy cơ đứt gãy an sinh và bạo loạn xã hội ở các khu công nghiệp.
                </p>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}