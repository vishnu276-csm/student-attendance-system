import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  HiBars3,
  HiSun,
  HiMoon,
  HiBell,
  HiArrowRightOnRectangle,
  HiUserCircle,
  HiCalendarDays,
  HiCheckBadge
} from 'react-icons/hi2';

export default function Navbar({ onToggleMobile, pageTitle }) {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme, students, attendance } = useData();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  return (
    <header
      className="navbar"
      ref={dropdownRef}
      style={{
        height: 'var(--navbar-height)',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-xs)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          type="button"
          className="btn-icon"
          onClick={onToggleMobile}
          style={{ display: 'none', padding: 6 }}
          id="mobile-nav-toggle"
          aria-label="Toggle navigation"
        >
          <HiBars3 size={24} />
        </button>

        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.01em' }}>
            {pageTitle || 'College Attendance System'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
            <HiCalendarDays size={14} />
            <span>Today: {todayFormatted}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Dark/Light mode toggle */}
        <button
          type="button"
          className="btn-icon"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          style={{
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '8px'
          }}
          aria-label="Toggle color theme"
        >
          {theme === 'light' ? <HiMoon size={20} color="var(--text-secondary)" /> : <HiSun size={20} color="#fbbf24" />}
        </button>

        {/* Quick notification button */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="btn-icon"
            onClick={() => {
              setNotifDropdownOpen(!notifDropdownOpen);
              setProfileDropdownOpen(false);
            }}
            style={{
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '8px',
              position: 'relative'
            }}
            aria-label="System notifications"
          >
            <HiBell size={20} color="var(--text-secondary)" />
            <span
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'var(--primary)'
              }}
            />
          </button>

          {notifDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 10px)',
                width: 300,
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                padding: '16px',
                zIndex: 200,
                animation: 'scaleUp 0.15s ease-out'
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Activity & Status</span>
                <span className="badge badge-neutral">Active</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.82rem' }}>
                <div style={{ padding: '8px 10px', backgroundColor: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-sm)' }}>
                  <strong>{students.length}</strong> Registered students in database.
                </div>
                <div style={{ padding: '8px 10px', backgroundColor: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-sm)' }}>
                  <strong>{attendance.length}</strong> Attendance records logged to LocalStorage.
                </div>
                <div style={{ padding: '8px 10px', backgroundColor: 'var(--status-present-bg)', color: 'var(--status-present)', borderRadius: 'var(--radius-sm)' }}>
                  System operating normal on client frontend.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile menu */}
        {currentUser && (
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => {
                setProfileDropdownOpen(!profileDropdownOpen);
                setNotifDropdownOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)',
                padding: '4px 12px 4px 4px',
                cursor: 'pointer'
              }}
              aria-label="User profile options"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {currentUser.role}
                </div>
              </div>
            </button>

            {profileDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 10px)',
                  width: 260,
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-xl)',
                  padding: '16px',
                  zIndex: 200,
                  animation: 'scaleUp 0.15s ease-out'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 12, borderBottom: '1px solid var(--border-color)', marginBottom: 12 }}>
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      {currentUser.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      @{currentUser.username}
                    </div>
                    <span className="badge badge-neutral" style={{ marginTop: 4 }}>
                      {currentUser.role}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                  <div><strong>Department:</strong> {currentUser.department}</div>
                  <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--status-present)' }}>
                    <HiCheckBadge size={14} /> Demo Auth Active
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={logout}
                  style={{ width: '100%', justifyContent: 'center', gap: 8, color: '#ef4444' }}
                >
                  <HiArrowRightOnRectangle size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
