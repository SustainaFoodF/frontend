import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';
import './TaskCard.css';

const TaskCard = ({ task }) => {
  const pickup = task.pickup || {};
  const dropoff = task.dropoff || {};
  const details = task.details || {};
  const orderItems = details.orderItems || [];

  const formatStatus = (status) => {
    return (status || '').toLowerCase().replace(" ", "-");
  };

  return (
    <div className="task-card">
      <div className="task-info">
        <div className="task-location">
          <div className="location-group">
            <span className="location-label">Pickup:</span>
            <span className="location-value">
              {pickup.businessName || 'N/A'} - {pickup.address || 'No address'}
            </span>
          </div>
          <div className="location-group">
            <span className="location-label">Drop-off:</span>
            <span className="location-value">
              {dropoff.clientName || 'N/A'} - {dropoff.address || 'No address'}
            </span>
          </div>
        </div>

        <div className="task-details">
          <span className="details-label">Food Details:</span>
          <span className="details-value">
            {orderItems.length > 0 ? (
              <span>
                {orderItems[0].name} 
                {orderItems.length > 1 ? ` +${orderItems.length - 1} more` : ''}
              </span>
            ) : (
              'No items'
            )}
          </span>
        </div>

        <div className={`task-status status-${formatStatus(task.status)}`}>
          <span className="status-label">Status:</span>
          <span className="status-value">{task.status || 'Pending'}</span>
        </div>
      </div>

      <div className="task-actions">
        <Link to={`/livreur/tasks/${task._id}`} className="view-button">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default TaskCard;