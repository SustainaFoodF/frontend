import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import IssueReportingModal from './IssueReportingModal';
import '../styles.css';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    // In a real app, fetch task details from API
    // Example: axios.get(`/api/tasks/${id}`)
    const fetchTaskDetails = async () => {
      try {
        // Sample data to simulate API response
        const sampleTasks = [
          {
            id: "123",
            pickupLocation: "Supermarket X, 123 Main St",
            dropoffLocation: "Shelter Y, 456 Oak Ave",
            foodDetails: "10 lbs bread, expires 04/11/25",
            status: "Pending",
          },
          {
            id: "124",
            pickupLocation: "Restaurant Z, 789 Pine St",
            dropoffLocation: "Food Bank A, 101 Elm St",
            foodDetails: "5 lbs vegetables, expires 04/12/25",
            status: "In Progress",
          },
          {
            id: "125",
            pickupLocation: "Bakery B, 202 Maple Ave",
            dropoffLocation: "Community Center C, 303 Cedar Rd",
            foodDetails: "8 lbs pastries, expires 04/10/25",
            status: "Completed",
          },
        ];
        
        const foundTask = sampleTasks.find(task => task.id === id);
        setTask(foundTask);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching task details:", error);
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [id]);

  const handleStatusUpdate = (newStatus) => {
    // In a real app, make API call to update status
    // Example: axios.put(`/api/tasks/${id}/status`, { status: newStatus })
    console.log(`Updating task ${id} status to ${newStatus}`);
    setTask({ ...task, status: newStatus });
  };

  if (loading) {
    return <div className="loading">Loading task details...</div>;
  }

  if (!task) {
    return (
      <div className="layout">
        <Sidebar />
        <main className="main-content">
          <div className="error-message">Task not found</div>
          <button onClick={() => navigate('/')} className="view-button">
            Back to Tasks
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">

        <div className="breadcrumb">
<span onClick={() => navigate('/livreur')}>Tasks</span>
        </div>

        <div className="task-summary">
          <h1>Task Details</h1>
          <div className="summary-info">
            <div>
              <strong>Pickup:</strong> {task.pickupLocation}
            </div>
            <div>
              <strong>Drop-off:</strong> {task.dropoffLocation}
            </div>
          </div>
        </div>

        <div className="map-container">
          <div className="map-placeholder">
            {/* In a real app, this would be a Google Maps component */}
            <div className="map-text">
              Map showing route from {task.pickupLocation} to {task.dropoffLocation}
            </div>
          </div>
        </div>

        <div className="food-details">
          <h2>Food Details</h2>
          <p>{task.foodDetails}</p>
        </div>

        <div className="action-buttons">
          {task.status === "Pending" && (
            <button 
              className="action-button accept-button" 
              onClick={() => handleStatusUpdate("In Progress")}
            >
              Accept Task
            </button>
          )}

          {task.status === "In Progress" && (
            <button 
              className="action-button pickup-button" 
              onClick={() => handleStatusUpdate("Picked Up")}
            >
              Mark Picked Up
            </button>
          )}

          {task.status === "Picked Up" && (
            <button 
              className="action-button deliver-button" 
              onClick={() => handleStatusUpdate("Completed")}
            >
              Mark Delivered
            </button>
          )}

          <button 
            className="action-button report-button" 
            onClick={() => setShowReportModal(true)}
          >
            Report Issue
          </button>
        </div>

        {showReportModal && (
          <IssueReportingModal 
            taskId={id} 
            onClose={() => setShowReportModal(false)} 
          />
        )}
      </main>
    </div>
  );
};

export default TaskDetail;