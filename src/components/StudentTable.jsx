import { useData } from '../context/DataContext';
import { calculateStudentOverallAttendance } from '../utils/attendance';
import {
  HiEye,
  HiPencilSquare,
  HiTrash,
  HiExclamationCircle,
  HiAcademicCap
} from 'react-icons/hi2';

export default function StudentTable({ students = [], onView, onEdit, onDelete }) {
  const { attendance, threshold } = useData();

  if (!students.length) {
    return (
      <div className="card empty-state">
        <HiAcademicCap className="empty-state-icon" />
        <h3 className="empty-state-title">No Students Found</h3>
        <p className="empty-state-desc">
          No student records match your current search or filter criteria. Try adjusting filters or register a new student.
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Department</th>
              <th>Year & Section</th>
              <th>Overall Attendance</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => {
              const stats = calculateStudentOverallAttendance(student.id, attendance, threshold);
              const isLow = stats.isBelowThreshold;
              const hasRecords = stats.percentage !== null;

              return (
                <tr key={student.id}>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace', fontSize: '0.92rem' }}>
                      {student.rollNumber}
                    </span>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                        {student.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {student.email}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {student.id}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem' }}>
                      {student.department}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-neutral" style={{ fontSize: '0.76rem' }}>
                      {student.academicYear} • {student.classSection}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        className={`badge ${
                          !hasRecords
                            ? 'badge-neutral'
                            : isLow
                            ? 'badge-absent'
                            : 'badge-present'
                        }`}
                        style={{ minWidth: 62, justifyContent: 'center' }}
                      >
                        {stats.formattedPercentage}
                      </span>

                      {isLow && (
                        <span title={`Attendance is below warning threshold (${threshold}%)`} style={{ color: 'var(--status-absent)', display: 'flex' }}>
                          <HiExclamationCircle size={18} />
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => onView(student)}
                        title="View Full Profile & Attendance"
                        aria-label={`View ${student.name}`}
                      >
                        <HiEye size={18} color="var(--primary)" />
                      </button>
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => onEdit(student)}
                        title="Edit Student"
                        aria-label={`Edit ${student.name}`}
                      >
                        <HiPencilSquare size={18} color="var(--text-secondary)" />
                      </button>
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => onDelete(student)}
                        title="Delete Student"
                        aria-label={`Delete ${student.name}`}
                      >
                        <HiTrash size={18} color="#ef4444" />
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
