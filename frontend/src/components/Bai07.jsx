import React, { useState } from 'react';
// Nạp bộ vẽ đồ thị 3D tương tác động
import Plot from 'react-plotly.js';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Bai07() {
  const [inputs, setInputs] = useState({
    w_growth: 0.40,
    w_inclusive: 0.25,
    w_env: 0.20,
    w_security: 0.15,
    pop_size: 100,
    n_gen: 200
  });

  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleInputChange = (field, val) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(val) || 0 }));
  };

  const runNSGA2Optimization = () => {
    setLoading(true);
    setHasError(false);
    
    // 💡 CƠ CHẾ PHÒNG VỆ CHỐNG ĐEN MÀN HÌNH CHÍ MẠNG
    setIsCalculated(false);
    setResData(null);

    fetch('http://localhost:8000/api/bai07/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputs)
    })
    .then(res => {
      if (!res.ok) throw new Error("Backend sập cổng tối ưu");
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
      console.error("Lỗi API Bài 7:", err);
      setLoading(false);
      setHasError(true);
      setIsCalculated(false);
    });
  };

  // Tách mảng dữ liệu phục vụ riêng cho Scatter 3D Plotly
  const getPlotlyData = () => {
    if (!resData || !resData.scatter_data) return [];
    
    const x = resData.scatter_data.map(d => d.f1); // Trục X: Tăng trưởng
    const y = resData.scatter_data.map(d => d.f2); // Trục Y: Bao trùm
    const z = resData.scatter_data.map(d => d.f3); // Trục Z: Môi trường
    const colors = resData.scatter_data.map(d => d.is_topsis === 1 ? '#ffbb28' : '#38bdf8');
    const sizes = resData.scatter_data.map(d => d.is_topsis === 1 ? 12 : 6);

    return [{
      x: x, y: y, z: z,
      mode: 'markers',
      type: 'scatter3d',
      marker: {
        size: sizes,
        color: colors,
        opacity: 0.8,
        line: { color: '#1e293b', width: 0.5 }
      },
      text: resData.scatter_data.map(d => `Nghiệm thứ: ${d.index}<br>F1 (Growth): ${d.f1}<br>F2 (Inclusive): ${d.f2}<br>F3 (Env): ${d.f3}`),
      hoverinfo: 'text'
    }];
  };

  return (
    <div style={{ color: '#ffffff', maxWidth: '1400px', margin: '0 auto', paddingBottom: '30px' }}>
      
      {/* Tiêu đề */}
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', margin: '0 0 5px 0', fontWeight: 'bold' }}>BÀI 7 — TỐI ƯU HÓA ĐA MỤC TIÊU VĨ MÔ KẾT HỢP BIỂU ĐỒ XOAY 3D</h1>
      </div>

      {/* Tóm tắt toán học lý thuyết */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
        <div style={{ fontSize: '14px', color: '#aaa', marginBottom: '8px' }}><b>Không gian Pareto Front 3 Chiều (3D Policy Surface)</b></div>
        <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '0', lineHeight: '1.5' }}>
          Biểu đồ xoay 3D trực quan hóa tập hợp các kịch bản không bị áp đảo. Đạt có thể <b>nhấp giữ chuột để xoay khối không gian</b>, dùng con lăn chuột để zoom xa gần nhằm tìm ra các điểm uốn gãy (Elbow Points) của chính sách kinh tế. Hạt màu vàng lớn đại diện cho nghiệm thỏa hiệp duy nhất được chọn lọc bởi thuật toán TOPSIS.
        </p>
      </div>

      {/* Khối tham số đầu vào động */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#38bdf8', borderBottom: '1px solid #232936', paddingBottom: '10px' }}>🎛️ Bộ cấu hình thuật toán di truyền NSGA-II & Trọng số TOPSIS</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#aaa' }}>Trọng số Tăng trưởng (f1)</label>
            <input type="number" step="0.01" value={inputs.w_growth} onChange={e => handleInputChange('w_growth', e.target.value)} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', marginTop: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#aaa' }}>Trọng số Bao trùm (f2)</label>
            <input type="number" step="0.01" value={inputs.w_inclusive} onChange={e => handleInputChange('w_inclusive', e.target.value)} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', marginTop: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#aaa' }}>Trọng số Môi trường (f3)</label>
            <input type="number" step="0.01" value={inputs.w_env} onChange={e => handleInputChange('w_env', e.target.value)} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', marginTop: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#aaa' }}>Trọng số An ninh (f4)</label>
            <input type="number" step="0.01" value={inputs.w_security} onChange={e => handleInputChange('w_security', e.target.value)} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', marginTop: '4px' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#aaa' }}>Kích thước quần thể (pop_size)</label>
            <input type="number" value={inputs.pop_size} onChange={e => handleInputChange('pop_size', e.target.value)} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', marginTop: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#aaa' }}>Số thế hệ tiến hóa (n_gen)</label>
            <input type="number" value={inputs.n_gen} onChange={e => handleInputChange('n_gen', e.target.value)} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', marginTop: '4px' }} />
          </div>
        </div>

        <button onClick={runNSGA2Optimization} disabled={loading} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'block', width: '200px' }}>
          {loading ? '⏳ Đang tiến hóa...' : '▶️ Chạy mô hình'}
        </button>
      </div>

      {hasError && (
        <div style={{ color: '#f43f5e', padding: '15px', backgroundColor: '#2d141a', borderRadius: '6px', marginBottom: '20px', fontWeight: 'bold' }}>
          ⚠️ Lỗi kết nối vĩ mô với Backend. Vui lòng kiểm tra trạng thái Docker Container.
        </div>
      )}

      {/* Điều kiện render bảo vệ giao diện */}
      {!isCalculated ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#161a25', borderRadius: '8px', border: '1px dashed #232936', color: '#64748b' }}>
          💡 Vui lòng thiết lập hệ số và nhấp nút <b>"Chạy mô hình"</b> để kích hoạt không gian đồ thị mô phỏng đa mục tiêu NSGA-II.
        </div>
      ) : (
        <>
          {/* Câu 7.4.4: Hộp phân tích định lượng Chi phí cơ hội */}
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '20px', marginBottom: '25px', borderLeft: '4px solid #ffbb28' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#ffbb28' }}>🔍 Câu 7.4.4: Phân tích định lượng "Chi phí cơ hội" chính sách</h3>
            <p style={{ fontSize: '13px', color: '#e2e8f0', margin: 0, lineHeight: '1.6' }}>
              Để đổi lấy mức tăng trưởng kịch trần, mô hình ưu tiên tăng trưởng cực đoan (Max Growth) phải <b>hi sinh mất {resData.opportunity_cost.drop_inclusive_pct}% về mục tiêu Bao trùm xã hội</b> và <b>hi sinh mất {resData.opportunity_cost.drop_env_pct}% về an toàn Môi trường sinh thái</b> so với phương án thỏa hiệp đa mục tiêu được lựa chọn bởi TOPSIS (Hạt màu vàng).
            </p>
          </div>

          {/* Cụm Đồ thị song song: Trái Scatter 3D Plotly, Phải Parallel Coordinates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr', gap: '20px', marginBottom: '25px' }}>
            
            {/* Đồ thị không gian xoay 3D Plotly (Câu 7.4.2) */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#fff', width: '100%', textAlign: 'left' }}>📊 Đồ thị không gian xoay 3D Tập Pareto Front (Giữ chuột để xoay xoay)</h4>
              <Plot
                data={getPlotlyData()}
                layout={{
                  width: 600,
                  height: 360,
                  margin: { l: 0, r: 0, b: 0, t: 0 },
                  scene: {
                    xaxis: { title: 'F1: Tăng trưởng', gridcolor: '#232936', color: '#94a3b8' },
                    yaxis: { title: 'F2: Bao trùm', gridcolor: '#232936', color: '#94a3b8' },
                    zaxis: { title: 'F3: Môi trường', gridcolor: '#232936', color: '#94a3b8' },
                    backgroundcolor: '#161a25'
                  },
                  paper_bgcolor: '#161a25',
                  plot_bgcolor: '#161a25'
                }}
                config={{ displayModeBar: false }}
              />
            </div>

            {/* Biểu đồ song song Recharts cho cả 4 mục tiêu (Câu 7.4.2) */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#38bdf8' }}>📈 Biểu đồ tọa độ song song (Parallel Coordinates) đối chiếu 4 mục tiêu vĩ mô</h4>
              <div style={{ width: '100%', height: 360 }}>
                <ResponsiveContainer>
                  <LineChart data={[
                    { name: 'f1 Tăng trưởng', 'Nghiệm thỏa hiệp TOPSIS': resData.topsis_solution.f1_growth, 'Nghiệm Max Tăng Trưởng': resData.max_growth_solution.f1_growth },
                    { name: 'f2 Bao trùm', 'Nghiệm thỏa hiệp TOPSIS': resData.topsis_solution.f2_inclusive, 'Nghiệm Max Tăng Trưởng': resData.max_growth_solution.f2_inclusive },
                    { name: 'f3 Môi trường', 'Nghiệm thỏa hiệp TOPSIS': resData.topsis_solution.f3_env, 'Nghiệm Max Tăng Trưởng': resData.max_growth_solution.f3_env },
                    { name: 'f4 An ninh', 'Nghiệm thỏa hiệp TOPSIS': resData.topsis_solution.f4_security, 'Nghiệm Max Tăng Trưởng': resData.max_growth_solution.f4_security },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff' }} />
                    <Legend />
                    <Line type="linear" dataKey="Nghiệm thỏa hiệp TOPSIS" stroke="#2a9d8f" strokeWidth={3} dot={{ r: 6 }} />
                    <Line type="linear" dataKey="Nghiệm Max Tăng Trưởng" stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* 💡 CÂU 7.5: KHỐI LUẬN CỨ THẢO LUẬN CHÍNH SÁCH VĨ MÔ */}
          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '4px solid #38bdf8', borderRadius: '8px', padding: '25px', marginTop: '25px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🏛️ 7.5. Hệ thống Luận cứ & Thảo luận Chiến lược Chính sách (Đại hội XIII & COP26)
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '13.5px', color: '#94a3b8', lineHeight: '1.7' }}>
              
              {/* Câu a */}
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '6px', border: '1px solid #232936' }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#38bdf8', fontSize: '14px', fontWeight: 'bold' }}>
                  a) Đánh đổi giữa Tăng trưởng (f₁) và Bao trùm (f₂) & Đặc thù Cơ cấu kinh tế Việt Nam
                </h5>
                <p style={{ margin: 0 }}>
                  • <b>Tính rõ ràng của đường biên:</b> Khi quan sát không gian xoay 3D Pareto, mối quan hệ đánh đổi (Trade-off) diễn ra cực kỳ rõ ràng dưới dạng một mặt cong lồi/lõm liên tục. Khi đẩy mục tiêu Tăng trưởng ($f_1$) lên kịch trần, đồ thị lập tức dốc xuống nghiêm trọng ở trục Bao trùm ($f_2$).<br />
                  • <b>Hàm ý cơ cấu kinh tế:</b> Mức đánh đổi gay gắt này phản ánh cơ cấu kinh tế Việt Nam hiện nay vẫn đang trong giai đoạn thâm dụng vốn và tài nguyên dựa mạnh trên công nghiệp chế biến, chế tạo, và lắp ráp gia công công nghệ thấp. Khi tập trung dòng vốn đầu tư công đổ vào các cực tăng trưởng đô thị lớn nhằm kích tổng cầu nhanh, dòng tiền tích tụ sâu tại các nhóm doanh nghiệp dẫn dắt, vô tình làm nới rộng khoảng cách giàu nghèo và chênh lệch thu nhập vùng miền, khiến tính "bao trùm" xã hội bị suy giảm trong ngắn hạn.
                </p>
              </div>

              {/* Câu b */}
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '6px', border: '1px solid #232936' }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#34d399', fontSize: '14px', fontWeight: 'bold' }}>
                  b) Đối chiếu Văn kiện Đại hội XIII, Cam kết COP26 và Quyết định 127/QĐ-TTg về Chiến lược AI
                </h5>
                <p style={{ margin: 0 }}>
                  • <b>Đánh giá bộ trọng số (0.40; 0.25; 0.20; 0.15):</b> Bộ trọng số này phản ánh rất sát thực tiễn điều hành kinh tế giai đoạn bứt phá của Đại hội XIII — nơi "Tăng trưởng nhanh" đóng vai trò cốt lõi để đưa đất nước vượt qua bẫy thu nhập trung bình thấp.<br />
                  • <b>Phương án điều chỉnh theo hướng Kinh tế Xanh & QĐ 127:</b> Để đồng bộ với cam kết Net-Zero tại COP26 và Chiến lược quốc gia về phát triển AI (Quyết định 127/QĐ-TTg), ma trận điều hành cần dịch chuyển sang giảm áp lực tăng trưởng cơ học, nâng cao an toàn sinh thái và chủ quyền số thông minh. 
                  <span style={{ color: '#ffbb28', display: 'block', marginTop: '8px' }}>
                    👉 <b>Khuyến nghị điều chỉnh hệ số:</b> Tái cấu trúc ma trận điểm sang tỷ lệ cân bằng mới: <b>(0.30 Tăng trưởng | 0.20 Bao trùm | 0.30 Môi trường | 0.20 An ninh)</b>. Việc gia tăng trọng số Môi trường lên 0.30 sẽ ép bộ giải NSGA-II ưu tiên các hạt nghiệm xanh, thúc đẩy phát triển trung tâm dữ liệu AI tuần hoàn và hạ tầng ít phát thải.
                  </span>
                </p>
              </div>

              {/* Câu c */}
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '6px', border: '1px solid #232936' }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#ff6b6b', fontSize: '14px', fontWeight: 'bold' }}>
                  c) Vai trò của NSGA-II so với LP đơn mục tiêu & Giới hạn của Quyết định Chính trị
                </h5>
                <p style={{ margin: 0 }}>
                  • <b>Sự khác biệt lõi:</b> Mô hình Quy hoạch tuyến tính (LP) đơn mục tiêu bắt buộc phải hy sinh 3 mục tiêu vĩ mô làm điều kiện biên (ràng buộc phẳng cứng) để tối ưu hóa duy nhất một mục tiêu. Ngược lại, <b>NSGA-II hoạt động như một bộ quét không gian thông minh</b>, nó không áp đặt một nghiệm độc tôn mà trả về toàn bộ tập kịch bản không bị áp đảo để nhà hoạch định nhìn thấy bức tranh đa chiều.<br />
                  • <b>Khả năng thay thế quyết định chính trị:</b> Thuật toán toán học hoàn toàn <b>KHÔNG THỂ</b> thay thế được quyết định chính trị. Hệ thống NSGA-II và TOPSIS chỉ đóng vai trò làm sáng tỏ chi phí cơ hội khoa học. Việc bấm nút lựa chọn phương án cuối cùng hoàn toàn dựa vào tầm nhìn chiến lược, bối cảnh lịch sử thực tế và ý chí chính trị của các nhà lãnh đạo quốc gia.
                </p>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}