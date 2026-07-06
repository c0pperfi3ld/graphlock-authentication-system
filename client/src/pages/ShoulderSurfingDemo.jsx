import { useState, useEffect } from 'react';
import ImageSelector from '../components/ImageSelector.jsx';
import ClickPointCapture from '../components/ClickPointCapture.jsx';
import { euclideanDistance } from '../utils/coordinates.js';
import api from '../utils/auth.js';

export default function ShoulderSurfingDemo() {
  const [phase, setPhase] = useState('setup'); // 'setup' | 'setter' | 'observer' | 'result'
  const [selectedImage, setSelectedImage] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [setterPoints, setSetterPoints] = useState(null);
  const [observerPoints, setObserverPoints] = useState(null);
  const [defaultImages, setDefaultImages] = useState([]);

  useEffect(() => {
    api.get('/images/defaults').then(({ data }) => setDefaultImages(data.images || [])).catch(() => {});
  }, []);

  const handleImageSelect = (id, src) => { setSelectedImage(id); setImageSrc(src); };

  const startDemo = () => { if (selectedImage) setPhase('setter'); };

  const handleSetterDone = (points) => {
    setSetterPoints(points);
    if (points) setTimeout(() => setPhase('observer'), 1500);
  };

  const handleObserverDone = (points) => {
    setObserverPoints(points);
    if (points) setPhase('result');
  };

  const reset = () => {
    setPhase('setup');
    setSelectedImage('');
    setImageSrc('');
    setSetterPoints(null);
    setObserverPoints(null);
  };

  // Calculate results
  const getResults = () => {
    if (!setterPoints || !observerPoints) return null;
    const threshold = 1.8; // tolerance on 0-100 scale
    let matched = 0;
    const pairs = setterPoints.map((sp, i) => {
      const op = observerPoints[i];
      const dist = euclideanDistance(sp, op);
      const isMatch = dist <= threshold;
      if (isMatch) matched++;
      return { setter: sp, observer: op, distance: dist, isMatch };
    });
    return { pairs, matched, total: setterPoints.length, success: matched === setterPoints.length };
  };

  const results = phase === 'result' ? getResults() : null;

  return (
    <div className="page-container">
      <h1 className="page-title">🕵️ Shoulder Surfing Resistance Demo</h1>
      <p className="page-subtitle">Can an observer replicate your graphical password by watching you?</p>

      <div className="demo-phase-indicator">
        <div className={`demo-phase ${phase === 'setup' ? 'active' : ''}`}>1. Setup</div>
        <div className={`demo-phase ${phase === 'setter' ? 'active' : ''}`}>2. Set Password</div>
        <div className={`demo-phase ${phase === 'observer' ? 'active' : ''}`}>3. Observer Tries</div>
        <div className={`demo-phase ${phase === 'result' ? 'active' : ''}`}>4. Results</div>
      </div>

      <div className="glass-card">
        {phase === 'setup' && (
          <div className="slide-up">
            <h3 className="section-title">Choose an Image for the Demo</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16, fontSize: '0.9rem' }}>
              One person sets a password while the other watches. Then the observer tries to replicate it.
            </p>
            <ImageSelector onImageSelect={handleImageSelect} selectedImage={selectedImage} />
            <button className="btn btn-primary mt-3" style={{ width: '100%' }} onClick={startDemo} disabled={!selectedImage}>
              Start Demo →
            </button>
          </div>
        )}

        {phase === 'setter' && (
          <div className="slide-up">
            <div className="alert alert-info">👁️ Let the observer watch carefully while you click your 5 secret points!</div>
            <ClickPointCapture imageSrc={imageSrc} onPointsSet={handleSetterDone} maxPoints={5} mode="register" />
            {setterPoints && <p className="text-center mt-2" style={{ color: 'var(--success)' }}>✓ Password set! Switching to observer...</p>}
          </div>
        )}

        {phase === 'observer' && (
          <div className="slide-up">
            <div className="alert alert-warning">🕵️ Observer: Try to replicate the exact click points you saw!</div>
            <ClickPointCapture imageSrc={imageSrc} onPointsSet={handleObserverDone} maxPoints={5} mode="login" />
          </div>
        )}

        {phase === 'result' && results && (
          <div className="slide-up">
            <div className="text-center mb-3">
              <div style={{ fontSize: '4rem', marginBottom: 8 }}>{results.success ? '😱' : '🛡️'}</div>
              <h2 style={{ color: results.success ? 'var(--error)' : 'var(--success)', fontSize: '1.5rem' }}>
                {results.success ? 'Observer Succeeded!' : 'Observer Failed!'}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                Matched <strong style={{ color: 'var(--primary)' }}>{results.matched}</strong> / {results.total} points
              </p>
            </div>

            {/* Show comparison */}
            <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
              <img src={imageSrc} alt="Result" style={{ width: '100%', borderRadius: 'var(--radius-md)' }} />
              {results.pairs.map((p, i) => (
                <div key={i}>
                  {/* Setter point (cyan) */}
                  <div className="click-dot" style={{ left: `${p.setter.x}%`, top: `${p.setter.y}%`, background: 'var(--primary)', animation: 'none' }}>{i + 1}</div>
                  {/* Observer point (red/green) */}
                  <div className="click-dot" style={{ left: `${p.observer.x}%`, top: `${p.observer.y}%`, background: p.isMatch ? 'var(--success)' : 'var(--error)', animation: 'none', border: '3px solid rgba(255,255,255,0.5)' }}>✕</div>
                </div>
              ))}
            </div>

            <div className="mt-2" style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead><tr><th>Point</th><th>Distance</th><th>Match?</th></tr></thead>
                <tbody>
                  {results.pairs.map((p, i) => (
                    <tr key={i}>
                      <td>Point {i + 1}</td>
                      <td>{p.distance.toFixed(2)}%</td>
                      <td>{p.isMatch ? <span className="badge badge-success">✓ Match</span> : <span className="badge badge-error">✕ Miss</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="glass-card mt-3" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--primary)' }}>Why graphical passwords resist shoulder surfing:</strong> Even when observed closely, replicating exact pixel locations from memory is extremely difficult. Human spatial memory for observed actions is inherently imprecise, making graphical passwords significantly harder to steal than text passwords.
            </div>

            <button className="btn btn-primary mt-3" style={{ width: '100%' }} onClick={reset}>🔄 Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
}
