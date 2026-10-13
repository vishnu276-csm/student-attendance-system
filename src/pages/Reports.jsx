import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { downloadCSV } from '../utils/exportCSV';
import {
  calculateStudentOverallAttendance,
  calculateStudentSubjectAttendance
} from '../utils/attendance';
import {
  DEPARTMENTS,
  ACADEMIC_YEARS,
  SECTIONS
} from '../data/sampleData';
import {
  HiDocumentChartBar,
  HiArrowDownTray,
  HiPrinter,
  HiMagnifyingGlass,
  HiCalendarDays,
  HiAdjustmentsHorizontal,
  HiArrowPath,
  HiChevronUpDown
} from 'react-icons/hi2';

export default function Reports() {
  const { students, attendance, threshold } = useData();

  // Active Report Tab: 'STUDENT_SUMMARY' | 'DAILY_LOG' | 'CLASS_SUMMARY' | 'SUBJECT_SUMMARY'
  const [reportType, setReportType] = useState('STUDENT_SUMMARY');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [yearFilter, setYearFilter] = useState('ALL');
  const [sectionFilter, setSectionFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ABOVE_THRESHOLD' | 'BELOW_THRESHOLD'
  
  // Date range
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Sorting
  const [sortField, setSortField] = useState('rollNumber');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter raw attendance records by date range
  const dateFilteredAttendance = useMemo(() => {
    return attendance.filter(r => {
      return (!startDate || r.date >= startDate) && (!endDate || r.date <= endDate);
    });
  }, [attendance, startDate, endDate]);

  // Compute Student Summary Data
  const studentSummaryData = useMemo(() => {
    return students
      .filter(s => {
        const matchesDept = departmentFilter === 'ALL' || s.department === departmentFilter;
        const matchesYear = yearFilter === 'ALL' || s.academicYear === yearFilter;
        const matchesSec = sectionFilter === 'ALL' || s.classSection === sectionFilter;
        const matchesSearch =
          !searchTerm ||
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesDept && matchesYear && matchesSec && matchesSearch;
      })
      .map(s => {
        const stats = calculateStudentOverallAttendance(s.id, dateFilteredAttendance, threshold);
        return {
          studentId: s.id,
          rollNumber: s.rollNumber,
          name: s.name,
          department: s.department,
          academicYear: s.academicYear,
          classSection: s.classSection,
          totalDays: stats.totalDays,
          presentDays: stats.presentDays,
          absentDays: stats.absentDays,
          lateDays: stats.lateDays,
          leaveDays: stats.leaveDays,
          attendedDays: stats.attendedDays,
          percentage: stats.percentage,
          formattedPercentage: stats.formattedPercentage,
          isBelowThreshold: stats.isBelowThreshold
        };
      })
      .filter(row => {
        if (statusFilter === 'ABOVE_THRESHOLD') return row.percentage !== null && !row.isBelowThreshold;
        if (statusFilter === 'BELOW_THRESHOLD') return row.isBelowThreshold;
        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (valA === null || valA === undefined) valA = '';
        if (valB === null || valB === undefined) valB = '';

        let cmp = 0;
        if (typeof valA === 'number' && typeof valB === 'number') {
          cmp = valA - valB;
        } else {
          cmp = String(valA).localeCompare(String(valB), undefined, { numeric: true });
        }
        return sortDirection === 'asc' ? cmp : -cmp;
      });
  }, [students, dateFilteredAttendance, departmentFilter, yearFilter, sectionFilter, searchTerm, statusFilter, threshold, sortField, sortDirection]);

  // Compute Daily Attendance Log Data
  const dailyLogData = useMemo(() => {
    const studentMap = new Map(students.map(s => [s.id, s]));

    return dateFilteredAttendance
      .filter(rec => {
        const s = studentMap.get(rec.studentId);
        if (!s) return false;

        const matchesDept = departmentFilter === 'ALL' || rec.department === departmentFilter;
        const matchesYear = yearFilter === 'ALL' || rec.academicYear === yearFilter;
        const matchesSec = sectionFilter === 'ALL' || rec.classSection === sectionFilter;
        const matchesSearch =
          !searchTerm ||
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rec.subject.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesDept && matchesYear && matchesSec && matchesSearch;
      })
      .map(rec => {
        const s = studentMap.get(rec.studentId);
        return {
          id: rec.id,
          date: rec.date,
          rollNumber: s ? s.rollNumber : 'N/A',
          name: s ? s.name : 'Unknown',
          department: rec.department,
          classSection: `${rec.academicYear} (${rec.classSection})`,
          subject: rec.subject,
          status: rec.status,
          timestamp: rec.timestamp
        };
      })
      .sort((a, b) => {
        let valA = a[sortField] || a.date;
        let valB = b[sortField] || b.date;
        let cmp = String(valA).localeCompare(String(valB));
        return sortDirection === 'asc' ? cmp : -cmp;
      });
  }, [dateFilteredAttendance, students, departmentFilter, yearFilter, sectionFilter, searchTerm, sortField, sortDirection]);

  // Compute Class-wise Summary
  const classSummaryData = useMemo(() => {
    const classGroups = {};

    students.forEach(s => {
      const groupKey = `${s.department} | ${s.academicYear} | ${s.classSection}`;
      if (!classGroups[groupKey]) {
        classGroups[groupKey] = {
          department: s.department,
          academicYear: s.academicYear,
          classSection: s.classSection,
          students: []
        };
      }
      classGroups[groupKey].students.push(s);
    });

    return Object.values(classGroups)
      .filter(group => {
        const matchesDept = departmentFilter === 'ALL' || group.department === departmentFilter;
        const matchesYear = yearFilter === 'ALL' || group.academicYear === yearFilter;
        const matchesSec = sectionFilter === 'ALL' || group.classSection === sectionFilter;
        return matchesDept && matchesYear && matchesSec;
      })
      .map(group => {
        let totalPct = 0;
        let validStudents = 0;
        let totalPresent = 0;
        let totalAbsent = 0;
        let totalDefaulters = 0;

        group.students.forEach(s => {
          const stats = calculateStudentOverallAttendance(s.id, dateFilteredAttendance, threshold);
          if (stats.percentage !== null) {
            totalPct += stats.percentage;
            validStudents++;
            if (stats.isBelowThreshold) totalDefaulters++;
          }
          totalPresent += stats.presentDays;
          totalAbsent += stats.absentDays;
        });

        const avgPercentage = validStudents > 0 ? Math.round((totalPct / validStudents) * 10) / 10 : null;

        return {
          department: group.department,
          academicYear: group.academicYear,
          classSection: group.classSection,
          enrolledCount: group.students.length,
          avgPercentage,
          formattedAvg: avgPercentage !== null ? `${avgPercentage}%` : 'N/A',
          totalPresent,
          totalAbsent,
          totalDefaulters
        };
      });
  }, [students, dateFilteredAttendance, departmentFilter, yearFilter, sectionFilter, threshold]);

  // Export to CSV handler
  const handleExportCSV = () => {
    const timestamp = new Date().toISOString().split('T')[0];

    if (reportType === 'STUDENT_SUMMARY') {
      const headers = [
        { label: 'Roll Number', key: 'rollNumber' },
        { label: 'Student Name', key: 'name' },
        { label: 'Department', key: 'department' },
        { label: 'Year', key: 'academicYear' },
        { label: 'Section', key: 'classSection' },
        { label: 'Recorded Days', key: 'totalDays' },
        { label: 'Present Days', key: 'presentDays' },
        { label: 'Late Days', key: 'lateDays' },
        { label: 'Absent Days', key: 'absentDays' },
        { label: 'Leave Days', key: 'leaveDays' },
        { label: 'Attendance %', key: 'formattedPercentage' }
      ];
      downloadCSV(`Student_Attendance_Report_${timestamp}`, headers, studentSummaryData);
    } else if (reportType === 'DAILY_LOG') {
      const headers = [
        { label: 'Date', key: 'date' },
        { label: 'Roll Number', key: 'rollNumber' },
        { label: 'Student Name', key: 'name' },
        { label: 'Department', key: 'department' },
        { label: 'Class', key: 'classSection' },
        { label: 'Subject', key: 'subject' },
        { label: 'Status', key: 'status' }
      ];
      downloadCSV(`Attendance_Log_${timestamp}`, headers, dailyLogData);
    } else if (reportType === 'CLASS_SUMMARY') {
      const headers = [
        { label: 'Department', key: 'department' },
        { label: 'Academic Year', key: 'academicYear' },
        { label: 'Section', key: 'classSection' },
        { label: 'Enrolled Count', key: 'enrolledCount' },
        { label: 'Average Attendance', key: 'formattedAvg' },
        { label: 'Total Defaulters', key: 'totalDefaulters' }
      ];
      downloadCSV(`Class_Attendance_Summary_${timestamp}`, headers, classSummaryData);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header with Export & Print */}
      <div
        className="card no-print"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Attendance Reports & Analytics
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Generate student summaries, daily logs, and class-wise analytics with CSV export
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handlePrint}
          >
            <HiPrinter size={18} />
            <span>Print Report</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleExportCSV}
          >
            <HiArrowDownTray size={18} />
            <span>Export to CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          gap: 8,
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: 2
        }}
      >
        <button
          type="button"
          onClick={() => setReportType('STUDENT_SUMMARY')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 700,
            borderBottom: reportType === 'STUDENT_SUMMARY' ? '3px solid var(--primary)' : '3px solid transparent',
            color: reportType === 'STUDENT_SUMMARY' ? 'var(--primary)' : 'var(--text-secondary)'
          }}
        >
          Student-Wise Summary
        </button>

        <button
          type="button"
          onClick={() => setReportType('DAILY_LOG')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 700,
            borderBottom: reportType === 'DAILY_LOG' ? '3px solid var(--primary)' : '3px solid transparent',
            color: reportType === 'DAILY_LOG' ? 'var(--primary)' : 'var(--text-secondary)'
          }}
        >
          Daily Session Logs
        </button>

        <button
          type="button"
          onClick={() => setReportType('CLASS_SUMMARY')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 700,
            borderBottom: reportType === 'CLASS_SUMMARY' ? '3px solid var(--primary)' : '3px solid transparent',
            color: reportType === 'CLASS_SUMMARY' ? 'var(--primary)' : 'var(--text-secondary)'
          }}
        >
          Class-Wise Breakdown
        </button>
      </div>

      {/* Filters Bar */}
      <div className="card no-print" style={{ padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          {/* Search box */}
          <div>
            <label className="form-label">Search</label>
            <div style={{ position: 'relative' }}>
              <HiMagnifyingGlass
                size={16}
                style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />
              <input
                type="text"
                placeholder="Name or roll..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: 34 }}
              />
            </div>
          </div>

          {/* Start Date */}
          <div>
            <label className="form-label">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-input"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="form-label">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Department */}
          <div>
            <label className="form-label">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="form-select"
            >
              <option value="ALL">All Departments</option>
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="form-label">Academic Year</label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="form-select"
            >
              <option value="ALL">All Years</option>
              {ACADEMIC_YEARS.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div>
            <label className="form-label">Section</label>
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="form-select"
            >
              <option value="ALL">All Sections</option>
              {SECTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Defaulter / Status filter (for Student Summary) */}
          {reportType === 'STUDENT_SUMMARY' && (
            <div>
              <label className="form-label">Status Filter</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-select"
              >
                <option value="ALL">All Students</option>
                <option value="ABOVE_THRESHOLD">Satisfactory (≥ {threshold}%)</option>
                <option value="BELOW_THRESHOLD">Defaulters (&lt; {threshold}%)</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Report Table Display */}
      {reportType === 'STUDENT_SUMMARY' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('rollNumber')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>Roll No</span>
                      <HiChevronUpDown size={14} />
                    </div>
                  </th>
                  <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>Student Name</span>
                      <HiChevronUpDown size={14} />
                    </div>
                  </th>
                  <th>Department</th>
                  <th>Class</th>
                  <th>Recorded Days</th>
                  <th>Attended (P + L)</th>
                  <th>Absent Days</th>
                  <th>Leave Days</th>
                  <th onClick={() => handleSort('percentage')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>Overall %</span>
                      <HiChevronUpDown size={14} />
                    </div>
                  </th>
                  <th>Standing</th>
                </tr>
              </thead>
              <tbody>
                {studentSummaryData.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
                      No attendance data found matching current filters.
                    </td>
                  </tr>
                ) : (
                  studentSummaryData.map(row => (
                    <tr key={row.studentId}>
                      <td style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>
                        {row.rollNumber}
                      </td>
                      <td style={{ fontWeight: 600 }}>{row.name}</td>
                      <td style={{ fontSize: '0.82rem' }}>{row.department}</td>
                      <td>
                        <span className="badge badge-neutral" style={{ fontSize: '0.74rem' }}>
                          {row.academicYear} {row.classSection}
                        </span>
                      </td>
                      <td>{row.totalDays}</td>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--status-present)' }}>
                          {row.attendedDays}
                        </span> ({row.presentDays} P, {row.lateDays} L)
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--status-absent)' }}>
                          {row.absentDays}
                        </span>
                      </td>
                      <td>{row.leaveDays}</td>
                      <td>
                        <span
                          className={`badge ${
                            row.percentage === null
                              ? 'badge-neutral'
                              : row.isBelowThreshold
                              ? 'badge-absent'
                              : 'badge-present'
                          }`}
                          style={{ minWidth: 60, justifyContent: 'center' }}
                        >
                          {row.formattedPercentage}
                        </span>
                      </td>
                      <td>
                        {row.percentage === null ? (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>N/A</span>
                        ) : row.isBelowThreshold ? (
                          <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>Defaulter</span>
                        ) : (
                          <span className="badge badge-present" style={{ fontSize: '0.72rem' }}>Eligible</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'DAILY_LOG' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>Date</span>
                      <HiChevronUpDown size={14} />
                    </div>
                  </th>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Department / Class</th>
                  <th>Subject</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dailyLogData.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
                      No daily logs found for this date range.
                    </td>
                  </tr>
                ) : (
                  dailyLogData.map(row => (
                    <tr key={row.id}>
                      <td style={{ fontWeight: 600 }}>{row.date}</td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary)' }}>
                        {row.rollNumber}
                      </td>
                      <td style={{ fontWeight: 600 }}>{row.name}</td>
                      <td style={{ fontSize: '0.82rem' }}>{row.department} - {row.classSection}</td>
                      <td>{row.subject}</td>
                      <td>
                        <span
                          className={`badge ${
                            row.status === 'Present'
                              ? 'badge-present'
                              : row.status === 'Absent'
                              ? 'badge-absent'
                              : row.status === 'Late'
                              ? 'badge-late'
                              : 'badge-leave'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'CLASS_SUMMARY' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Academic Year</th>
                  <th>Section</th>
                  <th>Enrolled Students</th>
                  <th>Class Average Attendance</th>
                  <th>Low Attendance Defaulters</th>
                </tr>
              </thead>
              <tbody>
                {classSummaryData.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
                      No classes found.
                    </td>
                  </tr>
                ) : (
                  classSummaryData.map((cls, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{cls.department}</td>
                      <td>{cls.academicYear}</td>
                      <td>
                        <span className="badge badge-neutral">{cls.classSection}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{cls.enrolledCount} students</td>
                      <td>
                        <span
                          className={`badge ${
                            cls.avgPercentage === null
                              ? 'badge-neutral'
                              : cls.avgPercentage < threshold
                              ? 'badge-absent'
                              : 'badge-present'
                          }`}
                          style={{ minWidth: 64, justifyContent: 'center' }}
                        >
                          {cls.formattedAvg}
                        </span>
                      </td>
                      <td>
                        {cls.totalDefaulters > 0 ? (
                          <span className="badge badge-warning">
                            {cls.totalDefaulters} at risk
                          </span>
                        ) : (
                          <span className="badge badge-present">0 defaulters</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
