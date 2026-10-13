import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import StudentTable from '../components/StudentTable';
import StudentForm from '../components/StudentForm';
import ConfirmDialog from '../components/ConfirmDialog';
import { DEPARTMENTS, ACADEMIC_YEARS, SECTIONS } from '../data/sampleData';
import {
  HiUserPlus,
  HiMagnifyingGlass,
  HiAdjustmentsHorizontal,
  HiArrowPath
} from 'react-icons/hi2';

export default function Students() {
  const navigate = useNavigate();
  const { students, deleteStudent } = useData();

  // Search, filter & sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [sortBy, setSortBy] = useState('rollAsc'); // rollAsc, rollDesc, nameAsc, nameDesc

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Filtered and sorted students list
  const filteredStudents = useMemo(() => {
    return students
      .filter(student => {
        // Search by name or roll number
        const term = searchTerm.trim().toLowerCase();
        const matchesSearch =
          !term ||
          student.name.toLowerCase().includes(term) ||
          student.rollNumber.toLowerCase().includes(term) ||
          student.id.toLowerCase().includes(term);

        // Filter department
        const matchesDept = selectedDept === 'ALL' || student.department === selectedDept;

        // Filter academic year
        const matchesYear = selectedYear === 'ALL' || student.academicYear === selectedYear;

        // Filter section
        const matchesSection = selectedSection === 'ALL' || student.classSection === selectedSection;

        return matchesSearch && matchesDept && matchesYear && matchesSection;
      })
      .sort((a, b) => {
        if (sortBy === 'rollAsc') return a.rollNumber.localeCompare(b.rollNumber, undefined, { numeric: true });
        if (sortBy === 'rollDesc') return b.rollNumber.localeCompare(a.rollNumber, undefined, { numeric: true });
        if (sortBy === 'nameAsc') return a.name.localeCompare(b.name);
        if (sortBy === 'nameDesc') return b.name.localeCompare(a.name);
        return 0;
      });
  }, [students, searchTerm, selectedDept, selectedYear, selectedSection, sortBy]);

  const handleOpenAdd = () => {
    setStudentToEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (student) => {
    setStudentToEdit(student);
    setIsFormOpen(true);
  };

  const handleDeletePrompt = (student) => {
    setStudentToDelete(student);
  };

  const handleConfirmDelete = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete.id);
      setStudentToDelete(null);
    }
  };

  const handleView = (student) => {
    navigate(`/students/${student.id}`);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDept('ALL');
    setSelectedYear('ALL');
    setSelectedSection('ALL');
    setSortBy('rollAsc');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Page Header */}
      <div
        className="card"
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
            Student Directory
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Manage student registrations, academic classes, and view individual attendance records
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleOpenAdd}
        >
          <HiUserPlus size={18} />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div
        className="card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          padding: 20
        }}
      >
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search box */}
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <HiMagnifyingGlass
              size={18}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}
            />
            <input
              type="text"
              placeholder="Search by name, roll number, or student ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: 38 }}
            />
          </div>

          {/* Department Filter */}
          <div style={{ minWidth: 200, flex: '1 1 180px' }}>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="form-select"
            >
              <option value="ALL">All Departments</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Academic Year Filter */}
          <div style={{ minWidth: 140, flex: '1 1 120px' }}>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="form-select"
            >
              <option value="ALL">All Years</option>
              {ACADEMIC_YEARS.map(yr => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>

          {/* Class / Section Filter */}
          <div style={{ minWidth: 140, flex: '1 1 120px' }}>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="form-select"
            >
              <option value="ALL">All Sections</option>
              {SECTIONS.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div style={{ minWidth: 160, flex: '1 1 140px' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
            >
              <option value="rollAsc">Roll No (Ascending)</option>
              <option value="rollDesc">Roll No (Descending)</option>
              <option value="nameAsc">Name (A to Z)</option>
              <option value="nameDesc">Name (Z to A)</option>
            </select>
          </div>

          {/* Reset Filters button */}
          <button
            type="button"
            className="btn btn-secondary btn-icon"
            onClick={resetFilters}
            title="Reset Filters"
            aria-label="Reset Filters"
          >
            <HiArrowPath size={18} />
          </button>
        </div>

        {/* Filter stats pill */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          <div>
            Showing <strong>{filteredStudents.length}</strong> of <strong>{students.length}</strong> registered students
          </div>
          {(searchTerm || selectedDept !== 'ALL' || selectedYear !== 'ALL' || selectedSection !== 'ALL') && (
            <span className="badge badge-neutral">Active Filters Applied</span>
          )}
        </div>
      </div>

      {/* Student Table */}
      <StudentTable
        students={filteredStudents}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeletePrompt}
      />

      {/* Add / Edit Student Form Modal */}
      <StudentForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setStudentToEdit(null);
        }}
        studentToEdit={studentToEdit}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!studentToDelete}
        title="Delete Student Record"
        message={
          studentToDelete
            ? `Are you sure you want to delete ${studentToDelete.name} (${studentToDelete.rollNumber})? This will also remove their recorded attendance entries.`
            : ''
        }
        confirmText="Delete Record"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setStudentToDelete(null)}
      />
    </div>
  );
}
