import React, { useState, useEffect } from 'react';
import './GalleryPage.css';
import { getUrl } from 'aws-amplify/storage';const getTypeIcon = (type) => {
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
const GalleryPage = () => {
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [savedImages, setSavedImages] = useState([]);
const [selectedImage, setSelectedImage] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
  // Mock data for demo (mantenemos las existentes)
  const mockImages = [
    { id: 1, title: 'AI Portrait', type: 'generated', date: '2024-02-20', url: 'https://picsum.photos/300/300?random=1', source: 'mock' },
    { id: 2, title: 'Enhanced Photo', type: 'enhanced', date: '2024-02-19', url: 'https://picsum.photos/300/400?random=2', source: 'mock' },
    { id: 3, title: 'Logo Design', type: 'generated', date: '2024-02-18', url: 'https://picsum.photos/400/300?random=3', source: 'mock' },
    { id: 4, title: 'Document Scan', type: 'extracted', date: '2024-02-17', url: 'https://picsum.photos/300/350?random=4', source: 'mock' },
    { id: 5, title: 'Art Creation', type: 'generated', date: '2024-02-16', url: 'https://picsum.photos/350/300?random=5', source: 'mock' },
    { id: 6, title: 'Photo Analysis', type: 'analyzed', date: '2024-02-15', url: 'https://picsum.photos/300/300?random=6', source: 'mock' },
    { id: 7, title: 'Enhanced Image', type: 'enhanced', date: '2024-02-14', url: 'https://picsum.photos/400/350?random=7', source: 'mock' },
    { id: 8, title: 'AI Artwork', type: 'generated', date: '2024-02-13', url: 'https://picsum.photos/300/400?random=8', source: 'mock' },
  ];

  // Cargar imágenes guardadas del localStorage
  useEffect(() => {
    loadSavedImages();
  }, []);

const loadSavedImages = async () => {
  try {
    const saved = JSON.parse(localStorage.getItem('galleryImages') || '[]');
    
    // Regenerar URL fresca para cada imagen
    const formattedSaved = await Promise.all(saved.map(async (img) => {
      const { url } = await getUrl({
        key: img.s3Key,
        options: { expiresIn: 3600 } // 1 hora es suficiente
      });
      
      return {
        id: `saved_${img.id}`,
        title: img.prompt.slice(0, 30) + (img.prompt.length > 30 ? '...' : ''),
        type: 'generated',
        date: new Date(img.createdAt).toISOString().split('T')[0],
        url: url.toString(), // URL fresca cada vez
        source: 'bedrock',
        prompt: img.prompt,
        model: img.model,
        s3Key: img.s3Key
      };
    }));
    
    setSavedImages(formattedSaved);
  } catch (error) {
    console.error('Error loading images:', error);
    setSavedImages([]);
  }
};


  // Combinar imágenes mock y guardadas
  const allImages = [...savedImages, ...mockImages];
  const filteredImages = filter === 'all' ? allImages : allImages.filter(img => img.type === filter);

  // Contar imágenes por tipo (incluyendo las guardadas)
  const getImageCount = (type) => {
    if (type === 'all') return allImages.length;
    return allImages.filter(img => img.type === type).length;
  };

  // Contar imágenes reales de Bedrock
  const bedrockCount = savedImages.length;

  

  const deleteImage = (imageId) => {
    if (imageId.startsWith('saved_')) {
      // Eliminar imagen guardada
      const originalId = parseInt(imageId.replace('saved_', ''));
      const updatedSaved = JSON.parse(localStorage.getItem('savedImages') || '[]')
        .filter(img => img.id !== originalId);
      localStorage.setItem('savedImages', JSON.stringify(updatedSaved));
      loadSavedImages(); // Recargar
    }
  };

  const downloadImage = (image, format = 'png') => {
    if (image.source === 'bedrock') {
      // Descargar imagen de Bedrock
      if (format === 'jpg') {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          
          const jpgDataUrl = canvas.toDataURL('image/jpeg', 0.9);
          const link = document.createElement('a');
          link.href = jpgDataUrl;
          link.download = `${image.title}-${Date.now()}.jpg`;
          link.click();
        };
        
        img.src = image.url;
      } else {
        const link = document.createElement('a');
        link.href = image.url;
        link.download = `${image.title}-${Date.now()}.png`;
        link.click();
      }
    } else {
      // Descargar imagen mock (simulado)
      const link = document.createElement('a');
      link.href = image.url;
      link.download = `${image.title}-${Date.now()}.jpg`;
      link.click();
    }
  };
const openModal = (image) => {
  setSelectedImage(image);
  setIsModalOpen(true);
};

const closeModal = () => {
  setSelectedImage(null);
  setIsModalOpen(false);
};


  return (
    <div className="gallery-page">
      {/* Header */}
      <div className="gallery-header">
        <div className="header-content">
          <h1 className="page-title">🖼️ My Gallery</h1>
          <p className="page-subtitle">
            Manage and view all your AI-generated and processed images
            {bedrockCount > 0 && (
              <span className="bedrock-badge">
                ✨ {bedrockCount} created with Bedrock
              </span>
            )}
          </p>
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

 

      {/* Filters - Actualizados con conteos reales */}
      <div className="gallery-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Images ({getImageCount('all')})
        </button>
        <button 
          className={`filter-btn ${filter === 'generated' ? 'active' : ''}`}
          onClick={() => setFilter('generated')}
        >
          🎨 Generated ({getImageCount('generated')})
        </button>
        <button 
          className={`filter-btn ${filter === 'enhanced' ? 'active' : ''}`}
          onClick={() => setFilter('enhanced')}
        >
          ✨ Enhanced ({getImageCount('enhanced')})
        </button>
        <button 
          className={`filter-btn ${filter === 'analyzed' ? 'active' : ''}`}
          onClick={() => setFilter('analyzed')}
        >
          🔍 Analyzed ({getImageCount('analyzed')})
        </button>
        <button 
          className={`filter-btn ${filter === 'extracted' ? 'active' : ''}`}
          onClick={() => setFilter('extracted')}
        >
          📝 Extracted ({getImageCount('extracted')})
        </button>
      </div>

      {/* Image Grid */}
      <div className={`image-grid ${viewMode}`}>
        {filteredImages.map((image) => (
          <div key={image.id} className={`image-card ${image.source === 'bedrock' ? 'bedrock-image' : ''}`} data-category={image.category}>

            <div className="image-container">
              <img src={image.url} alt={image.title} className="image" />
              <div className="image-overlay">
                <button 
  className="overlay-btn"
  onClick={() => openModal(image)}
>
  👁️ View
</button>

                {image.source === 'bedrock' ? (
                  <>
                    <button 
                      className="overlay-btn"
                      onClick={() => downloadImage(image, 'png')}
                    >
                      📥 PNG
                    </button>
                    <button 
                      className="overlay-btn"
                      onClick={() => downloadImage(image, 'jpg')}
                    >
                      📥 JPG
                    </button>
                    <button 
                      className="overlay-btn delete"
                      onClick={() => deleteImage(image.id)}
                    >
                      🗑️ Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className="overlay-btn"
                      onClick={() => downloadImage(image)}
                    >
                      📥 Download
                    </button>
                    <button className="overlay-btn">🗑️ Delete</button>
                  </>
                )}
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
              {image.source === 'bedrock' && (
                <p className="image-source">🤖 Amazon Bedrock</p>
              )}
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
    <ImageModal 
        image={selectedImage}
        isOpen={isModalOpen}
        onClose={closeModal}
        onDownload={downloadImage}
        onDelete={deleteImage}
      /></div>
  );
};
// Agregar este componente Modal antes del export default
const ImageModal = ({ image, isOpen, onClose, onDownload, onDelete }) => {
  if (!isOpen || !image) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        
        <div className="modal-image-container">
          <img 
            src={image.url} 
            alt={image.title} 
            className="modal-image"
          />
        </div>
        
        <div className="modal-info">
          <div className="modal-header">
            <h2 className="modal-title">{image.title}</h2>
            <div 
              className="modal-type-badge"
              style={{ backgroundColor: getTypeColor(image.type) }}
            >
              {getTypeIcon(image.type)} {image.type}
            </div>
          </div>
          
          {image.prompt && (
            <p className="modal-prompt">
              <strong>Prompt:</strong> "{image.prompt}"
            </p>
          )}
          
          <div className="modal-meta">
            <span className="modal-date">📅 {image.date}</span>
            {image.source === 'bedrock' && (
              <span className="modal-source">🤖 Amazon Bedrock</span>
            )}
          </div>
          
          <div className="modal-actions">
            {image.source === 'bedrock' ? (
              <>
                <button 
                  className="modal-btn download-png"
                  onClick={() => onDownload(image, 'png')}
                >
                  📥 Download PNG
                </button>
                <button 
                  className="modal-btn download-jpg"
                  onClick={() => onDownload(image, 'jpg')}
                >
                  📥 Download JPG
                </button>
                <button 
                  className="modal-btn delete-btn"
                  onClick={() => {
                    onDelete(image.id);
                    onClose();
                  }}
                >
                  🗑️ Delete
                </button>
              </>
            ) : (
              <>
                <button 
                  className="modal-btn download-btn"
                  onClick={() => onDownload(image)}
                >
                  📥 Download
                </button>
                <button className="modal-btn delete-btn">
                  🗑️ Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
