import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Upload } from 'lucide-react';
import { useData } from '../context/DataContext';

const ManageNotes = () => {
  // Use global data context
  const { data, addNote, deleteNote, getBatchesBySubject } = useData();
  const [selectedSubject, setSelectedSubject] = useState(1);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
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
  const handleUpload = () => {
    if (!newNoteTitle.trim()) {
      setUploadError('Please enter a title for the note.');
      return;
    }

    if (!selectedFile) {
      setUploadError('Please select a PDF file to upload.');
      return;
    }

    // Create new note using context
    const noteData = {
      title: newNoteTitle,
      type: 'PDF',
      fileName: selectedFile.name
    };

    addNote(selectedSubject, noteData);

    // Close modal and reset form
    setShowUploadModal(false);
    setNewNoteTitle('');
    setSelectedFile(null);
    setUploadError('');

    // Display success message (in real app, you'd actually upload the file to a server)
    alert('Note uploaded successfully!');
  };

  // Handle note deletion
  const handleDeleteNote = (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(selectedSubject, noteId);
    }
  };

  // Get current subject's notes
  const currentSubjectNotes = data.notes[selectedSubject] || [];

  return (
    <div>
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
                const subjectBatches = getBatchesBySubject(selectedSubject);
                
                return (
                  <tr key={note.id}>
                    <td>{note.title}</td>
                    <td>
                      <span className="lecture-tag">{subjectName}</span>
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
                    <td>{note.type}</td>
                    <td>{note.addedOn}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn" style={{ padding: '6px 10px', background: '#f3f4f6' }}>
                          <Eye size={16} />
                        </button>
                        <button className="btn" style={{ padding: '6px 10px', background: '#fef3c7' }}>
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn" 
                          style={{ padding: '6px 10px', background: '#fee2e2' }}
                          onClick={() => handleDeleteNote(note.id)}
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
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label>Available in Batches</label>
              <div style={{
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '10px',
                backgroundColor: '#f9fafb'
              }}>
                {(() => {
                  const subjectBatches = getBatchesBySubject(selectedSubject);
                  return subjectBatches.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {subjectBatches.map(batch => (
                        <span 
                          key={batch.id} 
                          style={{
                            background: '#10b981',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            fontWeight: '500'
                          }}
                        >
                          {batch.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>
                      This subject is not assigned to any batches yet. Students in these batches won't be able to access this note.
                    </p>
                  );
                })()
                }
              </div>
            </div>

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
    </div>
  );
};

export default ManageNotes;
