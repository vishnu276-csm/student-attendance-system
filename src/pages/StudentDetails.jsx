import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import StudentForm from '../components/StudentForm';
import {
  calculateStudentOverallAttendance,
  getStudentSubjectsBreakdown
} from '../utils/attendance';
import { SUBJECTS_BY_DEPT } from '../data/sampleData';
import {
  HiArrowLeft,
  HiPencilSquare,
  HiExclamationTriangle,
  HiCheckCircle,
  HiCalendarDays,
  HiAcademicCap,
  HiEnvelope,
  HiPhone,
  HiClock,
  HiShieldCheck,
  HiDocumentText
} from 'react-icons/hi2';

export default function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students, attendance, threshold } = useData();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [historySubjectFilter, setHistorySubjectFilter] = useState('ALL');

  // Find student by ID
  const student = useMemo(() => {
    return students.find(s => s.id === id);
  }, [students, id]);

  // Overall attendance statistics
  const stats = useMemo(() => {
    if (!student) return null;
    return calculateStudentOverallAttendance(student.id, attendance, threshold);
  }, [student, attendance, threshold]);

  // Subject-wise attendance breakdown
  const subjectBreakdown = useMemo(() => {
    if (!student) return [];
    const deptSubjects = SUBJECTS_BY_DEPT[student.department] || [];
    return getStudentSubjectsBreakdown(student.id, attendance, deptSubjects, threshold);
  }, [student, attendance, threshold]);

  // Date-wise chronological history
  const historyRecords = useMemo(() => {
    if (!student) return [];
    return attendance
      .filter(r => r.studentId === student.id)
      .filter(r => historySubjectFilter === 'ALL' || r.subject === historySubjectFilter)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [student, attendance, historySubjectFilter]);

  if (!student) {
    return (
      <div className="card empty-state">
        <HiAcademicCap className="empty-state-icon" />
        <h3 className="empty-state-title">Student Not Found</h3>
        <p className="empty-state-desc">
          No student record was found matching ID "{id}".
        </p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate('/students')}
        >
          Return to Student Directory
        </button>
      </div>
    );
  }

  const isLowAttendance = stats?.isBelowThreshold;
  const percentageVal = stats?.percentage ?? 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Back button bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate('/students')}
        >
          <HiArrowLeft size={18} />
          <span>Back to Students</span>
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setIsEditModalOpen(true)}
        >
          <HiPencilSquare size={18} />
          <span>Edit Student Info</span>
        </button>
      </div>

      {/* Warning banner if attendance is below threshold */}
      {isLowAttendance && (
        <div
          style={{
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--status-absent-bg)',
            border: '1px solid var(--status-absent-border)',
            display: 'flex',
            alignItems: 'center',
            gap: 16
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: 'var(--status-absent)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <HiExclamationTriangle size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--status-absent)' }}>
              Attendance Shortage Warning!
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              Current overall attendance is <strong>{stats.formattedPercentage}</strong>, which is below the mandatory college threshold of <strong>{threshold}%</strong>. Parent intimation or remedial sessions required.
            </div>
          </div>
        </div>
      )}

      {/* Profile Card & Key Metrics Grid */}
      <div className="grid-2" style={{ gap: 24 }}>
        {/* Student Profile Info */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, var(--primary) 0%, #06b6d4 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 800,
                boxShadow: '0 4px 12px var(--primary-glow)'
              }}
            >
              {student.name.charAt(0)}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  {student.name}
                </h3>
                <span className="badge badge-neutral" style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                  {student.rollNumber}
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                ID: {student.id}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: '0.85rem' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 600 }}>Department</div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: 2 }}>{student.department}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 600 }}>Class & Section</div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: 2 }}>{student.academicYear} • {student.classSection}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 600 }}>Email Address</div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                <HiEnvelope size={14} color="var(--primary)" />
                <span>{student.email}</span>
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 600 }}>Contact Number</div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                <HiPhone size={14} color="var(--status-present)" />
                <span>{student.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Summary Meter Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header" style={{ marginBottom: 12 }}>
              <h4 className="card-title" style={{ fontSize: '1.05rem' }}>Overall Attendance Metric</h4>
              <span className={`badge ${isLowAttendance ? 'badge-absent' : 'badge-present'}`} style={{ fontSize: '0.82rem' }}>
                {isLowAttendance ? 'Shortage Alert' : 'Good Standing'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '14px 0 8px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: isLowAttendance ? 'var(--status-absent)' : 'var(--status-present)', letterSpacing: '-0.02em' }}>
                {stats?.formattedPercentage}
              </span>
              <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                Target: {threshold}% minimum
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="progress-bar-container" style={{ height: 10, marginBottom: 16 }}>
              <div
                className="progress-bar-fill"
                style={{
                  width: `${Math.min(percentageVal, 100)}%`,
                  backgroundColor: isLowAttendance ? 'var(--status-absent)' : 'var(--status-present)'
                }}
              />
            </div>
          </div>

          {/* Breakdown counts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: 14 }}>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--status-present)' }}>{stats?.presentDays}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Present Days</div>
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--status-absent)' }}>{stats?.absentDays}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Absent Days</div>
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--status-late)' }}>{stats?.lateDays}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Late Days</div>
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--status-leave)' }}>{stats?.leaveDays}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Excused Leave</div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject-Wise Attendance Breakdown */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <HiDocumentText size={20} color="var(--primary)" />
            <span>Subject-Wise Attendance Breakdown</span>
          </h3>
          <p className="card-subtitle">Detailed attendance record per curriculum course</p>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Subject Course</th>
                <th>Sessions Held</th>
                <th>Attended (P + L)</th>
                <th>Absent</th>
                <th>Leave</th>
                <th>Percentage</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {subjectBreakdown.map((subj, i) => (
                <tr key={i}>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{subj.subject}</span>
                  </td>
                  <td>{subj.totalSessions}</td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--status-present)' }}>
                      {subj.attended}
                    </span> ({subj.presentCount} P / {subj.lateCount} L)
                  </td>
                  <td>
                    <span style={{ color: 'var(--status-absent)', fontWeight: 600 }}>{subj.absentCount}</span>
                  </td>
                  <td>{subj.leaveCount}</td>
                  <td>
                    <span
                      className={`badge ${
                        subj.percentage === null
                          ? 'badge-neutral'
                          : subj.isBelowThreshold
                          ? 'badge-absent'
                          : 'badge-present'
                      }`}
                      style={{ minWidth: 60, justifyContent: 'center' }}
                    >
                      {subj.formattedPercentage}
                    </span>
                  </td>
                  <td>
                    {subj.percentage === null ? (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No Records</span>
                    ) : subj.isBelowThreshold ? (
                      <span className="badge badge-warning" style={{ fontSize: '0.74rem' }}>Below 75%</span>
                    ) : (
                      <span className="badge badge-present" style={{ fontSize: '0.74rem' }}>Satisfactory</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Date-Wise Chronological History */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <HiCalendarDays size={20} color="var(--primary)" />
              <span>Date-Wise Attendance History</span>
            </h3>
            <p className="card-subtitle">Complete chronological activity log for this student</p>
          </div>

          {/* Filter by subject */}
          <div style={{ minWidth: 200 }}>
            <select
              value={historySubjectFilter}
              onChange={(e) => setHistorySubjectFilter(e.target.value)}
              className="form-select"
            >
              <option value="ALL">All Subjects</option>
              {subjectBreakdown.map(s => (
                <option key={s.subject} value={s.subject}>{s.subject}</option>
              ))}
            </select>
          </div>
        </div>

        {historyRecords.length === 0 ? (
          <div className="empty-state" style={{ padding: '32px 12px' }}>
            <p className="empty-state-desc">No attendance records found for this student.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Department / Class</th>
                  <th>Attendance Status</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {historyRecords.map(rec => (
                  <tr key={rec.id}>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                        {rec.date}
                      </span>
                    </td>
                    <td>{rec.subject}</td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {rec.department} ({rec.classSection})
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          rec.status === 'Present'
                            ? 'badge-present'
                            : rec.status === 'Absent'
                            ? 'badge-absent'
                            : rec.status === 'Late'
                            ? 'badge-late'
                            : 'badge-leave'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Student Modal */}
      <StudentForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        studentToEdit={student}
      />
    </div>
  );
}
