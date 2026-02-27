import React, { useState } from 'react';
import './SettingsPage.css';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    language: 'en',
    timezone: 'America/New_York',
    theme: 'light',
    autoSave: true,
    
    // AI Settings
    defaultModel: 'dall-e-3',
    imageQuality: 'high',
    enhancementLevel: 'medium',
    autoEnhance: false,
    
    // Privacy Settings
    profileVisibility: 'private',
    shareAnalytics: true,
    cookieConsent: true,
    dataRetention: '1year',
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    securityAlerts: true,
    
    // Account Settings
    twoFactorAuth: false,
    sessionTimeout: '30min',
    downloadQuality: 'original'
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // Here you would save to backend
    alert('Settings saved successfully! 🎉');
  };

  const handleExportData = () => {
    // Mock data export
    const data = {
      profile: 'User profile data...',
      images: 'Generated images metadata...',
      settings: settings
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-studio-data.json';
    a.click();
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'ai', label: 'AI Settings', icon: '🤖' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'account', label: 'Account', icon: '👤' }
  ];

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-header">
        <h1 className="page-title">⚙️ Settings</h1>
        <p className="page-subtitle">Customize your AI Image Studio Pro experience</p>
        <button className="save-all-btn" onClick={handleSaveSettings}>
          💾 Save All Changes
        </button>
      </div>

      <div className="settings-content">
        {/* Sidebar Navigation */}
        <div className="settings-sidebar">
          <nav className="settings-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span className="nav-label">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="settings-main">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="settings-section">
              <h2 className="section-title">⚙️ General Settings</h2>
              
              <div className="setting-group">
                <h3 className="group-title">🌐 Localization</h3>
                <div className="setting-item">
                  <label className="setting-label">Language</label>
                  <select 
                    className="setting-select"
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label className="setting-label">Timezone</label>
                  <select 
                    className="setting-select"
                    value={settings.timezone}
                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  </select>
                </div>
              </div>

              <div className="setting-group">
                <h3 className="group-title">🎨 Appearance</h3>
                <div className="setting-item">
                  <label className="setting-label">Theme</label>
                  <div className="theme-options">
                    <button 
                      className={`theme-btn ${settings.theme === 'light' ? 'active' : ''}`}
                      onClick={() => handleSettingChange('theme', 'light')}
                    >
                      ☀️ Light
                    </button>
                    <button 
                      className={`theme-btn ${settings.theme === 'dark' ? 'active' : ''}`}
                      onClick={() => handleSettingChange('theme', 'dark')}
                    >
                      🌙 Dark
                    </button>
                    <button 
                      className={`theme-btn ${settings.theme === 'auto' ? 'active' : ''}`}
                      onClick={() => handleSettingChange('theme', 'auto')}
                    >
                      🔄 Auto
                    </button>
                  </div>
                </div>
              </div>

              <div className="setting-group">
                <h3 className="group-title">💾 Data</h3>
                <div className="setting-item">
                  <div className="setting-toggle">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={settings.autoSave}
                        onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <div className="toggle-content">
                      <span className="toggle-title">Auto-save projects</span>
                      <span className="toggle-description">Automatically save your work every 30 seconds</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Settings */}
          {activeTab === 'ai' && (
            <div className="settings-section">
              <h2 className="section-title">🤖 AI Settings</h2>
              
              <div className="setting-group">
                <h3 className="group-title">🎨 Generation</h3>
                <div className="setting-item">
                  <label className="setting-label">Default AI Model</label>
                  <select 
                    className="setting-select"
                    value={settings.defaultModel}
                    onChange={(e) => handleSettingChange('defaultModel', e.target.value)}
                  >
                    <option value="dall-e-3">DALL-E 3 (Recommended)</option>
                    <option value="dall-e-2">DALL-E 2</option>
                    <option value="midjourney">Midjourney Style</option>
                    <option value="stable-diffusion">Stable Diffusion</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label className="setting-label">Image Quality</label>
                  <div className="quality-options">
                    <button 
                      className={`quality-btn ${settings.imageQuality === 'standard' ? 'active' : ''}`}
                      onClick={() => handleSettingChange('imageQuality', 'standard')}
                    >
                      Standard
                    </button>
                    <button 
                      className={`quality-btn ${settings.imageQuality === 'high' ? 'active' : ''}`}
                      onClick={() => handleSettingChange('imageQuality', 'high')}
                    >
                      High
                    </button>
                    <button 
                      className={`quality-btn ${settings.imageQuality === 'ultra' ? 'active' : ''}`}
                      onClick={() => handleSettingChange('imageQuality', 'ultra')}
                    >
                      Ultra
                    </button>
                  </div>
                </div>
              </div>

              <div className="setting-group">
                <h3 className="group-title">✨ Enhancement</h3>
                <div className="setting-item">
                  <label className="setting-label">Enhancement Level</label>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={settings.enhancementLevel === 'low' ? 1 : settings.enhancementLevel === 'medium' ? 3 : 5}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        const level = val <= 2 ? 'low' : val <= 4 ? 'medium' : 'high';
                        handleSettingChange('enhancementLevel', level);
                      }}
                      className="enhancement-slider"
                    />
                    <div className="slider-labels">
                      <span>Low</span>
                      <span>Medium</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>
                <div className="setting-item">
                  <div className="setting-toggle">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={settings.autoEnhance}
                        onChange={(e) => handleSettingChange('autoEnhance', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <div className="toggle-content">
                      <span className="toggle-title">Auto-enhance uploads</span>
                      <span className="toggle-description">Automatically enhance images when uploaded</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <div className="settings-section">
              <h2 className="section-title">🔒 Privacy Settings</h2>
              
              <div className="setting-group">
                <h3 className="group-title">👁️ Profile Visibility</h3>
                <div className="setting-item">
                  <label className="setting-label">Profile Visibility</label>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="profileVisibility"
                        value="public"
                        checked={settings.profileVisibility === 'public'}
                        onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                      />
                      <span className="radio-label">🌐 Public - Anyone can see your profile</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="profileVisibility"
                        value="friends"
                        checked={settings.profileVisibility === 'friends'}
                        onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                      />
                      <span className="radio-label">👥 Friends - Only friends can see your profile</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="profileVisibility"
                        value="private"
                        checked={settings.profileVisibility === 'private'}
                        onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                      />
                      <span className="radio-label">🔒 Private - Only you can see your profile</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="setting-group">
                <h3 className="group-title">📊 Data Usage</h3>
                <div className="setting-item">
                  <div className="setting-toggle">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={settings.shareAnalytics}
                        onChange={(e) => handleSettingChange('shareAnalytics', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <div className="toggle-content">
                      <span className="toggle-title">Share usage analytics</span>
                      <span className="toggle-description">Help improve our service by sharing anonymous usage data</span>
                    </div>
                  </div>
                </div>
                <div className="setting-item">
                  <label className="setting-label">Data Retention Period</label>
                  <select 
                    className="setting-select"
                    value={settings.dataRetention}
                    onChange={(e) => handleSettingChange('dataRetention', e.target.value)}
                  >
                    <option value="3months">3 Months</option>
                    <option value="6months">6 Months</option>
                    <option value="1year">1 Year</option>
                    <option value="forever">Forever</option>
                  </select>
                </div>
              </div>

              <div className="setting-group">
                <h3 className="group-title">📁 Data Export</h3>
                <div className="export-section">
                  <p className="export-description">
                    Download all your data including profile information, generated images, and settings.
                  </p>
                  <button className="export-btn" onClick={handleExportData}>
                    📥 Export My Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2 className="section-title">🔔 Notification Settings</h2>
              
              <div className="setting-group">
                <h3 className="group-title">📧 Email Notifications</h3>
                <div className="setting-item">
                  <div className="setting-toggle">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <div className="toggle-content">
                      <span className="toggle-title">Email notifications</span>
                      <span className="toggle-description">Receive email updates about your account</span>
                    </div>
                  </div>
                </div>
                <div className="setting-item">
                  <div className="setting-toggle">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={settings.weeklyReport}
                        onChange={(e) => handleSettingChange('weeklyReport', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <div className="toggle-content">
                      <span className="toggle-title">Weekly activity report</span>
                      <span className="toggle-description">Get a summary of your weekly AI creation activity</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="setting-group">
                <h3 className="group-title">📱 Push Notifications</h3>
                <div className="setting-item">
                  <div className="setting-toggle">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications}
                        onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <div className="toggle-content">
                      <span className="toggle-title">Push notifications</span>
                      <span className="toggle-description">Receive push notifications on your device</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="setting-group">
                <h3 className="group-title">🔐 Security Alerts</h3>
                <div className="setting-item">
                  <div className="setting-toggle">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={settings.securityAlerts}
                        onChange={(e) => handleSettingChange('securityAlerts', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <div className="toggle-content">
                      <span className="toggle-title">Security alerts</span>
                      <span className="toggle-description">Get notified about important security events</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Settings */}
          {activeTab === 'account' && (
            <div className="settings-section">
              <h2 className="section-title">👤 Account Settings</h2>
              
              <div className="setting-group">
                <h3 className="group-title">🔐 Security</h3>
                <div className="setting-item">
                  <div className="setting-toggle">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={settings.twoFactorAuth}
                        onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <div className="toggle-content">
                      <span className="toggle-title">Two-factor authentication</span>
                      <span className="toggle-description">Add an extra layer of security to your account</span>
                    </div>
                  </div>
                </div>
                <div className="setting-item">
                  <label className="setting-label">Session Timeout</label>
                  <select 
                    className="setting-select"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                  >
                    <option value="15min">15 Minutes</option>
                    <option value="30min">30 Minutes</option>
                    <option value="1hour">1 Hour</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </div>

              <div className="setting-group">
                <h3 className="group-title">📥 Downloads</h3>
                <div className="setting-item">
                  <label className="setting-label">Download Quality</label>
                  <select 
                    className="setting-select"
                    value={settings.downloadQuality}
                    onChange={(e) => handleSettingChange('downloadQuality', e.target.value)}
                  >
                    <option value="compressed">Compressed (Smaller file)</option>
                    <option value="standard">Standard Quality</option>
                    <option value="original">Original Quality</option>
                  </select>
                </div>
              </div>

              <div className="setting-group danger-zone">
                <h3 className="group-title">⚠️ Danger Zone</h3>
                <div className="danger-actions">
                  <button className="danger-btn" onClick={() => setShowDeleteModal(true)}>
                    🗑️ Delete Account
                  </button>
                  <p className="danger-description">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">⚠️ Delete Account</h3>
            <p className="modal-text">
              Are you sure you want to delete your account? This will permanently remove all your data, 
              including generated images, profile information, and settings.
            </p>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="modal-confirm" onClick={() => {
                alert('Account deletion cancelled for demo purposes');
                setShowDeleteModal(false);
              }}>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
