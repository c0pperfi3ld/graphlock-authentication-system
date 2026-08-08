import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/auth.js';
import ImageSelector from '../components/ImageSelector.jsx';
import ClickPointCapture from '../components/ClickPointCapture.jsx';

export default function LoginPage() {
  const { login, loginWithText, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('graphical'); // 'graphical' or 'text'
  const [step, setStep] = useState(1); // 1=username, 2=image+clicks
  const [username, setUsername] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [textPassword, setTextPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(null);
  const [lockedUntil, setLockedUntil] = useState(null);
  const [captureKey, setCaptureKey] = useState(0);

  if (isAuthenticated) { navigate('/dashboard'); return null; }

  const handleContinueUsername = async () => {
    if (!username.trim()) return setError('Username is required');
    setLoading(true);
    setError('');
    try {
      await api.get(`/auth/user-image/${username.trim()}`);
      setSelectedImage('');
      setImageSrc('');
      setStep(2);
    } catch (err) {
      const res = err.response?.data;
      if (res?.lockedUntil) {
        setLockedUntil(new Date(res.lockedUntil));
        setError(`Account locked. Try again in ${res.minutesRemaining || '?'} minutes.`);
      } else {
        setError(res?.error || 'User not found. Check your username.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGraphicalLogin = async (points) => {
    setLoading(true);
    setError('');
    try {
      const data = await login({ username: username.trim(), clickPoints: points, imageId: selectedImage });
      if (data.isDecoy) {
        navigate('/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const res = err.response?.data;
      if (res?.lockedUntil) {
        setLockedUntil(new Date(res.lockedUntil));
        setError(`Account locked. Try again in ${res.minutesRemaining || '?'} minutes.`);
      } else {
        setAttemptsRemaining(res?.attemptsRemaining ?? null);
        setError(res?.error || 'Login failed. Check your click points.');
        setCaptureKey(prev => prev + 1); // Reset capture points on failure
      }
    } finally { setLoading(false); }
  };

  const handleTextLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loginWithText({ username: username.trim(), textPassword });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally { setLoading(false); }
  };

  const isLocked = lockedUntil && new Date(lockedUntil) > new Date();

  return (
    <div className="page-container narrow">
      <h1 className="page-title text-center">Welcome Back</h1>
      <p className="page-subtitle text-center">Log in with your graphical password</p>

      {error && (
        <div className={`alert ${isLocked ? 'alert-error' : 'alert-warning'}`}>
          ⚠ {error}
          {attemptsRemaining !== null && !isLocked && (
            <span style={{ marginLeft: 8 }}>({attemptsRemaining} attempts remaining)</span>
          )}
        </div>
      )}

      <div className="glass-card">
        {mode === 'graphical' ? (
          <>
            {step === 1 && (
              <div className="slide-up">
                <div className="form-group">
                  <label>Username</label>
                  <input
                    className="input-field"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(''); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleContinueUsername(); }}
                    placeholder="Enter your username"
                    autoFocus
                  />
                </div>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  onClick={handleContinueUsername}
                  disabled={isLocked || loading}
                >
                  {loading ? 'Validating Account...' : 'Continue →'}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="slide-up">
                {!selectedImage ? (
                  <>
                    <div className="alert alert-warning mb-3">
                      📷 <strong>Upload / Select Image Required:</strong> Upload or select your password image file below to unlock your click-point grid.
                    </div>
                    <ImageSelector onImageSelect={(id, src) => { setSelectedImage(id); setImageSrc(src); }} selectedImage={selectedImage} />
                  </>
                ) : (
                  <>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 12, fontSize: '0.9rem' }}>
                      Click your 5 secret spots on your password image:
                    </p>
                    <ClickPointCapture
                      key={captureKey}
                      imageSrc={imageSrc}
                      onPointsSet={(pts) => { if (pts) handleGraphicalLogin(pts); }}
                      maxPoints={5}
                      mode="login"
                    />
                    {loading && <div className="spinner" />}
                  </>
                )}

                <div className="mt-2" style={{ display: 'flex', gap: 12 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setStep(1); setSelectedImage(''); setImageSrc(''); }}>
                    ← Back
                  </button>
                  {selectedImage && (
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => { setSelectedImage(''); setImageSrc(''); }}
                    >
                      🔄 Choose / Re-upload Image
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <form onSubmit={handleTextLogin} className="slide-up">
            <div className="form-group">
              <label>Username</label>
              <input className="input-field" value={username}
                onChange={(e) => setUsername(e.target.value)} placeholder="Username" autoFocus />
            </div>
            <div className="form-group">
              <label>Text Password</label>
              <input className="input-field" type="password" value={textPassword}
                onChange={(e) => setTextPassword(e.target.value)} placeholder="Enter text password" />
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login with Text Password'}
            </button>
          </form>
        )}

        <div className="divider" />
        <div className="text-center">
          <button className="btn btn-ghost btn-sm" onClick={() => { setMode(mode === 'graphical' ? 'text' : 'graphical'); setError(''); }}>
            {mode === 'graphical' ? '🔑 Use text password instead' : '🖼️ Use graphical password instead'}
          </button>
        </div>
      </div>

      <p className="text-center mt-3 link-muted">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}
