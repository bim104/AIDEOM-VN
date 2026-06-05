import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Home() {
  // Dữ liệu giả lập tổng quan cho đồ thị tiến trình số hóa vĩ mô Việt Nam
  const macroSummaryData = [
    { year: '2020', gdp: 8044.4, tfp: 27.74 },
    { year: '2021', gdp: 8487.5, tfp: 28.76 },
    { year: '2022', gdp: 9513.3, tfp: 30.35 },
    { year: '2023', gdp: 10221.8, tfp: 30.97 },
    { year: '2024', gdp: 11511.9, tfp: 32.91 },
    { year: '2025', gdp: 12847.6, tfp: 34.91 },
  ];

  return (
    <div style={{ color: '#ffffff', maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px', fontFamily: 'sans-serif' }}>
      
      {/* Khối Banner Chào mừng */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)', border: '1px solid #232936', borderRadius: '12px', padding: '35px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: '28px', margin: 0, fontWeight: 'bold', letterSpacing: '0.5px' }}>
            HỆ THỐNG ĐIỀU HÀNH VĨ MÔ TÍCH HỢP — AIDEOM-VN V1.0
          </h1>
          <p style={{ fontSize: '14px', color: '#38bdf8', margin: '8px 0 15px 0', fontWeight: '500' }}>
            Artificial Intelligence Driven Economic Optimization Model for Vietnam
          </p>
          
          <div style={{ fontSize: '13.5px', color: '#94a3b8', maxWidth: '900px', lineHeight: '1.6' }}>
            Chào mừng đến với hệ thống mô phỏng chiến lược quốc gia. Đồ án tổng hợp các phương pháp kinh tế lượng, đánh giá đa tiêu chí, quy hoạch tối ưu và học tăng cường (RL) nhằm giải quyết bài toán phân bổ tài khóa và bảo hộ an sinh trước làn sóng AI.
          </div>
        </div>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)' }}></div>
      </div>

      {/* Khối Thông tin Sinh viên (Thẻ riêng) */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '15px 25px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'rgba(37, 99, 235, 0.2)', border: '1px solid #38bdf8', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}>
            🎓
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600', marginBottom: '3px' }}>Sinh viên thực hiện</div>
            <div style={{ fontSize: '18px', color: '#fff', fontWeight: 'bold' }}>Vũ Đức Duy</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ backgroundColor: '#0f172a', padding: '10px 20px', borderRadius: '6px', border: '1px solid #1e293b' }}>
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>MSV:</span> <b style={{ color: '#38bdf8', marginLeft: '6px', fontSize: '15px' }}>23050493</b>
          </div>
          <div style={{ backgroundColor: '#0f172a', padding: '10px 20px', borderRadius: '6px', border: '1px solid #1e293b' }}>
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>Lớp:</span> <b style={{ color: '#34d399', marginLeft: '6px', fontSize: '15px' }}>QH2023E-KTPT2</b>
          </div>
        </div>
      </div>

      {/* Cụm Thẻ KPI Chỉ số Mục tiêu Quốc gia đến năm 2030 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderLeft: '4px solid #34d399', padding: '20px', borderRadius: '8px' }}>
          <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Mục tiêu Tăng trưởng GDP</div>
          <h2 style={{ fontSize: '24px', margin: '6px 0 0 0', fontWeight: 'bold', color: '#34d399' }}>6.5% - 7.0%</h2>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Giai đoạn chiến lược 2026-2030</div>
        </div>
        <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderLeft: '4px solid #38bdf8', padding: '20px', borderRadius: '8px' }}>
          <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Tỷ trọng Kinh tế số / GDP</div>
          <h2 style={{ fontSize: '24px', margin: '6px 0 0 0', fontWeight: 'bold', color: '#38bdf8' }}>Cán mốc 30%</h2>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Đóng góp nền kinh tế cốt lõi</div>
        </div>
        <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderLeft: '4px solid #fbbf24', padding: '20px', borderRadius: '8px' }}>
          <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Đóng góp năng suất TFP</div>
          <h2 style={{ fontSize: '24px', margin: '6px 0 0 0', fontWeight: 'bold', color: '#fbbf24' }}>&gt; 45%</h2>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Dịch chuyển sang tăng trưởng chiều sâu</div>
        </div>
        <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderLeft: '4px solid #f43f5e', padding: '20px', borderRadius: '8px' }}>
          <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Trần biến động lao động</div>
          <h2 style={{ fontSize: '24px', margin: '6px 0 0 0', fontWeight: 'bold', color: '#f43f5e' }}>{"<= 5.0%"}</h2>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Ràng buộc an sinh việc làm</div>
        </div>
      </div>

      {/* Khối chia đôi: Đồ thị xu hướng bên trái, Tóm tắt 12 Bài tập bên phải */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '25px', marginBottom: '30px' }}>
        
        {/* Đồ thị Recharts */}
        <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
          <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#fff', fontWeight: '600' }}>📊 Quỹ đạo quy mô kinh tế Việt Nam (nghìn tỷ VND)</h4>
          <div style={{ width: '100%', height: 360 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={macroSummaryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#232936" vertical={false} />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff', border: '1px solid #232936' }} />
                <Bar dataKey="gdp" fill="#2563eb" radius={[4, 4, 0, 0]} name="Quy mô GDP" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tóm tắt Lộ trình 12 Bài tập */}
        <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
          <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#fff', fontWeight: '600' }}>🗺️ Lộ trình triển khai Đồ án (Bài 1 đến Bài 12)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            
            {/* Giai đoạn 1 */}
            <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '6px', border: '1px solid #1e293b' }}>
              <b style={{ color: '#38bdf8', fontSize: '13px', display: 'block', borderBottom: '1px solid #1e293b', paddingBottom: '8px', marginBottom: '8px' }}>
                1. Nền tảng Vĩ mô & Đánh giá
              </b>
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '12.5px', lineHeight: '1.6' }}>
                <li><b>Bài 1-3:</b> Hàm sản xuất Cobb-Douglas mở rộng, ước lượng TFP và dự báo tăng trưởng.</li>
                <li><b>Bài 4-6:</b> Ma trận đánh giá năng lực Readiness số hóa (TOPSIS, Entropy, AHP).</li>
              </ul>
            </div>

            {/* Giai đoạn 2 */}
            <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '6px', border: '1px solid #1e293b' }}>
              <b style={{ color: '#34d399', fontSize: '13px', display: 'block', borderBottom: '1px solid #1e293b', paddingBottom: '8px', marginBottom: '8px' }}>
                2. Tối ưu hóa phân bổ Vốn
              </b>
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '12.5px', lineHeight: '1.6' }}>
                <li><b>Bài 7:</b> Tối ưu đa mục tiêu NSGA-II tìm tập Pareto phân bổ ngân sách Vùng.</li>
                <li><b>Bài 8:</b> Tối ưu động liên thời gian (Dynamic DP / Ramsey) mô phỏng 2026-2035.</li>
              </ul>
            </div>

            {/* Giai đoạn 3 */}
            <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '6px', border: '1px solid #1e293b' }}>
              <b style={{ color: '#fbbf24', fontSize: '13px', display: 'block', borderBottom: '1px solid #1e293b', paddingBottom: '8px', marginBottom: '8px' }}>
                3. An sinh Việc làm & Rủi ro
              </b>
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '12.5px', lineHeight: '1.6' }}>
                <li><b>Bài 9:</b> Mô phỏng cân bằng dòng lao động (NetJob), quy hoạch tuyến tính bảo hộ an sinh.</li>
                <li><b>Bài 10:</b> Quy hoạch ngẫu nhiên 2 giai đoạn (SP) dưới các kịch bản bất định.</li>
              </ul>
            </div>

            {/* Giai đoạn 4 */}
            <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '6px', border: '1px solid #1e293b' }}>
              <b style={{ color: '#f43f5e', fontSize: '13px', display: 'block', borderBottom: '1px solid #1e293b', paddingBottom: '8px', marginBottom: '8px' }}>
                4. AI tự hành & Tích hợp
              </b>
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '12.5px', lineHeight: '1.6' }}>
                <li><b>Bài 11:</b> Học tăng cường (Q-Learning) tìm kiếm chính sách kinh tế thích nghi.</li>
                <li><b>Bài 12:</b> Đồ án tích hợp hệ thống AIDEOM-VN, cung cấp Dashboard ra quyết định đa kịch bản.</li>
              </ul>
            </div>

          </div>
        </div>

      </div>

      {/* Chân trang Hướng dẫn thao tác nhanh */}
      <div style={{ backgroundColor: '#111520', border: '1px dashed #334155', padding: '15px', borderRadius: '6px', fontSize: '13px', color: '#94a3b8', textAlign: 'center' }}>
        💡 <b>HƯỚNG DẪN:</b> Vui lòng sử dụng <b>Menu Sidebar phía bên trái</b> để đi qua toàn bộ 12 Bài tập từ cơ bản đến nâng cao.
      </div>

    </div>
  );
}