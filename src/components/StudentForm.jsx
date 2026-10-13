import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { DEPARTMENTS, ACADEMIC_YEARS, SECTIONS } from '../data/sampleData';
import { HiXMark, HiUserPlus, HiPencilSquare } from 'react-icons/hi2';

export default function StudentForm({ isOpen, onClose, studentToEdit }) {
  const { addStudent, updateStudent, generateStudentId } = useData();

  const isEditing = !!studentToEdit;

  const [formData, setFormData] = useState({
    rollNumber: '',
    name: '',
    department: DEPARTMENTS[0],
    academicYear: ACADEMIC_YEARS[0],
    classSection: SECTIONS[0],
    email: '',
    phone: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        rollNumber: studentToEdit.rollNumber || '',
        name: studentToEdit.name || '',
        department: studentToEdit.department || DEPARTMENTS[0],
        academicYear: studentToEdit.academicYear || ACADEMIC_YEARS[0],
        classSection: studentToEdit.classSection || SECTIONS[0],
        email: studentToEdit.email || '',
        phone: studentToEdit.phone || ''
      });
      setErrors({});
    } else {
      setFormData({
        rollNumber: '',
        name: '',
        department: DEPARTMENTS[0],
        academicYear: ACADEMIC_YEARS[0],
        classSection: SECTIONS[0],
        email: '',
        phone: ''
      });
      setErrors({});
    }
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.rollNumber.trim()) {
      errs.rollNumber = 'Roll number is required';
    }

    if (!formData.name.trim()) {
      errs.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Contact number is required';
    } else if (formData.phone.trim().length < 8) {
      errs.phone = 'Please enter a valid phone number (at least 8 digits)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing) {
      const res = updateStudent({
        ...studentToEdit,
        ...formData
      });
      if (res.success) {
        onClose();
      } else if (res.error) {
        setErrors(prev => ({ ...prev, rollNumber: res.error }));
      }
    } else {
      const res = addStudent({
        ...formData
      });
      if (res.success) {
        onClose();
      } else if (res.error) {
        setErrors(prev => ({ ...prev, rollNumber: res.error }));
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 600, padding: 28 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isEditing ? <HiPencilSquare size={22} /> : <HiUserPlus size={22} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                {isEditing ? 'Edit Student Details' : 'Register New Student'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                {isEditing
                  ? `Updating record for ${studentToEdit.id}`
                  : `ID will be automatically assigned (e.g. ${generateStudentId()})`}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <HiXMark size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label required" htmlFor="rollNumber">Roll Number</label>
              <input
                id="rollNumber"
                name="rollNumber"
                type="text"
                placeholder="e.g. CS-108"
                value={formData.rollNumber}
                onChange={handleChange}
                className={`form-input ${errors.rollNumber ? 'is-invalid' : ''}`}
              />
              {errors.rollNumber && <div className="form-error">{errors.rollNumber}</div>}
              <div className="form-hint">Unique college roll or registration code.</div>
            </div>

            <div className="form-group">
              <label className="form-label required" htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Priya Sundaram"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'is-invalid' : ''}`}
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label required" htmlFor="department">Department</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="form-select"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label required" htmlFor="academicYear">Academic Year</label>
              <select
                id="academicYear"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                className="form-select"
              >
                {ACADEMIC_YEARS.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label required" htmlFor="classSection">Class / Section</label>
              <select
                id="classSection"
                name="classSection"
                value={formData.classSection}
                onChange={handleChange}
                className="form-select"
              >
                {SECTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label required" htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="student@college.edu"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'is-invalid' : ''}`}
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label required" htmlFor="phone">Contact Number</label>
              <input
                id="phone"
                name="phone"
                type="text"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                className={`form-input ${errors.phone ? 'is-invalid' : ''}`}
              />
              {errors.phone && <div className="form-error">{errors.phone}</div>}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {isEditing ? 'Save Changes' : 'Register Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
