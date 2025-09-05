import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import BatchDashboard from './components/BatchDashboard';
import SubjectDashboard from './components/SubjectDashboard';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import { DataProvider } from './context/DataContext';
import './index.css';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);

  const handleAdminLogin = (key) => {
    if (key === "26127") {
      setAdminAuthenticated(true);
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setAdminAuthenticated(false);
  };

  return (
    <DataProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/batch/:batchId" element={<BatchDashboard />} />
            <Route path="/batch/:batchId/subject/:subjectId" element={<SubjectDashboard />} />
            <Route 
              path="/admin-login" 
              element={
                adminAuthenticated ? 
                  <Navigate to="/admin" replace /> : 
                  <AdminLogin onLogin={handleAdminLogin} />
              } 
            />
            <Route 
              path="/admin/*" 
              element={
                adminAuthenticated ? 
                  <AdminPanel onLogout={handleAdminLogout} /> : 
                  <Navigate to="/admin-login" replace />
              } 
            />
          </Routes>
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
