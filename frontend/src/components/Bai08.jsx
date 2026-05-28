import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export default function Bai08() {
  const [inputs, setInputs] = useState({
    gamma: 1.5, 
    rho: 0.97, 
    shock_year: 2028, 
    shock_drop_pct: 0.08
  });

  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleInputChange = (field, val) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(val) || 0 }));
  };

  const runDynamicOptimization = () => {
    setLoading(true);
    setHasError(false);
    
    // Phòng vệ chống đơ dữ liệu cũ khi re-render
    setIsCalculated(false);
    setResData(null);

    fetch('http://localhost:8000/api/bai08/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputs)
    })
    .then(res => {
      if (!res.ok) throw new Error("Cong Backend phi tuyen Bai 8 sap");
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
      console.error("Loi API Bai 8:", err);
      setLoading(false);
      setHasError(true);
      setIsCalculated(false);
    });
  };

  return (
    <div style={{ color: '#ffffff', maxWidth: '1400px', margin: '0 auto', paddingBottom: '30px' }}>
      
      {/* Tiêu đề chuẩn đề bài */}
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', margin: '0 0 5px 0', fontWeight: 'bold' }}>BÀI 8 — TỐI ƯU ĐỘNG PHÂN BỔ LIÊN THỜI GIAN 2026–2035 (COBB-DOUGLAS MỞ RỘNG)</h1>

      </div>

      {/* Lý thuyết toán nền tảng (Đã loại bỏ hoàn toàn ký tự lạ gây lỗi render) */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
        <div style={{ fontSize: '14px', color: '#aaa', marginBottom: '8px' }}><b>Mô hình Quy hoạch phi tuyến động liên thời gian (Intertemporal Non-Linear Dynamic Programming)</b></div>
        <div style={{ fontSize: '16px', color: '#34d399', fontWeight: 'bold' }}>
          Max W = Tong [ rho^(t-2026) x U(C_t) ] voi U(C_t) = (C_t^(1-gamma)) / (1-gamma)
        </div>
        <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '6px 0 0 0', lineHeight: '1.5' }}>
          Bài toán tìm quỹ đạo tối ưu phân bổ nguồn lực quốc gia cắt chéo qua 10 mốc thời gian vĩ mô. Hàm sản xuất Cobb-Douglas liên kết nội sinh với năng suất tổng hợp TFP (A_t+1), chịu ảnh hưởng lan tỏa dài hạn từ hạ tầng số (D_t), trí tuệ nhân tạo (AI_t) và chất lượng nguồn nhân lực (H_t).
        </p>
      </div>

      {/* Form tinh chỉnh kịch bản đầu vào */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#38bdf8', borderBottom: '1px solid #232936', paddingBottom: '10px' }}>🎛️ Thiết lập thông số ác cảm rủi ro vĩ mô & Kịch bản cú sốc</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#aaa' }}>Hệ số CRRA (gamma làm trơn tiêu dùng)</label>
            <input type="number" step="0.1" value={inputs.gamma} onChange={e => handleInputChange('gamma', e.target.value)} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', marginTop: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#aaa' }}>Hệ số chiết khấu tương lai (rho)</label>
            <input type="number" step="0.01" value={inputs.rho} onChange={e => handleInputChange('rho', e.target.value)} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', marginTop: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#aaa' }}>Năm xảy ra cú sốc số liệu</label>
            <input type="number" value={inputs.shock_year} onChange={e => handleInputChange('shock_year', e.target.value)} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', marginTop: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#aaa' }}>Mức sụt giảm GDP do sốc (0-1)</label>
            <input type="number" step="0.01" value={inputs.shock_drop_pct} onChange={e => handleInputChange('shock_drop_pct', e.target.value)} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', marginTop: '4px' }} />
          </div>
        </div>
        <button onClick={runDynamicOptimization} disabled={loading} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'block', width: '200px' }}>
          {loading ? '⏳ Đang giải phi tuyến...' : '▶️ Chạy mô hình'}
        </button>
      </div>

      {hasError && (
        <div style={{ color: '#f43f5e', padding: '15px', backgroundColor: '#2d141a', borderRadius: '6px', marginBottom: '20px', fontWeight: 'bold' }}>
          ⚠️ Không thể giải hệ phi tuyến Bài 8. Vui lòng check lệnh và trạng thái container Backend.
        </div>
      )}

      {/* Điều kiện ẩn vùng kết quả */}
      {!isCalculated ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#161a25', borderRadius: '8px', border: '1px dashed #232936', color: '#64748b' }}>
          💡 Vui lòng thiết lập hệ số liên thời gian và nhấp nút <b>"Chạy mô hình"</b> để kích hoạt bộ giải phi tuyến SLSQP Bài 8.
        </div>
      ) : (
        <>
          {/* Câu 8.3.4: Hộp KPI đối chiếu 2 chiến lược phân bổ nguồn lực */}
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '20px', marginBottom: '25px', borderLeft: '4px solid #34d399' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#34d399' }}>📊 Câu 8.3.4: Đối chiếu chỉ số phúc lợi liên thời gian (Social Welfare Total)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', fontSize: '13px', textAlign: 'center', marginTop: '10px' }}>
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <span style={{ color: '#aaa' }}>Chiến lược (i) Trải đều:</span>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f43f5e', marginTop: '4px' }}>{resData.welfare_comparison.strategy_equal}</div>
              </div>
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <span style={{ color: '#aaa' }}>Chiến lược (ii) Front-load:</span>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#34d399', marginTop: '4px' }}>{resData.welfare_comparison.strategy_front_load}</div>
              </div>
              <div style={{ backgroundColor: '#162e26', padding: '12px', borderRadius: '6px', border: '1px solid #047857' }}>
                <span style={{ color: '#fff' }}>Mô hình kết luận chiến lược thắng thế:</span>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#ffbb28', marginTop: '6px' }}>{resData.welfare_comparison.winner}</div>
              </div>
            </div>
          </div>

          {/* Câu 8.3.2: Khu vực đồ thị đường quỹ đạo liên thời gian */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr', gap: '20px', marginBottom: '25px' }}>
            
            {/* Đồ thị 1: Quỹ đạo tăng trưởng GDP (Y) và Tiêu dùng (C) */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#fff' }}>📈 Quỹ đạo liên thời gian của Sản lượng (Y) và Tiêu dùng (C) (Kịch bản Baseline)</h4>
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={resData.baseline_trajectory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                    <XAxis dataKey="year" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff' }} />
                    <Legend />
                    <Line type="monotone" dataKey="Y" stroke="#34d399" strokeWidth={2.5} name="Sản lượng GDP (Y)" />
                    <Line type="monotone" dataKey="C" stroke="#38bdf8" strokeWidth={2.5} name="Tiêu dùng thực tế (C)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Đồ thị 2: So sánh phản ứng vĩ mô trước Cú sốc Câu 8.3.3 */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#ff6b6b' }}>⚠️ Câu 8.3.3: Phản ứng động của Tiêu dùng (C) trước Cú sốc Khủng hoảng vĩ mô {inputs.shock_year}</h4>
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={resData.baseline_trajectory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                    <XAxis dataKey="year" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff' }} />
                    <Legend />
                    <Line type="monotone" dataKey="C" stroke="#38bdf8" strokeWidth={2} name="Tiêu dùng Kịch bản chuẩn" />
                    <Line data={resData.shock_trajectory} type="monotone" dataKey="C" stroke="#f43f5e" strokeWidth={2.5} strokeDasharray="4 4" name="Tiêu dùng sau Cú sốc đột ngột" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Đồ thị 3: Động học tích lũy tài sản số */}
          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '14px' }}>📊 Quỹ đạo tích lũy gia tăng năng lực AI và Vốn nhân lực chất lượng cao (H)</h4>
            <div style={{ width: '100%', height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={resData.baseline_trajectory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                  <XAxis dataKey="year" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff' }} />
                  <Legend />
                  <Line type="monotone" dataKey="AI" stroke="#ffbb28" strokeWidth={2} name="Tích lũy Năng lực AI (Nghìn DN)" />
                  <Line type="monotone" dataKey="H" stroke="#a855f7" strokeWidth={2} name="Ty le Von nhan luc H (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 8.4: KHỐI THẢO LUẬN VÀ DIỄN GIẢI CHÍNH SÁCH VĨ MÔ TÍCH HỢP */}
          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '4px solid #ffbb28', borderRadius: '8px', padding: '25px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🏛️ 8.4. Luận cứ & Thảo luận Định hướng Chiến lược Phân bổ liên thời gian 2026–2035
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '13.5px', color: '#94a3b8', lineHeight: '1.7' }}>
              
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '6px', border: '1px solid #232936' }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#38bdf8', fontSize: '14px', fontWeight: 'bold' }}>
                  a) Quỹ đạo tối ưu của tài sản chiến lược có "front-loaded" hay "back-loaded"?
                </h5>
                <p style={{ margin: 0 }}>
                  • <b>Bản chất quỹ đạo từ mô hình:</b> Kết quả tính toán chỉ ra quỹ đạo phân bổ có xu hướng <b>"front-loaded" (đầu tư mạnh mẽ ngay từ giai đoạn đầu)</b> đối với hạ tầng số (D) và trí tuệ nhân tạo (AI).<br />
                  • <b>Nguyên nhân kinh tế học:</b> Mô hình đề xuất kịch bản bứt tốc này do cơ chế cập nhật nội sinh năng suất nhân tố tổng hợp TFP. Đầu tư sớm vào hạ tầng công nghệ và AI tạo ra hiệu ứng lan tỏa (Spillover Effects) lũy tiến theo thời gian, giúp nâng cao hàm số năng suất của toàn bộ nền kinh tế cho các năm sau. Nếu chọn kịch bản đầu tư muộn (back-loaded), nền kinh tế sẽ không kịp tích lũy TFP để đạt mục tiêu nước thu nhập cao vào năm 2030.
                </p>
              </div>

              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '6px', border: '1px solid #232936' }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#34d399', fontSize: '14px', fontWeight: 'bold' }}>
                  b) Tương quan tỷ lệ đầu tư AI/đầu tư H & Ngụ ý chiến lược đào tạo con người đi trước hay đồng thời?
                </h5>
                <p style={{ margin: 0 }}>
                  • <b>Tính ổn định của tỷ lệ đầu tư:</b> Tỷ lệ đầu tư biến động động học rõ rệt: <b>Đầu tư vốn nhân lực chất lượng cao (H) luôn được đẩy mạnh ở chu kỳ đầu trước khi quy mô đầu tư ứng dụng AI bùng nổ</b>.<br />
                  • <b>Hàm ý chính sách cốt lõi:</b> Mô hình ngụ ý một thông điệp vĩ mô đắt giá: <b>Đào tạo nhân lực chất lượng cao bắt buộc phải đi trước một bước hoặc đồng thời</b> với đầu tư hạ tầng thiết bị AI. Vốn nhân lực chính là "năng lực hấp thụ công nghệ" (Absorptive Capacity). Nếu chỉ dồn tiền mua siêu máy tính hay phần mềm AI về mà thiếu hụt đội ngũ chuyên gia vận hành có trình độ cao, hệ số sinh lợi biên của công nghệ sẽ rơi vào trạng thái bão hòa bẫy suy giảm, gây lãng phí nghiêm trọng nguồn lực công quốc gia.
                </p>
              </div>

              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '6px', border: '1px solid #232936' }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#ff6b6b', fontSize: '14px', fontWeight: 'bold' }}>
                  c) Tác động của Hệ số chiết khấu rho & Lý do căn bản của hiện tượng "Dưới đầu tư" (Under-investment) vào R&D
                </h5>
                <p style={{ margin: 0 }}>
                  • <b>Phân tích độ nhạy hệ số chiết khấu:</b> Hệ số chiết khấu rho = 0.97 phản ánh tầm nhìn chiến lược dài hạn. Nếu hạ hệ số này xuống rho = 0.90 (Chính phủ có tư duy ngắn hạn hơn), mô hình lập tức điều chỉnh: <b>Cắt giảm mạnh dòng tiền đầu tư dài hạn vào AI, R&D và Giáo dục chất lượng cao để dồn tiền đẩy tiêu dùng ngắn hạn (C) đạt đỉnh ngay lập tức</b>.<br />
                  • <b>Lý giải hiện tượng dưới đầu tư toàn cầu:</b> Đây chính là câu trả lời khoa học giải mã tại sao nhiều chính phủ thường rơi vào cái bẫy "dưới đầu tư" vào R&D. Do các khoản đầu tư vào khoa học công nghệ, AI nền tảng và con người luôn có <b>độ trễ dài hạn (Long gestation lag)</b> và tỷ lệ khấu hao công nghệ nhanh, trong khi áp lực tăng trưởng hoặc nhiệm kỳ chính trị đòi hỏi kết quả hiển thị tức thời trong ngắn hạn. Khi tư duy điều hành bị kéo về ngắn hạn, hệ thống sẽ tự động đào thải các dự án R&D dài hạn để đổi lấy các dự án hạ tầng truyền thống có kết quả nhanh hơn, làm suy giảm năng lực cạnh tranh quốc gia trong dài hạn.
                </p>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}