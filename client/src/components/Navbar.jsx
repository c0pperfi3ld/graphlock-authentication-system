import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, isAuthenticated, isDecoyMode, logout } = useAuth();
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to={isAuthenticated ? '/dashboard' : '/'} className="navbar-brand">
        🔐 GraphLock
      </Link>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
            <Link to="/security" className={isActive('/security')}>Security</Link>
            <Link to="/shoulder-surfing" className={isActive('/shoulder-surfing')}>Demo</Link>
            {user?.role === 'admin' && !isDecoyMode && (
              <Link to="/admin" className={isActive('/admin')}>Admin</Link>
            )}
            <div className="navbar-user">
              <span>{user?.username}</span>
              <button onClick={logout} className="btn btn-ghost btn-sm">Logout</button>
            </div>
          </>
        ) : (
          <>
            <Link to="/" className={isActive('/')}>Login</Link>
            <Link to="/register" className={isActive('/register')}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
