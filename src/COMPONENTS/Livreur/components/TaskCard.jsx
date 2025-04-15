import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

const TaskCard = ({ task }) => {
  return (
    <div className="task-card">
      <div className="task-info">
        <div>
          <strong>Pickup:</strong> {task.pickupLocation}
        </div>
        <div>
          <strong>Drop-off:</strong> {task.dropoffLocation}
        </div>
        <div>
          <strong>Food Details:</strong> {task.foodDetails}
        </div>
        <div className={`task-status status-${task.status.toLowerCase().replace(" ", "-")}`}>
          <strong>Status:</strong> {task.status}
        </div>
      </div>
      <div className="task-actions">
      <Link to={`/livreur/tasks/${task.id}`} className="view-button">
          View
        </Link>
      </div>
    </div>
  );
};

export default TaskCard;