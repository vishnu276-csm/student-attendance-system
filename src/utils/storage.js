import { INITIAL_STUDENTS, generateInitialAttendance } from '../data/sampleData';

const STORAGE_KEYS = {
  STUDENTS: 'college_attendance_students_v1',
  ATTENDANCE: 'college_attendance_records_v1',
  THEME: 'college_attendance_theme',
  THRESHOLD: 'college_attendance_threshold',
  AUTH: 'college_attendance_auth'
};

/**
 * Safely parse JSON from localStorage with a fallback
 */
const safeGet = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null || item === undefined) return fallback;
    return JSON.parse(item);
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
};

/**
 * Safely stringify and write to localStorage
 */
const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
    return false;
  }
};

export const getStoredStudents = () => {
  const existing = safeGet(STORAGE_KEYS.STUDENTS, null);
  if (!existing || !Array.isArray(existing) || existing.length === 0) {
    // Initialize with sample students if never set or empty
    safeSet(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    return INITIAL_STUDENTS;
  }
  return existing;
};

export const saveStudents = (students) => {
  return safeSet(STORAGE_KEYS.STUDENTS, students);
};

export const getStoredAttendance = () => {
  const existing = safeGet(STORAGE_KEYS.ATTENDANCE, null);
  if (!existing || !Array.isArray(existing)) {
    // Generate fresh initial records for demonstration
    const initialRecords = generateInitialAttendance();
    safeSet(STORAGE_KEYS.ATTENDANCE, initialRecords);
    return initialRecords;
  }
  return existing;
};

export const saveAttendance = (records) => {
  return safeSet(STORAGE_KEYS.ATTENDANCE, records);
};

export const getStoredTheme = () => {
  return safeGet(STORAGE_KEYS.THEME, 'light');
};

export const saveTheme = (theme) => {
  return safeSet(STORAGE_KEYS.THEME, theme);
};

export const getStoredThreshold = () => {
  const threshold = safeGet(STORAGE_KEYS.THRESHOLD, 75);
  return typeof threshold === 'number' && !isNaN(threshold) ? threshold : 75;
};

export const saveThreshold = (val) => {
  return safeSet(STORAGE_KEYS.THRESHOLD, Number(val));
};

export const getStoredAuth = () => {
  return safeGet(STORAGE_KEYS.AUTH, null);
};

export const saveAuth = (authData) => {
  return safeSet(STORAGE_KEYS.AUTH, authData);
};

export const clearAuth = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  } catch (err) {
    console.error('Error clearing auth:', err);
  }
};

export const resetToDemoData = () => {
  const demoStudents = [...INITIAL_STUDENTS];
  const demoAttendance = generateInitialAttendance();
  safeSet(STORAGE_KEYS.STUDENTS, demoStudents);
  safeSet(STORAGE_KEYS.ATTENDANCE, demoAttendance);
  safeSet(STORAGE_KEYS.THRESHOLD, 75);
  return { students: demoStudents, attendance: demoAttendance, threshold: 75 };
};

export const clearAllData = () => {
  safeSet(STORAGE_KEYS.STUDENTS, []);
  safeSet(STORAGE_KEYS.ATTENDANCE, []);
  return { students: [], attendance: [] };
};
