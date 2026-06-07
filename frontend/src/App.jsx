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
    { id: 'home', name: '🏠 TRANG CHỦ TỔNG QUAN', component: <Home /> },
    { id: 'bai1', name: 'PHÂN HỆ 01: Cobb-Douglas AI', component: <Bai01 /> },
    { id: 'bai2', name: 'PHÂN HỆ 02: LP Ngân sách số', component: <Bai02 /> }, 
    { id: 'bai3', name: 'PHÂN HỆ 03: Priority 10 ngành', component: <Bai03 /> },
    { id: 'bai4', name: 'PHÂN HỆ 04: LP Ngành - Vùng', component: <Bai04 /> },
    { id: 'bai5', name: 'PHÂN HỆ 05: MIP 15 dự án số', component: <Bai05 /> },
    { id: 'bai6', name: 'PHÂN HỆ 06: TOPSIS 6 vùng', component: <Bai06 /> },
    { id: 'bai7', name: 'PHÂN HỆ 07: Tối ưu đa mục tiêu', component: <Bai07 /> },
    { id: 'bai8', name: 'PHÂN HỆ 08: Tối ưu động 2035', component: <Bai08 /> },
    { id: 'bai9', name: 'PHÂN HỆ 09: Tác động lao động', component: <Bai09 /> },
    { id: 'bai10', name: 'PHÂN HỆ 10: Bất định Stochastic', component: <Bai10 /> },
    { id: 'bai11', name: 'PHÂN HỆ 11: Học tăng cường RL', component: <Bai11 /> },
    { id: 'bai12', name: 'PHÂN HỆ 12: Đồ án AIDEOM-VN', component: <Bai12 /> },
  ];

  return (
    <div style={{ 
      backgroundColor: '#060913', 
      minHeight: '100vh', 
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      color: '#f1f5f9',
      backgroundImage: 'radial-gradient(circle at 50% -20%, #1e1b4b 0%, transparent 50%), radial-gradient(circle at 0% 100%, #020617 0%, transparent 40%)',
      paddingBottom: '60px',
      boxSizing: 'border-box'
    }}>
      
      {/* HEADER ĐIỀU HÀNH TRỤC NGANG */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        backgroundColor: 'rgba(10, 15, 30, 0.75)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '0 40px', height: '80px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)', fontWeight: '900', fontSize: '20px', color: '#fff'
          }}>V</div>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', letterSpacing: '0.5px', color: '#fff' }}>
              AIDEOM<span style={{ color: '#06b6d4' }}>-VN</span>
            </h2>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Macroeconomic Quantum Deck
            </div>
          </div>
        </div>

        <button 
          onClick={() => setActiveTab('home')}
          style={{
            backgroundColor: activeTab === 'home' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
            color: activeTab === 'home' ? '#06b6d4' : '#94a3b8',
            border: activeTab === 'home' ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid rgba(255,255,255,0.05)',
            padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px',
            transition: 'all 0.3s ease'
          }}
        >
          🏠 MÀN HÌNH TỔNG QUAN
        </button>
      </header>

      {/* THANH ĐIỀU HƯỚNG TẤT CẢ PHÂN HỆ */}
      <div style={{ maxWidth: '1400px', margin: '30px auto 0 auto', padding: '0 40px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {tabs.filter(t => t.id !== 'home').map(tab => {
            const isTabActive = activeTab === tab.id;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '10px 18px', borderRadius: '20px', cursor: 'pointer', fontSize: '12.5px',
                  fontWeight: '600', transition: 'all 0.2s',
                  backgroundColor: isTabActive ? '#06b6d4' : 'rgba(30, 41, 59, 0.4)',
                  color: isTabActive ? '#000000' : '#94a3b8',
                  boxShadow: isTabActive ? '0 0 15px rgba(6, 182, 212, 0.4)' : 'none',
                  border: isTabActive ? '1px solid #06b6d4' : '1px solid rgba(255,255,255,0.03)'
                }}
              >
                {tab.name}
              </div>
            );
          })}
        </div>
      </div>

      {/* VÙNG HIỂN THỊ */}
      <main style={{ maxWidth: '1400px', margin: '30px auto 0 auto', padding: '0 40px', boxSizing: 'border-box' }}>
        <div style={{
          backgroundColor: 'rgba(11, 17, 34, 0.7)',
          borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          position: 'relative'
        }} className="quantum-dynamic-wrapper">
          {tabs.find(t => t.id === activeTab)?.component}
        </div>
      </main>

      <style>{`
        .quantum-dynamic-wrapper, .quantum-dynamic-wrapper div, .quantum-dynamic-wrapper p, .quantum-dynamic-wrapper span { color: #e2e8f0 !important; }
        .quantum-dynamic-wrapper div[style*="background-color: #ffffff"], .quantum-dynamic-wrapper div[style*="backgroundColor: '#ffffff'"] {
          background-color: rgba(22, 30, 54, 0.5) !important;
          backdrop-filter: blur(10px) !important;
          border: 1px solid rgba(255,255,255,0.05) !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
          border-radius: 16px !important;
        }
        .quantum-dynamic-wrapper button {
          background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%) !important;
          color: #000000 !important;
          font-weight: 700 !important;
          border: none !important;
          border-radius: 8px !important;
          padding: 10px 20px !important;
          cursor: pointer !important;
        }
      `}</style>
    </div>
  );
}