import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NotificationsPanel from './NotificationsPanel';
import '../styles.css';
import './Sidebar.css';

const Sidebar = ({ className }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [livreurId, setLivreurId] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const id = localStorage.getItem('loggedInUserId');
    if (id) {
      setLivreurId(id);
    }
  }, []);

  return (
    <div className={`sidebar ${className || ''}`}>
     
      <nav className="sidebar-menu">
        <Link to="/livreur/tasks" className={`menu-item ${location.pathname === '/livreur/tasks' ? 'active' : ''}`}>
          Tasks
        </Link>
        <div 
          className="menu-item notification-trigger" 
          onClick={() => setShowNotifications(!showNotifications)}
        >
          Notifications
        </div>
      </nav>

      {showNotifications && livreurId && (
        <NotificationsPanel 
          livreurId={livreurId} 
          onClose={() => setShowNotifications(false)}
        />
      )}

    
    </div>
  );
};

export default Sidebar;