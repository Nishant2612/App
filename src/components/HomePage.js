import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const HomePage = () => {
  const { data } = useData();
  const [activeTab, setActiveTab] = useState('All');
  const [adminKey, setAdminKey] = useState('');
  const [showAdminInput, setShowAdminInput] = useState(false);
  const navigate = useNavigate();

  const filteredBatches = activeTab === 'All' 
    ? data.batches 
    : data.batches.filter(batch => `Class ${batch.class}` === activeTab);

  const handleAdminKeySubmit = (e) => {
    e.preventDefault();
    if (adminKey === '26127') {
      navigate('/admin-login');
    } else {
      alert('Invalid admin key!');
    }
    setAdminKey('');
    setShowAdminInput(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      setShowAdminInput(true);
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1>EduVerse 2.0</h1>
          <p className="subtitle">
            You have successfully verified your access. Please select your batch to continue.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        {/* Admin Key Input */}
        {showAdminInput && (
          <div className="modal-overlay" onClick={() => setShowAdminInput(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h3 style={{ marginBottom: '20px' }}>Admin Access</h3>
              <form onSubmit={handleAdminKeySubmit}>
                <div className="form-group">
                  <label className="form-label">Enter Admin Key:</label>
                  <input
                    type="password"
                    className="form-input"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    placeholder="Enter admin key..."
                    autoFocus
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={() => setShowAdminInput(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Access Admin
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="tabs">
          {['All', 'Class 9', 'Class 10', 'Class 11'].map(tab => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Batch Cards */}
        <div className="grid">
          {filteredBatches.map(batch => (
            <div key={batch.id} className="card batch-card">
              <h3>{batch.name}</h3>
              
              <div className="teacher-images">
                {batch.teachers.map((teacher, index) => (
                  <div key={index} className="teacher-img">
                    {teacher}
                  </div>
                ))}
              </div>

              <div className="pricing">
                <span className="original">₹{batch.originalPrice}/-</span> 
                <span style={{ margin: '0 10px' }}>~₹{batch.discountPrice}/-~</span>
                <span className="free">FREE</span>
                <div style={{ fontSize: '0.9rem', opacity: '0.8', marginTop: '5px' }}>
                  (₹{batch.originalPrice} Value)
                </div>
              </div>

              <Link 
                to={`/batch/${batch.id}`} 
                className="btn btn-primary"
                style={{ 
                  backgroundColor: 'white', 
                  color: '#ee5a24',
                  width: '100%',
                  marginTop: '15px',
                  fontWeight: '700'
                }}
              >
                Enroll Now
              </Link>
            </div>
          ))}
        </div>

        {/* Admin Access Hint */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '50px', 
          padding: '20px',
          background: '#f8fafc',
          borderRadius: '12px',
          border: '1px dashed #d1d5db'
        }}>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            Press Ctrl+Enter to access admin panel
          </p>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
