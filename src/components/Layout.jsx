import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Notification from './Notification';

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Determine current page title
  const getPageTitle = (pathname) => {
    if (pathname === '/' || pathname === '/dashboard') return 'College Dashboard';
    if (pathname.startsWith('/attendance')) return 'Attendance Management';
    if (pathname.startsWith('/students/')) return 'Student Profile Details';
    if (pathname.startsWith('/students')) return 'Student Directory';
    if (pathname.startsWith('/reports')) return 'Attendance Reports & Analytics';
    if (pathname.startsWith('/settings')) return 'System Settings';
    return 'Attendance Management';
  };

  return (
    <div className="app-container">
      <Notification />
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      
      <div className="main-content-wrapper">
        <Navbar
          pageTitle={getPageTitle(location.pathname)}
          onToggleMobile={() => setMobileOpen(!mobileOpen)}
        />
        <main className="page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
