import { useState, useMemo } from 'react';
import { calculateGraphicalEntropy, calculateTextEntropy, formatEntropy, getComparisonData } from '../utils/entropy.js';

export default function SecurityCompare() {
  const [numPoints, setNumPoints] = useState(5);
  const [imgWidth, setImgWidth] = useState(1024);
  const [imgHeight, setImgHeight] = useState(768);
  const [tolerance, setTolerance] = useState(18);

  const graphicalEntropy = useMemo(
    () => calculateGraphicalEntropy(imgWidth, imgHeight, numPoints, tolerance),
    [imgWidth, imgHeight, numPoints, tolerance]
  );

  const baseData = useMemo(() => getComparisonData(), []);

  const dynamicData = useMemo(() => [
    ...baseData,
    { label: `Your Config (${numPoints} pts, ${tolerance}px tol)`, entropy: graphicalEntropy, color: '#10b981' },
  ], [baseData, graphicalEntropy, numPoints, tolerance]);

  const maxEntropy = Math.max(...dynamicData.map((d) => d.entropy));

  return (
    <div className="page-container">
      <h1 className="page-title">📊 Security Analysis</h1>
      <p className="page-subtitle">Compare graphical password entropy with traditional text passwords</p>

      {/* Interactive controls */}
      <div className="glass-card mb-3">
        <h3 className="section-title">🎛️ Adjust Parameters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          <div className="form-group">
            <label>Click Points: <strong style={{ color: 'var(--primary)' }}>{numPoints}</strong></label>
            <input type="range" min="3" max="8" value={numPoints} onChange={(e) => setNumPoints(+e.target.value)}
              style={{ width: '100%', accentColor: 'var(--primary)' }} />
          </div>
          <div className="form-group">
            <label>Image Width: <strong style={{ color: 'var(--primary)' }}>{imgWidth}px</strong></label>
            <input type="range" min="320" max="1920" step="64" value={imgWidth} onChange={(e) => setImgWidth(+e.target.value)}
              style={{ width: '100%', accentColor: 'var(--primary)' }} />
          </div>
          <div className="form-group">
            <label>Image Height: <strong style={{ color: 'var(--primary)' }}>{imgHeight}px</strong></label>
            <input type="range" min="240" max="1080" step="48" value={imgHeight} onChange={(e) => setImgHeight(+e.target.value)}
              style={{ width: '100%', accentColor: 'var(--primary)' }} />
          </div>
          <div className="form-group">
            <label>Tolerance Radius: <strong style={{ color: 'var(--primary)' }}>{tolerance}px</strong></label>
            <input type="range" min="8" max="40" value={tolerance} onChange={(e) => setTolerance(+e.target.value)}
              style={{ width: '100%', accentColor: 'var(--primary)' }} />
          </div>
        </div>
        <div className="alert alert-info mt-2">
          Your graphical password entropy: <strong>{formatEntropy(graphicalEntropy)}</strong>
        </div>
      </div>

      {/* Comparison bars */}
      <div className="glass-card mb-3">
        <h3 className="section-title">📈 Entropy Comparison</h3>
        {dynamicData.map((item, i) => (
          <div key={i} className="entropy-bar-container">
            <div className="entropy-bar-label">
              <span>{item.label}</span>
              <span style={{ color: item.color, fontWeight: 600 }}>{item.entropy.toFixed(1)} bits</span>
            </div>
            <div className="entropy-bar-track">
              <div className="entropy-bar-fill"
                style={{ width: `${(item.entropy / maxEntropy) * 100}%`, background: `linear-gradient(90deg, ${item.color}aa, ${item.color})` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Formulas */}
      <div className="glass-card">
        <h3 className="section-title">📐 Mathematical Formulas</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <h4 style={{ color: 'var(--warning)', marginBottom: 8 }}>Text Password</h4>
            <div style={{ background: 'var(--bg-tertiary)', padding: 16, borderRadius: 'var(--radius-sm)', fontFamily: 'monospace', fontSize: '0.9rem' }}>
              E = L × log₂(C)<br />
              <span style={{ color: 'var(--text-muted)' }}>L = password length<br />C = charset size</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 8 }}>
              Example: 8-char mixed = 8 × log₂(95) = {calculateTextEntropy(8, 95).toFixed(1)} bits
            </p>
          </div>
          <div>
            <h4 style={{ color: 'var(--primary)', marginBottom: 8 }}>Graphical Password</h4>
            <div style={{ background: 'var(--bg-tertiary)', padding: 16, borderRadius: 'var(--radius-sm)', fontFamily: 'monospace', fontSize: '0.9rem' }}>
              E = N × log₂(A / πr²)<br />
              <span style={{ color: 'var(--text-muted)' }}>N = click points<br />A = image area, r = tolerance</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 8 }}>
              Your config: {numPoints} × log₂({imgWidth * imgHeight} / π×{tolerance}²) = {graphicalEntropy.toFixed(1)} bits
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
