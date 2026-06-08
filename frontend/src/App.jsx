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
    { id: 'home', icon: '🌍', name: 'Trang chủ Tổng quan', component: <Home /> },
    { id: 'bai1', icon: '📈', name: 'M1. Cobb-Douglas AI', component: <Bai01 /> },
    { id: 'bai2', icon: '💰', name: 'M2. LP Ngân sách số', component: <Bai02 /> }, 
    { id: 'bai3', icon: '🎯', name: 'M3. Priority 10 ngành', component: <Bai03 /> },
    { id: 'bai4', icon: '🗺️', name: 'M4. LP Ngành - Vùng', component: <Bai04 /> },
    { id: 'bai5', icon: '📦', name: 'M5. MIP Dự án số', component: <Bai05 /> },
    { id: 'bai6', icon: '🏆', name: 'M6. TOPSIS 6 vùng', component: <Bai06 /> },
    { id: 'bai7', icon: '⚖️', name: 'M7. NSGA-II Đa mục', component: <Bai07 /> },
    { id: 'bai8', icon: '⏳', name: 'M8. Tối ưu động DP', component: <Bai08 /> },
    { id: 'bai9', icon: '🛡️', name: 'M9. An sinh Việc làm', component: <Bai09 /> },
    { id: 'bai10', icon: '🎲', name: 'M10. Stochastic', component: <Bai10 /> },
    { id: 'bai11', icon: '🤖', name: 'M11. Q-Learning', component: <Bai11 /> },
    { id: 'bai12', icon: '🚀', name: 'M12. AIDEOM-VN', component: <Bai12 /> },
  ];

  return (
    <div style={{ backgroundColor: '#e2e8f0', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", display: 'flex', overflow: 'hidden' }}>
      
      {/* MENU KIỂU MỚI: FLOATING SIDEBAR BÊN TRÁI */}
      <nav style={{
        width: '280px',
        backgroundColor: '#0f172a',
        margin: '20px',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
        flexShrink: 0
      }}>
        {/* Logo Section */}
        <div style={{ padding: '30px 25px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px', fontWeight: '900', boxShadow: '0 4px 15px rgba(56,189,248,0.4)' }}>
            A
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#f8fafc', letterSpacing: '0.5px' }}>AIDEOM-VN</h2>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>Workspace</div>
          </div>
        </div>

        {/* Navigation Links */}
        <div style={{ padding: '20px 15px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }} className="custom-scrollbar">
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', paddingLeft: '10px' }}>
            Menu Điều Hành
          </div>
          
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 16px', borderRadius: '12px', border: 'none',
                  backgroundColor: isActive ? '#1e293b' : 'transparent',
                  color: isActive ? '#38bdf8' : '#cbd5e1',
                  fontSize: '13.5px', fontWeight: isActive ? '700' : '500',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  textAlign: 'left',
                  boxShadow: isActive ? 'inset 4px 0 0 #38bdf8' : 'none'
                }}
              >
                <span style={{ fontSize: '18px', filter: isActive ? 'grayscale(0)' : 'grayscale(1)', opacity: isActive ? 1 : 0.7 }}>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* KHÔNG GIAN NỘI DUNG CHÍNH (FLOATING MAIN) */}
      <main style={{
        flex: 1,
        backgroundColor: '#ffffff',
        margin: '20px 20px 20px 0',
        borderRadius: '24px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Topbar của Main Content */}
        <header style={{ height: '70px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', padding: '0 40px', justifyContent: 'space-between', backgroundColor: '#ffffff', zIndex: 10 }}>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
            {tabs.find(t => t.id === activeTab)?.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', boxShadow: '0 0 10px #10b981' }}></span>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>AIDEOM-VN: Mô hình tối ưu kinh tế tích hợp AI</span>
          </div>
        </header>

        {/* Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '40px', boxSizing: 'border-box' }} className="light-theme-override custom-scrollbar">
          {tabs.find(t => t.id === activeTab)?.component}
        </div>
      </main>

      {/* CSS ĐÈ MÀU TỰ ĐỘNG VÀ SCROLLBAR */}
      <style>{`
        /* Scrollbar đẹp */
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        nav.custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }

        /* ÉP MÀU NỀN SÁNG CHO 12 BÀI TẬP */
        .light-theme-override { color: #334155 !important; }
        .light-theme-override div[style*="background-color: #0f172a"], 
        .light-theme-override div[style*="backgroundColor: '#0f172a'"],
        .light-theme-override div[style*="background-color: rgba(20, 27, 45, 0.7)"] {
          background-color: #ffffff !important; border: 1px solid #e2e8f0 !important; box-shadow: 0 4px 15px rgba(0,0,0,0.03) !important;
        }
        .light-theme-override div[style*="background-color: #090d16"], 
        .light-theme-override div[style*="backgroundColor: '#090d16'"] {
          background-color: #f8fafc !important; border: 1px solid #e2e8f0 !important;
        }
        .light-theme-override h1, .light-theme-override h2, .light-theme-override h3, .light-theme-override h4, .light-theme-override h5 {
          color: #0f172a !important; border-color: #e2e8f0 !important;
        }
        .light-theme-override p, .light-theme-override span, .light-theme-override label, .light-theme-override td { color: #475569 !important; word-wrap: break-word; }
        .light-theme-override input, .light-theme-override select { background-color: #ffffff !important; color: #0f172a !important; border: 1px solid #cbd5e1 !important; }
        .light-theme-override table { background-color: #ffffff !important; border: 1px solid #e2e8f0 !important; }
        .light-theme-override th { background-color: #f1f5f9 !important; color: #0f172a !important; border-bottom: 2px solid #cbd5e1 !important; }
        .light-theme-override tr { border-bottom: 1px solid #e2e8f0 !important; }
        .recharts-cartesian-grid-horizontal line, .recharts-cartesian-grid-vertical line { stroke: #f1f5f9 !important; }
        .recharts-text { fill: #64748b !important; }
        .recharts-default-tooltip { background-color: #ffffff !important; border: 1px solid #e2e8f0 !important; border-radius: 8px !important; color: #0f172a !important; box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; }
      `}</style>
    </div>
  );
}