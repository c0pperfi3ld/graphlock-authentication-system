import { useState, useEffect, useCallback } from 'react';
import api from '../utils/auth.js';
import Heatmap from '../components/Heatmap.jsx';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [heatmapImage, setHeatmapImage] = useState('');
  const [heatmapData, setHeatmapData] = useState([]);
  const [defaultImages, setDefaultImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Vault Inspector Modal
  const [inspectingUser, setInspectingUser] = useState(null);
  const [inspectVaultData, setInspectVaultData] = useState(null);
  const [inspectLoading, setInspectLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, usersRes, imagesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/images/defaults'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data.users || []);
      setDefaultImages(imagesRes.data.images || []);
    } catch { /* empty */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const loadHeatmap = async (imageId) => {
    setHeatmapImage(imageId);
    try {
      const { data } = await api.get(`/admin/heatmap-data/${imageId}`);
      setHeatmapData(data.clickData || []);
    } catch { setHeatmapData([]); }
  };

  // ── ADMIN USER ACTIONS ──
  const handleToggleLock = async (user) => {
    try {
      await api.put(`/admin/users/${user._id}/lock`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to toggle lock status');
    }
  };

  const handleToggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (!confirm(`Change ${user.username}'s role to ${newRole.toUpperCase()}?`)) return;
    try {
      await api.put(`/admin/users/${user._id}/role`, { role: newRole });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (user) => {
    if (!confirm(`⚠️ PERMANENT DELETE: Are you sure you want to delete user "${user.username}" and ALL their notes, passwords, and sessions?`)) return;
    try {
      await api.delete(`/admin/users/${user._id}`);
      fetchData();
      if (inspectingUser?._id === user._id) {
        setInspectingUser(null);
        setInspectVaultData(null);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleInspectVault = async (user) => {
    setInspectingUser(user);
    setInspectLoading(true);
    setInspectVaultData(null);
    try {
      const { data } = await api.get(`/admin/users/${user._id}/vault`);
      setInspectVaultData(data);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to fetch user vault items');
      setInspectingUser(null);
    } finally {
      setInspectLoading(false);
    }
  };

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div className="page-container wide">
      <h1 className="page-title">🛡️ Admin Command Center</h1>
      <p className="page-subtitle">Full granular control over users, secrets, and security analytics</p>

      {/* System Stats */}
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

      {/* User Management Table */}
      <div className="glass-card mb-3">
        <h3 className="section-title">👥 User Accounts & Granular Management</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Decoy</th>
                <th>Joined</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 600 }}>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <button
                      onClick={() => handleToggleRole(u)}
                      className={`badge ${u.role === 'admin' ? 'badge-success' : 'badge-warning'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                      title="Click to toggle Role"
                    >
                      {u.role === 'admin' ? '🛡️ Admin' : '👤 User'}
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleLock(u)}
                      className={`badge ${u.isLocked ? 'badge-error' : 'badge-success'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                      title="Click to Lock/Unlock"
                    >
                      {u.isLocked ? '🔒 Locked' : '✅ Active'}
                    </button>
                  </td>
                  <td>{u.hasDecoy ? '🎭 Yes' : '—'}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleInspectVault(u)}
                        title="Read this user's secret notes & passwords"
                      >
                        👁️ Inspect Vault
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--error)', borderColor: 'rgba(244,63,94,0.3)' }}
                        onClick={() => handleDeleteUser(u)}
                        title="Delete user and all data"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══ INSPECT VAULT MODAL ═══ */}
      {inspectingUser && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            className="glass-card slide-up"
            style={{
              width: '100%',
              maxWidth: 750,
              maxHeight: '85vh',
              overflowY: 'auto',
              border: '1px solid var(--primary)',
              boxShadow: '0 0 30px rgba(0,212,255,0.25)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid var(--glass-border)', paddingBottom: 12 }}>
              <div>
                <h3 style={{ color: 'var(--primary)', margin: 0 }}>
                  👁️ Vault Inspector — <span style={{ color: '#fff' }}>{inspectingUser.username}</span>
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '4px 0 0' }}>{inspectingUser.email}</p>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setInspectingUser(null)}>✕ Close</button>
            </div>

            {inspectLoading ? (
              <div style={{ textAlign: 'center', padding: 40 }}><div className="spinner" /><span>Loading user vault items...</span></div>
            ) : inspectVaultData ? (
              <div>
                {/* User's Secret Notes */}
                <div className="mb-3">
                  <h4 style={{ color: 'var(--primary)', marginBottom: 10 }}>📝 Secret Notes ({inspectVaultData.notes.length})</h4>
                  {inspectVaultData.notes.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No secret notes stored by this user.</p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
                      {inspectVaultData.notes.map(n => (
                        <div key={n._id} style={{ background: n.color || '#1a1a2e', padding: 12, borderRadius: 8, border: '1px solid var(--glass-border)' }}>
                          <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem', marginBottom: 4 }}>{n.title}</div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{n.content}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* User's Credentials */}
                <div>
                  <h4 style={{ color: 'var(--primary)', marginBottom: 10 }}>🔑 Stored Passwords ({inspectVaultData.credentials.length})</h4>
                  {inspectVaultData.credentials.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No credentials saved by this user.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {inspectVaultData.credentials.map(c => (
                        <div key={c._id} className="cred-row" style={{ padding: '10px 14px' }}>
                          <div className="cred-icon" style={{ width: 32, height: 32, fontSize: '0.9rem' }}>{(c.siteName || '?')[0]}</div>
                          <div className="cred-details">
                            <div className="cred-site" style={{ fontSize: '0.88rem' }}>{c.siteName}</div>
                            <div className="cred-user" style={{ fontSize: '0.78rem' }}>{c.username}</div>
                          </div>
                          <div className="cred-password">
                            <span className="cred-pass-text" style={{ fontSize: '0.82rem' }}>{showPasswords[c._id] ? c.password : '••••••••'}</span>
                            <button className="cred-action-btn" onClick={() => setShowPasswords(prev => ({ ...prev, [c._id]: !prev[c._id] }))}>
                              {showPasswords[c._id] ? '🙈' : '👁️'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Recent Login Attempts Log */}
      {stats?.recentAttempts?.length > 0 && (
        <div className="glass-card">
          <h3 className="section-title">📜 System Login Audit Stream</h3>
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
