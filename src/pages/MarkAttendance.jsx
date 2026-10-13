import { useState, useEffect, useMemo } from 'react';
import { useData } from '../context/DataContext';
import AttendanceTable from '../components/AttendanceTable';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  DEPARTMENTS,
  ACADEMIC_YEARS,
  SECTIONS,
  SUBJECTS_BY_DEPT
} from '../data/sampleData';
import {
  HiCalendarDays,
  HiCheckBadge,
  HiExclamationTriangle,
  HiInformationCircle
} from 'react-icons/hi2';

export default function MarkAttendance() {
  const {
    students,
    checkSessionExists,
    getSessionRecords,
    saveAttendanceBatch
  } = useData();

  // Selection parameters
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [academicYear, setAcademicYear] = useState(ACADEMIC_YEARS[2]); // Default 3rd Year
  const [classSection, setClassSection] = useState(SECTIONS[0]); // Section A
  const [subject, setSubject] = useState(SUBJECTS_BY_DEPT[DEPARTMENTS[0]][0]);

  // Status mapping: { [studentId]: 'Present' | 'Absent' | 'Late' | 'Leave' }
  const [statuses, setStatuses] = useState({});
  const [hasExistingRecord, setHasExistingRecord] = useState(false);
  const [showOverwriteWarning, setShowOverwriteWarning] = useState(false);

  // Update subject list when department changes
  const availableSubjects = useMemo(() => {
    return SUBJECTS_BY_DEPT[department] || [];
  }, [department]);

  useEffect(() => {
    if (availableSubjects.length > 0 && !availableSubjects.includes(subject)) {
      setSubject(availableSubjects[0]);
    }
  }, [availableSubjects, subject]);

  // Filter registered students belonging to the chosen Department + Year + Section
  const classStudents = useMemo(() => {
    return students.filter(
      s =>
        s.department === department &&
        s.academicYear === academicYear &&
        s.classSection === classSection
    );
  }, [students, department, academicYear, classSection]);

  // Whenever selection parameters change, check if attendance was already recorded
  useEffect(() => {
    const exists = checkSessionExists(date, department, academicYear, classSection, subject);
    setHasExistingRecord(exists);

    if (exists) {
      // Load previously recorded attendance into state!
      const previous = getSessionRecords(date, department, academicYear, classSection, subject);
      const initialMap = {};
      classStudents.forEach(s => {
        const found = previous.find(p => p.studentId === s.id);
        initialMap[s.id] = found ? found.status : 'Present';
      });
      setStatuses(initialMap);
    } else {
      // Default all to Present for convenient fast marking
      const defaultMap = {};
      classStudents.forEach(s => {
        defaultMap[s.id] = 'Present';
      });
      setStatuses(defaultMap);
    }
  }, [date, department, academicYear, classSection, subject, classStudents]);

  const handleStatusChange = (studentId, newStatus) => {
    setStatuses(prev => ({
      ...prev,
      [studentId]: newStatus
    }));
  };

  const handleMarkAll = (status) => {
    const updated = {};
    classStudents.forEach(s => {
      updated[s.id] = status;
    });
    setStatuses(updated);
  };

  const handleSaveClick = () => {
    if (!classStudents.length) return;

    // If records exist, warn before replacing
    if (hasExistingRecord) {
      setShowOverwriteWarning(true);
    } else {
      executeSave();
    }
  };

  const executeSave = () => {
    const recordPayload = classStudents.map(s => ({
      studentId: s.id,
      status: statuses[s.id] || 'Present'
    }));

    saveAttendanceBatch({
      date,
      department,
      academicYear,
      classSection,
      subject,
      records: recordPayload
    });

    setHasExistingRecord(true);
    setShowOverwriteWarning(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Class Attendance Marking
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              Select session parameters, review roll roster, and record student attendance statuses
            </p>
          </div>

          {hasExistingRecord && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--status-late-bg)',
                color: 'var(--status-late)',
                border: '1px solid var(--status-late-border)',
                fontSize: '0.82rem',
                fontWeight: 600
              }}
            >
              <HiInformationCircle size={18} />
              <span>Existing records loaded for this session</span>
            </div>
          )}
        </div>
      </div>

      {/* Classroom & Subject Configuration Bar */}
      <div className="card" style={{ padding: 22 }}>
        <div className="card-title" style={{ fontSize: '1rem', marginBottom: 16 }}>
          <HiCalendarDays size={20} color="var(--primary)" />
          <span>Session Parameters</span>
        </div>

        <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label required" htmlFor="attendance-date">Attendance Date</label>
            <input
              id="attendance-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label required" htmlFor="attendance-dept">Department</label>
            <select
              id="attendance-dept"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="form-select"
            >
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label required" htmlFor="attendance-year">Academic Year</label>
            <select
              id="attendance-year"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="form-select"
            >
              {ACADEMIC_YEARS.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label required" htmlFor="attendance-section">Class / Section</label>
            <select
              id="attendance-section"
              value={classSection}
              onChange={(e) => setClassSection(e.target.value)}
              className="form-select"
            >
              {SECTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label required" htmlFor="attendance-subject">Subject</label>
            <select
              id="attendance-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="form-select"
            >
              {availableSubjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Interactive Roster Table */}
      <AttendanceTable
        students={classStudents}
        statuses={statuses}
        onChangeStatus={handleStatusChange}
        onMarkAll={handleMarkAll}
        onSave={handleSaveClick}
        isSaving={false}
        hasExistingRecord={hasExistingRecord}
        subject={subject}
        date={date}
      />

      {/* Confirmation modal before updating/overwriting existing session */}
      <ConfirmDialog
        isOpen={showOverwriteWarning}
        title="Update Existing Attendance?"
        message={`Attendance for "${subject}" on ${date} for ${classSection} has already been saved before. Are you sure you want to overwrite and update the existing attendance records?`}
        confirmText="Yes, Update Attendance"
        cancelText="Cancel"
        variant="primary"
        onConfirm={executeSave}
        onCancel={() => setShowOverwriteWarning(false)}
      />
    </div>
  );
}
