import React from 'react';
import { Wifi, WifiOff, Cloud, CloudOff, RefreshCw, CheckCircle } from 'lucide-react';
import { useData } from '../context/DataContext';

const SyncStatus = () => {
  const { isLoading, isOnline, lastSyncTime } = useData();

  if (isLoading) {
    return (
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: '#3b82f6',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}>
        <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '0.9rem' }}>Loading...</span>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: isOnline ? '#10b981' : '#f59e0b',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      fontSize: '0.8rem'
    }}>
      {isOnline ? (
        <>
          <Cloud size={14} />
          <span>Online</span>
          {lastSyncTime && (
            <CheckCircle size={12} style={{ opacity: 0.8 }} />
          )}
        </>
      ) : (
        <>
          <CloudOff size={14} />
          <span>Offline</span>
        </>
      )}
      
      {lastSyncTime && (
        <div style={{
          fontSize: '0.7rem',
          opacity: 0.9,
          marginLeft: '4px'
        }}>
          {new Date(lastSyncTime).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

// Add the spin animation to your CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

export default SyncStatus;
