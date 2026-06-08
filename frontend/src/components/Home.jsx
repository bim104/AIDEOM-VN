import React from 'react';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Home() {
  // Dữ liệu cho Biểu đồ mới: PIE CHART (Cơ cấu hệ thống)
  const pieData = [
    { name: 'Nền tảng Vĩ mô', value: 30 },
    { name: 'Tối ưu Tài khóa', value: 35 },
    { name: 'An sinh Xã hội', value: 20 },
    { name: 'AI & Tự hành', value: 15 },
  ];
  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  // Dữ liệu cho Biểu đồ mới: AREA CHART CHỒNG LỚP
  const macroData = [
    { year: '2020', gdp: 8044, fdi: 2000, tech: 1200 },
    { year: '2021', gdp: 8487, fdi: 2100, tech: 1500 },
    { year: '2022', gdp: 9513, fdi: 2500, tech: 2100 },
    { year: '2023', gdp: 10221, fdi: 2800, tech: 2800 },
    { year: '2024', gdp: 11511, fdi: 3200, tech: 3600 },
    { year: '2025', gdp: 12847, fdi: 3600, tech: 4500 },
  ];

  const pillars = [
    {
      id: 1,
      title: 'Mô hình Kinh tế Vĩ mô',
      desc: 'Xây dựng mô hình kinh tế vĩ mô tích hợp các biến GDP, vốn, lao động và năng suất nhằm mô phỏng tăng trưởng quốc gia.',
      icon: '🏛️',
      color: '#eff6ff',
      textColor: '#2563eb'
    },
    {
      id: 2,
      title: 'Dự báo bằng AI',
      desc: 'Ứng dụng Machine Learning và Deep Learning để dự báo tăng trưởng kinh tế, lạm phát và xu hướng thị trường lao động.',
      icon: '📈',
      color: '#ecfdf5',
      textColor: '#10b981'
    },
    {
      id: 3,
      title: 'Tối ưu Phân bổ Nguồn lực',
      desc: 'Sử dụng các thuật toán tối ưu hóa để phân bổ ngân sách, đầu tư công và nguồn lực quốc gia một cách hiệu quả.',
      icon: '💎',
      color: '#fef3c7',
      textColor: '#d97706'
    },
    {
      id: 4,
      title: 'An sinh và Việc làm',
      desc: 'Đánh giá tác động của tự động hóa đến thị trường lao động và đề xuất các chính sách hỗ trợ chuyển đổi nghề nghiệp.',
      icon: '🛡️',
      color: '#fef2f2',
      textColor: '#dc2626'
    },
    {
      id: 5,
      title: 'Mô phỏng Chính sách',
      desc: 'Cho phép thử nghiệm các kịch bản kinh tế và đánh giá tác động của chính sách tài khóa, tiền tệ trước khi triển khai.',
      icon: '⚖️',
      color: '#f5f3ff',
      textColor: '#7c3aed'
    },
    {
      id: 6,
      title: 'Hệ thống Tự học Thông minh',
      desc: 'Triển khai Reinforcement Learning giúp mô hình tự điều chỉnh tham số và thích nghi với các biến động kinh tế theo thời gian.',
      icon: '🧠',
      color: '#ecfeff',
      textColor: '#0891b2'
    }
  ];

  return (
    <div style={{ color: '#334155', animation: 'fadeIn 0.5s ease' }}>

      {/* 1. THÔNG TIN TÁC GIẢ LÊN ĐẦU TIÊN (ĐÃ SỬA LỖI TRÀN CHỮ BẰNG FLEX-WRAP VÀ AUTO WIDTH) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>

        {/* Card Tác giả */}
        <div style={{ flex: '1 1 350px', backgroundColor: '#ffffff', borderRadius: '16px', padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Sinh Viên Thực Hiện</div>
              <div style={{ fontSize: '22px', color: '#0f172a', fontWeight: '900' }}>Đặng Bảo Linh</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
            <div style={{ backgroundColor: '#eff6ff', padding: '8px 15px', borderRadius: '8px', border: '1px solid #bfdbfe', flex: '1 1 auto' }}>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>MÃ SINH VIÊN</div>
              <div style={{ fontSize: '15px', color: '#2563eb', fontWeight: '800', fontFamily: 'monospace' }}>23050528</div>
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: '8px 15px', borderRadius: '8px', border: '1px solid #e2e8f0', flex: '1 1 auto' }}>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>LỚP</div>
              <div style={{ fontSize: '15px', color: '#0f172a', fontWeight: '800' }}>QH2023E-KTPT2</div>
            </div>
          </div>
        </div>

        {/* Card Tên dự án */}
        <div style={{ flex: '2 1 500px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '16px', padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px solid #334155', boxShadow: '0 10px 25px rgba(15,23,42,0.1)' }}>
          <div style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: 'rgba(56,189,248,0.1)', color: '#38bdf8', fontSize: '11px', fontWeight: '800', borderRadius: '6px', marginBottom: '15px', width: 'fit-content', border: '1px solid rgba(56,189,248,0.2)' }}>
            HỆ THỐNG ĐIỀU HÀNH CHUYỂN ĐỔI SỐ
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#ffffff', margin: '0 0 10px 0', lineHeight: '1.3' }}>
            AIDEOM-VN <span style={{ fontWeight: '400', opacity: 0.8 }}>| Mô hình Tối ưu Kinh tế Vĩ mô Tích hợp Trí tuệ Nhân tạo</span>
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', wordWrap: 'break-word' }}>
            Hệ sinh thái phân tích và hỗ trợ ra quyết định cấp Quốc gia. Kết hợp khoa học dữ liệu, quy hoạch tuyến tính và học tăng cường để giải quyết bài toán: Tối đa hóa tăng trưởng thông qua công nghệ song song với việc bảo vệ an sinh việc làm.
          </p>
        </div>

      </div>

      {/* 2. KHỐI DASHBOARD BIỂU ĐỒ (KIỂU MỚI: DONUT & AREA) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '25px', marginBottom: '30px' }}>

        {/* CHART 1: DONUT CHART - CƠ CẤU */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '25px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>Phân bổ Năng lực Hệ thống</h3>
          <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748b' }}>Tỷ trọng đóng góp của các phân hệ lõi</p>

          <div style={{ flex: 1, minHeight: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', fontWeight: '500', color: '#475569' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: AREA CHART - QUỸ ĐẠO */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '25px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>Quỹ đạo Phát triển Tích hợp</h3>
          <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748b' }}>Động lực tăng trưởng theo các lớp cấu phần</p>

          <div style={{ flex: 1, minHeight: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={macroData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGdp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTech" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" fontSize={11} stroke="#94a3b8" tickLine={false} />
                <YAxis fontSize={11} stroke="#94a3b8" tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="gdp" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorGdp)" name="GDP Tổng" />
                <Area type="monotone" dataKey="tech" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorTech)" name="Đóng góp Công nghệ" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 3. KHỐI TRỤ CỘT CHIẾN LƯỢC (ĐÃ SỬA LỖI TRÀN CHỮ BẰNG FLEX VÀ BỎ HEIGHT CỐ ĐỊNH) */}
      <div>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Tổ hợp 4 Trụ cột Vĩ mô</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {pillars.map(p => (
            <div key={p.id} style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', transition: 'transform 0.2s', cursor: 'default' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '10px', backgroundColor: p.color, color: p.textColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  {p.icon}
                </div>
                <b style={{ fontSize: '15px', color: '#0f172a', flex: 1, wordWrap: 'break-word' }}>{p.title}</b>
              </div>
              <p style={{ margin: 0, fontSize: '13.5px', color: '#475569', lineHeight: '1.6', wordWrap: 'break-word' }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}