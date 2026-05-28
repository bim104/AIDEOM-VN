import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Bai11() {
  const [inputs, setInputs] = useState({
    episodes: 10000, alpha: 0.1, gamma: 0.95
  });

  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [hasError, setHasError] = useState(false);

  const runRLTraining = () => {
    setLoading(true);
    setHasError(false);
    setIsCalculated(false);
    setResData(null);

    fetch('http://localhost:8000/api/bai11/train', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputs)
    })
    .then(res => {
      if (!res.ok) throw new Error("Backend sập cổng Reinforcement Learning");
      return res.json();
    })
    .then(data => {
      if (data && data.success) {
        setResData(data);
        setIsCalculated(true);
      } else {
        setIsCalculated(false);
        setHasError(true);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error("Lỗi liên thông API Bài 11:", err);
      setLoading(false);
      setHasError(true);
      setIsCalculated(false);
    });
  };

  const safeFormat = (val) => (val === undefined || val === null || isNaN(val)) ? "0" : val.toLocaleString();

  return (
    <div style={{ color: '#ffffff', maxWidth: '1400px', margin: '0 auto', paddingBottom: '30px' }}>
      
      {/* Tiêu đề */}
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', margin: '0 0 5px 0', fontWeight: 'bold' }}>BÀI 11 — HỌC TĂNG CƯỜNG (TABULAR Q-LEARNING) CHO CHÍNH SÁCH KÍNH TẾ THÍCH NGHI</h1>
      
      </div>

      {/* Tóm tắt lý thuyết nền tảng */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
        <div style={{ fontSize: '14px', color: '#aaa', marginBottom: '8px' }}><b>Khung toán học Markov Decision Process (MDP) cho Điều hành Vĩ mô</b></div>
        <div style={{ fontSize: '16px', color: '#34d399', fontWeight: 'bold', fontFamily: 'monospace' }}>
          {"Q(s, a) ← Q(s, a) + α × [ R + γ × max_a' Q(s', a') - Q(s, a) ]"}
        </div>
        <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '6px 0 0 0', lineHeight: '1.5' }}>
          Mô hình hóa nền kinh tế vĩ mô Việt Nam thành một hệ tác tử tự học (Agent). Thông qua quá trình tương tác liên tục với môi trường Cobb-Douglas mở rộng, Tác tử tự tìm ra chuỗi hành động phân bổ tài khóa tối ưu thích nghi theo từng biến động trạng thái để tối đa hóa hàm phúc lợi an sinh xã hội toàn diện.
        </p>
      </div>

      {/* Khối tham số đầu vào */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#38bdf8', borderBottom: '1px solid #232936', paddingBottom: '10px' }}>🎛️ Bộ cấu hình Siêu tham số Huấn luyện Tác tử (Hyperparameters)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#aaa' }}>Số vòng lặp tiến hóa (Episodes)</label>
            <input type="number" value={inputs.episodes} onChange={e => setInputs({...inputs, episodes: parseInt(e.target.value)||0})} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', marginTop: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#aaa' }}>Tốc độ học thuật toán (Learning Rate - α)</label>
            <input type="number" step="0.01" value={inputs.alpha} onChange={e => setInputs({...inputs, alpha: parseFloat(e.target.value)||0})} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', marginTop: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#aaa' }}>Hệ số chiết khấu tương lai (Discount Factor - γ)</label>
            <input type="number" step="0.01" value={inputs.gamma} onChange={e => setInputs({...inputs, gamma: parseFloat(e.target.value)||0})} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', marginTop: '4px' }} />
          </div>
        </div>
        <button onClick={runRLTraining} disabled={loading} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'block', width: '220px' }}>
          {loading ? '⏳ Agent đang tự học...' : '▶️ Kích hoạt Huấn luyện'}
        </button>
      </div>

      {hasError && (
        <div style={{ color: '#f43f5e', padding: '15px', backgroundColor: '#2d141a', borderRadius: '6px', marginBottom: '20px', fontWeight: 'bold' }}>
          ⚠️ Lỗi kết nối hoặc hội tụ thuật toán Học Tăng Cường tại Backend. Vui lòng check tệp routes/bai11.py.
        </div>
      )}

      {!isCalculated ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#161a25', borderRadius: '8px', border: '1px dashed #232936', color: '#64748b' }}>
          💡 Vui lòng nhấn nút <b>"Kích hoạt Huấn luyện"</b> để Agent chạy 10.000 episodes học thích nghi nền kinh tế vĩ mô.
        </div>
      ) : (
        <>
          {/* Cụm đồ thị liên thông kết quả */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr', gap: '20px', marginBottom: '25px' }}>
            
            {/* Đồ thị đường cong học tập Learning Curve Câu 11.3.4 */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#fff' }}>📈 Câu 11.3.4: Đường cong học tập của Agent (Learning Curve hội tụ)</h4>
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={resData?.learning_curve || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                    <XAxis dataKey="episode" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff' }} />
                    <Line type="monotone" dataKey="reward" stroke="#38bdf8" strokeWidth={1.5} dot={false} name="Tổng điểm thưởng Welfare" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Đồ thị đối chiếu với các chính sách Rule-based Câu 11.3.4 */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#34d399' }}>📊 Đối chiếu tổng điểm Phúc lợi giữa các Chiến lược điều hành</h4>
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Q-Learning Tối ưu', value: resData?.comparison?.q_learning },
                    { name: 'Luôn Cân bằng (a1)', value: resData?.comparison?.rule_fixed_a1 },
                    { name: 'Luôn AI dẫn dắt (a3)', value: resData?.comparison?.rule_fixed_a3 },
                    { name: 'Hành động Random', value: resData?.comparison?.rule_random }
                  ]} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff' }} />
                    <Bar dataKey="value" fill="#34d399" radius={[4, 4, 0, 0]}>
                      {/* Đổi màu riêng cho cột tối ưu nhất */}
                      <Bar dataKey="value" fill="#2563eb" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Bảng báo cáo chính sách thích nghi tại các trạng thái kinh tế cụ thể Câu 11.3.3 */}
          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#ffbb28' }}>🎯 Câu 11.3.3: Bản đồ phản ứng chính sách tối ưu π*(s) trích xuất từ Q-Table</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
              <div style={{ backgroundColor: '#0e1117', padding: '15px', borderRadius: '6px', borderLeft: '4px solid #38bdf8' }}>
                <span style={{ fontSize: '11px', color: '#aaa' }}>Kịch bản 1: Việt Nam 2026 Thực tế</span>
                <div style={{ fontSize: '12.5px', color: '#fff', marginTop: '4px' }}>Trạng thái: Growth Vừa, Số hóa Vừa, AI Thấp</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#38bdf8', marginTop: '6px' }}>{resData?.policy_report?.vn_2026_actual}</div>
              </div>
              <div style={{ backgroundColor: '#0e1117', padding: '15px', borderRadius: '6px', borderLeft: '4px solid #ef4444' }}>
                <span style={{ fontSize: '11px', color: '#aaa' }}>Kịch bản 2: Suy thoái & Thất nghiệp cao</span>
                <div style={{ fontSize: '12.5px', color: '#fff', marginTop: '4px' }}>Trạng thái: Growth Thấp, Số hóa Thấp, Thất nghiệp Cao</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ef4444', marginTop: '6px' }}>{resData?.policy_report?.crisis_state}</div>
              </div>
              <div style={{ backgroundColor: '#0e1117', padding: '15px', borderRadius: '6px', borderLeft: '4px solid #34d399' }}>
                <span style={{ fontSize: '11px', color: '#aaa' }}>Kịch bản 3: Chuyển đổi số bùng nổ</span>
                <div style={{ fontSize: '12.5px', color: '#fff', marginTop: '4px' }}>Trạng thái: Growth Cao, Hạ tầng số Cao, AI Vừa</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#34d399', marginTop: '6px' }}>{resData?.policy_report?.boom_state}</div>
              </div>
            </div>
          </div>

          {/* 💡 CÂU 11.4: KHỐI LUẬN CỨ CHÍNH SÁCH CHUẨN ĐỒ ÁN */}
          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '4px solid #ffbb28', borderRadius: '8px', padding: '25px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#fff', fontWeight: 'bold' }}>🏛️ 11.4. Hệ thống Luận cứ & Diễn giải Chính sách Thích nghi Động học</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '13.5px', color: '#94a3b8', lineHeight: '1.7' }}>
              
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '6px', border: '1px solid #232936' }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#38bdf8', fontSize: '14px', fontWeight: 'bold' }}>a) Phản ứng của chính sách tối ưu π*(s) khi kinh tế rơi vào trạng thái Suy thoái cục bộ</h5>
                <p style={{ margin: 0 }}>
                  • <b>Hành động của Agent:</b> Khi nền kinh tế rơi vào trạng thái bất lợi nhất (GDP tăng trưởng thấp, hạ tầng kỹ thuật số nghèo nàn, tỷ lệ thất nghiệp cao), chính sách tối ưu π*(s) trích xuất từ mô hình tự động kích hoạt lựa chọn <b>a4: Bao trùm</b> hoặc <b>a1: Cân bằng</b>.<br />
                  • <b>Tính chất "Quick-win":</b> Lựa chọn này hoàn toàn trùng khớp với tư duy cứu trợ vĩ mô ngoài thực tế. Lúc này, việc dồn tiền cho các siêu dự án AI xa xỉ là bất khả thi. Thay vào đó, việc phân bổ tới 40% ngân sách cho vốn nhân lực và an sinh xã hội (trong gói a4) đóng vai trò như một đòn bẩy "quick-win" lập tức bảo vệ thu nhập tối thiểu cho người lao động, kích cầu tiêu dùng nội địa, giúp nền kinh tế xây dựng lại tấm khiên chống chịu để thoát hiểm suy thoái.
                </p>
              </div>

              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '6px', border: '1px solid #232936' }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#34d399', fontSize: '14px', fontWeight: 'bold' }}>b) Hành động điều hành khi kinh tế đạt trạng thái Hưng thịnh ổn định</h5>
                <p style={{ margin: 0 }}>
                  • <b>Hành động của Agent:</b> Khi các chỉ số vĩ mô đạt trạng thái lý tưởng (Tăng trưởng cao, năng lực AI sẵn có, nguy cơ thất nghiệp thấp), mô hình dịch chuyển hẳn hành vi sang chọn hành động <b>a3: AI dẫn dắt</b> hoặc <b>a2: Số hóa nhanh</b>.<br />
                  • <b>Bản chất chiến lược "Consolidation":</b> Đây là minh chứng rõ nét cho chiến lược củng cố nền tảng bền vững. Khi bài toán an sinh xã hội ngắn hạn đã được giải quyết xong, Agent tận dụng tối đa thặng dư tài khóa công để đổ mạnh dòng vốn mồi vào hạ tầng AI nền tảng và chuyển đổi số sâu rộng. Quá trình này giúp nâng cao hằng số năng suất nhân tố tổng hợp TFP nội sinh, tạo động lực tăng trưởng mới để đưa Việt Nam bứt phá vượt hẳn bẫy thu nhập trung bình.
                </p>
              </div>

              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '6px', border: '1px solid #232936' }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#ff6b6b', fontSize: '14px', fontWeight: 'bold' }}>c) Phương án tích hợp hệ thống học máy Tăng cường vào quy trình hoạch định thực tế tại Việt Nam</h5>
                <p style={{ margin: 0 }}>
                  • <b>Nguyên tắc tối cao:</b> Đúng như Mục 11 của bài báo nguồn đã khẳng định, thuật toán trí tuệ nhân tạo hay các mô hình Học tăng cường hoàn toàn **KHÔNG THỂ THAY THẾ** được quyết định chính trị - xã hội mang tính nhân văn của Đảng và Nhà nước.<br />
                  • <b>Mô hình triển khai khuyến nghị:</b> Để không vi phạm nguyên tắc cốt lõi này, chúng ta sẽ định vị hệ thống Q-learning đóng vai trò là một **Hệ thống cố vấn giả lập hộp cát (Policy Sandbox System)** nằm ở bước tiền kiểm tra. Khi các cơ quan tham mưu thiết kế một dự thảo luật ngân sách, họ sẽ đẩy các tham số vào mô hình này để chạy mô phỏng trước 10,000 episode phản ứng giả lập của thị trường. Thuật toán sẽ làm sáng tỏ các điểm mù chính sách và đưa ra các khuyến nghị cảnh báo sớm về chi phí cơ hội. Quyết định bấm nút thông qua cuối cùng hoàn toàn thuộc về ý chí chiến lược mang tính nhân văn và bối cảnh lịch sử thực tế của Hội đồng Nhân dân và Quốc hội.
                </p>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}