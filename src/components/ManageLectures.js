import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Upload, Play } from 'lucide-react';
import { useData } from '../context/DataContext';
import BatchSelector from './BatchSelector';
import { useToast, ToastContainer } from './Toast';

const ManageLectures = () => {
  // Use global data context
  const { data, addLecture, updateLecture, deleteLecture, getBatchesBySubject } = useData();
  const { toasts, showSuccess, showError, removeToast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState(1);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null);
  const [newLectureTitle, setNewLectureTitle] = useState('');
  const [lectureDuration, setLectureDuration] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [uploadError, setUploadError] = useState('');

  // Subject options for filtering
  const subjectOptions = data.subjects.map(subject => ({
    id: subject.id,
    name: subject.name
  }));

  // Handle lecture upload
  const handleUpload = async () => {
    if (!newLectureTitle.trim()) {
      setUploadError('Please enter a title for the lecture.');
      return;
    }

    if (!videoUrl.trim()) {
      setUploadError('Please enter a video URL.');
      return;
    }

    if (!lectureDuration.trim()) {
      setUploadError('Please enter the lecture duration.');
      return;
    }

    if (selectedBatches.length === 0) {
      setUploadError('Please select at least one batch for this lecture.');
      return;
    }

    try {
      // Create new lecture using context
      const lectureData = {
        title: newLectureTitle,
        subject: data.subjects.find(s => s.id === selectedSubject)?.name.toUpperCase(),
        duration: lectureDuration,
        videoUrl: videoUrl,
        availableInBatches: selectedBatches
      };

      await addLecture(selectedSubject, lectureData);

      // Close modal and reset form
      setShowUploadModal(false);
      setNewLectureTitle('');
      setLectureDuration('');
      setVideoUrl('');
      setSelectedBatches([]);
      setUploadError('');

      // Display success message
      showSuccess('Lecture uploaded successfully!');
    } catch (error) {
      showError('Failed to upload lecture. Please try again.');
    }
  };

  // Handle lecture editing
  const handleEditLecture = (lecture) => {
    setEditingLecture(lecture);
    setNewLectureTitle(lecture.title);
    setLectureDuration(lecture.duration);
    setVideoUrl(lecture.videoUrl);
    setSelectedBatches(lecture.availableInBatches || []);
    setShowEditModal(true);
  };

  // Handle edit save
  const handleSaveEdit = async () => {
    if (!newLectureTitle.trim()) {
      setUploadError('Please enter a title for the lecture.');
      return;
    }

    if (!videoUrl.trim()) {
      setUploadError('Please enter a video URL.');
      return;
    }

    if (!lectureDuration.trim()) {
      setUploadError('Please enter the lecture duration.');
      return;
    }

    if (selectedBatches.length === 0) {
      setUploadError('Please select at least one batch for this lecture.');
      return;
    }

    try {
      await updateLecture(selectedSubject, editingLecture.id, {
        title: newLectureTitle,
        duration: lectureDuration,
        videoUrl: videoUrl,
        availableInBatches: selectedBatches
      });

      // Close modal and reset form
      setShowEditModal(false);
      setEditingLecture(null);
      setNewLectureTitle('');
      setLectureDuration('');
      setVideoUrl('');
      setSelectedBatches([]);
      setUploadError('');

      showSuccess('Lecture updated successfully!');
    } catch (error) {
      showError('Failed to update lecture. Please try again.');
    }
  };

  // Handle lecture deletion
  const handleDeleteLecture = async (lectureId) => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      try {
        await deleteLecture(selectedSubject, lectureId);
        showSuccess('Lecture deleted successfully!');
      } catch (error) {
        showError('Failed to delete lecture. Please try again.');
      }
    }
  };

  // Handle lecture viewing
  const handleViewLecture = (lecture) => {
    // In a real application, this would open the video player or redirect to the video
    if (lecture.videoUrl) {
      window.open(lecture.videoUrl, '_blank');
    } else {
      alert(`Viewing lecture: ${lecture.title}\nDuration: ${lecture.duration}\n\nIn a real application, this would open the video player.`);
    }
  };

  // Get current subject's lectures
  const currentSubjectLectures = data.lectures[selectedSubject] || [];

  return (
    <div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>Manage Lectures</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowUploadModal(true)}
        >
          <Plus size={20} />
          Add New Lecture
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
              <th>Duration</th>
              <th>Upload Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentSubjectLectures.length > 0 ? (
              currentSubjectLectures.map(lecture => {
                const subjectName = data.subjects.find(s => s.id === selectedSubject)?.name;
                const lectureBatches = lecture.availableInBatches || [];
                const batchDetails = data.batches.filter(batch => lectureBatches.includes(batch.id));
                
                return (
                  <tr key={lecture.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Play size={16} style={{ color: '#ef4444' }} />
                        {lecture.title}
                      </div>
                    </td>
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
                    <td>
                      <span style={{ 
                        background: '#e0f2fe', 
                        color: '#0369a1', 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.8rem', 
                        fontWeight: '500' 
                      }}>
                        {lecture.duration}
                      </span>
                    </td>
                    <td>{lecture.uploadDate}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="btn" 
                          style={{ padding: '6px 10px', background: '#f3f4f6' }}
                          onClick={() => handleViewLecture(lecture)}
                          title="View Lecture"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="btn" 
                          style={{ padding: '6px 10px', background: '#fef3c7' }}
                          onClick={() => handleEditLecture(lecture)}
                          title="Edit Lecture"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn" 
                          style={{ padding: '6px 10px', background: '#fee2e2' }}
                          onClick={() => handleDeleteLecture(lecture.id)}
                          title="Delete Lecture"
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
                  No lectures found for this subject. Click "Add New Lecture" to add some.
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
            <h3 style={{ marginBottom: '20px' }}>Add New Lecture</h3>
            
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label htmlFor="lectureTitle">Lecture Title</label>
              <input
                type="text"
                id="lectureTitle"
                className="form-input"
                placeholder="e.g., Quadrilaterals L1"
                value={newLectureTitle}
                onChange={(e) => setNewLectureTitle(e.target.value)}
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
              title="Choose Target Batches for Lecture"
              required={true}
              showStudentCount={true}
            />

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label htmlFor="duration">Duration</label>
              <input
                type="text"
                id="duration"
                className="form-input"
                placeholder="e.g., 45 min"
                value={lectureDuration}
                onChange={(e) => setLectureDuration(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label htmlFor="videoUrl">Video URL</label>
              <input
                type="url"
                id="videoUrl"
                className="form-input"
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '5px' }}>
                Supports YouTube, Vimeo, or direct video links
              </div>
            </div>

            {uploadError && <p style={{ color: 'red', marginTop: '5px' }}>{uploadError}</p>}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button 
                className="btn"
                onClick={() => {
                  setShowUploadModal(false);
                  setNewLectureTitle('');
                  setLectureDuration('');
                  setVideoUrl('');
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
                Add Lecture
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingLecture && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '20px' }}>Edit Lecture</h3>
            
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label htmlFor="editLectureTitle">Lecture Title</label>
              <input
                type="text"
                id="editLectureTitle"
                className="form-input"
                placeholder="e.g., Quadrilaterals L1"
                value={newLectureTitle}
                onChange={(e) => setNewLectureTitle(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label htmlFor="editDuration">Duration</label>
              <input
                type="text"
                id="editDuration"
                className="form-input"
                placeholder="e.g., 45 min"
                value={lectureDuration}
                onChange={(e) => setLectureDuration(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label htmlFor="editVideoUrl">Video URL</label>
              <input
                type="url"
                id="editVideoUrl"
                className="form-input"
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </div>

            <BatchSelector
              selectedSubject={selectedSubject}
              selectedBatches={selectedBatches}
              onBatchesChange={setSelectedBatches}
              title="Update Target Batches for Lecture"
              required={true}
              showStudentCount={true}
            />

            {uploadError && <p style={{ color: 'red', marginTop: '5px' }}>{uploadError}</p>}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button 
                className="btn"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingLecture(null);
                  setNewLectureTitle('');
                  setLectureDuration('');
                  setVideoUrl('');
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

export default ManageLectures;
