import React, { useState } from 'react';
import { Outlet, useNavigate} from 'react-router-dom';
import Sidebar from './Sidebar';
import './Layout.css';
import { useAuth } from '../contexts/AuthContext';
import Chatbot from './Chatbot';
import { useChatbot } from '../contexts/ChatbotContext';const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
const { user, logout } = useAuth();
  const handleLogout = async () => {
  await logout();
  window.location.href = '/';  // hard redirect en lugar de navigate
};
const { toggleChatbot } = useChatbot();
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
          <div className="header-logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
  <span className="logo-icon">🎨</span>
  <span className="logo-text">AI Image Studio Pro</span>
</div>
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{user?.username || user?.signInDetails?.loginId || 'User'}</span>
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
    <button 
        className="chatbot-fab"
        onClick={toggleChatbot}
        title="AI Assistant"
      >
        🤖
      </button>
      <Chatbot />
    </div>
  );
};

export default Layout;
