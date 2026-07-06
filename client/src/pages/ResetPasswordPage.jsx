import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ImageSelector from '../components/ImageSelector.jsx';
import ClickPointCapture from '../components/ClickPointCapture.jsx';
import ClickPointReplay from '../components/ClickPointReplay.jsx';
import PasswordStrength from '../components/PasswordStrength.jsx';
import api from '../utils/auth.js';

export default function ResetPasswordPage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [clickPoints, setClickPoints] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/reset-graphical-password', { imageId: selectedImage, clickPoints });
      await refreshUser();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-container narrow">
      <h1 className="page-title text-center">🔄 Reset Graphical Password</h1>
      <p className="page-subtitle text-center">Choose a new image and set new click points</p>

      {error && <div className="alert alert-error">⚠ {error}</div>}

      <div className="glass-card">
        {step === 1 && (
          <div className="slide-up">
            <ImageSelector onImageSelect={(id, src) => { setSelectedImage(id); setImageSrc(src); }} selectedImage={selectedImage} />
            <button className="btn btn-primary mt-3" style={{ width: '100%' }} onClick={() => setStep(2)} disabled={!selectedImage}>
              Next → Set New Click Points
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="slide-up">
            <ClickPointCapture imageSrc={imageSrc} onPointsSet={setClickPoints} maxPoints={5} mode="register" />
            <PasswordStrength points={clickPoints} />
            <div className="mt-3" style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-secondary" onClick={() => { setStep(1); setClickPoints(null); }}>← Back</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setStep(3)} disabled={!clickPoints}>Next → Confirm</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="slide-up">
            <div className="text-center mb-2">
              <h3 style={{ color: 'var(--primary)' }}>Confirm Your New Password</h3>
            </div>
            <ClickPointReplay points={clickPoints} imageSrc={imageSrc} />
            <div className="mt-3" style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)}>← Back</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSubmit} disabled={loading}>
                {loading ? 'Saving...' : '✓ Save New Password'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
