import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import SummaryCard from '../components/SummaryCard';
import StudentForm from '../components/StudentForm';
import {
  getDateStatistics,
  getSystemWideStatistics,
  calculateStudentOverallAttendance
} from '../utils/attendance';
import {
  HiUsers,
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiCalendar,
  HiChartBar,
  HiUserPlus,
  HiCheckBadge,
  HiDocumentChartBar,
  HiExclamationTriangle,
  HiArrowRight,
  HiCalendarDays
} from 'react-icons/hi2';

export default function Dashboard() {
  const navigate = useNavigate();
  const { students, attendance, threshold } = useData();
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  // Statistics for the selected date
  const dateStats = useMemo(() => {
    return getDateStatistics(selectedDate, attendance, students);
  }, [selectedDate, attendance, students]);

  // Overall system statistics across all dates
  const systemStats = useMemo(() => {
    return getSystemWideStatistics(students, attendance, threshold);
  }, [students, attendance, threshold]);

  // Defaulters list (students below threshold)
  const defaultersList = useMemo(() => {
    return students
      .map(s => {
        const stats = calculateStudentOverallAttendance(s.id, attendance, threshold);
        return {
          ...s,
          attendanceStats: stats
        };
      })
      .filter(s => s.attendanceStats.isBelowThreshold)
      .sort((a, b) => (a.attendanceStats.percentage ?? 0) - (b.attendanceStats.percentage ?? 0));
  }, [students, attendance, threshold]);

  // Recent attendance sessions grouped
  const recentSessions = useMemo(() => {
    const sessionMap = new Map();
    // Sort records newest first
    const sorted = [...attendance].sort((a, b) => (b.date > a.date ? 1 : -1));

    sorted.forEach(rec => {
      const key = `${rec.date}_${rec.department}_${rec.academicYear}_${rec.classSection}_${rec.subject}`;
      if (!sessionMap.has(key)) {
        sessionMap.set(key, {
          date: rec.date,
          department: rec.department,
          academicYear: rec.academicYear,
          classSection: rec.classSection,
          subject: rec.subject,
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
          leave: 0
        });
      }
      const item = sessionMap.get(key);
      item.total++;
      if (rec.status === 'Present') item.present++;
      else if (rec.status === 'Absent') item.absent++;
      else if (rec.status === 'Late') item.late++;
      else if (rec.status === 'Leave') item.leave++;
    });

    return Array.from(sessionMap.values()).slice(0, 5);
  }, [attendance]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Banner & Date Picker Bar */}
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-surface-secondary) 100%)'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Attendance Overview
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Real-time daily metrics, class analytics, and attendance warnings
          </p>
        </div>

        {/* Date Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            <HiCalendarDays size={18} color="var(--primary)" />
            <span>Select Date:</span>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="form-input"
            style={{ width: 'auto', padding: '7px 12px', fontSize: '0.88rem' }}
          />
        </div>
      </div>

      {/* Metric Summary Cards Grid */}
      <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))' }}>
        <SummaryCard
          title="Total Students"
          value={students.length}
          subtitle="Enrolled across branches"
          icon={HiUsers}
          color="indigo"
          badge={{ text: 'Active Roster', type: 'badge-neutral' }}
          onClick={() => navigate('/students')}
        />

        <SummaryCard
          title="Present Today"
          value={dateStats.presentCount}
          subtitle={`On ${selectedDate}`}
          icon={HiCheckCircle}
          color="green"
          badge={{ text: 'Attended', type: 'badge-present' }}
        />

        <SummaryCard
          title="Absent"
          value={dateStats.absentCount}
          subtitle={`On ${selectedDate}`}
          icon={HiXCircle}
          color="red"
          badge={{ text: 'Unexcused', type: 'badge-absent' }}
        />

        <SummaryCard
          title="Late Arrivals"
          value={dateStats.lateCount}
          subtitle={`On ${selectedDate}`}
          icon={HiClock}
          color="amber"
          badge={{ text: 'Counted as Attended', type: 'badge-late' }}
        />

        <SummaryCard
          title="Approved Leave"
          value={dateStats.leaveCount}
          subtitle={`Excluded from base`}
          icon={HiCalendar}
          color="purple"
          badge={{ text: 'Excused', type: 'badge-leave' }}
        />

        <SummaryCard
          title="Overall Attendance"
          value={systemStats.overallPercentage}
          subtitle={`Institution Average`}
          icon={HiChartBar}
          color="blue"
          badge={{
            text: `Threshold: ${threshold}%`,
            type: 'badge-neutral'
          }}
          onClick={() => navigate('/reports')}
        />
      </div>

      {/* Quick Action Shortcuts */}
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          padding: '16px 22px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', fontWeight: 700 }}>
          <span>Quick Actions:</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/attendance')}
          >
            <HiCheckBadge size={16} />
            <span>Mark Attendance</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setIsStudentModalOpen(true)}
          >
            <HiUserPlus size={16} />
            <span>Register Student</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/reports')}
          >
            <HiDocumentChartBar size={16} />
            <span>Attendance Reports</span>
          </button>
        </div>
      </div>

      {/* Lower Dashboard: Recent Activity & Low Attendance Alert */}
      <div className="grid-2" style={{ gap: 24 }}>
        {/* Recent Attendance Activity */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <HiCalendar size={20} color="var(--primary)" />
                <span>Recent Attendance Activity</span>
              </h3>
              <p className="card-subtitle">Latest recorded classroom sessions</p>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => navigate('/reports')}
            >
              <span>View All</span>
              <HiArrowRight size={14} />
            </button>
          </div>

          {recentSessions.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px 12px' }}>
              <p className="empty-state-desc">No attendance sessions recorded yet.</p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => navigate('/attendance')}
              >
                Mark First Session
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentSessions.map((session, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface-secondary)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 8
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                      {session.subject}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {session.department} • {session.academicYear} ({session.classSection})
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--primary)', marginTop: 2, fontWeight: 600 }}>
                      Date: {session.date}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.76rem' }}>
                    <span className="badge badge-present">{session.present} P</span>
                    <span className="badge badge-absent">{session.absent} A</span>
                    {session.late > 0 && <span className="badge badge-late">{session.late} L</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Attendance Alert / Defaulters Warning */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <HiExclamationTriangle size={20} color="var(--status-warning)" />
                <span>Attendance Defaulters Alert</span>
              </h3>
              <p className="card-subtitle">
                Students below warning threshold (&lt; {threshold}%)
              </p>
            </div>
            <span className="badge badge-warning">
              {defaultersList.length} Students At Risk
            </span>
          </div>

          {defaultersList.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px 12px' }}>
              <HiCheckCircle size={36} color="var(--status-present)" style={{ marginBottom: 8 }} />
              <p className="empty-state-title" style={{ fontSize: '1rem' }}>All Clear!</p>
              <p className="empty-state-desc" style={{ fontSize: '0.82rem' }}>
                No students currently have attendance below the {threshold}% warning threshold.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {defaultersList.slice(0, 5).map(student => (
                <div
                  key={student.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--status-absent-border)',
                    backgroundColor: 'var(--status-absent-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/students/${student.id}`)}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                      {student.name} ({student.rollNumber})
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {student.department} • {student.classSection}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-absent" style={{ fontWeight: 800 }}>
                      {student.attendanceStats.formattedPercentage}
                    </span>
                    <div style={{ fontSize: '0.72rem', color: 'var(--status-absent)', marginTop: 2 }}>
                      Requires Notice
                    </div>
                  </div>
                </div>
              ))}

              {defaultersList.length > 5 && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', marginTop: 6 }}
                  onClick={() => navigate('/reports')}
                >
                  View All {defaultersList.length} Low Attendance Students
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Student Modal */}
      <StudentForm
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        studentToEdit={null}
      />
    </div>
  );
}
