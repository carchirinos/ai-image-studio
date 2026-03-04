import React, { useState } from 'react';

import { uploadData, getUrl } from 'aws-amplify/storage'; // ← SOLO AMPLIFY
import './GeneratePage.css';


function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
const [imageBase64, setImageBase64] = useState('');
  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Por favor ingresa un prompt');
      return;
    }

    setLoading(true);
    setError('');
    setImageUrl('');
    setSaved(false);
    try {
      const response = await fetch('https://dqmj2hhndg.execute-api.us-west-2.amazonaws.com/dev/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (data.success) {
        setImageUrl(`data:image/png;base64,${data.imageBase64}`);
      setImageBase64(data.imageBase64); // ← base64 puro sin prefijo
} else {
        setError(data.error || 'Error generando imagen');
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

const saveToGallery = async (base64Data, prompt) => {
  try {
    setSaving(true); // ← AGREGAR ESTA LÍNEA
    console.log('🚨 INICIANDO saveToGallery CON SOLO AMPLIFY');
    
    // Paso 1: Convertir base64 a blob
    console.log('🔄 Paso 1: Convirtiendo base64...');
    const base64Response = await fetch(`data:image/png;base64,${base64Data}`);
    const blob = await base64Response.blob();
    console.log('✅ Blob creado, tamaño:', blob.size);
    
    // Paso 2: Subir a S3 CON AMPLIFY
    console.log('🔄 Paso 2: Subiendo con Amplify Storage...');
    const timestamp = Date.now();
    const s3Key = `images/generated/generated_${timestamp}.png`;
    
    const uploadResult = await uploadData({
      key: s3Key,
      data: blob,
      options: {
        contentType: 'image/png'
      }
    }).result;
    
    console.log('✅ Subido con Amplify:', uploadResult.key);
    
    // Paso 3: GENERAR URL SEGURA CON AMPLIFY
    console.log('🔄 Paso 3: Generando URL segura con Amplify...');
    const { url } = await getUrl({
      key: s3Key,
      options: { 
        expiresIn: 30 * 24 * 60 * 60 // 30 días
      }
    });
    
    console.log('✅ URL segura generada con Amplify');
    console.log('🔗 URL:', url.toString());
    
    // Paso 4: Guardar metadata
    console.log('🔄 Paso 4: Guardando metadata...');
    const imageData = {
      id: timestamp,
      prompt: prompt,

      s3Key: s3Key,
      createdAt: new Date().toISOString(),
      model: 'amazon.titan-image-generator-v2:0',
      resolution: '1024x1024',
      fileSize: Math.round(blob.size / 1024) + ' KB'
    };
    
    const existingImages = JSON.parse(localStorage.getItem('galleryImages') || '[]');
    const updatedImages = [imageData, ...existingImages];
    localStorage.setItem('galleryImages', JSON.stringify(updatedImages));
    
    console.log('✅ GUARDADO EXITOSO CON AMPLIFY. Total imágenes:', updatedImages.length);
    
    setSaving(false); // ← AGREGAR ESTA LÍNEA
    return true;
    
  } catch (error) {
    console.error('❌ Error en saveToGallery:', error);
    setSaving(false); // ← AGREGAR ESTA LÍNEA
    return false;
  }
};

  // Función para convertir PNG a JPG
  const convertToJPG = (callback) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Fondo blanco para JPG
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Dibujar imagen
      ctx.drawImage(img, 0, 0);
      
      // Convertir a JPG
      const jpgDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      callback(jpgDataUrl);
    };
    
    img.src = imageUrl;
  };

  const downloadImage = (format = 'png') => {
    if (format === 'jpg') {
      convertToJPG((jpgDataUrl) => {
        const link = document.createElement('a');
        link.href = jpgDataUrl;
        link.download = `ai-image-${Date.now()}.jpg`;
        link.click();
      });
    } else {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `ai-image-${Date.now()}.png`;
      link.click();
    }
  };

return (
  <div className="generate-container">
    <div className="generate-header">
      <h1>🎨 Generar Imagen</h1>
      <p>Crea imágenes increíbles con Amazon Bedrock</p>
    </div>

    <div className="generate-layout">
      {/* Panel izquierdo - Formulario */}
      <div className="generate-left">
        <div className="generate-form">
          <div className="input-group">
            <label htmlFor="prompt">Describe tu imagen:</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ejemplo: Un gato naranja durmiendo en un jardín lleno de flores coloridas..."
              className="prompt-textarea"
              rows="5"
            />
          </div>
          <button
            onClick={generateImage}
            disabled={loading || !prompt.trim()}
            className="generate-btn"
          >
            {loading ? <><span className="spinner"></span>Generando...</> : <>🚀 Generar Imagen</>}
          </button>
        </div>

        {error && <div className="error-message"><span>⚠️</span>{error}</div>}

        {imageUrl && (
          <div className="image-actions">
            <button onClick={() => saveToGallery(imageBase64, prompt)} disabled={saving || saved} className="save-btn">
              {saving ? <><span className="spinner-small"></span>Guardando...</> : saved ? <>✅ Guardado</> : <>💾 Guardar en Galería</>}
            </button>
            <div className="download-group">
              <button onClick={() => downloadImage('png')} className="download-btn png">📥 PNG</button>
              <button onClick={() => downloadImage('jpg')} className="download-btn jpg">📥 JPG</button>
            </div>
            <button onClick={() => { setImageUrl(''); setSaved(false); }} className="clear-btn">🗑️ Limpiar</button>
          </div>
        )}

        {saved && <div className="success-message"><span>✅</span>¡Imagen guardada en tu galería!</div>}
      </div>

      {/* Panel derecho - Imagen */}
      <div className="generate-right">
        {imageUrl ? (
          <>
            <img src={imageUrl} alt="Generated" className="generated-image" />
            <div className="image-meta">
              <p><strong>Prompt:</strong> "{prompt}"</p>
              <p><strong>Modelo:</strong> Amazon Titan v2</p>
            </div>
          </>
        ) : (
          <div className="image-placeholder-empty">
            <span>🎨</span>
            <p>Tu imagen aparecerá aquí</p>
          </div>
        )}
      </div>
    </div>
  </div>
);
}

export default GeneratePage;
