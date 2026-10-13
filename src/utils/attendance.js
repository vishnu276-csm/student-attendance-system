/**
 * Core attendance calculation algorithms following college requirements:
 *
 * Formula:
 * Attendance Percentage = (Present Days + Late Days) / (Total Recorded Days - Approved Leave Days) * 100
 *
 * Rules:
 * 1. Present counts as attended.
 * 2. Late counts as attended.
 * 3. Absent counts as not attended.
 * 4. Approved leave is excluded from denominator.
 * 5. Do not count dates where attendance was not recorded.
 * 6. Avoid counting multiple subjects on same day as multiple days in overall daily percentage.
 * 7. Subject-wise calculations are independent per subject.
 * 8. Denominator zero returns null ('N/A').
 */

/**
 * Calculate overall daily-based attendance for a specific student
 * Aggregates sessions across the same day so a student attending classes on date X
 * is counted for 1 attendance day, rather than multiplied by subject count.
 */
export const calculateStudentOverallAttendance = (studentId, attendanceRecords = [], threshold = 75) => {
  const studentRecords = attendanceRecords.filter(r => r.studentId === studentId);

  if (!studentRecords.length) {
    return {
      totalDays: 0,
      presentDays: 0,
      lateDays: 0,
      absentDays: 0,
      leaveDays: 0,
      attendedDays: 0,
      effectiveDays: 0,
      percentage: null,
      formattedPercentage: 'N/A',
      isBelowThreshold: false,
      totalSessions: 0
    };
  }

  // Group records by unique date
  const recordsByDate = {};
  studentRecords.forEach(rec => {
    if (!recordsByDate[rec.date]) {
      recordsByDate[rec.date] = [];
    }
    recordsByDate[rec.date].push(rec.status);
  });

  const dates = Object.keys(recordsByDate);
  const totalDays = dates.length;

  let presentDays = 0;
  let lateDays = 0;
  let leaveDays = 0;
  let absentDays = 0;

  dates.forEach(date => {
    const statuses = recordsByDate[date];
    // If student was present in any session that day -> day marked Present
    if (statuses.includes('Present')) {
      presentDays++;
    } else if (statuses.includes('Late')) {
      // Late in session without full present -> day marked Late
      lateDays++;
    } else if (statuses.every(s => s === 'Leave')) {
      // All sessions on this day were approved leave
      leaveDays++;
    } else {
      // Otherwise absent
      absentDays++;
    }
  });

  const attendedDays = presentDays + lateDays;
  const effectiveDays = totalDays - leaveDays; // Denominator excluded approved leave

  let percentage = null;
  let formattedPercentage = 'N/A';
  let isBelowThreshold = false;

  if (effectiveDays > 0) {
    percentage = Math.round((attendedDays / effectiveDays) * 100 * 10) / 10;
    formattedPercentage = `${percentage}%`;
    isBelowThreshold = percentage < threshold;
  }

  return {
    totalDays,
    presentDays,
    lateDays,
    absentDays,
    leaveDays,
    attendedDays,
    effectiveDays,
    percentage,
    formattedPercentage,
    isBelowThreshold,
    totalSessions: studentRecords.length
  };
};

/**
 * Calculate subject-wise attendance for a student
 */
export const calculateStudentSubjectAttendance = (studentId, subject, attendanceRecords = [], threshold = 75) => {
  const subjectRecords = attendanceRecords.filter(
    r => r.studentId === studentId && r.subject === subject
  );

  const totalSessions = subjectRecords.length;
  let presentCount = 0;
  let lateCount = 0;
  let leaveCount = 0;
  let absentCount = 0;

  subjectRecords.forEach(rec => {
    if (rec.status === 'Present') presentCount++;
    else if (rec.status === 'Late') lateCount++;
    else if (rec.status === 'Leave') leaveCount++;
    else if (rec.status === 'Absent') absentCount++;
  });

  const attended = presentCount + lateCount;
  const effective = totalSessions - leaveCount;

  let percentage = null;
  let formattedPercentage = 'N/A';
  let isBelowThreshold = false;

  if (effective > 0) {
    percentage = Math.round((attended / effective) * 100 * 10) / 10;
    formattedPercentage = `${percentage}%`;
    isBelowThreshold = percentage < threshold;
  }

  return {
    subject,
    totalSessions,
    presentCount,
    lateCount,
    leaveCount,
    absentCount,
    attended,
    effective,
    percentage,
    formattedPercentage,
    isBelowThreshold
  };
};

