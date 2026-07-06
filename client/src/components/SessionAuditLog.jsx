import { useState, useEffect } from 'react';
import api from '../utils/auth.js';

export default function SessionAuditLog() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      const { data } = await api.get('/sessions');
      setSessions(data.sessions || []);
    } catch { setSessions([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSessions(); }, []);

  const revokeSession = async (id) => {
    try {
      await api.delete(`/sessions/${id}`);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) { alert(err.response?.data?.error || 'Failed to revoke'); }
  };

  const revokeAll = async () => {
    try {
      const { data } = await api.delete('/sessions/revoke-all');
      alert(`${data.revokedCount} session(s) revoked`);
      fetchSessions();
    } catch (err) { alert(err.response?.data?.error || 'Failed'); }
  };

  if (loading) return <div className="spinner" />;

  const formatDate = (d) => new Date(d).toLocaleString();

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 className="section-title" style={{ marginBottom: 0 }}>📋 Active Sessions</h3>
        {sessions.length > 1 && (
          <button className="btn btn-danger btn-sm" onClick={revokeAll}>Revoke All Others</button>
        )}
      </div>
      {sessions.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No active sessions found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Browser</th>
                <th>OS</th>
                <th>IP</th>
                <th>Last Active</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} className={s.isCurrent ? 'current-row' : ''}>
                  <td>{s.browser || 'Unknown'}</td>
                  <td>{s.os || 'Unknown'}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{s.ip}</td>
                  <td>{formatDate(s.lastAccessedAt)}</td>
                  <td>
                    {s.isCurrent
                      ? <span className="badge badge-success">Current</span>
                      : <span className="badge badge-warning">Active</span>
                    }
                  </td>
                  <td>
                    {!s.isCurrent && (
                      <button className="btn btn-ghost btn-sm" onClick={() => revokeSession(s.id)}>
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
