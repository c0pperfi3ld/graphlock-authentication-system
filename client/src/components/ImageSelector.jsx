import { useState, useEffect, useRef } from 'react';
import api from '../utils/auth.js';

export default function ImageSelector({ onImageSelect, selectedImage }) {
  const [defaultImages, setDefaultImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    api.get('/images/defaults')
      .then(({ data }) => setDefaultImages(data.images || []))
      .catch(() => setDefaultImages([]))
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const { data } = await api.post('/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onImageSelect(data.imageId, `/uploads/${data.imageId}`);
    } catch (err) {
      alert(err.response?.data?.error || 'Upload failed');
    }
  };

  const getImageSrc = (filename) => `/default-images/${filename}`;
  const getLabel = (filename) => filename.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ');

  if (loading) return <div className="spinner" />;

  return (
    <div className="fade-in">
      <h3 className="section-title">Choose Your Password Image</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 16, fontSize: '0.9rem' }}>
        Select a default image or upload your own. You'll click secret spots on this image as your password.
      </p>
      <div className="image-grid">
        {defaultImages.map((img) => (
          <div
            key={img}
            className={`image-card ${selectedImage === img ? 'selected' : ''}`}
            onClick={() => onImageSelect(img, getImageSrc(img))}
          >
            <img src={getImageSrc(img)} alt={getLabel(img)} loading="lazy" />
            <div className="image-card-label">{getLabel(img)}</div>
          </div>
        ))}
      </div>
      <div className="divider" />
      <div
        className="upload-zone"
        onClick={() => fileInputRef.current?.click()}
      >
        <div style={{ fontSize: '2rem', marginBottom: 8 }}>📁</div>
        <div>Click to upload your own image</div>
        <div style={{ fontSize: '0.8rem', marginTop: 4 }}>JPG, PNG, or WebP (max 5MB)</div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleUpload}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}
