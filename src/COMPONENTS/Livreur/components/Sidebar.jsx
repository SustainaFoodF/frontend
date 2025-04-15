import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NotificationsPanel from './NotificationsPanel';
import '../styles.css';

// Sample notifications for the component
const sampleNotifications = [
  {
    id: "1",
    message: "New task assigned: Pickup at Supermarket X",
    timestamp: "10 minutes ago",
    taskId: "123",
  },
  {
    id: "2",
    message: "Task #124 status updated to In Progress",
    timestamp: "1 hour ago",
    taskId: "124",
  },
  {
    id: "3",
    message: "Task #125 has been completed",
    timestamp: "Yesterday",
    taskId: "125",
  },
];

const Sidebar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  
  const handleClearNotifications = () => {
    // In a real app, this would make an API call to clear notifications
    console.log("Clearing all notifications");
    setShowNotifications(false);
  };

  return (
    <div className="sidebar">
      <div className="logo">SustainaFood</div>
      <nav className="sidebar-menu">
        <Link to="/livreur/tasks" className={`menu-item ${location.pathname === '/livreur/tasks' ? 'active' : ''}`}>
          Tasks
        </Link>
        <div className="menu-item notification-trigger" onClick={() => setShowNotifications(!showNotifications)}>
          Notifications
          {showNotifications && (
            <NotificationsPanel 
              notifications={sampleNotifications} 
              onClearAll={handleClearNotifications} 
            />
          )}
        </div>
        <Link to="/livreur" className={`menu-item ${location.pathname === '/livreur' ? 'active' : ''}`}>
            Tasks
          </Link>
      </nav>
    </div>
  );
};

export default Sidebar;