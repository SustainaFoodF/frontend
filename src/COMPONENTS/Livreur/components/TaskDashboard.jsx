import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TaskCard from './TaskCard';
import '../styles.css';

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch tasks from an API
    // Example: axios.get('/api/tasks/livreur/123')
    const fetchTasks = async () => {
      try {
        // Simulating API call with sample data
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
        
        setTasks(sampleTasks);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Filter tasks based on selected filter
  const filteredTasks = filter === "All" 
    ? tasks 
    : tasks.filter((task) => task.status === filter);

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="dashboard-header">
          <h1>Your Delivery Tasks</h1>
          <div className="filter-container">
            <select 
              className="filter-dropdown" 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Picked Up">Picked Up</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="task-list">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <p>No tasks match the selected filter.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default TaskDashboard;