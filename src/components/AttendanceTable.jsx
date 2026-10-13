import { HiCheck, HiXMark, HiClock, HiCalendar, HiSparkles } from 'react-icons/hi2';

export default function AttendanceTable({
  students = [],
  statuses = {},
  onChangeStatus,
  onMarkAll,
  onSave,
  isSaving,
  hasExistingRecord
}) {
  if (!students.length) {
    return (
      <div className="card empty-state">
        <HiCalendar className="empty-state-icon" />
        <h3 className="empty-state-title">No Students Registered In This Class</h3>
        <p className="empty-state-desc">
          There are no students enrolled in the selected department, academic year, and section.
          Please select another class or add students from the Students page.
        </p>
      </div>
    );
  }

  // Calculate live summary stats from statuses
  const counts = {
    present: 0,
    absent: 0,
    late: 0,
    leave: 0
  };

  students.forEach(s => {
    const st = statuses[s.id] || 'Present';
    if (st === 'Present') counts.present++;
    else if (st === 'Absent') counts.absent++;
    else if (st === 'Late') counts.late++;
    else if (st === 'Leave') counts.leave++;
  });

  const total = students.length;
  const attendanceRate = total > 0 ? Math.round(((counts.present + counts.late) / total) * 100) : 0;

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Header controls & live summary */}
      <div
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Batch Summary:
          </span>
          <span className="badge badge-present">Present: {counts.present}</span>
          <span className="badge badge-absent">Absent: {counts.absent}</span>
          <span className="badge badge-late">Late: {counts.late}</span>
          <span className="badge badge-leave">Leave: {counts.leave}</span>
          <span className="badge badge-neutral" style={{ fontWeight: 700 }}>
            Session Rate: {attendanceRate}%
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onMarkAll('Present')}
          >
            <HiSparkles size={16} color="var(--status-present)" />
            <span>Mark All Present</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onMarkAll('Absent')}
          >
            <HiXMark size={16} color="var(--status-absent)" />
            <span>Mark All Absent</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onSave}
            disabled={isSaving}
          >
            <HiCheck size={18} />
            <span>{hasExistingRecord ? 'Update Attendance' : 'Save Attendance'}</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Roll No</th>
              <th>Student Name</th>
              <th>Student ID</th>
              <th style={{ textAlign: 'center', width: '380px' }}>Attendance Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => {
              const currentStatus = statuses[student.id] || 'Present';

              return (
                <tr key={student.id}>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>
                      {student.rollNumber}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                      {student.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {student.email}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {student.id}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        backgroundColor: 'var(--bg-surface-secondary)',
                        padding: 4,
                        borderRadius: 'var(--radius-md)',
                        gap: 4
                      }}
                    >
                      {/* Present Button */}
                      <button
                        type="button"
                        onClick={() => onChangeStatus(student.id, 'Present')}
                        style={{
                          padding: '6px 12px',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          transition: 'all 0.15s ease',
                          backgroundColor:
                            currentStatus === 'Present' ? 'var(--status-present)' : 'transparent',
                          color: currentStatus === 'Present' ? '#ffffff' : 'var(--text-secondary)'
                        }}
                      >
                        <HiCheck size={14} />
                        <span>Present</span>
                      </button>

                      {/* Absent Button */}
                      <button
                        type="button"
                        onClick={() => onChangeStatus(student.id, 'Absent')}
                        style={{
                          padding: '6px 12px',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          transition: 'all 0.15s ease',
                          backgroundColor:
                            currentStatus === 'Absent' ? 'var(--status-absent)' : 'transparent',
                          color: currentStatus === 'Absent' ? '#ffffff' : 'var(--text-secondary)'
                        }}
                      >
                        <HiXMark size={14} />
                        <span>Absent</span>
                      </button>

                      {/* Late Button */}
                      <button
                        type="button"
                        onClick={() => onChangeStatus(student.id, 'Late')}
                        style={{
                          padding: '6px 12px',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          transition: 'all 0.15s ease',
                          backgroundColor:
                            currentStatus === 'Late' ? 'var(--status-late)' : 'transparent',
                          color: currentStatus === 'Late' ? '#ffffff' : 'var(--text-secondary)'
                        }}
                      >
                        <HiClock size={14} />
                        <span>Late</span>
                      </button>

                      {/* Leave Button */}
                      <button
                        type="button"
                        onClick={() => onChangeStatus(student.id, 'Leave')}
                        style={{
                          padding: '6px 12px',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          transition: 'all 0.15s ease',
                          backgroundColor:
                            currentStatus === 'Leave' ? 'var(--status-leave)' : 'transparent',
                          color: currentStatus === 'Leave' ? '#ffffff' : 'var(--text-secondary)'
                        }}
                      >
                        <HiCalendar size={14} />
                        <span>Leave</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
