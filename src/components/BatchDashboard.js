import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useData } from '../context/DataContext';

const BatchDashboard = () => {
  const { data } = useData();
  const { batchId } = useParams();
  const navigate = useNavigate();
  const batch = data.batches.find(b => b.id === parseInt(batchId));

  if (!batch) {
    return <div>Batch not found</div>;
  }

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
            <h1>EduVerse 2.0</h1>
            <p className="subtitle">Class {batch.class}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        <div style={{ margin: '30px 0' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '10px' }}>
            {batch.name}
          </h2>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
            Choose a subject to continue your learning journey
          </p>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-2">
          {data.subjects
            .filter(subject => batch.subjects && batch.subjects.includes(subject.id))
            .map(subject => {
              const lectureCount = data.lectures[subject.id]?.length || 0;
              const notesCount = data.notes[subject.id]?.length || 0;
              const dppsCount = data.dpps[subject.id]?.length || 0;
              
              return (
                <Link
                  key={subject.id}
                  to={`/batch/${batchId}/subject/${subject.id}`}
                  className={`subject-card ${subject.class}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="subject-icon">
                    {subject.icon}
                  </div>
                  <h3 style={{ 
                    fontSize: '1.3rem', 
                    fontWeight: '600', 
                    marginBottom: '8px',
                    color: '#1f2937'
                  }}>
                    {subject.name}
                  </h3>
                  <p style={{ 
                    color: '#6b7280', 
                    fontSize: '0.9rem',
                    margin: '0'
                  }}>
                    {lectureCount} Lectures • {notesCount} Notes • {dppsCount} DPPs
                  </p>
                </Link>
              );
            })
          }
          {(!batch.subjects || batch.subjects.length === 0) && (
            <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
              <p style={{ color: '#6b7280', margin: 0 }}>No subjects available in this batch yet.</p>
            </div>
          )}
        </div>

        {/* Live Classes Section */}
        <div style={{ marginTop: '50px' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                🎥
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '5px' }}>
                  Live Classes
                </h3>
                <p style={{ color: '#6b7280', margin: '0' }}>
                  Join interactive live sessions with expert teachers
                </p>
              </div>
            </div>
            
            <div style={{ 
              background: '#f8fafc', 
              padding: '20px', 
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <p style={{ color: '#6b7280', margin: '0 0 15px 0' }}>
                Next live class starts in
              </p>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: '700', 
                color: '#1f2937',
                marginBottom: '15px'
              }}>
                2h 45m
              </div>
              <button className="btn btn-primary">
                Join Live Class
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BatchDashboard;
