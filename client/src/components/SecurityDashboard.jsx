import { useMemo } from 'react';
import { getComparisonData } from '../utils/entropy.js';

export default function SecurityDashboard() {
  const data = useMemo(() => getComparisonData(), []);
  const maxEntropy = Math.max(...data.map((d) => d.entropy));

  return (
    <div className="fade-in">
      <h3 className="section-title">🔒 Security Comparison: Text vs Graphical Passwords</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>
        Password entropy measures unpredictability. Higher = harder to crack.
      </p>
      {data.map((item, i) => (
        <div key={i} className="entropy-bar-container">
          <div className="entropy-bar-label">
            <span>{item.label}</span>
            <span style={{ color: item.color, fontWeight: 600 }}>{item.entropy.toFixed(1)} bits</span>
          </div>
          <div className="entropy-bar-track">
            <div
              className="entropy-bar-fill"
              style={{
                width: `${(item.entropy / maxEntropy) * 100}%`,
                background: `linear-gradient(90deg, ${item.color}cc, ${item.color})`,
              }}
            />
          </div>
        </div>
      ))}
      <div className="glass-card mt-3" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        <strong style={{ color: 'var(--primary)' }}>Formula:</strong>{' '}
        Text: E = L × log₂(C) where L = length, C = charset size. {' '}
        Graphical: E = N × log₂(A / πr²) where N = click points, A = image area, r = tolerance radius.
      </div>
    </div>
  );
}
