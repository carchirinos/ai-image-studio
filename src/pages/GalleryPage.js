import React, { useState } from 'react';
import './GalleryPage.css';

const GalleryPage = () => {
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  // Mock data for demo
  const images = [
    { id: 1, title: 'AI Portrait', type: 'generated', date: '2024-02-20', url: 'https://picsum.photos/300/300?random=1' },
    { id: 2, title: 'Enhanced Photo', type: 'enhanced', date: '2024-02-19', url: 'https://picsum.photos/300/400?random=2' },
    { id: 3, title: 'Logo Design', type: 'generated', date: '2024-02-18', url: 'https://picsum.photos/400/300?random=3' },
    { id: 4, title: 'Document Scan', type: 'extracted', date: '2024-02-17', url: 'https://picsum.photos/300/350?random=4' },
    { id: 5, title: 'Art Creation', type: 'generated', date: '2024-02-16', url: 'https://picsum.photos/350/300?random=5' },
    { id: 6, title: 'Photo Analysis', type: 'analyzed', date: '2024-02-15', url: 'https://picsum.photos/300/300?random=6' },
    { id: 7, title: 'Enhanced Image', type: 'enhanced', date: '2024-02-14', url: 'https://picsum.photos/400/350?random=7' },
    { id: 8, title: 'AI Artwork', type: 'generated', date: '2024-02-13', url: 'https://picsum.photos/300/400?random=8' },
  ];

  const filteredImages = filter === 'all' ? images : images.filter(img => img.type === filter);

  const getTypeIcon = (type) => {
    const icons = {
      generated: '🎨',
      enhanced: '✨',
      analyzed: '🔍',
      extracted: '📝'
    };
    return icons[type] || '🖼️';
  };

  const getTypeColor = (type) => {
    const colors = {
      generated: '#667eea',
      enhanced: '#f093fb',
      analyzed: '#4facfe',
      extracted: '#43e97b'
    };
    return colors[type] || '#718096';
  };

  return (
    <div className="gallery-page">
      {/* Header */}
      <div className="gallery-header">
        <div className="header-content">
          <h1 className="page-title">🖼️ My Gallery</h1>
          <p className="page-subtitle">Manage and view all your AI-generated and processed images</p>
        </div>
        
        <div className="header-actions">
          <div className="view-controls">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              ⊞
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎨</div>
          <div className="stat-content">
            <div className="stat-number">24</div>
            <div className="stat-label">Generated</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✨</div>
          <div className="stat-content">
            <div className="stat-number">12</div>
            <div className="stat-label">Enhanced</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔍</div>
          <div className="stat-content">
            <div className="stat-number">8</div>
            <div className="stat-label">Analyzed</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-number">6</div>
            <div className="stat-label">Extracted</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="gallery-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Images ({images.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'generated' ? 'active' : ''}`}
          onClick={() => setFilter('generated')}
        >
          🎨 Generated ({images.filter(img => img.type === 'generated').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'enhanced' ? 'active' : ''}`}
          onClick={() => setFilter('enhanced')}
        >
          ✨ Enhanced ({images.filter(img => img.type === 'enhanced').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'analyzed' ? 'active' : ''}`}
          onClick={() => setFilter('analyzed')}
        >
          🔍 Analyzed ({images.filter(img => img.type === 'analyzed').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'extracted' ? 'active' : ''}`}
          onClick={() => setFilter('extracted')}
        >
          📝 Extracted ({images.filter(img => img.type === 'extracted').length})
        </button>
      </div>

      {/* Image Grid */}
      <div className={`image-grid ${viewMode}`}>
        {filteredImages.map((image) => (
          <div key={image.id} className="image-card">
            <div className="image-container">
              <img src={image.url} alt={image.title} className="image" />
              <div className="image-overlay">
                <button className="overlay-btn">👁️ View</button>
                <button className="overlay-btn">📥 Download</button>
                <button className="overlay-btn">🗑️ Delete</button>
              </div>
            </div>
            <div className="image-info">
              <div className="image-header">
                <h3 className="image-title">{image.title}</h3>
                <div 
                  className="image-type"
                  style={{ backgroundColor: getTypeColor(image.type) }}
                >
                  {getTypeIcon(image.type)}
                </div>
              </div>
              <p className="image-date">{image.date}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🖼️</div>
          <h3>No images found</h3>
          <p>Try adjusting your filters or create some new images!</p>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
