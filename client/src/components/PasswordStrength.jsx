import { useMemo } from 'react';
import { calculateStrengthScore } from '../utils/coordinates.js';

export default function PasswordStrength({ points }) {
  const strength = useMemo(() => calculateStrengthScore(points || []), [points]);
  if (!points || points.length < 3) return null;

  const colorClass = strength.label.toLowerCase();
  const colors = { weak: 'var(--error)', medium: 'var(--warning)', strong: 'var(--success)' };

  return (
    <div className="strength-meter slide-up">
      <div className="strength-label">
        <span className="label-text" style={{ color: colors[colorClass] }}>
          Password Strength: {strength.label}
        </span>
        <span style={{ color: 'var(--text-muted)' }}>{strength.score}/100</span>
      </div>
      <div className="strength-bar-track">
        <div
          className={`strength-bar-fill ${colorClass}`}
          style={{ width: `${strength.score}%` }}
        />
      </div>
      <ul className="strength-details">
        {strength.details.map((d, i) => <li key={i}>{d}</li>)}
      </ul>
    </div>
  );
}
