import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import SessionAuditLog from '../components/SessionAuditLog.jsx';
import SecurityDashboard from '../components/SecurityDashboard.jsx';

export default function DashboardPage() {
  const { user, isDecoyMode, passwordExpired, daysRemaining } = useAuth();

  if (!user) return <div className="loading-page"><div className="spinner" /></div>;

  // Decoy mode: show a restricted fake dashboard
  if (isDecoyMode) {
    return (
      <div className="page-container">
        <h1 className="page-title">Welcome, {user.username}</h1>
        <p className="page-subtitle">Your personal dashboard</p>
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-value">0</div><div className="stat-label">Messages</div></div>
          <div className="stat-card"><div className="stat-value">0</div><div className="stat-label">Notifications</div></div>
          <div className="stat-card"><div className="stat-value">—</div><div className="stat-label">Activity</div></div>
        </div>
        <div className="glass-card"><p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No recent activity to display.</p></div>
        <div className="decoy-indicator">🛡️ Restricted Mode</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Welcome back, {user.username}! 👋</h1>
      <p className="page-subtitle">Your GraphLock security dashboard</p>

      {passwordExpired && (
        <div className="alert alert-error">
          ⚠️ Your graphical password has expired! <Link to="/reset-password" style={{ marginLeft: 8, fontWeight: 600 }}>Reset it now →</Link>
        </div>
      )}
      {!passwordExpired && daysRemaining !== null && daysRemaining <= 7 && (
        <div className="alert alert-warning">
          ⏰ Your password expires in <strong>{daysRemaining}</strong> day{daysRemaining !== 1 ? 's' : ''}. <Link to="/reset-password" style={{ marginLeft: 8 }}>Change it →</Link>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{user.username}</div>
          <div className="stat-label">Account</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{user.role === 'admin' ? '🛡️ Admin' : '👤 User'}</div>
          <div className="stat-label">Role</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{daysRemaining ?? '—'}</div>
          <div className="stat-label">Days Until Expiry</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{user.hasDecoy ? '✅' : '❌'}</div>
          <div className="stat-label">Decoy Password</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card mb-3">
        <h3 className="section-title">⚡ Quick Actions</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/reset-password" className="btn btn-secondary">🔄 Change Graphical Password</Link>
          <Link to="/setup-decoy" className="btn btn-secondary">🎭 {user.hasDecoy ? 'Update' : 'Setup'} Decoy Password</Link>
          <Link to="/security" className="btn btn-secondary">📊 Security Analysis</Link>
          <Link to="/shoulder-surfing" className="btn btn-secondary">🕵️ Shoulder Surfing Demo</Link>
        </div>
      </div>

      {/* Session Audit Log */}
      <div className="glass-card mb-3">
        <SessionAuditLog />
      </div>

      {/* Security Overview */}
      <div className="glass-card">
        <SecurityDashboard />
      </div>
    </div>
  );
}
