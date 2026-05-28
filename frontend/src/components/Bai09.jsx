import React, { useState, lazy, Suspense } from 'react';

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
        <div style={{ fontSize: '16px', color: '#34d399', fontWeight: 'bold', fontFamily: 'monospace' }}>
          NetJob_i = NewJob_i + UpgradeJob_i - DisplacedJob_i | Điều kiện biên: Displaced {"<="} RetrainingCapacity
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
              onChange={e => setInputs({...inputs, total_budget: parseFloat(e.target.value) || 0})} 
              style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '10px', borderRadius: '4px', marginTop: '6px' }} 
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8' }}>Ngưỡng kịch bản rủi ro đào tạo ngành 2 (%)</label>
            <input 
              type="number" 
              value={inputs.gamma_retrain_ngành2} 
              onChange={e => setInputs({...inputs, gamma_retrain_ngành2: parseFloat(e.target.value) || 0})} 
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '25px' }}>
            <div style={{ backgroundColor: '#1e293b', borderLeft: '4px solid #2a9d8f', padding: '20px', borderRadius: '8px' }}>
              <div style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600' }}>Tổng việc làm thuần ròng toàn quốc</div>
              <h2 style={{ fontSize: '26px', margin: '5px 0 0 0', fontWeight: 'bold', color: '#34d399' }}>+{resData.total_net_jobs.toLocaleString()} việc</h2>
            </div>
            <div style={{ backgroundColor: '#1e293b', borderLeft: '4px solid #e29578', padding: '20px', borderRadius: '8px' }}>
              <div style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600' }}>9.4.2 Ngưỡng x_H_2 tối thiểu cứu ngành 2</div>
              <h2 style={{ fontSize: '26px', margin: '5px 0 0 0', fontWeight: 'bold', color: '#ffbb28' }}>{resData.threshold_sector2_x_H.toLocaleString()} tỷ VND</h2>
            </div>
            <div style={{ backgroundColor: '#1e293b', borderLeft: `4px solid ${resData.is_feasible_clause_4 ? '#118ab2' : '#ef4444'}`, padding: '20px', borderRadius: '8px' }}>
              <div style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600' }}>9.4.4 Ràng buộc an sinh bảo hộ ({"<"}5%)</div>
              <h2 style={{ fontSize: '22px', margin: '8px 0 0 0', fontWeight: 'bold', color: resData.is_feasible_clause_4 ? '#38bdf8' : '#ef4444' }}>
                {resData.is_feasible_clause_4 ? "KHẢ THI (ĐẠT CHUẨN)" : "VI PHẠM AN SINH"}
              </h2>
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

          {/* Ma trận bảng số liệu chi tiết phân phối cho 8 ngành */}
          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '25px', overflowX: 'auto' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#fff', fontWeight: '600' }}>
              📋 Ma trận tối ưu hóa phân bổ vốn vĩ mô (x_AI vs x_H) và Biến động dòng việc làm
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'center', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Phân nhóm ngành kinh tế quốc gia</th>
                  <th style={{ padding: '12px' }}>Đầu tư AI (tỷ)</th>
                  <th style={{ padding: '12px' }}>Đầu tư Nhân lực H (tỷ)</th>
                  <th style={{ padding: '12px' }}>Việc làm mới</th>
                  <th style={{ padding: '12px' }}>Nâng cấp số</th>
                  <th style={{ padding: '12px', color: '#f43f5e' }}>Mất việc (AI)</th>
                  <th style={{ padding: '12px', backgroundColor: '#1e293b', color: '#34d399' }}>NetJob ròng</th>
                </tr>
              </thead>
              <tbody>
                {resData.sector_table.map((row, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #232936', hover: { backgroundColor: '#1a202c' } }}>
                    <td style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>{row.sector_name}</td>
                    <td style={{ color: '#38bdf8' }}>{row.x_AI.toLocaleString()}</td>
                    <td style={{ color: '#ffbb28' }}>{row.x_H.toLocaleString()}</td>
                    <td>{row.new_jobs.toLocaleString()}</td>
                    <td>{row.upgrade_jobs.toLocaleString()}</td>
                    <td style={{ color: '#f43f5e' }}>-{row.displaced_jobs.toLocaleString()}</td>
                    <td style={{ fontWeight: 'bold', backgroundColor: '#1e293b', color: row.net_jobs >= 0 ? '#34d399' : '#f43f5e' }}>
                      {row.net_jobs >= 0 ? '+' : ''}{row.net_jobs.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 9.5: HỆ THỐNG LUẬN CỨ CHÍNH SÁCH CHUẨN KHÓA LUẬN VĂN */}
          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '4px solid #34d399', borderRadius: '8px', padding: '25px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#fff', fontWeight: 'bold' }}>
              🏛️ 9.5. Hệ thống Luận cứ & Thảo luận Định hướng Chiến lược Lao động quốc gia
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '13.5px', color: '#94a3b8', lineHeight: '1.7' }}>
              
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '6px', border: '1px solid #232936' }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#38bdf8', fontSize: '14px', fontWeight: 'bold' }}>a) Ngành kinh tế đòi hỏi dòng tiền đầu tư đào tạo lại nhiều nhất?</h5>
                <p style={{ margin: 0 }}>
                  • <b>Kết quả tối ưu:</b> Mô hình định tuyến dòng tiền tập trung cao độ tại <b>Ngành 2 (Công nghiệp chế biến, chế tạo)</b> và <b>Ngành 4 (Bán buôn, bán lẻ)</b>.<br />
                  • <b>Đối chiếu thực tiễn Việt Nam:</b> Điều này hoàn toàn khớp với thực tế phân bổ vĩ mô. Đây là những nhóm ngành thâm dụng lao động cơ học lớn, có tỷ lệ thao tác lặp lại cao nên cực kỳ dễ bị tổn thương khi các thuật toán AI tự động hóa thâm nhập sâu vào quy trình sản xuất.
                </p>
              </div>

              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '6px', border: '1px solid #232936' }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#34d399', fontSize: '14px', fontWeight: 'bold' }}>b) Chiến lược điều tiết cơ cấu đối với nhóm ngành Tài chính - Ngân hàng</h5>
                <p style={{ margin: 0 }}>
                  • <b>Cơ hội và thách thức:</b> Nhóm Tài chính - Ngân hàng có hệ số rủi ro thay thế tiệm cận đỉnh kịch trần (Risk = 52%), tuy nhiên hệ số phát sinh mô hình việc làm số mới (alpha) của nhóm này cũng đứng top đầu thị trường.<br />
                  • <b>Khuyến nghị điều hành:</b> Chiến lược ưu tiên không phải là cản trở hành chính việc ứng dụng AI, mà là chủ động thiết lập lộ trình chuyển dịch kỹ năng, biến lực lượng giao dịch viên truyền thống thành chuyên viên quản trị mô hình AI, khai phá dữ liệu lớn và phân tích rủi ro số hóa.
                </p>
              </div>

              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '6px', border: '1px solid #232936' }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#ffbb28', fontSize: '14px', fontWeight: 'bold' }}>c) Bản chất phân bổ x_AI vào nhóm ngành Nông - Lâm - Thủy sản</h5>
                <p style={{ margin: 0 }}>
                  • <b>Bản chất mô hình:</b> Hệ số tạo việc làm AI trực tiếp trong nông nghiệp cơ học rất thấp. Do đó, thuật toán tối ưu hóa LP sẽ tự động tiết giảm đầu tư AI diện rộng vào nông nghiệp để dồn lực vào việc nâng cấp kỹ năng nông nghiệp số công nghệ cao, ngăn chặn làn sóng dịch chuyển lao động nông thôn gây bất ổn an sinh xã hội.
                </p>
              </div>

              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '6px', border: '1px solid #232936' }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#ff6b6b', fontSize: '14px', fontWeight: 'bold' }}>d) Định luật "Tốc độ tự động hóa không vượt quá năng lực đào tạo lại"</h5>
                <p style={{ margin: 0 }}>
                  • <b>Biểu diễn toán học:</b> Mệnh đề cốt lõi này được khóa chặt bằng hệ ràng buộc bất đẳng thức phi tuyến: <span style={{ fontFamily: 'monospace', color: '#f43f5e', fontWeight: 'bold' }}>DisplacedJob_i {"<="} RetrainingCapacity_i</span>.<br />
                  • <b>Khuyến nghị bổ sung ràng buộc an sinh:</b> Khuyến nghị bổ sung thêm ràng buộc: <span style={{ fontFamily: 'monospace', color: '#34d399', fontWeight: 'bold' }}>x_H_i {"_>_="} alpha * x_AI_i</span> (Đầu tư công nghệ bắt buộc phải đi kèm một tỷ lệ ngân sách đối ứng cố định cho quỹ đào tạo lại nguồn lực), bảo đảm tốc độ thay thế của máy móc không vượt quá khả năng hấp thụ và chuyển đổi kỹ năng của người lao động.
                </p>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}