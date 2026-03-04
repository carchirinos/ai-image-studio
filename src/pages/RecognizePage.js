import React, { useState, useRef } from 'react';
import { RekognitionClient, DetectLabelsCommand, RecognizeCelebritiesCommand } from '@aws-sdk/client-rekognition';
import { fetchAuthSession } from 'aws-amplify/auth';
import './RecognizePage.css';

const RecognizePage = () => {
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
  const analyzeImage = async () => {
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

      const [labelsResponse, celebsResponse] = await Promise.all([
        client.send(new DetectLabelsCommand({
          Image: { Bytes: imageBuffer },
          MaxLabels: 10,
          MinConfidence: 70
        })),
        client.send(new RecognizeCelebritiesCommand({
          Image: { Bytes: imageBuffer }
        }))
      ]);

      setResults({
        labels: labelsResponse.Labels || [],
        faces: celebsResponse.CelebrityFaces || []
      });

    } catch (err) {
      setError('Error analizando imagen: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recognize-container">
      <div className="recognize-header">
        <h1>🔍 Reconocimiento de Imágenes</h1>
        <p>Identifica objetos, escenas y personas con Amazon Rekognition</p>
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
            onClick={analyzeImage}
            disabled={!image || loading}
            className="analyze-btn"
          >
            {loading ? <><span className="spinner"></span>Analizando...</> : <>🔍 Analizar Imagen</>}
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
              <h3>🎯 Resultados del Análisis</h3>

              {/* Objetos y Escenas */}
              {results.labels?.length > 0 && (
                <div className="result-section">
                  <h4>
                    🏷️ Objetos y Escenas
                    <span className="results-count">{results.labels.length}</span>
                  </h4>
                  <div className="labels-grid">
                    {results.labels.slice(0, 8).map((label, i) => (
                      <div key={i} className="label-item">
                        <span className="label-name">{label.Name}</span>
                        <div className="confidence-bar">
                          <div
                            className="confidence-fill"
                            style={{ width: `${label.Confidence}%` }}
                          ></div>
                          <span className="confidence-text">{Math.round(label.Confidence)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Celebridades */}
              {results.faces?.length > 0 && (
                <div className="result-section">
                  <h4>
                    👤 Personas Detectadas
                    <span className="results-count">{results.faces.length}</span>
                  </h4>
                  {results.faces.map((face, i) => (
                    <div key={i} className="face-item">
                      <div className="face-info">
                        <span className="celebrity-name">⭐ {face.Name || 'Celebridad'}</span>
                        <span className="confidence-badge">
                          {Math.round(face.MatchConfidence || 85)}%
                        </span>
                      </div>
                      {face.KnownGender && (
                        <span className="emotion-tag">{face.KnownGender.Type}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Resumen */}
              {(results.labels?.length > 0 || results.faces?.length > 0) && (
                <div className="result-section">
                  <h4>📊 Resumen del Análisis</h4>
                  <div className="stats-summary">
                    <div className="stat-item">
                      <span className="stat-label">Objetos detectados:</span>
                      <span className="stat-value">{results.labels?.length || 0}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Celebridades:</span>
                      <span className="stat-value">{results.faces?.length || 0}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Confianza promedio:</span>
                      <span className="stat-value">
                        {results.labels?.length > 0
                          ? Math.round(
                              results.labels.reduce((acc, l) => acc + l.Confidence, 0) /
                              results.labels.length
                            )
                          : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {(!results.labels?.length && !results.faces?.length) && (
                <div className="no-results">
                  <span>🔍</span>
                  <p>No se detectaron elementos reconocibles</p>
                  <p>Intenta con imágenes que contengan objetos o personas</p>
                </div>
              )}
            </div>
          ) : (
            <div className="results-placeholder">
              <span>🎯</span>
              <p>Los resultados aparecerán aquí</p>
              <p>Sube una imagen y presiona Analizar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecognizePage;