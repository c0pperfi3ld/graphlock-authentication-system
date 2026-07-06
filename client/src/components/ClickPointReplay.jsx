import { useState, useEffect, useCallback } from 'react';

export default function ClickPointReplay({ points, imageSrc, onComplete }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [playing, setPlaying] = useState(false);

  const play = useCallback(() => {
    setVisibleCount(0);
    setPlaying(true);
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (visibleCount >= points.length) {
      setPlaying(false);
      onComplete?.();
      return;
    }
    const timer = setTimeout(() => setVisibleCount((c) => c + 1), 600);
    return () => clearTimeout(timer);
  }, [playing, visibleCount, points.length, onComplete]);

  useEffect(() => { play(); }, [play]);

  return (
    <div className="fade-in">
      <div className="text-center mb-2" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        {playing ? `Replaying your click sequence... (${visibleCount}/${points.length})` : 'Your click sequence:'}
      </div>
      <div className="replay-container">
        <img src={imageSrc} alt="Password replay" draggable={false} />
        {points.slice(0, visibleCount).map((p, i) => (
          <div key={i} className="replay-dot visible" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
            {i + 1}
          </div>
        ))}
        {/* Connecting lines */}
        {points.slice(0, visibleCount).map((p, i) => {
          if (i === 0) return null;
          const prev = points[i - 1];
          const dx = p.x - prev.x;
          const dy = p.y - prev.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          return (
            <div
              key={`line-${i}`}
              className="replay-line"
              style={{
                left: `${prev.x}%`,
                top: `${prev.y}%`,
                width: `${length}%`,
                transform: `rotate(${angle}deg)`,
              }}
            />
          );
        })}
      </div>
      <div className="text-center mt-2">
        <button className="btn btn-secondary btn-sm" onClick={play}>
          🔄 Replay
        </button>
      </div>
    </div>
  );
}
