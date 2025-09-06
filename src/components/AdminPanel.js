import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  Video, 
  FileText, 
  ClipboardList, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { useData } from '../context/DataContext';
import ManageNotes from './ManageNotes';
import ManageDPPs from './ManageDPPs';
import BatchSubjectSelector from './BatchSubjectSelector';

// Dashboard Overview Component
const Dashboard = () => {
  const { data } = useData();
  
  const totalStudents = data.batches.reduce((sum, batch) => sum + batch.students, 0);
  const activeBatches = data.batches.filter(batch => batch.status === 'active').length;
  const totalSubjects = data.subjects.length;
  const totalLectures = Object.values(data.lectures).reduce((sum, lectures) => sum + lectures.length, 0);
  
  return (
    <div>
      <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '30px' }}>
        Admin Dashboard
      </h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{totalStudents}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{activeBatches}</div>
          <div className="stat-label">Active Batches</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalSubjects}</div>
          <div className="stat-label">Subjects Created</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalLectures}</div>
          <div className="stat-label">Lectures Uploaded</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px' }}>
      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>Recent Activities</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
            <span style={{ fontSize: '0.9rem' }}>25 new students joined Class 10 batch</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></div>
            <span style={{ fontSize: '0.9rem' }}>Mathematics lecture uploaded</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></div>
            <span style={{ fontSize: '0.9rem' }}>Live session scheduled for tomorrow</span>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>Quick Actions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button className="btn btn-primary">Create New Batch</button>
          <button className="btn btn-success">Upload Lecture</button>
          <button className="btn btn-primary">Add Subject</button>
        </div>
      </div>
      </div>
    </div>
  );
};

