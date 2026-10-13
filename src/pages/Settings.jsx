import { useState } from 'react';
import { useData } from '../context/DataContext';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  HiCog6Tooth,
  HiSun,
  HiMoon,
  HiArrowPath,
  HiTrash,
  HiInformationCircle,
  HiDocumentArrowDown,
  HiShieldCheck,
  HiAdjustmentsVertical
} from 'react-icons/hi2';

export default function Settings() {
  const {
    threshold,
    setAttendanceThreshold,
    theme,
    toggleTheme,
    students,
    attendance,
    handleRestoreDemoData,
    handleClearAllData,
    notify
  } = useData();

  const [thresholdInput, setThresholdInput] = useState(threshold);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleThresholdSave = (e) => {
    e.preventDefault();
    setAttendanceThreshold(thresholdInput);
  };

  const handleExportJSON = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      threshold,
      students,
      attendance
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `college_attendance_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    notify('Database backup exported to JSON!', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 960 }}>
      {/* Header */}
      <div className="card">
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          System Settings & Preferences
        </h2>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
          Configure institutional thresholds, color themes, and database administration
        </p>
      </div>

      {/* Attendance Threshold Settings */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <HiAdjustmentsVertical size={22} color="var(--primary)" />
            <div>
              <h3 className="card-title">Attendance Warning Threshold</h3>
              <p className="card-subtitle">
                Set minimum required attendance percentage before students are flagged as defaulters
              </p>
            </div>
          </div>
          <span className="badge badge-warning" style={{ fontWeight: 700, fontSize: '0.9rem' }}>
            Current: {threshold}%
          </span>
        </div>

        <form onSubmit={handleThresholdSave} style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '1 1 300px' }}>
            <input
              type="range"
              min="40"
              max="95"
              step="1"
              value={thresholdInput}
              onChange={(e) => setThresholdInput(Number(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
            <div style={{ width: 70 }}>
              <input
                type="number"
                min="40"
                max="95"
                value={thresholdInput}
                onChange={(e) => setThresholdInput(Number(e.target.value))}
                className="form-input"
                style={{ textAlign: 'center', fontWeight: 700 }}
              />
            </div>
            <span style={{ fontWeight: 700 }}>%</span>
          </div>

          <button type="submit" className="btn btn-primary btn-sm">
            Save Threshold
          </button>
        </form>
      </div>

      {/* Theme Preferences */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {theme === 'light' ? <HiMoon size={22} color="var(--primary)" /> : <HiSun size={22} color="#fbbf24" />}
            <div>
              <h3 className="card-title">Interface Color Theme</h3>
              <p className="card-subtitle">
                Choose between Light and Dark interface appearance
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          <button
            type="button"
            className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { if (theme !== 'light') toggleTheme(); }}
          >
            <HiSun size={18} />
            <span>Light Theme</span>
          </button>

          <button
            type="button"
            className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { if (theme !== 'dark') toggleTheme(); }}
          >
            <HiMoon size={18} />
            <span>Dark Theme</span>
          </button>
        </div>
      </div>

      {/* Database Management & Demo Data */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <HiArrowPath size={22} color="var(--secondary)" />
            <div>
              <h3 className="card-title">Data Storage & Backup</h3>
              <p className="card-subtitle">
                Current Storage: {students.length} students, {attendance.length} attendance records
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Restore Sample Demo Data</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Populates realistic college students, departments, and attendance records
              </div>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowRestoreConfirm(true)}
            >
              <HiArrowPath size={16} />
              <span>Restore Demo Data</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Export Full Database (JSON)</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Download complete JSON snapshot of all students and attendance history
              </div>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleExportJSON}
            >
              <HiDocumentArrowDown size={16} />
              <span>Download JSON Backup</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'var(--status-absent-bg)', border: '1px solid var(--status-absent-border)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--status-absent)' }}>Clear All Records</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Permanently wipes all students and attendance entries from LocalStorage
              </div>
            </div>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => setShowClearConfirm(true)}
            >
              <HiTrash size={16} />
              <span>Clear All Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* About System Information */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <HiInformationCircle size={22} color="var(--primary)" />
          <h3 className="card-title">College Mini Project Details</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, fontSize: '0.85rem' }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>APPLICATION</div>
            <div style={{ fontWeight: 600, marginTop: 2 }}>Student Attendance Management System</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>CORE FRAMEWORK</div>
            <div style={{ fontWeight: 600, marginTop: 2 }}>React.js 19 + Vite + ES6+</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>NAVIGATION & ICONS</div>
            <div style={{ fontWeight: 600, marginTop: 2 }}>React Router 7 & React Icons (Heroicons v2)</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>PERSISTENCE ENGINE</div>
            <div style={{ fontWeight: 600, marginTop: 2 }}>HTML5 LocalStorage (Client-Side)</div>
          </div>
        </div>
      </div>

      {/* Confirm Restore Demo Data */}
      <ConfirmDialog
        isOpen={showRestoreConfirm}
        title="Restore Demonstration Sample Data?"
        message="This will overwrite current records with default sample students and realistic 5-day attendance history across departments. Do you want to proceed?"
        confirmText="Yes, Restore Demo Data"
        cancelText="Cancel"
        variant="primary"
        onConfirm={() => {
          handleRestoreDemoData();
          setShowRestoreConfirm(false);
        }}
        onCancel={() => setShowRestoreConfirm(false)}
      />

      {/* Confirm Clear All Data */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        title="Wipe All Records?"
        message="Are you sure you want to delete all students and attendance records from LocalStorage? This action cannot be undone."
        confirmText="Yes, Clear All"
        cancelText="Cancel"
        variant="danger"
        onConfirm={() => {
          handleClearAllData();
          setShowClearConfirm(false);
        }}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
}
