import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useData } from '../context/DataContext';
import VideoPlayer from './VideoPlayer';

const SubjectDashboard = () => {
  const { data } = useData();
  const { batchId, subjectId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Lectures');
  const [videoPlayer, setVideoPlayer] = useState({ isOpen: false, videoUrl: '', title: '' });
  
  const batch = data.batches.find(b => b.id === parseInt(batchId));
  const subject = data.subjects.find(s => s.id === parseInt(subjectId));

  if (!subject || !batch) {
    return <div>Subject or batch not found</div>;
  }

  // Check if this subject is available in the current batch
  const isSubjectInBatch = batch.subjects && batch.subjects.includes(subject.id);
  
  if (!isSubjectInBatch) {
    return (
      <div className="container" style={{ padding: '50px 20px', textAlign: 'center' }}>
        <h2>Subject Not Available</h2>
        <p>This subject is not available in the current batch.</p>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  const lectures = data.lectures[subject.id] || [];
  const notes = data.notes[subject.id] || [];
  const dpps = data.dpps[subject.id] || [];

  const handleWatchLecture = (lecture) => {
    if (lecture.videoUrl) {
      setVideoPlayer({
        isOpen: true,
        videoUrl: lecture.videoUrl,
        title: lecture.title
      });
    } else {
      alert('Video not available for this lecture.');
    }
  };

  const handleCloseVideo = () => {
    setVideoPlayer({ isOpen: false, videoUrl: '', title: '' });
  };

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{ 
              background: 'rgba(255,255,255,0.2)', 
              border: 'none', 
              padding: '8px', 
              borderRadius: '8px', 
              cursor: 'pointer',
              color: 'white'
            }}
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1>{subject.name} - Class {batchId}</h1>
            <p className="subtitle">Explore Lectures, Notes and DPPs</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        {/* Tabs */}
        <div className="tabs">
          {['Lectures', 'Notes', 'DPPs'].map(tab => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'Lectures' && (
          <div className="lecture-list">
            {lectures.map(lec => (
              <div key={lec.id} className="lecture-item">
                <span className="lecture-tag">{lec.subject}</span>
                <div>
                  <h4 style={{ marginBottom: '5px' }}>{lec.title}</h4>
                  <p style={{ color: '#6b7280', margin: 0 }}>Duration: {lec.duration}</p>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <button 
                    className="btn btn-success"
                    onClick={() => handleWatchLecture(lec)}
                  >
                    Watch
                  </button>
                </div>
              </div>
            ))}
            {lectures.length === 0 && (
              <div className="card">
                <p>No lectures available yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Notes' && (
          <div className="lecture-list">
            {notes.map(note => (
              <div key={note.id} className="lecture-item">
                <span className="lecture-tag">NOTES</span>
                <div>
                  <h4 style={{ marginBottom: '5px' }}>{note.title}</h4>
                  <p style={{ color: '#6b7280', margin: 0 }}>Type: {note.type}</p>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <button className="btn btn-primary">Download</button>
                </div>
              </div>
            ))}
            {notes.length === 0 && (
              <div className="card">
                <p>No notes available yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'DPPs' && (
          <div className="lecture-list">
            {dpps.map(set => (
              <div key={set.id} className="lecture-item">
                <span className="lecture-tag">DPP</span>
                <div>
                  <h4 style={{ marginBottom: '5px' }}>{set.title}</h4>
                  <p style={{ color: '#6b7280', margin: 0 }}>Questions: {set.questions}</p>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
                  <button className="btn btn-success">Solve Quiz</button>
                  <button className="btn btn-primary">Download PDF</button>
                </div>
              </div>
            ))}
            {dpps.length === 0 && (
              <div className="card">
                <p>No DPPs available yet.</p>
              </div>
            )}
          </div>
        )}
      </main>
      
      {/* Video Player Modal */}
      <VideoPlayer 
        isOpen={videoPlayer.isOpen}
        onClose={handleCloseVideo}
        videoUrl={videoPlayer.videoUrl}
        title={videoPlayer.title}
      />
    </div>
  );
};

export default SubjectDashboard;

