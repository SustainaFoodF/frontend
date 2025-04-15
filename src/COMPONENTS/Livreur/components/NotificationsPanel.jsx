import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const NotificationsPanel = ({ notifications, onClearAll }) => {
  const navigate = useNavigate();

  return (
    <div className="notifications-panel">
      <div className="notifications-header">
        <h3>Notifications</h3>
        <button className="clear-button" onClick={onClearAll}>Clear All</button>
      </div>
      <div className="notifications-list">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="notification-item"
            onClick={() => navigate(`/livreur/tasks/${notification.taskId}`)}
          >
            <div className="notification-message">{notification.message}</div>
            <div className="notification-time">{notification.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPanel;