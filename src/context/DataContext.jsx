import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getStoredStudents,
  saveStudents,
  getStoredAttendance,
  saveAttendance,
  getStoredTheme,
  saveTheme,
  getStoredThreshold,
  saveThreshold,
  resetToDemoData,
  clearAllData as clearStorageData
} from '../utils/storage';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [students, setStudents] = useState(() => getStoredStudents());
  const [attendance, setAttendance] = useState(() => getStoredAttendance());
  const [threshold, setThresholdState] = useState(() => getStoredThreshold());
  const [theme, setThemeState] = useState(() => getStoredTheme());
  const [notifications, setNotifications] = useState([]);

  // Apply theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveTheme(theme);
  }, [theme]);

  // Sync state to storage
  useEffect(() => {
    saveStudents(students);
  }, [students]);

  useEffect(() => {
    saveAttendance(attendance);
  }, [attendance]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setAttendanceThreshold = (val) => {
    const num = Math.min(Math.max(Number(val) || 75, 40), 95);
    setThresholdState(num);
    saveThreshold(num);
    notify(`Attendance threshold updated to ${num}%`, 'info');
  };

  // Toast notification helper
  const notify = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setNotifications(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Helper to generate next unique Student ID
  const generateStudentId = () => {
    const year = new Date().getFullYear();
    const numbers = students
      .map(s => {
        const match = s.id.match(/\d+$/);
        return match ? parseInt(match[0], 10) : 0;
      })
      .filter(n => !isNaN(n));
    const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
    return `STU-${year}-${String(nextNumber).padStart(3, '0')}`;
  };

  // Add a new student
  const addStudent = (studentData) => {
    // Check duplicate roll number
    const rollTrim = studentData.rollNumber.trim().toUpperCase();
    const isRollDuplicate = students.some(
      s => s.rollNumber.trim().toUpperCase() === rollTrim
    );
    if (isRollDuplicate) {
      notify(`Roll number "${studentData.rollNumber}" already exists!`, 'error');
      return { success: false, error: `Roll number "${studentData.rollNumber}" already exists.` };
    }

    const newStudent = {
      ...studentData,
      id: studentData.id || generateStudentId(),
      rollNumber: rollTrim,
      createdAt: new Date().toISOString()
    };

    setStudents(prev => [newStudent, ...prev]);
    notify(`Student "${newStudent.name}" (${newStudent.rollNumber}) added successfully!`, 'success');
    return { success: true, student: newStudent };
  };

  // Update existing student
  const updateStudent = (updatedStudent) => {
    const rollTrim = updatedStudent.rollNumber.trim().toUpperCase();
    const isRollDuplicate = students.some(
      s => s.id !== updatedStudent.id && s.rollNumber.trim().toUpperCase() === rollTrim
    );
    if (isRollDuplicate) {
      notify(`Roll number "${updatedStudent.rollNumber}" is taken by another student!`, 'error');
      return { success: false, error: `Roll number "${updatedStudent.rollNumber}" is already in use.` };
    }

    const finalStudent = {
      ...updatedStudent,
      rollNumber: rollTrim
    };

    setStudents(prev =>
      prev.map(s => (s.id === finalStudent.id ? finalStudent : s))
    );
    notify(`Student "${finalStudent.name}" updated successfully!`, 'success');
    return { success: true, student: finalStudent };
  };

  // Delete student and their attendance
  const deleteStudent = (studentId) => {
    const target = students.find(s => s.id === studentId);
    setStudents(prev => prev.filter(s => s.id !== studentId));
    setAttendance(prev => prev.filter(r => r.studentId !== studentId));
    notify(`Student ${target ? `"${target.name}"` : ''} deleted successfully.`, 'info');
  };

  // Check if attendance already recorded for this specific session
  const checkSessionExists = (date, department, academicYear, classSection, subject) => {
    return attendance.some(
      r =>
        r.date === date &&
        r.department === department &&
        r.academicYear === academicYear &&
        r.classSection === classSection &&
        r.subject === subject
    );
  };

  // Get previously saved session records
  const getSessionRecords = (date, department, academicYear, classSection, subject) => {
    return attendance.filter(
      r =>
        r.date === date &&
        r.department === department &&
        r.academicYear === academicYear &&
        r.classSection === classSection &&
        r.subject === subject
    );
  };

  // Save attendance batch
  const saveAttendanceBatch = ({
    date,
    department,
    academicYear,
    classSection,
    subject,
    records // array of { studentId, status }
  }) => {
    // Remove existing records for this specific session to avoid duplicates
    const otherRecords = attendance.filter(
      r =>
        !(
          r.date === date &&
          r.department === department &&
          r.academicYear === academicYear &&
          r.classSection === classSection &&
          r.subject === subject
        )
    );

    const now = new Date().toISOString();
    const newRecords = records.map((item, idx) => ({
      id: `ATT-${date}-${item.studentId}-${subject.substring(0, 3)}-${idx}`,
      date,
      department,
      academicYear,
      classSection,
      subject,
      studentId: item.studentId,
      status: item.status,
      timestamp: now
    }));

    setAttendance([...otherRecords, ...newRecords]);
    notify(`Attendance for ${subject} on ${date} saved successfully! (${newRecords.length} students)`, 'success');
    return { success: true, count: newRecords.length };
  };

  // Restore sample demo data
  const handleRestoreDemoData = () => {
    const restored = resetToDemoData();
    setStudents(restored.students);
    setAttendance(restored.attendance);
    setThresholdState(restored.threshold);
    notify('Sample demonstration data restored successfully!', 'success');
  };

  // Clear all data
  const handleClearAllData = () => {
    const cleared = clearStorageData();
    setStudents(cleared.students);
    setAttendance(cleared.attendance);
    notify('All records have been cleared.', 'warning');
  };

  return (
    <DataContext.Provider
      value={{
        students,
        attendance,
        threshold,
        theme,
        toggleTheme,
        setAttendanceThreshold,
        notifications,
        notify,
        dismissNotification,
        addStudent,
        updateStudent,
        deleteStudent,
        checkSessionExists,
        getSessionRecords,
        saveAttendanceBatch,
        handleRestoreDemoData,
        handleClearAllData,
        generateStudentId
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('useData must be used within a DataProvider');
  }
  return ctx;
};
