import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function Bai12() {
  const [inputs, setInputs] = useState({
    total_national_budget: 80000,
    cyber_risk_weight: 0.25
  });

  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [subTab, setSubTab] = useState('overview'); // Quản lý 4 Tab kỹ thuật chính của đồ án

  const executeIntegratedModel = () => {
    setLoading(true);
    setResData(null);
    setIsCalculated(false);

    fetch('http://localhost:8000/api/bai12/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputs)
    })
    .then(res => {
      if (!res.ok) throw new Error("Cổng tích hợp hệ thống AIDEOM-VN lỗi 404/500");
      return res.json();
    })
    .then(data => {
      if (data && data.success) {
        setResData(data);
        setIsCalculated(true);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error("Lỗi liên hợp đồ án Bài 12:", err);
      setLoading(false);
    });
  };

  // Chuyển đổi cấu trúc mảng cho đồ thị Radar và Bar so sánh đối chiếu kịch bản
  const prepareChartData = () => {
    if (!resData?.scenarios_data) return [];
    return Object.keys(resData.scenarios_data).map(key => ({
      name: key,
      gdp: resData.scenarios_data[key].gdp_growth,
      readiness: resData.scenarios_data[key].digital_readiness,
      jobs: resData.scenarios_data[key].net_jobs / 1000, 
      risk: resData.scenarios_data[key].risk_index * 10 
    }));
  };

  return (
    <div style={{ color: '#ffffff', maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Khối thanh Header chính */}
      <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid #232936', paddingBottom: '15px' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: 0, fontWeight: 'bold', color: '#fff' }}>
            BÀI 12 (ĐỒ ÁN TỔNG HỢP) — NGUYÊN MẪU SIÊU MÔ HÌNH AIDEOM-VN
          </h1>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <button 
            onClick={executeIntegratedModel} 
            disabled={loading}
            style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {loading ? '⏳ Đang đồng bộ 6 phân hệ...' : '⚡ Kích hoạt Mô Hình'}
          </button>
        </div>
      </div>

      {/* Thanh điều khiển tham số vĩ mô cốt lõi */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', backgroundColor: '#161a25', border: '1px solid #232936', padding: '15px', borderRadius: '8px', marginBottom: '25px' }}>
        <div>
          <label style={{ fontSize: '12px', color: '#94a3b8' }}>Gói tài khóa tổng quốc gia 5 năm 2026-2030 (tỷ VND)</label>
          <input type="number" value={inputs.total_national_budget} onChange={e => setInputs({...inputs, total_national_budget: parseFloat(e.target.value)||0})} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', marginTop: '5px' }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: '#94a3b8' }}>Hệ số phạt rủi ro an ninh mạng biên (Cyber Risk Weight)</label>
          <input type="number" step="0.05" value={inputs.cyber_risk_weight} onChange={e => setInputs({...inputs, cyber_risk_weight: parseFloat(e.target.value)||0})} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', marginTop: '5px' }} />
        </div>
      </div>

      {!isCalculated ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#161a25', borderRadius: '8px', border: '1px dashed #232936', color: '#64748b' }}>
          🚀 Vui lòng bấm nút <b>"Kích hoạt Mô Hình"</b> để hợp nhất dòng chảy dữ liệu từ Phân hệ M1 đến M5 lên Tổng đài M6.
        </div>
      ) : (
        <>
          {/* HỆ THỐNG 4 TAB ĐIỀU HƯỚNG THEO ĐÚNG CHUẨN YÊU CẦU ĐỀ BÀI */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', borderBottom: '2px solid #232936', paddingBottom: '10px' }}>
            <button onClick={() => setSubTab('overview')} style={{ backgroundColor: subTab === 'overview' ? '#2563eb' : '#161a25', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>🖥️ Tab 1: Tổng quan Hệ thống</button>
            <button onClick={() => setSubTab('allocation')} style={{ backgroundColor: subTab === 'allocation' ? '#2563eb' : '#161a25', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>💰 Tab 2: Cơ cấu Phân bổ vốn</button>
            <button onClick={() => setSubTab('comparison')} style={{ backgroundColor: subTab === 'comparison' ? '#2563eb' : '#161a25', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>📊 Tab 3: Đối chiếu Kịch bản</button>
            <button onClick={() => setSubTab('risk')} style={{ backgroundColor: subTab === 'risk' ? '#2563eb' : '#161a25', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>⚠️ Tab 4: Cảnh báo Rủi ro</button>
          </div>

          {/* TAB 1: TỔNG QUAN HỆ THỐNG */}
          {subTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px' }}>
                {Object.keys(resData.scenarios_data).map((key) => (
                  <div key={key} style={{ backgroundColor: '#161a25', border: '1px solid #232936', padding: '15px', borderRadius: '8px', borderTop: '4px solid #10b981' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#38bdf8', marginBottom: '8px' }}>{key}</div>
                    <div style={{ fontSize: '12px', color: '#aaa' }}>Tăng trưởng GDP: <b style={{ color: '#34d399' }}>{resData.scenarios_data[key].gdp_growth}%</b></div>
                    <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>Sẵn sàng số: <b>{resData.scenarios_data[key].digital_readiness} đ</b></div>
                    <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>NetJob ròng: <b style={{ color: '#fbbf24' }}>+{resData.scenarios_data[key].net_jobs.toLocaleString()}</b></div>
                  </div>
                ))}
              </div>
              <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', padding: '20px', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#fff', fontWeight: 'bold' }}>📌 Bản đồ Ma trận Tổng kết Đồ án liên thông chiến lược quốc gia</h4>
                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
                  Hệ thống kết xuất trực tiếp cho thấy kịch bản <b>S5. Tối ưu cân bằng</b> đạt điểm Pareto hài hòa nhất, giải quyết triệt để sự đánh đổi (Trade-off) giữa bứt tốc GDP tăng trưởng ngắn hạn và chỉ số an toàn hệ sinh thái tài khóa dài hạn của Việt Nam.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: CƠ CẤU PHÂN BỔ VỐN */}
          {subTab === 'allocation' && (
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', padding: '20px', borderRadius: '8px', overflowX: 'auto' }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#38bdf8', fontWeight: 'bold' }}>📋 Chi tiết định cấu trúc phân bổ nguồn lực (Vật chất K, Số D, AI, Nhân lực H)</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'center' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Kịch bản vĩ mô</th>
                    <th style={{ padding: '10px' }}>Vốn vật chất K (tỷ)</th>
                    <th style={{ padding: '10px' }}>Hạ tầng số D (tỷ)</th>
                    <th style={{ padding: '10px' }}>Trí tuệ nhân tạo AI (tỷ)</th>
                    <th style={{ padding: '10px' }}>Vốn nhân lực H (tỷ)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(resData.scenarios_data).map((key) => (
                    <tr key={key} style={{ borderBottom: '1px solid #232936' }}>
                      <td style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>{key}</td>
                      <td style={{ color: '#2563eb' }}>{resData.scenarios_data[key].allocation.K.toLocaleString()}</td>
                      <td style={{ color: '#38bdf8' }}>{resData.scenarios_data[key].allocation.D.toLocaleString()}</td>
                      <td style={{ color: '#34d399' }}>{resData.scenarios_data[key].allocation.AI.toLocaleString()}</td>
                      <td style={{ color: '#a855f7' }}>{resData.scenarios_data[key].allocation.H.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: ĐỐI CHIẾU KỊCH BẢN */}
          {subTab === 'comparison' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr', gap: '20px' }}>
              <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', padding: '20px', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#fff', fontWeight: 'bold' }}>📊 Biến động Tăng trưởng GDP (%) vs Sẵn sàng số (Điểm) qua 5 Kịch bản</h4>
                <div style={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepareChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff' }} />
                      <Legend />
                      <Bar dataKey="gdp" fill="#34d399" name="Tốc độ tăng GDP (%)" />
                      <Bar dataKey="readiness" fill="#38bdf8" name="Chỉ số Sẵn sàng số (TOPSIS)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#fff', width: '100%', fontWeight: 'bold' }}>🕸️ Đồ thị Radar phân tích cấu trúc đa tiêu chí diện rộng</h4>
                <div style={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" radius="70%" data={prepareChartData()}>
                      <PolarGrid stroke="#232936" />
                      <PolarAngleAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                      <PolarRadiusAxis stroke="#94a3b8" />
                      <Radar name="Điểm hiệu năng tổng hợp" dataKey="readiness" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CẢNH BÁO RỦI RO */}
          {subTab === 'risk' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', padding: '20px', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#f43f5e', fontWeight: 'bold' }}>⚠️ Chỉ số Rủi ro Tích hợp liên thông vĩ mô (Integrated Risk Index - Thang điểm 10)</h4>
                <div style={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepareChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff' }} />
                      <Bar dataKey="risk" fill="#f43f5e" name="Điểm rủi ro tổng hợp hệ thống" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div style={{ backgroundColor: '#2d141a', border: '1px solid #f43f5e', padding: '15px', borderRadius: '6px', fontSize: '13px', color: '#fda4af', lineHeight: '1.6' }}>
                <b>🚨 KHUYẾN NGHỊ CẢNH BÁO SỚM (SYSTEM WARNING):</b> Kịch bản <i>S3. AI dẫn dắt</i> đẩy chỉ số rủi ro an ninh dữ liệu và lỗ hổng công nghệ lên mức báo động đỏ cao nhất (Index vượt ngưỡng an toàn). Mô hình AIDEOM-VN khuyến nghị Chính phủ bắt buộc phải áp dụng bộ ràng buộc tối ưu từ kịch bản <b>S5 (Cân bằng)</b>, dồn đối ứng tối thiểu 15% dòng ngân sách vĩ mô cho phân hệ an sinh số và quỹ đào tạo nguồn nhân lực chất lượng cao để hấphtu hoàn toàn các cú sốc.
              </div>
            </div>
          )}

          {/* 🏛️ 12.6. KHỐI LUẬN CỨ ĐỀ XUẤT CÁC HƯỚNG MỞ RỘNG NGHIÊN CỨU SAU ĐỒ ÁN (CÂU A, B, C, D) */}
          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '4px solid #10b981', borderRadius: '8px', padding: '25px', marginTop: '30px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
              🚀 12.6. Hướng phát triển & Định hướng Nghiên cứu Nâng cao sau Đồ án (R&D Roadmap)
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '13.5px', color: '#94a3b8', lineHeight: '1.7' }}>
              
              {/* Câu a */}
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '6px', border: '1px solid #232936' }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#38bdf8', fontSize: '14px', fontWeight: 'bold' }}>
                  a) Định hướng Công bố Quốc tế (SCIE Q2/Q3) dựa trên Khung mô hình AIDEOM-VN
                </h5>
                <p style={{ margin: 0 }}>
                  • <b>Chiến lược bài báo:</b> Nguyên mẫu siêu mô hình này hoàn toàn đủ khả năng phát triển thành một công bố quốc tế chuẩn SCIE Q2 hoặc Q3 bằng cách áp dụng vào một **Use-case (Khu vực nghiên cứu điển hình) cụ thể** tại Việt Nam.<br />
                  • <b>Phương án chọn tiêu đề:</b> Khuyến nghị nhóm lựa chọn 1 trong 2 hướng đi: (1) <i>Ứng dụng AIDEOM-VN tối ưu hóa cơ cấu kinh tế Đồng bằng Sông Cửu Long (ĐBSCL)</i> dưới tác động kép của biến đổi khí hậu xâm nhập mặn và làn sóng di cư lao động; hoặc (2) <i>Mô hình hóa tác động thay thế việc làm của GenAI trong ngành Chế biến, Chế tạo Việt Nam</i> để đề xuất hạn mức phân bổ tài chính quốc gia.
                </p>
              </div>

              {/* Câu b */}
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '6px', border: '1px solid #232936' }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#34d399', fontSize: '14px', fontWeight: 'bold' }}>
                  b) Kế hoạch mở rộng sang Mô hình Cân bằng Tổng thể (CGE / DSGE-AI)
                </h5>
                <p style={{ margin: 0 }}>
                  • <b>Hạn chế hiện tại:</b> Khung toán học hiện tại của AIDEOM-VN đang dựa trên các liên kết hàm sản xuất trực tiếp và hệ phương trình tuyến tính mang tính cục bộ.<br />
                  • <b>Định hướng nâng cấp:</b> Để đạt được trạng thái **Cân bằng tổng thể toàn diện**, hệ thống cần được mở rộng sang mô hình **CGE (Computable General Equilibrium)** hoặc **DSGE-AI (Dynamic Stochastic General Equilibrium)**. Bước nâng cấp này cho phép nhúng thêm các hành vi tối ưu hóa vi mô của Hộ gia đình (Consumers) tối đa hóa lợi ích và Doanh nghiệp (Firms) tối đa hóa lợi nhuận, đồng thời tích hợp phản ứng động học của Ngân hàng Trung ương và chính sách tiền tệ trước các cú sốc công nghệ đột phá.
                </p>
              </div>

              {/* Câu c */}
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '6px', border: '1px solid #232936' }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#ffbb28', fontSize: '14px', fontWeight: 'bold' }}>
                  c) Tích hợp Dữ liệu Thời gian thực (Real-time Pipeline Integration) qua các Cổng OpenAPI
                </h5>
                <p style={{ margin: 0 }}>
                  • <b>Mục tiêu động học:</b> Biến AIDEOM-VN từ một công cụ lập kế hoạch tĩnh chu kỳ 5 năm thành một hệ thống **Hỗ trợ điều hành kinh tế số linh hoạt cập nhật theo tháng hoặc quý**.<br />
                  • <b>Phương án kỹ thuật kết nối:</b> Nhóm nghiên cứu đề xuất thiết lập các đường ống nạp dữ liệu tự động (ETL Data Pipelines) kết nối trực tiếp với: Cổng dữ liệu quốc gia (Open Data Portal Việt Nam) để cập nhật chỉ số CPI/IIP, Cổng dữ liệu tài chính Vietstock để đo lường biến động dòng vốn FDI/vốn hóa, và hệ thống cơ sở dữ liệu Tổng cục Hải quan để cập nhật cán cân xuất nhập khẩu thời gian thực.
                </p>
              </div>

              {/* Câu d */}
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '6px', border: '1px solid #232936' }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#ff6b6b', fontSize: '14px', fontWeight: 'bold' }}>
                  d) Phát triển môi trường Học tăng cường đa tác tử (Multi-Agent RL - MARL)
                </h5>
                <p style={{ margin: 0 }}>
                  • <b>Nâng cấp kiến trúc trò chơi:</b> Chuyển đổi môi trường Q-learning đơn lẻ từ Bài 11 thành một hệ sinh thái **Học tăng cường đa tác tử (Multi-Agent Reinforcement Learning - MARL)**.<br />
                  • <b>Mô phỏng hành vi xung đột lợi ích:</b> Trong hệ sinh thái mới, mỗi Bộ - Ngành (Bộ Kế hoạch và Đầu tư, Bộ Thông tin và Truyền thông, Bộ Lao động - Thương binh và Xã hội) sẽ được đại diện bởi một Agent độc lập với các hàm mục tiêu riêng (Welfare Functions). Các Agent này sẽ liên tục tương tác, đàm phán và cạnh tranh nguồn ngân sách tài khóa công. Mô hình sẽ tìm ra điểm cân bằng Nash (Nash Equilibrium), giúp Chính phủ dự báo chính xác các xung đột cục bộ và cơ cấu lại cơ chế phối hợp liên bộ ngành tối ưu nhất.
                </p>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}