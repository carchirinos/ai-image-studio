import React, { useState } from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'Carlos Rodriguez',
    email: 'carlos@example.com',
    title: 'AI Image Creator',
    location: 'San Francisco, CA',
    joinDate: 'January 2024',
    bio: 'Passionate about AI-generated art and image enhancement. Love exploring new creative possibilities with artificial intelligence.'
  });

  const stats = [
    { label: 'Images Generated', value: '156', icon: '🎨', color: '#667eea' },
    { label: 'Images Enhanced', value: '89', icon: '✨', color: '#f093fb' },
    { label: 'Total Projects', value: '245', icon: '📁', color: '#4facfe' },
    { label: 'Days Active', value: '45', icon: '📅', color: '#43e97b' }
  ];

  const recentActivity = [
    { id: 1, action: 'Generated AI portrait', time: '2 hours ago', icon: '🎨' },
    { id: 2, action: 'Enhanced landscape photo', time: '5 hours ago', icon: '✨' },
    { id: 3, action: 'Analyzed product image', time: '1 day ago', icon: '🔍' },
    { id: 4, action: 'Extracted text from document', time: '2 days ago', icon: '📝' },
    { id: 5, action: 'Created new gallery collection', time: '3 days ago', icon: '🖼️' },
  ];

  const achievements = [
    { title: 'First Generation', description: 'Created your first AI image', icon: '🌟', earned: true },
    { title: 'Power User', description: 'Generated 100+ images', icon: '🚀', earned: true },
    { title: 'Enhancer Pro', description: 'Enhanced 50+ images', icon: '✨', earned: true },
    { title: 'Explorer', description: 'Used all AI features', icon: '🗺️', earned: false },
    { title: 'Master Creator', description: 'Generated 500+ images', icon: '👑', earned: false },
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <h1 className="page-title">👤 My Profile</h1>
        <p className="page-subtitle">Manage your account and view your AI creation journey</p>
      </div>

      <div className="profile-content">
        {/* Left Column */}
        <div className="profile-left">
          {/* User Card */}
          <div className="user-card">
            <div className="user-avatar-section">
              <div className="user-avatar-large">
                <span className="avatar-text">CR</span>
              </div>
              <button className="avatar-edit-btn">📷</button>
            </div>
            
            <div className="user-info-section">
              {!isEditing ? (
                <>
                  <h2 className="user-name">{userInfo.name}</h2>
                  <p className="user-title">{userInfo.title}</p>
                  <p className="user-location">📍 {userInfo.location}</p>
                  <p className="user-join-date">Joined {userInfo.joinDate}</p>
                  <p className="user-bio">{userInfo.bio}</p>
                  <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                    ✏️ Edit Profile
                  </button>
                </>
              ) : (
                <div className="edit-form">
                  <input
                    type="text"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                    className="edit-input"
                    placeholder="Full Name"
                  />
                  <input
                    type="text"
                    value={userInfo.title}
                    onChange={(e) => setUserInfo({...userInfo, title: e.target.value})}
                    className="edit-input"
                    placeholder="Title"
                  />
                  <input
                    type="text"
                    value={userInfo.location}
                    onChange={(e) => setUserInfo({...userInfo, location: e.target.value})}
                    className="edit-input"
                    placeholder="Location"
                  />
                  <textarea
                    value={userInfo.bio}
                    onChange={(e) => setUserInfo({...userInfo, bio: e.target.value})}
                    className="edit-textarea"
                    placeholder="Bio"
                    rows="3"
                  />
                  <div className="edit-actions">
                    <button className="save-btn" onClick={handleSave}>💾 Save</button>
                    <button className="cancel-btn" onClick={() => setIsEditing(false)}>❌ Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="achievements-card">
            <h3 className="card-title">🏆 Achievements</h3>
            <div className="achievements-list">
              {achievements.map((achievement, index) => (
                <div key={index} className={`achievement-item ${achievement.earned ? 'earned' : 'locked'}`}>
                  <div className="achievement-icon">{achievement.icon}</div>
                  <div className="achievement-info">
                    <h4 className="achievement-title">{achievement.title}</h4>
                    <p className="achievement-description">{achievement.description}</p>
                  </div>
                  {achievement.earned && <div className="earned-badge">✓</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="profile-right">
          {/* Stats Grid */}
          <div className="stats-section">
            <h3 className="section-title">📊 Your Statistics</h3>
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                    {stat.icon}
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="activity-section">
            <h3 className="section-title">⚡ Recent Activity</h3>
            <div className="activity-list">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">{activity.icon}</div>
                  <div className="activity-content">
                    <p className="activity-action">{activity.action}</p>
                    <p className="activity-time">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="view-all-btn">View All Activity →</button>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-section">
            <h3 className="section-title">⚡ Quick Actions</h3>
            <div className="quick-actions-grid">
              <button className="quick-action-btn">
                <span className="action-icon">🎨</span>
                <span className="action-label">Generate Image</span>
              </button>
              <button className="quick-action-btn">
                <span className="action-icon">📤</span>
                <span className="action-label">Upload & Enhance</span>
              </button>
              <button className="quick-action-btn">
                <span className="action-icon">🖼️</span>
                <span className="action-label">View Gallery</span>
              </button>
              <button className="quick-action-btn">
                <span className="action-icon">⚙️</span>
                <span className="action-label">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
