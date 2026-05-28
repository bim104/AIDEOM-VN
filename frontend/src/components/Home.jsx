import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Home() {
  // Dữ liệu giả lập tổng quan cho đồ thị tiến trình số hóa vĩ mô Việt Nam
  const macroSummaryData = [
    { year: '2020', gdp: 8044, tfp: 41.2 },
    { year: '2022', gdp: 9513, tfp: 43.5 },
    { year: '2024', gdp: 11511, tfp: 46.8 },
    { year: '2026', gdp: 13900, tfp: 48.5 },
    { year: '2030 (Dự báo)', gdp: 18450, tfp: 52.3 },
  ];

  return (
    <div style={{ color: '#ffffff', maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Khối Banner Chào mừng */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)', border: '1px solid #232936', borderRadius: '12px', padding: '35px', marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: '28px', margin: 0, fontWeight: 'bold', letterSpacing: '0.5px' }}>
            HỆ THỐNG ĐIỀU HÀNH VĨ MÔ TÍCH HỢP — AIDEOM-VN V1.0
          </h1>
          <p style={{ fontSize: '14px', color: '#38bdf8', margin: '8px 0 15px 0', fontWeight: '500' }}>
            Artificial Intelligence Driven Economic Optimization Model for Vietnam
          </p>
          <div style={{ fontSize: '13.5px', color: '#94a3b8', maxWidth: '900px', lineHeight: '1.6' }}>
            Chào mừng bạn đến với Trung tâm mô phỏng chiến lược quốc gia. Hệ thống tích hợp toàn diện các mô hình toán kinh tế lượng, quy hoạch tuyến tính phi tuyến, thuật toán tiến hóa đa mục tiêu NSGA-II và học tăng cường RL nhằm tối ưu hóa phân bổ ngân sách tài khóa, bảo hộ việc làm an sinh trước làn sóng đột phá công nghệ số.
          </div>
        </div>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)' }}></div>
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
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Ràng buộc tối thiểu theo Bài 1 & 12</div>
        </div>
        <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderLeft: '4px solid #fbbf24', padding: '20px', borderRadius: '8px' }}>
          <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Đóng góp năng suất TFP</div>
          <h2 style={{ fontSize: '24px', margin: '6px 0 0 0', fontWeight: 'bold', color: '#fbbf24' }}>&gt; 45%</h2>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Dịch chuyển sang tăng trưởng chiều sâu</div>
        </div>
        <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderLeft: '4px solid #f43f5e', padding: '20px', borderRadius: '8px' }}>
          <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Trần biến động lao động AI</div>
          <h2 style={{ fontSize: '24px', margin: '6px 0 0 0', fontWeight: 'bold', color: '#f43f5e' }}>{"<= 5.0%"}</h2>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Ràng buộc an sinh Bài 9 & Bài 10</div>
        </div>
      </div>

      {/* Khối chia đôi: Đồ thị xu hướng bên trái, Sơ đồ 6 Module bên phải */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.6fr', gap: '25px', marginBottom: '30px' }}>
        
        {/* Đồ thị Recharts phẳng tổng quan quỹ đạo */}
        <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
          <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#fff', fontWeight: '600' }}>📊 Quỹ đạo tăng trưởng quy mô kinh tế Việt Nam (nghìn tỷ VND)</h4>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={macroSummaryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff' }} />
                <Bar dataKey="gdp" fill="#2563eb" radius={[4, 4, 0, 0]} name="Quy mô GDP" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Kiến trúc 6 Module cốt lõi theo đề bài đồ án tổng kết */}
        <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
          <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#fff', fontWeight: '600' }}>🗺️ Cấu trúc Kiến trúc Phân tầng Hệ thống Mô hình AIDEOM-VN</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12.5px' }}>
            <div style={{ backgroundColor: '#0e1117', padding: '12px', borderRadius: '6px', border: '1px solid #232936' }}>
              <b style={{ color: '#38bdf8' }}>M1: Dự báo Macro</b>
              <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '11.5px' }}>Ước lượng TFP nòng cốt và dự toán quỹ đạo GDP tương lai.</p>
            </div>
            <div style={{ backgroundColor: '#0e1117', padding: '12px', borderRadius: '6px', border: '1px solid #232936' }}>
              <b style={{ color: '#34d399' }}>M2: Sẵn sàng số (Readiness)</b>
              <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '11.5px' }}>Thuật toán ma trận TOPSIS xếp hạng năng lực số 10 ngành.</p>
            </div>
            <div style={{ backgroundColor: '#0e1117', padding: '12px', borderRadius: '6px', border: '1px solid #232936' }}>
              <b style={{ color: '#a855f7' }}>M3: Tối ưu Phân bổ</b>
              <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '11.5px' }}>Quy hoạch tuyến tính (LP) phân phối dòng vốn Ngành - Vùng.</p>
            </div>
            <div style={{ backgroundColor: '#0e1117', padding: '12px', borderRadius: '6px', border: '1px solid #232936' }}>
              <b style={{ color: '#fbbf24' }}>M4: Mô phỏng Lao động</b>
              <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '11.5px' }}>Cân bằng dòng việc làm NetJob trước sức ép tự động hóa.</p>
            </div>
            <div style={{ backgroundColor: '#0e1117', padding: '12px', borderRadius: '6px', border: '1px solid #232936' }}>
              <b style={{ color: '#f43f5e' }}>M5: Đánh giá Rủi ro</b>
              <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '11.5px' }}>Quy hoạch ngẫu nhiên 2 giai đoạn chặn lỗ hổng Cyber-risk.</p>
            </div>
            <div style={{ backgroundColor: '#0e1117', padding: '12px', borderRadius: '6px', border: '1px solid #232936' }}>
              <b style={{ color: '#10b981' }}>M6: Dashboard QĐ</b>
              <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '11.5px' }}>Hợp nhất giao diện đa kịch bản liên thông phòng vệ đồ án.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Chân trang Hướng dẫn thao tác nhanh */}
      <div style={{ backgroundColor: '#111520', border: '1px dashed #232936', padding: '15px', borderRadius: '6px', fontSize: '13px', color: '#94a3b8', textAlign: 'center' }}>
        💡 <b>HƯỚNG DẪN THAO TÁC:</b> vui lòng sử dụng <b>Menu Sidebar phía bên trái</b> để di chuyển linh hoạt qua lại giữa 12 Phân hệ bài toán từ cơ bản đến nâng cao nhé!
      </div>

    </div>
  );
}