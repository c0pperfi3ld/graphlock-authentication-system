import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/auth.js';
import ImageSelector from '../components/ImageSelector.jsx';
import ClickPointCapture from '../components/ClickPointCapture.jsx';
import ClickPointReplay from '../components/ClickPointReplay.jsx';
import PasswordStrength from '../components/PasswordStrength.jsx';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ username: '', email: '', textPassword: '' });

  const [formData, setFormData] = useState({ username: '', email: '', textPassword: '' });
  const [selectedImage, setSelectedImage] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [clickPoints, setClickPoints] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const nextStep = async () => {
    if (step === 1) {
      const errors = {};
      const usernameVal = formData.username.trim();
      const emailVal = formData.email.trim();

      if (!usernameVal) {
        errors.username = 'Username is required';
      }
      if (!emailVal) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(emailVal)) {
        errors.email = 'Invalid email address format';
      }
      if (!formData.textPassword) {
        errors.textPassword = 'Text password is required';
      } else if (formData.textPassword.length < 6) {
        errors.textPassword = 'Text password must be at least 6 characters';
      }

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }

      setLoading(true);
      setError('');
      setFieldErrors({ username: '', email: '', textPassword: '' });

      try {
        await api.post('/auth/check-availability', {
          username: usernameVal,
          email: emailVal,
        });
      } catch (err) {
        setLoading(false);
        if (err.response?.status === 409 && err.response?.data?.errors) {
          setFieldErrors(err.response.data.errors);
          return; // Stay on Step 1 so the user sees inline error in email/username field
        }
        setError(err.response?.data?.error || 'Validation failed');
        return;
      }
      setLoading(false);
    }

    if (step === 2 && !selectedImage) {
      return setError('Please select an image');
    }
    if (step === 3 && !clickPoints) {
      return setError('Please set your click points');
    }
    setError('');
    setStep(step + 1);
  };

  const handleImageSelect = (imageId, src) => {
    setSelectedImage(imageId);
    setImageSrc(src);
    setError('');
  };

  const [autoLoadImage, setAutoLoadImage] = useState(true);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        textPassword: formData.textPassword,
        imageId: selectedImage,
        clickPoints,
        autoLoadImage,
      });
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 409) {
        const msg = err.response?.data?.error || '';
        setStep(1); // Redirect back to step 1
        if (msg.toLowerCase().includes('email')) {
          setFieldErrors({ email: 'Email address is already registered' });
        } else if (msg.toLowerCase().includes('username')) {
          setFieldErrors({ username: 'Username is already taken' });
        } else {
          setError(msg);
        }
      } else {
        setError(err.response?.data?.error || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = ['Account', 'Image', 'Password', 'Confirm'];

  return (
    <div className="page-container narrow">
      <h1 className="page-title text-center">Create Account</h1>
      <p className="page-subtitle text-center">Set up your graphical password in 4 easy steps</p>

      {/* Steps indicator */}
      <div className="steps">
        {stepLabels.map((label, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className={`step ${step > i + 1 ? 'done' : step === i + 1 ? 'active' : ''}`}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            {i < stepLabels.length - 1 && <div className={`step-line ${step > i + 1 ? 'done' : ''}`} />}
          </div>
        ))}
      </div>

      {error && <div className="alert alert-error">⚠ {error}</div>}

      <div className="glass-card">
        {/* Step 1: Account Info */}
        {step === 1 && (
          <div className="slide-up">
            <div className="form-group">
              <label>Username</label>
              <input
                className={`input-field ${fieldErrors.username ? 'input-error' : ''}`}
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Choose a username"
                autoFocus
              />
              {fieldErrors.username && <span className="input-error-msg">⚠ {fieldErrors.username}</span>}
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                className={`input-field ${fieldErrors.email ? 'input-error' : ''}`}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
              />
              {fieldErrors.email && <span className="input-error-msg">⚠ {fieldErrors.email}</span>}
            </div>
            <div className="form-group">
              <label>Text Password (Fallback)</label>
              <input
                className={`input-field ${fieldErrors.textPassword ? 'input-error' : ''}`}
                name="textPassword"
                type="password"
                value={formData.textPassword}
                onChange={handleInputChange}
                placeholder="Min. 6 characters"
              />
              {fieldErrors.textPassword && <span className="input-error-msg">⚠ {fieldErrors.textPassword}</span>}
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <input
                type="checkbox"
                id="autoLoadCheck"
                checked={autoLoadImage}
                onChange={(e) => setAutoLoadImage(e.target.checked)}
                style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
              <label htmlFor="autoLoadCheck" style={{ margin: 0, textTransform: 'none', fontSize: '0.88rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
                Automatically load my password image when logging in
              </label>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={nextStep} disabled={loading}>
              {loading ? 'Checking Availability...' : 'Next → Choose Image'}
            </button>
          </div>
        )}

        {/* Step 2: Image Selection */}
        {step === 2 && (
          <div className="slide-up">
            <ImageSelector onImageSelect={handleImageSelect} selectedImage={selectedImage} />
            <div className="mt-3" style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={nextStep} disabled={!selectedImage}>
                Next → Set Click Points
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Click Points */}
        {step === 3 && (
          <div className="slide-up">
            <ClickPointCapture imageSrc={imageSrc} onPointsSet={setClickPoints} maxPoints={5} mode="register" />
            <PasswordStrength points={clickPoints} />
            <div className="mt-3" style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-secondary" onClick={() => { setStep(2); setClickPoints(null); }}>← Back</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={nextStep} disabled={!clickPoints}>
                Next → Confirm
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div className="slide-up">
            <div className="text-center mb-2">
              <h3 style={{ color: 'var(--primary)' }}>Memorize Your Click Sequence</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Watch the replay carefully — this is your password!
              </p>
            </div>
            <ClickPointReplay points={clickPoints} imageSrc={imageSrc} />
            <div className="mt-3" style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-secondary" onClick={() => setStep(3)}>← Back</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSubmit} disabled={loading}>
                {loading ? 'Creating Account...' : '✓ Confirm & Register'}
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-center mt-3 link-muted">
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </div>
  );
}
