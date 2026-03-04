import React, { useState, useRef } from 'react';
import { uploadData, getUrl } from 'aws-amplify/storage';
import './EnhancePage.css';

const ENHANCE_API = 'https://0cyr2qe6i6.execute-api.us-west-2.amazonaws.com/dev/enhance-image';

const MODES = [
  {
    id: 'BACKGROUND_REMOVAL',
    icon: '🎭',
    label: 'Background Removal',
    desc: 'Elimina el fondo automáticamente',
    hasPrompt: false
  },
  {
    id: 'IMAGE_VARIATION',
    icon: '🎨',
    label: 'Style Transfer',
    desc: 'Aplica un estilo artístico',
    hasPrompt: true,
    placeholder: 'Ej: "Convert to watercolor painting style"'
  },
  {
    id: 'INPAINTING',
    icon: '✏️',
    label: 'Image Editing',
    desc: 'Edita partes con texto',
    hasPrompt: true,
    placeholder: 'Ej: "Replace the sky with a sunset"'
  },
  {
    id: 'IMAGE_VARIATION',
    icon: '🤖',
    label: 'AI Transformation',
    desc: 'Transforma con un prompt libre',
    hasPrompt: true,
    placeholder: 'Ej: "Make it look like a cyberpunk city at night"'
  }
];

function EnhancePage() {
  const [image, setImage]           = useState(null);
  const [preview, setPreview]       = useState(null);
  const [imageBase64, setImageBase64] = useState('');
  const [mode, setMode]             = useState(MODES[0]);
  const [prompt, setPrompt]         = useState('');
  const [resultUrl, setResultUrl]   = useState('');
  const [resultBase64, setResultBase64] = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const fileInputRef                = useRef(null);

  // ── File handling ──────────────────────────────────────────
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setImage(file);
  setPreview(URL.createObjectURL(file));
  setResultUrl('');
  setError('');
  setSaved(false);
  setPrompt('');

  // Convertir a base64 con FileReader
  const reader = new FileReader();
  reader.onload = () => {
    // Quitar el prefijo "data:image/png;base64," — Titan solo quiere el base64 puro
    const base64 = reader.result.split(',')[1];
    setImageBase64(base64);
  };
  reader.readAsDataURL(file);
};

  const reset = () => {
    setImage(null);
    setPreview(null);
    setImageBase64('');
    setResultUrl('');
    setResultBase64('');
    setError('');
    setSaved(false);
    setPrompt('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Process image ──────────────────────────────────────────
  const processImage = async () => {
    if (!imageBase64) return;
    if (mode.hasPrompt && !prompt.trim()) {
      setError('Por favor describe la transformación');
      return;
    }

    setLoading(true);
    setError('');
    setResultUrl('');
    setSaved(false);

    try {
      const response = await fetch(ENHANCE_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          taskType: mode.id,
          prompt: prompt.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        setResultUrl(`data:image/png;base64,${data.imageBase64}`);
        setResultBase64(data.imageBase64);
      } else {
        setError(data.error || 'Error procesando imagen');
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Save to gallery ────────────────────────────────────────
  const saveToGallery = async () => {
    try {
      setSaving(true);
      const base64Response = await fetch(`data:image/png;base64,${resultBase64}`);
      const blob = await base64Response.blob();

      const timestamp = Date.now();
      const s3Key = `images/enhanced/enhanced_${timestamp}.png`;

     await uploadData({
  key: s3Key,
  data: blob,
  options: { contentType: 'image/png' }
}).result;

await getUrl({
  key: s3Key,
  options: { expiresIn: 30 * 24 * 60 * 60 }
});
      const imageData = {
        id: timestamp,
        prompt: prompt || mode.label,
        s3Key,
        createdAt: new Date().toISOString(),
        model: 'amazon.titan-image-generator-v2:0',
        mode: mode.label,
        resolution: '512x512',
        fileSize: Math.round(blob.size / 1024) + ' KB'
      };

      const existing = JSON.parse(localStorage.getItem('galleryImages') || '[]');
      localStorage.setItem('galleryImages', JSON.stringify([imageData, ...existing]));

      setSaved(true);
    } catch (err) {
      setError('Error guardando: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Download ───────────────────────────────────────────────
  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `enhanced-${Date.now()}.png`;
    link.click();
  };

  // ─────────────────────────────────────────────────────────
  return (
    <div className="enhance-container">
      <div className="enhance-header">
        <h1>✨ Enhance</h1>
        <p>Transforma tus imágenes con Amazon Bedrock Titan</p>
      </div>

      {/* ── Modes bar ── */}
      <div className="enhance-modes">
        {MODES.map((m, i) => (
          <div
            key={i}
            className={`enhance-mode-btn ${mode.label === m.label ? 'active' : ''}`}
            onClick={() => { setMode(m); setPrompt(''); setError(''); }}
          >
            <span className="enhance-mode-icon">{m.icon}</span>
            <div className="enhance-mode-text">
              <span className="enhance-mode-label">{m.label}</span>
              <span className="enhance-mode-desc">{m.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main layout ── */}
      <div className="enhance-layout">

        {/* Left: upload + controls */}
        <div className="enhance-left">
          <div
            className="upload-zone"
            onClick={() => fileInputRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) handleFileChange({ target: { files: [file] } });
            }}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="preview-image" />
            ) : (
              <div className="upload-placeholder">
                <span>📤</span>
                <p>Arrastra una imagen aquí</p>
                <p className="upload-hint">o haz clic para seleccionar</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {mode.hasPrompt && (
            <div className="enhance-prompt-wrap">
              <label className="enhance-prompt-label">Describe la transformación</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={mode.placeholder}
                className="enhance-prompt-input"
                rows={3}
              />
            </div>
          )}

          <button
            onClick={processImage}
            disabled={!image || loading}
            className="analyze-btn"
          >
            {loading
              ? <><span className="spinner"></span>Procesando...</>
              : <>✨ Procesar Imagen</>
            }
          </button>

          {image && (
            <button onClick={reset} className="reset-btn">
              🗑️ Limpiar imagen
            </button>
          )}

          {error && <div className="error-message">⚠️ {error}</div>}
        </div>

        {/* Right: result */}
        <div className="enhance-right">
          {resultUrl ? (
            <div className="enhance-result">
              <div className="enhance-comparison">
                <div className="comp-side">
                  <div className="comp-label">
                    <span className="comp-dot before"></span> ANTES
                  </div>
                  <img src={preview} alt="Original" className="comp-image" />
                </div>
                <div className="comp-side">
                  <div className="comp-label">
                    <span className="comp-dot after"></span> DESPUÉS
                  </div>
                  <img src={resultUrl} alt="Result" className="comp-image" />
                </div>
              </div>

              <div className="enhance-actions">
                <button
                  onClick={saveToGallery}
                  disabled={saving || saved}
                  className="analyze-btn"
                  style={{ flex: 1 }}
                >
                  {saving
                    ? <><span className="spinner"></span>Guardando...</>
                    : saved
                    ? <>✅ Guardado</>
                    : <>💾 Guardar en Galería</>
                  }
                </button>
                <button
                  onClick={downloadImage}
                  className="analyze-btn"
                  style={{ flex: 1 }}
                >
                  ⬇️ Descargar
                </button>
              </div>

              {saved && (
                <div className="success-message">
                  <span>✅</span> ¡Imagen guardada en tu galería!
                </div>
              )}
            </div>
          ) : (
            <div className="results-placeholder">
              <span>✨</span>
              <p>El resultado aparecerá aquí</p>
              <p>Sube una imagen y presiona Procesar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EnhancePage;