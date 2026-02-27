import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // TODO: Implement actual logout logic
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="layout">
      {/* Header */}
      <header className="layout-header">
        <div className="header-left">
          <button className="mobile-menu-btn" onClick={toggleSidebar}>
            ☰
          </button>
          <div className="header-logo">
            <span className="logo-icon">🎨</span>
            <span className="logo-text">AI Image Studio Pro</span>
          </div>
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">Carlos</span>
            <div className="user-avatar">👤</div>
          </div>
          <button className="header-btn" title="Notifications">
            🔔
          </button>
          <button className="header-btn" title="Settings" onClick={() => navigate('/app/settings')}>
            ⚙️
          </button>
          <button className="header-btn logout-btn" title="Logout" onClick={handleLogout}>
            🚪
          </button>
        </div>
      </header>

      <div className="layout-body">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Mobile Overlay */}
        {sidebarOpen && <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />}
        
        {/* Main Content */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
