import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [activeGallery, setActiveGallery] = useState('generated');

  // Sample gallery images for demonstration
  const galleryImages = {
    generated: [
      { id: 1, prompt: 'Cyberpunk cityscape at sunset', style: 'Digital Art' },
      { id: 2, prompt: 'Watercolor mountain landscape', style: 'Watercolor' },
      { id: 3, prompt: 'Portrait in oil painting style', style: 'Oil Painting' },
      { id: 4, prompt: 'Fantasy dragon in medieval setting', style: 'Fantasy' },
      { id: 5, prompt: 'Minimalist geometric design', style: 'Minimalist' },
      { id: 6, prompt: 'Vintage car photography', style: 'Vintage' }
    ],
    enhanced: [
      { id: 1, enhancement: 'AI Upscaled 4K', original: 'Low resolution photo' },
      { id: 2, enhancement: 'Noise Reduction', original: 'Grainy night photo' },
      { id: 3, enhancement: 'Color Enhancement', original: 'Faded vintage photo' },
      { id: 4, enhancement: 'Background Removal', original: 'Product photo' },
      { id: 5, enhancement: 'HDR Processing', original: 'Underexposed landscape' },
      { id: 6, enhancement: 'Portrait Enhancement', original: 'Selfie photo' }
    ],
    analyzed: [
      { id: 1, detected: ['Person', 'Car', 'Building'], confidence: '95%' },
      { id: 2, detected: ['Dog', 'Park', 'Trees'], confidence: '92%' },
      { id: 3, detected: ['Food', 'Table', 'Restaurant'], confidence: '88%' },
      { id: 4, detected: ['Nature', 'Mountain', 'Sky'], confidence: '96%' },
      { id: 5, detected: ['Technology', 'Computer', 'Office'], confidence: '91%' },
      { id: 6, detected: ['Sports', 'Stadium', 'Crowd'], confidence: '89%' }
    ],
    ocr: [
      { id: 1, extracted: 'Business Card - Contact Information', accuracy: '98%' },
      { id: 2, extracted: 'Restaurant Menu - Food Items & Prices', accuracy: '95%' },
      { id: 3, extracted: 'Document - Legal Contract Text', accuracy: '97%' },
      { id: 4, extracted: 'Handwritten Note - Personal Message', accuracy: '87%' },
      { id: 5, extracted: 'Street Sign - Location Information', accuracy: '99%' },
      { id: 6, extracted: 'Book Page - Literature Content', accuracy: '96%' }
    ]
  };

  const modules = [
    {
      id: 'generate',
      title: 'Generate Images',
      icon: '🎨',
      description: 'Create stunning images from text descriptions with AI',
      features: ['Text-to-Image', 'Multiple Styles', 'High Quality', 'Instant Results'],
      route: '/app/generate',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'upload',
      title: 'Upload & Enhance',
      icon: '📤',
      description: 'Upload and enhance your existing images with AI',
      features: ['AI Upscaling', 'Noise Reduction', 'Color Enhancement', 'Background Removal'],
      route: '/app/upload',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'recognize',
      title: 'Image Recognition',
      icon: '🔍',
      description: 'Analyze and identify objects, scenes, and content',
      features: ['Object Detection', 'Scene Analysis', 'Content Moderation', 'Smart Tagging'],
      route: '/app/recognize',
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'extract',
      title: 'Text Extraction',
      icon: '📝',
      description: 'Extract text from images and documents with OCR',
      features: ['Document OCR', 'Handwriting Recognition', 'Multi-language', 'Editable Output'],
      route: '/app/extract',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const handleModuleClick = (route) => {
    navigate(route);
  };

  const handleGalleryChange = (galleryType) => {
    setActiveGallery(galleryType);
  };

  const handleAuthAction = (action) => {
    navigate(`/${action}`);
  };

  return (
    <div className="home-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <span className="logo-icon">🎨</span>
              <span className="logo-text">AI Image Studio Pro</span>
            </div>
            <nav className="nav-buttons">
              <button className="btn btn-outline" onClick={() => handleAuthAction('login')}>
                Login
              </button>
              <button className="btn btn-primary" onClick={() => handleAuthAction('register')}>
                Register
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Transform Your Images with <span className="gradient-text">AI Power</span>
            </h1>
            <p className="hero-subtitle">
              Generate • Enhance • Analyze • Extract
            </p>
            <p className="hero-description">
              Unleash the full potential of artificial intelligence for all your image processing needs. 
              From creating stunning artwork to extracting valuable insights, we've got you covered.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Images Generated</span>
              </div>
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">AI Styles</span>
              </div>
              <div className="stat">
                <span className="stat-number">99%</span>
                <span className="stat-label">Accuracy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Gallery */}
      <section className="gallery-section">
        <div className="container">
          <h2 className="section-title">See What's Possible</h2>
          <div className="gallery-tabs">
            <button 
              className={`gallery-tab ${activeGallery === 'generated' ? 'active' : ''}`}
              onClick={() => handleGalleryChange('generated')}
            >
              🎨 Generated
            </button>
            <button 
              className={`gallery-tab ${activeGallery === 'enhanced' ? 'active' : ''}`}
              onClick={() => handleGalleryChange('enhanced')}
            >
              ✨ Enhanced
            </button>
            <button 
              className={`gallery-tab ${activeGallery === 'analyzed' ? 'active' : ''}`}
              onClick={() => handleGalleryChange('analyzed')}
            >
              🔍 Analyzed
            </button>
            <button 
              className={`gallery-tab ${activeGallery === 'ocr' ? 'active' : ''}`}
              onClick={() => handleGalleryChange('ocr')}
            >
              📝 OCR
            </button>
          </div>
          
          <div className="gallery-grid">
            {galleryImages[activeGallery].map((image) => (
              <div key={image.id} className="gallery-item">
                <div className="image-placeholder">
                  <span className="placeholder-icon">🖼️</span>
                  <span className="placeholder-text">Sample Image</span>
                </div>
                <div className="image-info">
                  {activeGallery === 'generated' && (
                    <>
                      <p className="image-prompt">"{image.prompt}"</p>
                      <span className="image-style">{image.style}</span>
                    </>
                  )}
                  {activeGallery === 'enhanced' && (
                    <>
                      <p className="image-enhancement">{image.enhancement}</p>
                      <span className="image-original">{image.original}</span>
                    </>
                  )}
                  {activeGallery === 'analyzed' && (
                    <>
                      <p className="image-detected">Detected: {image.detected.join(', ')}</p>
                      <span className="image-confidence">Confidence: {image.confidence}</span>
                    </>
                  )}
                  {activeGallery === 'ocr' && (
                    <>
                      <p className="image-extracted">{image.extracted}</p>
                      <span className="image-accuracy">Accuracy: {image.accuracy}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="modules-section">
        <div className="container">
          <h2 className="section-title">Choose Your AI Module</h2>
          <div className="modules-grid">
            {modules.map((module) => (
              <div 
                key={module.id} 
                className="module-card"
                onClick={() => handleModuleClick(module.route)}
              >
                <div className={`module-header bg-gradient-to-br ${module.color}`}>
                  <span className="module-icon">{module.icon}</span>
                  <h3 className="module-title">{module.title}</h3>
                </div>
                <div className="module-content">
                  <p className="module-description">{module.description}</p>
                  <ul className="module-features">
                    {module.features.map((feature, index) => (
                      <li key={index} className="module-feature">
                        <span className="feature-check">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="module-button">
                    Get Started <span className="button-arrow">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Images?</h2>
            <p className="cta-description">
              Join thousands of creators, professionals, and businesses using AI Image Studio Pro
            </p>
            <div className="cta-buttons">
              <button className="btn btn-primary btn-large" onClick={() => navigate('/app/generate')}>
                Start Creating Now
              </button>
              <button className="btn btn-outline btn-large" onClick={() => navigate('/app/gallery')}>
                View Gallery
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>AI Image Studio Pro</h4>
              <p>Transforming images with cutting-edge AI technology</p>
            </div>
            <div className="footer-section">
              <h4>Features</h4>
              <ul>
                <li>Image Generation</li>
                <li>Image Enhancement</li>
                <li>Object Recognition</li>
                <li>Text Extraction</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Community</li>
                <li>Contact Us</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 AI Image Studio Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Chatbot Indicator */}
      <div className="chatbot-indicator" onClick={() => navigate('/app')}>
        <span className="chatbot-icon">🤖</span>
        <span className="chatbot-text">Need help? Chat with our AI assistant!</span>
      </div>
    </div>
  );
};

export default HomePage;
