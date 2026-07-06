import { useState, useEffect } from 'react';
import api from '../utils/auth.js';
import Heatmap from '../components/Heatmap.jsx';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [heatmapImage, setHeatmapImage] = useState('');
  const [heatmapData, setHeatmapData] = useState([]);
  const [defaultImages, setDefaultImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/users'),
      api.get('/images/defaults'),
    ]).then(([statsRes, usersRes, imagesRes]) => {
      setStats(statsRes.data);
      setUsers(usersRes.data.users || []);
      setDefaultImages(imagesRes.data.images || []);
    }).catch(() => {})
    .finally(() => setLoading(false));
  }, []);

  const loadHeatmap = async (imageId) => {
    setHeatmapImage(imageId);
    try {
      const { data } = await api.get(`/admin/heatmap-data/${imageId}`);
      setHeatmapData(data.clickData || []);
    } catch { setHeatmapData([]); }
  };

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div className="page-container wide">
      <h1 className="page-title">🛡️ Admin Panel</h1>
      <p className="page-subtitle">System overview and security analytics</p>

      {/* Stats */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-value">{stats.totalUsers}</div><div className="stat-label">Total Users</div></div>
          <div className="stat-card"><div className="stat-value">{stats.totalLogins}</div><div className="stat-label">Total Logins</div></div>
          <div className="stat-card"><div className="stat-value">{stats.successRate}%</div><div className="stat-label">Success Rate</div></div>
          <div className="stat-card"><div className="stat-value">{stats.successfulLogins}</div><div className="stat-label">Successful</div></div>
        </div>
      )}

      {/* Heatmap Section */}
      <div className="glass-card mb-3">
        <h3 className="section-title">🔥 Click Heatmap Analysis</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 16 }}>
          Select an image to view aggregated click patterns across all users.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {defaultImages.map((img) => (
            <button key={img} className={`btn btn-sm ${heatmapImage === img ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => loadHeatmap(img)}>
              {img.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ')}
            </button>
          ))}
        </div>
        {heatmapImage && (
          <Heatmap clickData={heatmapData} imageSrc={`/default-images/${heatmapImage}`} />
        )}
      </div>

      {/* Users Table */}
      <div className="glass-card mb-3">
        <h3 className="section-title">👥 Registered Users</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr><th>Username</th><th>Email</th><th>Role</th><th>Failed Attempts</th><th>Status</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 500 }}>{u.username}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge ${u.role === 'admin' ? 'badge-success' : 'badge-warning'}`}>{u.role}</span></td>
                  <td>{u.failedAttempts}</td>
                  <td>{u.isLocked ? <span className="badge badge-error">Locked</span> : <span className="badge badge-success">Active</span>}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Attempts */}
      {stats?.recentAttempts?.length > 0 && (
        <div className="glass-card">
          <h3 className="section-title">📜 Recent Login Attempts</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead><tr><th>User</th><th>Result</th><th>Image</th><th>IP</th><th>Time</th></tr></thead>
              <tbody>
                {stats.recentAttempts.map((a, i) => (
                  <tr key={i}>
                    <td>{a.username}</td>
                    <td>{a.success ? <span className="badge badge-success">Success</span> : <span className="badge badge-error">Failed</span>}</td>
                    <td style={{ fontSize: '0.8rem' }}>{a.imageId?.replace(/[_-]/g, ' ') || '—'}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{a.ip}</td>
                    <td>{new Date(a.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
