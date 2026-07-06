import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import ShoulderSurfingDemo from './pages/ShoulderSurfingDemo.jsx';
import SecurityCompare from './pages/SecurityCompare.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import DecoySetupPage from './pages/DecoySetupPage.jsx';

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return <div className="loading-page"><div className="spinner" /><span>Loading...</span></div>;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  const { isDecoyMode } = useAuth();

  return (
    <>
      <Navbar />
      {isDecoyMode && <div className="decoy-indicator">🛡️ Restricted Mode</div>}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
        <Route path="/shoulder-surfing" element={<ShoulderSurfingDemo />} />
        <Route path="/security" element={<SecurityCompare />} />
        <Route path="/reset-password" element={<ProtectedRoute><ResetPasswordPage /></ProtectedRoute>} />
        <Route path="/setup-decoy" element={<ProtectedRoute><DecoySetupPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
