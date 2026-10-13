export const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering'
];

export const ACADEMIC_YEARS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year'
];

export const SECTIONS = [
  'Section A',
  'Section B',
  'Section C'
];

export const SUBJECTS_BY_DEPT = {
  'Computer Science & Engineering': [
    'Data Structures & Algorithms',
    'Database Management Systems',
    'Operating Systems',
    'Computer Networks',
    'Software Engineering',
    'Web Technologies'
  ],
  'Information Technology': [
    'Cloud Computing',
    'Cyber Security',
    'Full Stack Development',
    'Information Retrieval',
    'Distributed Systems'
  ],
  'Electronics & Communication': [
    'Digital Signal Processing',
    'VLSI Design',
    'Microprocessors & Microcontrollers',
    'Analog Electronics',
    'Wireless Communications'
  ],
  'Mechanical Engineering': [
    'Thermodynamics',
    'Fluid Mechanics',
    'Theory of Machines',
    'Manufacturing Technology',
    'Automobile Engineering'
  ],
  'Civil Engineering': [
    'Structural Analysis',
    'Geotechnical Engineering',
    'Transportation Systems',
    'Environmental Engineering',
    'Surveying & Leveling'
  ]
};

export const INITIAL_STUDENTS = [
  {
    id: 'STU-2024-001',
    rollNumber: 'CS-101',
    name: 'Aarav Sharma',
    department: 'Computer Science & Engineering',
    academicYear: '3rd Year',
    classSection: 'Section A',
    email: 'aarav.sharma@college.edu',
    phone: '+91 98765 43210',
    createdAt: '2024-08-01T09:00:00.000Z'
  },
  {
    id: 'STU-2024-002',
    rollNumber: 'CS-102',
    name: 'Diya Patel',
    department: 'Computer Science & Engineering',
    academicYear: '3rd Year',
    classSection: 'Section A',
    email: 'diya.patel@college.edu',
    phone: '+91 98765 43211',
    createdAt: '2024-08-01T09:05:00.000Z'
  },
  {
    id: 'STU-2024-003',
    rollNumber: 'CS-103',
    name: 'Rohan Verma',
    department: 'Computer Science & Engineering',
    academicYear: '3rd Year',
    classSection: 'Section A',
    email: 'rohan.verma@college.edu',
    phone: '+91 98765 43212',
    createdAt: '2024-08-01T09:10:00.000Z'
  },
  {
    id: 'STU-2024-004',
    rollNumber: 'CS-104',
    name: 'Ananya Iyer',
    department: 'Computer Science & Engineering',
    academicYear: '3rd Year',
    classSection: 'Section A',
    email: 'ananya.iyer@college.edu',
    phone: '+91 98765 43213',
    createdAt: '2024-08-01T09:15:00.000Z'
  },
  {
    id: 'STU-2024-005',
    rollNumber: 'CS-105',
    name: 'Kabir Mehta',
    department: 'Computer Science & Engineering',
    academicYear: '3rd Year',
    classSection: 'Section A',
    email: 'kabir.mehta@college.edu',
    phone: '+91 98765 43214',
    createdAt: '2024-08-01T09:20:00.000Z'
  },
  {
    id: 'STU-2024-006',
    rollNumber: 'CS-106',
    name: 'Suhani Nair',
    department: 'Computer Science & Engineering',
    academicYear: '3rd Year',
    classSection: 'Section A',
    email: 'suhani.nair@college.edu',
    phone: '+91 98765 43215',
    createdAt: '2024-08-01T09:25:00.000Z'
  },
  {
    id: 'STU-2024-007',
    rollNumber: 'CS-107',
    name: 'Vikramaditya Roy',
    department: 'Computer Science & Engineering',
    academicYear: '3rd Year',
    classSection: 'Section A',
    email: 'vikram.roy@college.edu',
    phone: '+91 98765 43216',
    createdAt: '2024-08-01T09:30:00.000Z'
  },
  {
    id: 'STU-2024-008',
    rollNumber: 'IT-201',
    name: 'Sneha Kulkarni',
    department: 'Information Technology',
    academicYear: '3rd Year',
    classSection: 'Section A',
    email: 'sneha.k@college.edu',
    phone: '+91 98765 43217',
    createdAt: '2024-08-02T10:00:00.000Z'
  },
  {
    id: 'STU-2024-009',
    rollNumber: 'IT-202',
    name: 'Arjun Nambiar',
    department: 'Information Technology',
    academicYear: '3rd Year',
    classSection: 'Section A',
    email: 'arjun.n@college.edu',
    phone: '+91 98765 43218',
    createdAt: '2024-08-02T10:05:00.000Z'
  },
  {
    id: 'STU-2024-010',
    rollNumber: 'EC-301',
    name: 'Meera Rao',
    department: 'Electronics & Communication',
    academicYear: '2nd Year',
    classSection: 'Section B',
    email: 'meera.rao@college.edu',
    phone: '+91 98765 43219',
    createdAt: '2024-08-03T11:00:00.000Z'
  }
];

// Helper to generate a realistic initial set of attendance records for the last 5 days
export const generateInitialAttendance = () => {
  const records = [];
  const today = new Date();
  
  // Dates: today, yesterday, and 3 previous weekdays
  const dates = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    // YYYY-MM-DD format
    const dateStr = d.toISOString().split('T')[0];
    dates.push(dateStr);
  }

  const csStudents = INITIAL_STUDENTS.filter(s => s.department === 'Computer Science & Engineering' && s.classSection === 'Section A');
  const subjects = ['Data Structures & Algorithms', 'Database Management Systems'];

  dates.forEach((dateStr, dayIndex) => {
    subjects.forEach((subject, subjIndex) => {
      csStudents.forEach((student, stuIndex) => {
        // Create realistic diverse attendance pattern
        // Student 005 (Kabir) has frequent absences to demonstrate low attendance (< 75%)
        let status = 'Present';
        
        if (student.rollNumber === 'CS-105') {
          // Kabir Mehta: low attendance test case
          if (dayIndex % 2 === 0) status = 'Absent';
          else if (dayIndex === 1 && subjIndex === 0) status = 'Late';
          else status = 'Absent';
        } else if (student.rollNumber === 'CS-107') {
          // Vikramaditya: borderline test case
          if (dayIndex === 0) status = 'Late';
          else if (dayIndex === 2) status = 'Leave';
          else if (dayIndex === 3) status = 'Absent';
          else status = 'Present';
        } else {
          // High attendance students
          const pseudoRandom = (stuIndex * 7 + dayIndex * 13 + subjIndex * 3) % 10;
          if (pseudoRandom === 0) status = 'Absent';
          else if (pseudoRandom === 1) status = 'Late';
          else if (pseudoRandom === 2 && dayIndex === 4) status = 'Leave';
          else status = 'Present';
        }

        records.push({
          id: `ATT-${dateStr}-${student.id}-${subjIndex}`,
          date: dateStr,
          department: student.department,
          academicYear: student.academicYear,
          classSection: student.classSection,
          subject: subject,
          studentId: student.id,
          status: status,
          timestamp: new Date().toISOString()
        });
      });
    });
  });

  return records;
};
