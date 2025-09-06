import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Upload } from 'lucide-react';
import { useData } from '../context/DataContext';
import BatchSelector from './BatchSelector';
import { useToast, ToastContainer } from './Toast';

const ManageNotes = () => {
  // Use global data context
  const { data, addNote, updateNote, deleteNote, getBatchesBySubject } = useData();
  const { toasts, showSuccess, showError, removeToast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState(1);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [uploadError, setUploadError] = useState('');

  // Subject options for filtering
  const subjectOptions = data.subjects.map(subject => ({
    id: subject.id,
    name: subject.name
  }));

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        setUploadError('Only PDF files are allowed.');
        setSelectedFile(null);
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('File size should not exceed 10MB.');
        setSelectedFile(null);
        return;
      }
      
      setSelectedFile(file);
      setUploadError('');
    }
  };

  // Handle note upload
  const handleUpload = async () => {
    if (!newNoteTitle.trim()) {
      setUploadError('Please enter a title for the note.');
      return;
    }

    if (!selectedFile) {
      setUploadError('Please select a PDF file to upload.');
      return;
    }

    if (selectedBatches.length === 0) {
      setUploadError('Please select at least one batch for this note.');
      return;
    }

    try {
      // Create new note using context
      const noteData = {
        title: newNoteTitle,
        type: 'PDF',
        fileName: selectedFile.name,
        availableInBatches: selectedBatches
      };

      await addNote(selectedSubject, noteData);

      // Close modal and reset form
      setShowUploadModal(false);
      setNewNoteTitle('');
      setSelectedFile(null);
      setSelectedBatches([]);
      setUploadError('');

      // Display success message
      showSuccess('Note uploaded successfully!');
    } catch (error) {
      showError('Failed to upload note. Please try again.');
    }
  };

  // Handle note editing
  const handleEditNote = (note) => {
    setEditingNote(note);
    setNewNoteTitle(note.title);
    setSelectedBatches(note.availableInBatches || []);
    setShowEditModal(true);
  };

  // Handle edit save
  const handleSaveEdit = async () => {
    if (!newNoteTitle.trim()) {
      setUploadError('Please enter a title for the note.');
      return;
    }

    if (selectedBatches.length === 0) {
      setUploadError('Please select at least one batch for this note.');
      return;
    }

    try {
      await updateNote(selectedSubject, editingNote.id, {
        title: newNoteTitle,
        availableInBatches: selectedBatches
      });

      // Close modal and reset form
      setShowEditModal(false);
      setEditingNote(null);
      setNewNoteTitle('');
      setSelectedBatches([]);
      setUploadError('');

      showSuccess('Note updated successfully!');
    } catch (error) {
      showError('Failed to update note. Please try again.');
    }
  };

  // Handle note deletion
  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(selectedSubject, noteId);
        showSuccess('Note deleted successfully!');
      } catch (error) {
        showError('Failed to delete note. Please try again.');
      }
    }
  };

  // Handle note viewing/download
  const handleViewNote = (note) => {
    // In a real application, this would open the PDF or trigger a download
    alert(`Viewing note: ${note.title}\nFile: ${note.fileName}\n\nIn a real application, this would open the PDF file.`);
  };

  // Get current subject's notes
  const currentSubjectNotes = data.notes[selectedSubject] || [];

  return (
    <div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>Manage Lecture Notes</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowUploadModal(true)}
        >
          <Plus size={20} />
          Upload New Notes
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px', fontWeight: '500' }}>Filter by Subject:</label>
        <select 
          className="form-select"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(Number(e.target.value))}
          style={{ width: '200px' }}
        >
          {subjectOptions.map(subject => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Subject</th>
              <th>Available in Batches</th>
              <th>Type</th>
              <th>Added On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentSubjectNotes.length > 0 ? (
              currentSubjectNotes.map(note => {
                const subjectName = data.subjects.find(s => s.id === selectedSubject)?.name;
                const noteBatches = note.availableInBatches || [];
                const batchDetails = data.batches.filter(batch => noteBatches.includes(batch.id));
                
                return (
                  <tr key={note.id}>
                    <td>{note.title}</td>
                    <td>
                      <span className="lecture-tag">{subjectName}</span>
                    </td>
                    <td>
                      {batchDetails.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {batchDetails.map(batch => (
                            <span 
                              key={batch.id} 
                              style={{
                                background: '#10b981',
                                color: 'white',
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
                        <span style={{ color: '#f59e0b', fontSize: '0.8rem' }}>No batches selected</span>
                      )}
                    </td>
                    <td>{note.type}</td>
                    <td>{note.addedOn}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="btn" 
                          style={{ padding: '6px 10px', background: '#f3f4f6' }}
                          onClick={() => handleViewNote(note)}
                          title="View Note"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="btn" 
                          style={{ padding: '6px 10px', background: '#fef3c7' }}
                          onClick={() => handleEditNote(note)}
                          title="Edit Note"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn" 
                          style={{ padding: '6px 10px', background: '#fee2e2' }}
                          onClick={() => handleDeleteNote(note.id)}
                          title="Delete Note"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                  No notes found for this subject. Click "Upload New Notes" to add some.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '20px' }}>Upload New Notes</h3>
            
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label htmlFor="noteTitle">Note Title</label>
              <input
                type="text"
                id="noteTitle"
                className="form-input"
                placeholder="Enter note title"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label htmlFor="subject">Subject</label>
              <select 
                id="subject"
                className="form-select"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(Number(e.target.value))}
              >
                {subjectOptions.map(subject => {
                  const batches = getBatchesBySubject(subject.id);
                  return (
                    <option key={subject.id} value={subject.id}>
                      {subject.name} {batches.length > 0 ? `(${batches.length} batch${batches.length > 1 ? 'es' : ''})` : '(No batches)'}
                    </option>
                  );
                })}
              </select>
            </div>
            <BatchSelector
              selectedSubject={selectedSubject}
              selectedBatches={selectedBatches}
              onBatchesChange={setSelectedBatches}
              title="Choose Target Batches for Notes"
              required={true}
              showStudentCount={true}
            />

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label>Upload PDF File</label>
              <div 
                style={{ 
                  border: '2px dashed #d1d5db', 
                  padding: '20px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#f9fafb'
                }}
                onClick={() => document.getElementById('pdfFile').click()}
              >
                <Upload size={40} style={{ margin: '0 auto 10px', color: '#6b7280' }} />
                <p style={{ margin: 0 }}>
                  {selectedFile ? selectedFile.name : 'Click to select or drag & drop a PDF file'}
                </p>
                <input
                  type="file"
                  id="pdfFile"
                  accept=".pdf"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
              {uploadError && <p style={{ color: 'red', marginTop: '5px' }}>{uploadError}</p>}
              {selectedFile && (
                <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                  Selected file: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button 
                className="btn"
                onClick={() => {
                  setShowUploadModal(false);
                  setNewNoteTitle('');
                  setSelectedFile(null);
                  setSelectedBatches([]);
                  setUploadError('');
                }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleUpload}
              >
                Upload Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingNote && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '20px' }}>Edit Note</h3>
            
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label htmlFor="editNoteTitle">Note Title</label>
              <input
                type="text"
                id="editNoteTitle"
                className="form-input"
                placeholder="Enter note title"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label>Current File: {editingNote.fileName}</label>
              <div style={{
                padding: '10px',
                background: '#f3f4f6',
                borderRadius: '4px',
                fontSize: '0.9rem',
                color: '#6b7280'
              }}>
                Note: File replacement is not implemented in this demo. Only title and batch assignment can be edited.
              </div>
            </div>

            <BatchSelector
              selectedSubject={selectedSubject}
              selectedBatches={selectedBatches}
              onBatchesChange={setSelectedBatches}
              title="Update Target Batches for Notes"
              required={true}
              showStudentCount={true}
            />

            {uploadError && <p style={{ color: 'red', marginTop: '5px' }}>{uploadError}</p>}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button 
                className="btn"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingNote(null);
                  setNewNoteTitle('');
                  setSelectedBatches([]);
                  setUploadError('');
                }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSaveEdit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageNotes;
