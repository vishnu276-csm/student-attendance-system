import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, DEMO_CREDENTIALS } from '../context/AuthContext';
import {
  HiBuildingLibrary,
  HiEye,
  HiEyeSlash,
  HiLockClosed,
  HiUser,
  HiShieldExclamation,
  HiArrowRight,
  HiKey
} from 'react-icons/hi2';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Username is required.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = login(username, password);
      setIsLoading(false);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message);
      }
    }, 300);
  };

  const handleFillDemo = (demoUser, demoPass) => {
    setUsername(demoUser);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-app)',
        padding: '24px',
        position: 'relative'
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: 480,
          width: '100%',
          padding: '36px 32px',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)'
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)',
              marginBottom: 16
            }}
          >
            <HiBuildingLibrary size={32} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', margin: 0 }}>
            College Attendance Portal
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: 6 }}>
            Sign in to access faculty attendance dashboard
          </p>
        </div>

        {/* Demo Auth Notice */}
        <div
          style={{
            padding: '12px 14px',
            backgroundColor: 'var(--bg-surface-secondary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10
          }}
        >
          <HiShieldExclamation size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ lineHeight: 1.4 }}>
            <strong>Demonstration Mode:</strong> Client-side authentication active. Select one-click credentials below or enter manually.
          </div>
        </div>

        {/* Quick Fill Credentials Buttons */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>
            Quick Demo Logins
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleFillDemo('admin', 'admin123')}
              style={{ justifyContent: 'center', fontSize: '0.78rem' }}
            >
              <HiKey size={14} color="var(--primary)" />
              <span>Admin (Sarah M.)</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleFillDemo('teacher', 'teacher123')}
              style={{ justifyContent: 'center', fontSize: '0.78rem' }}
            >
              <HiKey size={14} color="var(--secondary)" />
              <span>Faculty (Rajesh K.)</span>
            </button>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--status-absent-bg)',
              color: 'var(--status-absent)',
              border: '1px solid var(--status-absent-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              marginBottom: 18,
              lineHeight: 1.4
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label required" htmlFor="login-username">Username</label>
            <div style={{ position: 'relative' }}>
              <HiUser
                size={18}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin or teacher"
                className="form-input"
                style={{ paddingLeft: 38 }}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 24 }}>
            <label className="form-label required" htmlFor="login-password">Password</label>
            <div style={{ position: 'relative' }}>
              <HiLockClosed
                size={18}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123 or teacher123"
                className="form-input"
                style={{ paddingLeft: 38, paddingRight: 40 }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  padding: 4
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <HiEyeSlash size={18} /> : <HiEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
          >
            <span>{isLoading ? 'Signing In...' : 'Sign In to Portal'}</span>
            <HiArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Credentials: <code>admin</code> / <code>admin123</code> or <code>teacher</code> / <code>teacher123</code>
        </div>
      </div>
    </div>
  );
}
