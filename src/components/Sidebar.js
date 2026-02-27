import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/app', icon: '🏠', label: 'Dashboard', exact: true },
    { path: '/app/generate', icon: '🎨', label: 'Generate' },
    { path: '/app/upload', icon: '📤', label: 'Upload' },
    { path: '/app/recognize', icon: '🔍', label: 'Analyze' },
    { path: '/app/extract', icon: '📝', label: 'Extract' },
    { path: '/app/gallery', icon: '🖼️', label: 'Gallery' },
    { path: '/app/profile', icon: '👤', label: 'Profile' },
    { path: '/app/settings', icon: '⚙️', label: 'Settings' }
  ];

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `sidebar-item ${isActive && (item.exact ? location.pathname === item.path : true) ? 'active' : ''}`
              }
              onClick={onClose}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <div className="status-indicator">
            <span className="status-dot">🟢</span>
            <span className="status-text">All systems operational</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
