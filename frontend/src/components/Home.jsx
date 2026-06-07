import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export default function Home() {
  const performanceData = [
    { subject: 'GDP Growth', A: 90, fullMark: 100 },
    { subject: 'Kinh tế số', A: 85, fullMark: 100 },
    { subject: 'Năng suất', A: 75, fullMark: 100 },
    { subject: 'An sinh', A: 88, fullMark: 100 },
    { subject: 'Ổn định', A: 92, fullMark: 100 },
  ];

  const strategicPillars = [
    { title: "Kiến trúc Vĩ mô", desc: "Hệ thống chuẩn hóa hàm sản xuất Cobb-Douglas mở rộng, định lượng hóa các biến số công nghệ nội sinh trong tăng trưởng dài hạn." },
    { title: "Tối ưu Tài khóa", desc: "Ứng dụng thuật toán tối ưu hóa (LP/MIP/NSGA-II) để giải bài toán phân bổ nguồn lực quốc gia một cách hiệu quả nhất." },
    { title: "An sinh Việc làm", desc: "Phân tích biến động dòng lao động, thiết lập bệ đỡ tài khóa bảo vệ nhân lực trước cú sốc tự động hóa." },
    { title: "Chính sách Thích nghi", desc: "Sử dụng Học tăng cường (RL) để Agent tự học các chính sách điều tiết vĩ mô trong môi trường biến động bất định." }
  ];

  return (
    <div style={{ color: '#e2e8f0', maxWidth: '1400px', margin: '0 auto', animation: 'fadeIn 0.6s ease' }}>
      
      {/* BANNER CHIẾN LƯỢC */}
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)', borderRadius: '16px', padding: '40px', marginBottom: '30px', border: '1px solid #312e81' }}>
        <h1 style={{ fontSize: '30px', fontWeight: '900', color: '#fff', margin: 0 }}>AIDEOM-VN: HỆ ĐIỀU HÀNH CHUYỂN ĐỔI SỐ QUỐC GIA</h1>
        <p style={{ fontSize: '14px', color: '#38bdf8', marginTop: '10px', fontWeight: '700', letterSpacing: '1px' }}>
          ARTIFICIAL INTELLIGENCE DRIVEN ECONOMIC OPTIMIZATION MODEL FOR VIETNAM
        </p>
        <div style={{ fontSize: '14px', color: '#cbd5e1', marginTop: '20px', maxWidth: '900px', lineHeight: '1.7' }}>
          <b>Ý nghĩa tên dự án:</b> AIDEOM-VN (Artificial Intelligence Driven Economic Optimization Model for Vietnam) là sự kết hợp giữa trí tuệ nhân tạo và mô hình tối ưu hóa kinh tế. Dự án không chỉ là một hệ thống tính toán, mà là một công cụ ra quyết định chiến lược (Decision Support System) giúp Chính phủ Việt Nam điều phối nguồn lực tài khóa, dự báo dòng lao động và thiết kế chính sách an sinh trong kỷ nguyên số hóa mạnh mẽ.
        </div>
      </div>

      {/* THÔNG TIN TÁC GIẢ */}
      <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '20px 30px', marginBottom: '30px', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '25px' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '10px', backgroundColor: 'rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>👤</div>
        <div>
          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Họ và tên</div>
          <div style={{ fontSize: '20px', color: '#fff', fontWeight: '800' }}>Đinh Ý Nhi</div>
          <div style={{ fontSize: '12px', color: '#38bdf8', fontFamily: 'monospace' }}>MSV: 23050586 | Lớp: QH2023E-KTPT2</div>
        </div>
      </div>

      {/* ĐỒ THỊ & TRỤ CỘT */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '25px' }}>
        <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b' }}>
          <h4 style={{ fontSize: '14px', color: '#fff', textAlign: 'center', marginBottom: '20px' }}>Hệ số cân bằng quốc gia</h4>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={performanceData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Radar dataKey="A" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          {strategicPillars.map((p, i) => (
            <div key={i} style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '10px', borderLeft: `4px solid ${p.border}`, border: '1px solid #1e293b' }}>
              <b style={{ color: '#fff', fontSize: '13px', display: 'block', marginBottom: '8px' }}>{p.title}</b>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '12px', lineHeight: '1.6' }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}