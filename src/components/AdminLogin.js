import React, { useState } from 'react';
import { Lock } from 'lucide-react';

const AdminLogin = ({ onLogin }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = onLogin(key);
    if (!success) {
      setError('Invalid admin key. Please try again.');
      setKey('');
    } else {
      setError('');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="modal" style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <Lock size={40} color="white" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '10px' }}>
            Admin Access
          </h2>
          <p style={{ color: '#6b7280' }}>
            Enter the admin key to access the management panel
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Admin Key</label>
            <input
              type="password"
              className="form-input"
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                setError('');
              }}
              placeholder="Enter admin key..."
              autoFocus
            />
            {error && (
              <p style={{ color: '#dc2626', fontSize: '0.9rem', marginTop: '8px' }}>
                {error}
              </p>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            Access Admin Panel
          </button>
        </form>

        <div style={{ 
          marginTop: '30px', 
          textAlign: 'center',
          padding: '20px',
          background: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>
            <strong>Hint:</strong> Admin key is "26127"
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
