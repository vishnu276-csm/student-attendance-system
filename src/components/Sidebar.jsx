import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineHome,
  HiOutlineCheckBadge,
  HiOutlineAcademicCap,
  HiOutlineChartBar,
  HiOutlineCog6Tooth,
  HiArrowRightOnRectangle,
  HiXMark,
  HiBuildingLibrary
} from 'react-icons/hi2';

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const { currentUser, logout } = useAuth();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: HiOutlineHome },
    { to: '/attendance', label: 'Mark Attendance', icon: HiOutlineCheckBadge },
    { to: '/students', label: 'Students', icon: HiOutlineAcademicCap },
    { to: '/reports', label: 'Attendance Reports', icon: HiOutlineChartBar },
    { to: '/settings', label: 'Settings', icon: HiOutlineCog6Tooth },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 1999,
            backdropFilter: 'blur(2px)'
          }}
        />
      )}

      <aside
        className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}
        style={{
          width: 'var(--sidebar-width)',
          backgroundColor: 'var(--bg-sidebar)',
          color: '#ffffff',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            height: 'var(--navbar-height)',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
              }}
            >
              <HiBuildingLibrary size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.01em', color: '#ffffff' }}>
                EduAttend
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                College Portal
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-icon"
            onClick={onCloseMobile}
            style={{ color: '#94a3b8', display: mobileOpen ? 'flex' : 'none' }}
            aria-label="Close menu"
          >
            <HiXMark size={22} />
          </button>
        </div>

        {/* Navigation items */}
        <nav style={{ padding: '24px 16px', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', fontWeight: 700, padding: '0 12px 10px' }}>
            Main Menu
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onCloseMobile}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '11px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.89rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#ffffff' : '#94a3b8',
                    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                    boxShadow: isActive ? '0 4px 12px rgba(79, 70, 229, 0.35)' : 'none',
                    transition: 'all 0.15s ease'
                  })}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* User profile & Logout */}
        {currentUser && (
          <div
            style={{
              padding: '16px 20px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              backgroundColor: 'rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid rgba(255,255,255,0.15)'
                  }}
                />
                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentUser.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentUser.role}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn-icon"
                onClick={logout}
                title="Logout"
                style={{ color: '#f87171', padding: 8 }}
                aria-label="Logout"
              >
                <HiArrowRightOnRectangle size={20} />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
