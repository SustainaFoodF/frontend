import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getLivreurNotifications, 
  markNotificationAsRead,
  markAllAsRead 
} from '../../../services/api';
import './NotificationsPanel.css';
import '../styles.css';

// Component to display and manage notifications for a delivery person
const NotificationsPanel = ({ livreurId, onClose }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications when livreurId changes
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await getLivreurNotifications(livreurId);
        setNotifications(response.data.data || response.data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    if (livreurId) fetchNotifications();
  }, [livreurId]);

  // Handle clicking a notification: mark as read and navigate to task
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
    } catch (error) {
      console.error("Failed to handle notification click:", error);
    } finally {
      onClose();
    }
  };

  // Mark all notifications as read and refresh the list
  const handleClearAll = async () => {
    try {
      await markAllAsRead();
      const response = await getLivreurNotifications(livreurId);
      setNotifications(response.data.data || response.data);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
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
          <div className="loading">Loading...</div>
        ) : notifications.length > 0 ? (
          notifications.slice(0, 5).map((notification) => ( // Limit to 5 notifications
            <div
              key={notification._id}
              className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="notification-content">
                <div className="notification-message">{notification.message}</div>
                <div className="notification-time">
                  {new Date(notification.createdAt).toLocaleString()}
                </div>
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