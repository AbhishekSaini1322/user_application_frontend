import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  const userDataStr = localStorage.getItem('userData');
  const userData = userDataStr && userDataStr !== 'undefined' ? JSON.parse(userDataStr) : {};

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
      
      <div className="dashboard-content">
                <div className="welcome-section">
          <h2>Welcome to Your Dashboard</h2>
          <p>Username: {userData.username || 'N/A'}</p>
        </div>
        
        <div className="dashboard-cards">
          {/* <div className="card">
            <h3>Profile</h3>
            <p>Manage your profile information</p>
            <button onClick={() => navigate('/profile')}>View Profile</button>
          </div> */}
          
          <div className="card">
            <h3>Items</h3>
            <p>Manage your items</p>
            <button onClick={() => navigate('/items')}>Manage Items</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 