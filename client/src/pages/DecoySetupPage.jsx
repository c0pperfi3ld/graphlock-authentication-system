import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ClickPointCapture from '../components/ClickPointCapture.jsx';
import api from '../utils/auth.js';

export default function DecoySetupPage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [clickPoints, setClickPoints] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const imageSrc = user?.imageId?.startsWith('upload')
    ? `/uploads/${user.imageId}`
    : `/default-images/${user?.imageId}`;

  const handleSubmit = async () => {
    if (!clickPoints) return;
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/setup-decoy', { clickPoints });
      setSuccess(true);
      await refreshUser();
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to set decoy');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-container narrow">
      <h1 className="page-title text-center">🎭 Decoy Password Setup</h1>
      <p className="page-subtitle text-center">Set a fake password for plausible deniability</p>

      <div className="glass-card mb-3">
        <h3 className="section-title">What is a Decoy Password?</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
          A decoy password lets you log in under duress (e.g., someone forcing you to reveal your password).
          When you use the decoy click-points, you'll be logged into a <strong>restricted, fake dashboard</strong> — 
          your real data stays hidden. The attacker won't know the difference.
        </p>
      </div>

      {error && <div className="alert alert-error">⚠ {error}</div>}
      {success && <div className="alert alert-success">✓ Decoy password saved! Redirecting...</div>}

      {!success && (
        <div className="glass-card">
          <div className="alert alert-warning mb-2">
            ⚠️ Set click points that are DIFFERENT from your real password but on the SAME image.
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 12 }}>
            Click 5 points on your password image. These will be your decoy login:
          </p>
          <ClickPointCapture imageSrc={imageSrc} onPointsSet={setClickPoints} maxPoints={5} mode="register" />
          <button className="btn btn-primary mt-3" style={{ width: '100%' }} onClick={handleSubmit} disabled={!clickPoints || loading}>
            {loading ? 'Saving...' : '🎭 Save Decoy Password'}
          </button>
        </div>
      )}
    </div>
  );
}
