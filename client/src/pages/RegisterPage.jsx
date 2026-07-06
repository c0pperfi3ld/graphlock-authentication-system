import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
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

  const [formData, setFormData] = useState({ username: '', email: '', textPassword: '' });
  const [selectedImage, setSelectedImage] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [clickPoints, setClickPoints] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.username || !formData.email || !formData.textPassword) {
        return setError('All fields are required');
      }
      if (formData.textPassword.length < 6) {
        return setError('Text password must be at least 6 characters');
      }
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

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await register({
        ...formData,
        imageId: selectedImage,
        clickPoints,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
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
              <input className="input-field" name="username" value={formData.username}
                onChange={handleInputChange} placeholder="Choose a username" autoFocus />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="input-field" name="email" type="email" value={formData.email}
                onChange={handleInputChange} placeholder="your@email.com" />
            </div>
            <div className="form-group">
              <label>Text Password (Fallback)</label>
              <input className="input-field" name="textPassword" type="password" value={formData.textPassword}
                onChange={handleInputChange} placeholder="Min. 6 characters" />
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={nextStep}>
              Next → Choose Image
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