/**
 * Breakdown of all subjects taken by a student
 */
export const getStudentSubjectsBreakdown = (studentId, attendanceRecords = [], subjectList = [], threshold = 75) => {
  const studentRecords = attendanceRecords.filter(r => r.studentId === studentId);
  const recordedSubjects = Array.from(new Set(studentRecords.map(r => r.subject)));
  const allSubjects = Array.from(new Set([...recordedSubjects, ...subjectList]));

  return allSubjects.map(subject => {
    return calculateStudentSubjectAttendance(studentId, subject, attendanceRecords, threshold);
  });
};

/**
 * Calculate day-level statistics for a selected date
 */
export const getDateStatistics = (dateStr, attendanceRecords = [], students = []) => {
  const dayRecords = attendanceRecords.filter(r => r.date === dateStr);
  
  if (!dayRecords.length) {
    return {
      recordedCount: 0,
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      leaveCount: 0,
      uniqueStudentsCount: 0,
      attendancePercentage: null,
      formattedPercentage: 'N/A'
    };
  }

  // Find unique students marked on this date
  const studentsOnDate = {};
  dayRecords.forEach(rec => {
    if (!studentsOnDate[rec.studentId]) {
      studentsOnDate[rec.studentId] = [];
    }
    studentsOnDate[rec.studentId].push(rec.status);
  });

  let present = 0;
  let absent = 0;
  let late = 0;
  let leave = 0;

  Object.values(studentsOnDate).forEach(statuses => {
    if (statuses.includes('Present')) {
      present++;
    } else if (statuses.includes('Late')) {
      late++;
    } else if (statuses.every(s => s === 'Leave')) {
      leave++;
    } else {
      absent++;
    }
  });

  const uniqueStudents = Object.keys(studentsOnDate).length;
  const attended = present + late;
  const denominator = uniqueStudents - leave;

  let percentage = null;
  let formattedPercentage = 'N/A';
  if (denominator > 0) {
    percentage = Math.round((attended / denominator) * 100 * 10) / 10;
    formattedPercentage = `${percentage}%`;
  }

  return {
    recordedCount: dayRecords.length,
    presentCount: present,
    absentCount: absent,
    lateCount: late,
    leaveCount: leave,
    uniqueStudentsCount: uniqueStudents,
    attendancePercentage: percentage,
    formattedPercentage
  };
};

/**
 * Overall system statistics across all students and records
 */
export const getSystemWideStatistics = (students = [], attendanceRecords = [], threshold = 75) => {
  const totalStudents = students.length;

  if (totalStudents === 0 || attendanceRecords.length === 0) {
    return {
      totalStudents,
      overallPercentage: 'N/A',
      defaultersCount: 0,
      totalRecords: attendanceRecords.length
    };
  }

  let totalValidPercentages = 0;
  let sumPercentages = 0;
  let defaultersCount = 0;

  students.forEach(student => {
    const stats = calculateStudentOverallAttendance(student.id, attendanceRecords, threshold);
    if (stats.percentage !== null) {
      sumPercentages += stats.percentage;
      totalValidPercentages++;
      if (stats.isBelowThreshold) {
        defaultersCount++;
      }
    }
  });

  const overallAvg = totalValidPercentages > 0
    ? (Math.round((sumPercentages / totalValidPercentages) * 10) / 10) + '%'
    : 'N/A';

  return {
    totalStudents,
    overallPercentage: overallAvg,
    defaultersCount,
    totalRecords: attendanceRecords.length
  };
};
