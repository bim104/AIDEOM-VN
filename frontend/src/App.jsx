import React, { useState } from 'react';
import Home from './components/Home';
import Bai01 from './components/Bai01';
import Bai02 from './components/Bai02';
import Bai03 from './components/Bai03';
import Bai04 from './components/Bai04';
import Bai05 from './components/Bai05';
import Bai06 from './components/Bai06';
import Bai07 from './components/Bai07';
import Bai08 from './components/Bai08';
import Bai09 from './components/Bai09';
import Bai10 from './components/Bai10';
import Bai11 from './components/Bai11';
import Bai12 from './components/Bai12';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { id: 'home', name: 'TRANG CHỦ', component: <Home /> },
    { id: 'bai1', name: 'Bài 1 — Cobb-Douglas + AI', component: <Bai01 /> },
    { id: 'bai2', name: 'Bài 2 — LP ngân sách số', component: <Bai02 /> }, 
    { id: 'bai3', name: 'Bài 3 — Priority 10 ngành', component: <Bai03 /> },
    { id: 'bai4', name: 'Bài 4 — LP Ngành - Vùng', component: <Bai04 /> },
    { id: 'bai5', name: 'Bài 5 — MIP 15 dự án số', component: <Bai05 /> },
    { id: 'bai6', name: 'Bài 6 — TOPSIS 6 vùng', component: <Bai06 /> },
    { id: 'bai7', name: 'Bài 7 — Tối ưu đa mục tiêu', component: <Bai07 /> },
    { id: 'bai8', name: 'Bài 8 — Tối ưu động 2035', component: <Bai08 /> },
    { id: 'bai9', name: 'Bài 9 — Tác động lao động AI', component: <Bai09 /> },
    { id: 'bai10', name: 'Bài 10 — Quy hoạch ngẫu nhiên', component: <Bai10 /> },
    { id: 'bai11', name: 'Bài 11 — Học tăng cường RL', component: <Bai11 /> },
    { id: 'bai12', name: 'Bài 12 — Đồ án AIDEOM-VN', component: <Bai12 /> },
  ];

  return (
    <div style={{ display: 'flex', backgroundColor: '#0e1117', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* Sidebar điều hướng danh sách bài tập */}
      <div style={{ width: '280px', backgroundColor: '#161a25', padding: '25px 20px', borderRight: '1px solid #232936', boxSizing: 'border-box' }}>
        <h3 style={{ margin: 0, color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>VN AIDEOM-VN</h3>
        <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Mô hình ra quyết định phát triển kinh tế vĩ mô</p>
        <hr style={{ borderColor: '#232936', margin: '20px 0' }} />
        
        <p style={{ fontSize: '11px', color: '#475569', fontWeight: 'bold', letterSpacing: '0.5px', margin: '0 0 10px 5px' }}>📚 DANH SÁCH BÀI TẬP</p>
        
        {tabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 15px',
              borderRadius: '6px',
              cursor: 'pointer',
              marginBottom: '6px',
              fontSize: '13.5px',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              backgroundColor: activeTab === tab.id ? '#1e40af' : 'transparent',
              color: activeTab === tab.id ? '#ffffff' : '#94a3b8',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.name}
          </div>
        ))}
      </div>

      {/* Vùng nội dung chi tiết */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto', boxSizing: 'border-box' }}>
        {tabs.find(t => t.id === activeTab)?.component}
      </div>

    </div>
  );
}