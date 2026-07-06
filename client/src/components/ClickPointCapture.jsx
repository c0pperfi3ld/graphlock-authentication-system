import { useState, useRef, useCallback } from 'react';
import { getRelativeCoordinates } from '../utils/coordinates.js';

export default function ClickPointCapture({ imageSrc, onPointsSet, maxPoints = 5, mode = 'register' }) {
  const [points, setPoints] = useState([]);
  const imgRef = useRef(null);

  const handleClick = useCallback((e) => {
    if (points.length >= maxPoints) return;
    const coords = getRelativeCoordinates(e, imgRef.current);
    const newPoints = [...points, coords];
    setPoints(newPoints);
    if (newPoints.length === maxPoints) {
      onPointsSet(newPoints);
    }
  }, [points, maxPoints, onPointsSet]);

  const undoLast = () => {
    const newPoints = points.slice(0, -1);
    setPoints(newPoints);
    if (newPoints.length < maxPoints) onPointsSet(null);
  };

  const clearAll = () => {
    setPoints([]);
    onPointsSet(null);
  };

  return (
    <div className="fade-in">
      <div className="click-counter">
        Click <strong>{points.length}</strong> / {maxPoints} points on the image
        {points.length === maxPoints && <span style={{ color: 'var(--success)', marginLeft: 8 }}>✓ Complete!</span>}
      </div>
      <div className="click-capture-container" onClick={handleClick}>
        <img ref={imgRef} src={imageSrc} alt="Password image" draggable={false} />
        {points.map((p, i) => (
          <div
            key={i}
            className={`click-dot ${mode === 'login' ? 'login-dot' : ''}`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            {mode === 'register' ? i + 1 : ''}
          </div>
        ))}
      </div>
      <div className="click-actions">
        <button className="btn btn-secondary btn-sm" onClick={undoLast} disabled={points.length === 0}>
          ↩ Undo
        </button>
        <button className="btn btn-secondary btn-sm" onClick={clearAll} disabled={points.length === 0}>
          ✕ Clear
        </button>
      </div>
    </div>
  );
}