// Manage Batches Component
const ManageBatches = () => {
  const { data, addBatch, updateBatch, deleteBatch, addSubjectToBatch, removeSubjectFromBatch } = useData();
  const [showModal, setShowModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [editingBatch, setEditingBatch] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    originalPrice: '',
    discountPrice: '',
    teachers: [''],
    subjects: [],
    status: 'active'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      class: '',
      originalPrice: '',
      discountPrice: '',
      teachers: [''],
      subjects: [],
      status: 'active'
    });
    setEditingBatch(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const batchData = {
      ...formData,
      class: parseInt(formData.class),
      originalPrice: parseFloat(formData.originalPrice),
      discountPrice: parseFloat(formData.discountPrice),
      currentPrice: 0,
      teachers: formData.teachers.filter(teacher => teacher.trim())
    };

    if (editingBatch) {
      updateBatch(editingBatch.id, batchData);
    } else {
      addBatch(batchData);
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (batch) => {
    setEditingBatch(batch);
    setFormData({
      name: batch.name,
      class: batch.class.toString(),
      originalPrice: batch.originalPrice.toString(),
      discountPrice: batch.discountPrice.toString(),
      teachers: batch.teachers.length ? batch.teachers : [''],
      subjects: batch.subjects || [],
      status: batch.status
    });
    setShowModal(true);
  };

  const handleDelete = (batchId) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      deleteBatch(batchId);
    }
  };

  const addTeacherField = () => {
    setFormData(prev => ({ ...prev, teachers: [...prev.teachers, ''] }));
  };

  const updateTeacher = (index, value) => {
    const newTeachers = [...formData.teachers];
    newTeachers[index] = value;
    setFormData(prev => ({ ...prev, teachers: newTeachers }));
  };

  const removeTeacher = (index) => {
    const newTeachers = formData.teachers.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, teachers: newTeachers.length ? newTeachers : [''] }));
  };

  const handleManageSubjects = (batch) => {
    setSelectedBatch(batch);
    setShowSubjectModal(true);
  };

  const handleSubjectToggle = (subjectId) => {
    const batch = selectedBatch;
    const isAssigned = batch.subjects && batch.subjects.includes(subjectId);
    
    if (isAssigned) {
      removeSubjectFromBatch(batch.id, subjectId);
    } else {
      addSubjectToBatch(batch.id, subjectId);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>Manage Batches</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Create New Batch
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Batch Name</th>
              <th>Class</th>
              <th>Students</th>
              <th>Subjects</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.batches.map(batch => (
              <tr key={batch.id}>
                <td>{batch.name}</td>
                <td>Class {batch.class}</td>
                <td>{batch.students}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>{batch.subjects?.length || 0} subjects</span>
                    <button 
                      className="btn" 
                      style={{ padding: '4px 8px', fontSize: '0.8rem', background: '#e0f2fe' }}
                      onClick={() => handleManageSubjects(batch)}
                    >
                      Manage
                    </button>
                  </div>
                </td>
                <td>₹{batch.originalPrice} → ₹{batch.discountPrice}</td>
                <td>
                  <span className={`status-badge ${batch.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                    {batch.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn" style={{ padding: '6px 10px', background: '#fef3c7' }} onClick={() => handleEdit(batch)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn" style={{ padding: '6px 10px', background: '#fee2e2' }} onClick={() => handleDelete(batch.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => { setShowModal(false); resetForm(); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <h3 style={{ marginBottom: '20px' }}>{editingBatch ? 'Edit Batch' : 'Create New Batch'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Batch Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="e.g., Aarambh Batch 2.0 - Class 9"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Class</label>
                <select
                  className="form-select"
                  value={formData.class}
                  onChange={(e) => setFormData({...formData, class: e.target.value})}
                  required
                >
                  <option value="">Select Class</option>
                  <option value="6">Class 6</option>
                  <option value="7">Class 7</option>
                  <option value="8">Class 8</option>
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label className="form-label">Original Price (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                    required
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Discount Price (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({...formData, discountPrice: e.target.value})}
                    required
                    min="0"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Teachers</label>
                {formData.teachers.map((teacher, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={teacher}
                      onChange={(e) => updateTeacher(index, e.target.value)}
                      placeholder="Teacher initials (e.g., AK)"
                      style={{ flex: 1 }}
                    />
                    {formData.teachers.length > 1 && (
                      <button type="button" className="btn btn-danger" onClick={() => removeTeacher(index)}>
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className="btn" onClick={addTeacherField} style={{ marginTop: '10px' }}>
                  Add Another Teacher
                </button>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn" onClick={() => { setShowModal(false); resetForm(); }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingBatch ? 'Update Batch' : 'Create Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subject Assignment Modal */}
      {showSubjectModal && selectedBatch && (
        <div className="modal-backdrop" onClick={() => { setShowSubjectModal(false); setSelectedBatch(null); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <h3 style={{ marginBottom: '20px' }}>Manage Subjects - {selectedBatch.name}</h3>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>Select subjects available in this batch:</p>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
              gap: '15px',
              maxHeight: '400px',
              overflowY: 'auto',
              padding: '10px'
            }}>
              {data.subjects.map(subject => {
                const isAssigned = selectedBatch.subjects && selectedBatch.subjects.includes(subject.id);
                return (
                  <div 
                    key={subject.id} 
                    style={{
                      border: `2px solid ${isAssigned ? '#10b981' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      padding: '15px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      background: isAssigned ? '#f0fdf4' : 'white',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => handleSubjectToggle(subject.id)}
                  >
                    <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
                      {subject.icon}
                    </div>
                    <h4 style={{ 
                      fontSize: '0.9rem', 
                      fontWeight: '600',
                      margin: '0 0 5px 0',
                      color: isAssigned ? '#065f46' : '#374151'
                    }}>
                      {subject.name}
                    </h4>
                    <div style={{
                      fontSize: '0.7rem',
                      color: isAssigned ? '#10b981' : '#6b7280',
                      fontWeight: '500'
                    }}>
                      {isAssigned ? '✓ Added' : 'Click to add'}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button 
                type="button" 
                className="btn" 
                onClick={() => { setShowSubjectModal(false); setSelectedBatch(null); }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Manage Subjects Component
const ManageSubjects = () => {
  const { data, addSubject, updateSubject, deleteSubject, getBatchesBySubject, addSubjectToBatch, removeSubjectFromBatch } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    class: '',
    selectedBatches: []
  });

  const subjectClassOptions = [
    { value: 'math', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
    { value: 'social', label: 'Social Science' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'english', label: 'English' },
    { value: 'sanskrit', label: 'Sanskrit' },
    { value: 'it', label: 'Information Technology' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'biology', label: 'Biology' },
    { value: 'history', label: 'History' },
    { value: 'geography', label: 'Geography' },
    { value: 'economics', label: 'Economics' }
  ];

  const resetForm = () => {
    setFormData({ name: '', icon: '', class: '', selectedBatches: [] });
    setEditingSubject(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const subjectData = {
      name: formData.name,
      icon: formData.icon,
      class: formData.class
    };
    
    let subjectId;
    if (editingSubject) {
      updateSubject(editingSubject.id, subjectData);
      subjectId = editingSubject.id;
      
      // Update batch-subject relationships for existing subject
      const currentBatches = getBatchesBySubject(subjectId);
      const currentBatchIds = currentBatches.map(b => b.id);
      
      // Remove subject from batches that are no longer selected
      currentBatchIds.forEach(batchId => {
        if (!formData.selectedBatches.includes(batchId)) {
          removeSubjectFromBatch(batchId, subjectId);
        }
      });
      
      // Add subject to newly selected batches
      formData.selectedBatches.forEach(batchId => {
        if (!currentBatchIds.includes(batchId)) {
          addSubjectToBatch(batchId, subjectId);
        }
      });
    } else {
      const newSubject = addSubject(subjectData);
      subjectId = newSubject.id;
      
      // Add subject to selected batches for new subject
      formData.selectedBatches.forEach(batchId => {
        addSubjectToBatch(batchId, subjectId);
      });
    }
    
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    const subjectBatches = getBatchesBySubject(subject.id);
    setFormData({
      name: subject.name,
      icon: subject.icon,
      class: subject.class,
      selectedBatches: subjectBatches.map(batch => batch.id)
    });
    setShowModal(true);
  };

  const handleDelete = (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject? This will also delete all associated lectures, notes, and DPPs.')) {
      deleteSubject(subjectId);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>Manage Subjects</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Add New Subject
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Subject Name</th>
              <th>Icon</th>
              <th>Available in Batches</th>
              <th>Topics</th>
              <th>Lectures</th>
              <th>Notes</th>
              <th>DPPs</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.subjects.map(subject => {
              const subjectBatches = getBatchesBySubject(subject.id);
              return (
                <tr key={subject.id}>
                  <td>{subject.name}</td>
                  <td style={{ fontSize: '1.5rem' }}>{subject.icon}</td>
                  <td>
                    {subjectBatches.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {subjectBatches.map(batch => (
                          <span 
                            key={batch.id} 
                            style={{
                              background: '#e0f2fe',
                              color: '#0369a1',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: '500'
                            }}
                          >
                            {batch.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Not assigned to any batch</span>
                    )}
                  </td>
                  <td>{subject.topics}</td>
                  <td>{data.lectures[subject.id]?.length || 0}</td>
                  <td>{data.notes[subject.id]?.length || 0}</td>
                  <td>{data.dpps[subject.id]?.length || 0}</td>
                  <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn" style={{ padding: '6px 10px', background: '#fef3c7' }} onClick={() => handleEdit(subject)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn" style={{ padding: '6px 10px', background: '#fee2e2' }} onClick={() => handleDelete(subject.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => { setShowModal(false); resetForm(); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '20px' }}>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Subject Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Subject Icon (Emoji)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  required
                  placeholder="e.g., 📐"
                  maxLength="2"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Subject Category</label>
                <select
                  className="form-select"
                  value={formData.class}
                  onChange={(e) => setFormData({...formData, class: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  {subjectClassOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Available in Batches</label>
                <div style={{ 
                  maxHeight: '150px', 
                  overflowY: 'auto', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  padding: '10px' 
                }}>
                  {data.batches.length > 0 ? (
                    data.batches.map(batch => (
                      <div key={batch.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <input
                          type="checkbox"
                          id={`batch-${batch.id}`}
                          checked={formData.selectedBatches.includes(batch.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                selectedBatches: [...prev.selectedBatches, batch.id]
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                selectedBatches: prev.selectedBatches.filter(id => id !== batch.id)
                              }));
                            }
                          }}
                          style={{ marginRight: '8px' }}
                        />
                        <label htmlFor={`batch-${batch.id}`} style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                          {batch.name} (Class {batch.class})
                        </label>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>No batches available</p>
                  )}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '5px' }}>
                  Select the batches where this subject will be available. You can also assign subjects to batches later from the Manage Batches section.
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn" onClick={() => { setShowModal(false); resetForm(); }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSubject ? 'Update Subject' : 'Add Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Manage Lectures Component
const ManageLectures = () => {
  const { data, addLecture, updateLecture, deleteLecture, getBatchesBySubject, getAllBatchSubjectCombinations } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    duration: '',
    videoUrl: ''
  });

  const resetForm = () => {
    setFormData({ title: '', subject: '', duration: '', videoUrl: '' });
    setSelectedSubject('');
    setSelectedBatch('');
    setEditingLecture(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const lectureData = {
      title: formData.title,
      subject: data.subjects.find(s => s.id === parseInt(selectedSubject))?.name?.toUpperCase() || 'GENERAL',
      duration: formData.duration,
      videoUrl: formData.videoUrl
    };

    if (editingLecture) {
      updateLecture(selectedSubject, editingLecture.id, lectureData);
    } else {
      addLecture(selectedSubject, lectureData);
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (lecture, subjectId) => {
    setEditingLecture(lecture);
    setSelectedSubject(subjectId.toString());
    setFormData({
      title: lecture.title,
      subject: lecture.subject,
      duration: lecture.duration,
      videoUrl: lecture.videoUrl || ''
    });
    setShowModal(true);
  };

  const handleDelete = (subjectId, lectureId) => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      deleteLecture(subjectId, lectureId);
    }
  };

  const allLectures = Object.entries(data.lectures).flatMap(([subjectId, lectures]) =>
    lectures.map(lecture => ({ ...lecture, subjectId: parseInt(subjectId) }))
  );

  const getSubjectName = (subjectId) => {
    return data.subjects.find(s => s.id === subjectId)?.name || 'Unknown';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>Manage Lectures</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Upload New Lecture
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Lecture Title</th>
              <th>Subject</th>
              <th>Available in Batches</th>
              <th>Duration</th>
              <th>Upload Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allLectures.map(lecture => {
              const subjectBatches = getBatchesBySubject(lecture.subjectId);
              return (
                <tr key={`${lecture.subjectId}-${lecture.id}`}>
                  <td>{lecture.title}</td>
                  <td>
                    <span className="lecture-tag">{getSubjectName(lecture.subjectId)}</span>
                  </td>
                  <td>
                    {subjectBatches.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {subjectBatches.map(batch => (
                          <span 
                            key={batch.id} 
                            style={{
                              background: '#e0f2fe',
                              color: '#0369a1',
                              padding: '2px 6px',
                              borderRadius: '10px',
                              fontSize: '0.7rem',
                              fontWeight: '500'
                            }}
                          >
                            {batch.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>No batches</span>
                    )}
                  </td>
                  <td>{lecture.duration}</td>
                  <td>{lecture.uploadDate}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn" style={{ padding: '6px 10px', background: '#fef3c7' }} onClick={() => handleEdit(lecture, lecture.subjectId)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn" style={{ padding: '6px 10px', background: '#fee2e2' }} onClick={() => handleDelete(lecture.subjectId, lecture.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => { setShowModal(false); resetForm(); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <h3 style={{ marginBottom: '20px' }}>{editingLecture ? 'Edit Lecture' : 'Upload New Lecture'}</h3>
            <form onSubmit={handleSubmit}>
              <BatchSubjectSelector
                selectedSubject={selectedSubject}
                onSubjectChange={(subjectId) => {
                  setSelectedSubject(subjectId);
                  // Auto-select first batch for this subject if available
                  const subjectBatches = getBatchesBySubject(parseInt(subjectId));
                  setSelectedBatch(subjectBatches.length > 0 ? subjectBatches[0].id.toString() : '');
                }}
                showBatchInfo={true}
                title={editingLecture ? "Subject (cannot be changed)" : "Select Subject & Target Batches"}
              />
              {editingLecture && (
                <div style={{
                  padding: '10px',
                  background: '#fef3c7',
                  borderRadius: '6px',
                  marginBottom: '15px',
                  fontSize: '0.9rem',
                  color: '#92400e'
                }}>
                  📝 Note: Subject cannot be changed when editing a lecture
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Lecture Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  placeholder="e.g., Quadrilaterals L1"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Duration</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  required
                  placeholder="e.g., 45 min"
                  pattern="[0-9]+\s?(min|mins|minutes?)$"
                  title="Please enter duration in format like '45 min' or '1 hour'"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Video URL (Optional)</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                  placeholder="https://example.com/video-link"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn" onClick={() => { setShowModal(false); resetForm(); }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingLecture ? 'Update Lecture' : 'Upload Lecture'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Student Management Component
const StudentManagement = () => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>Student Management</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Search students..." 
          className="form-input" 
          style={{ width: '300px' }}
        />
        <button className="btn btn-primary">Search</button>
      </div>
    </div>

    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Batch</th>
            <th>Email</th>
            <th>Enrollment Date</th>
            <th>Progress</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Rajesh Kumar</td>
            <td>Class 9 - Aarambh 2.0</td>
            <td>rajesh@email.com</td>
            <td>2024-01-15</td>
            <td>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ 
                  width: '100px', 
                  height: '8px', 
                  background: '#e5e7eb', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: '75%', 
                    height: '100%', 
                    background: '#10b981'
                  }}></div>
                </div>
                <span style={{ fontSize: '0.9rem' }}>75%</span>
              </div>
            </td>
            <td>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn" style={{ padding: '6px 10px', background: '#f3f4f6' }}>
                  <Eye size={16} />
                </button>
                <button className="btn" style={{ padding: '6px 10px', background: '#fee2e2' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
          <tr>
            <td>Priya Sharma</td>
            <td>Class 10 - Excellence</td>
            <td>priya@email.com</td>
            <td>2024-01-20</td>
            <td>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ 
                  width: '100px', 
                  height: '8px', 
                  background: '#e5e7eb', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: '60%', 
                    height: '100%', 
                    background: '#f59e0b'
                  }}></div>
                </div>
                <span style={{ fontSize: '0.9rem' }}>60%</span>
              </div>
            </td>
            <td>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn" style={{ padding: '6px 10px', background: '#f3f4f6' }}>
                  <Eye size={16} />
                </button>
                <button className="btn" style={{ padding: '6px 10px', background: '#fee2e2' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const AdminPanel = ({ onLogout }) => {
  const location = useLocation();
  const [activeNav, setActiveNav] = useState('Dashboard');

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Manage Batches', icon: BookOpen, path: '/admin/batches' },
    { name: 'Manage Subjects', icon: GraduationCap, path: '/admin/subjects' },
    { name: 'Lectures', icon: Video, path: '/admin/lectures' },
    { name: 'Notes', icon: FileText, path: '/admin/notes' },
    { name: 'DPPs', icon: ClipboardList, path: '/admin/dpps' },
    { name: 'Students', icon: Users, path: '/admin/students' },
    { name: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>EduVerse Admin</h2>
          <p style={{ opacity: '0.7', fontSize: '0.9rem' }}>Management Panel</p>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <Link
              key={item.name}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setActiveNav(item.name)}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
          
          <button
            className="nav-item"
            onClick={onLogout}
            style={{ 
              background: 'none', 
              border: 'none', 
              width: '100%', 
              textAlign: 'left',
              marginTop: '20px',
              borderTop: '1px solid #374151',
              paddingTop: '20px'
            }}
          >
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/batches" element={<ManageBatches />} />
          <Route path="/subjects" element={<ManageSubjects />} />
          <Route path="/lectures" element={<ManageLectures />} />
          <Route path="/notes" element={<ManageNotes />} />
          <Route path="/dpps" element={<ManageDPPs />} />
          <Route path="/students" element={<StudentManagement />} />
          <Route path="/analytics" element={<div><h2>Analytics & Reports</h2><p>Analytics dashboard will be implemented here.</p></div>} />
          <Route path="/settings" element={<div><h2>Settings</h2><p>System settings will be implemented here.</p></div>} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;
