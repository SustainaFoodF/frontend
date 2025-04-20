import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getLivreurNotifications, 
  markNotificationAsRead,
  markAllAsRead 
} from '../../../services/api';
import './NotificationsPanel.css';
import '../styles.css';

const NotificationsPanel = ({ livreurId, onClose }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getLivreurNotifications(livreurId);
        setNotifications(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    if (livreurId) {
      fetchNotifications();
    }
  }, [livreurId]);

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification._id);
        const response = await getLivreurNotifications(livreurId);
        setNotifications(response.data.data || response.data);
      }

      if (notification.relatedTask) {
        navigate(`/livreur/tasks/${notification.relatedTask._id}`);
      }
      
      onClose();
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  const handleClearAll = async () => {
    try {
      await markAllAsRead();
      const response = await getLivreurNotifications(livreurId);
      setNotifications(response.data.data || response.data);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  return (
    <div className="notifications-panel">
      <div className="notifications-header">
        <h3>Notifications</h3>
        <button className="clear-button" onClick={handleClearAll}>
          Mark All as Read
        </button>
      </div>
      <div className="notifications-list">
        {loading ? (
          <div className="loading">Loading notifications...</div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="notification-message">{notification.message}</div>
              <div className="notification-time">
                {new Date(notification.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        ) : (
          <div className="no-notifications">No notifications</div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;