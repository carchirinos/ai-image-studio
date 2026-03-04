import React, { useState, useRef } from 'react';
import { RekognitionClient, DetectTextCommand } from '@aws-sdk/client-rekognition';
import { fetchAuthSession } from 'aws-amplify/auth';
import './ExtractPage.css';

const ExtractPage = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setImage(file);
  setPreview(URL.createObjectURL(file));
  setResults(null);
  setError('');
};

const reset = () => {
  setImage(null);
  setPreview(null);
  setResults(null);
  setError('');
};

const extractText = async () => {
  if (!image) return;
  setLoading(true);
  setError('');

  try {
    const session = await fetchAuthSession();
    const credentials = session.credentials;

    const client = new RekognitionClient({
      region: 'us-west-2',
      credentials
    });

    const imageBytes = await image.arrayBuffer();
    const imageBuffer = new Uint8Array(imageBytes);

    const response = await client.send(new DetectTextCommand({
      Image: { Bytes: imageBuffer }
    }));

    const detections = response.TextDetections || [];

    const lines = detections
      .filter(d => d.Type === 'LINE')
      .map(d => ({
        text: d.DetectedText,
        confidence: Math.round(d.Confidence)
      }));

    const wordCount = detections.filter(d => d.Type === 'WORD').length;
    const fullText = lines.map(l => l.text).join('\n');

    setResults({ lines, wordCount, fullText });

  } catch (err) {
    setError('Error extrayendo texto: ' + err.message);
  } finally {
    setLoading(false);
  }
};

const copyAll = () => {
  if (!results?.fullText) return;
  navigator.clipboard.writeText(results.fullText);
};

  return (
    <div className="recognize-container">
      <div className="recognize-header">
        <h1>📝 Extracción de Texto (OCR)</h1>
        <p>Extrae texto de imágenes con Amazon Rekognition</p>
      </div>

      <div className="recognize-layout">
        <div className="recognize-left">
          <div
            className="upload-zone"
            onClick={() => fileInputRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) {
                setImage(file);
                setPreview(URL.createObjectURL(file));
                setResults(null);
              }
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

          <button
            onClick={extractText}
            disabled={!image || loading}
            className="analyze-btn"
          >
            {loading
              ? <><span className="spinner"></span>Extrayendo...</>
              : <>📝 Extraer Texto</>
            }
          </button>
{preview && (
  <button onClick={reset} className="reset-btn">
    🗑️ Limpiar imagen
  </button>
)}
          {error && <div className="error-message">⚠️ {error}</div>}
        </div>

        <div className="recognize-right">
          {results ? (
            <div className="results-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>📄 Texto Extraído</h3>
                <button
                  onClick={copyAll}
                  className="analyze-btn"
                  style={{ width: 'auto', padding: '0.5rem 1rem' }}
                >
                  📋 Copiar todo
                </button>
              </div>

              <div className="result-section">
                <h4>
                  📝 Líneas detectadas
                  <span className="results-count">{results.lines.length}</span>
                </h4>
                <div className="labels-grid" style={{ gridTemplateColumns: '1fr' }}>
                  {results.lines.map((line, i) => (
                    <div key={i} className="label-item">
                      <span className="label-name">{line.text}</span>
                      <div className="confidence-bar">
                        <div
                          className="confidence-fill"
                          style={{ width: `${line.confidence}%` }}
                        />
                        <span className="confidence-text">{line.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="result-section">
                <h4>📊 Resumen</h4>
                <div className="stats-summary">
                  <div className="stat-item">
                    <span className="stat-label">Líneas:</span>
                    <span className="stat-value">{results.lines.length}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Palabras:</span>
                    <span className="stat-value">{results.wordCount}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Confianza promedio:</span>
                    <span className="stat-value">
                      {results.lines.length > 0
                        ? Math.round(results.lines.reduce((acc, l) => acc + l.confidence, 0) / results.lines.length)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="results-placeholder">
              <span>📝</span>
              <p>El texto extraído aparecerá aquí</p>
              <p>Sube una imagen y presiona Extraer Texto</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExtractPage;