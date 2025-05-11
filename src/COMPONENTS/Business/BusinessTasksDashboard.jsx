import React, { useState, useEffect } from 'react';

import { getBusinessTasks } from '../../services/api';
import BusinessTaskCard from './BusinessTaskCard';

const BusinessTaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [BusinessId, setBusinessId] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('loggedInUserId');
    if (id) {
      setBusinessId(id);
    }
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!BusinessId) return;
      
      try {
        setLoading(true);
        const response = await getBusinessTasks(BusinessId);
        setTasks(response.data.data || response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [BusinessId]);

  const filteredTasks = filter === "All" 
    ? tasks 
    : tasks.filter(task => task.status === filter);

  return (
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

      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : filteredTasks.length > 0 ? (
        <div className="task-list">
          {filteredTasks.map((task) => (
            <BusinessTaskCard key={task._id} task={task} />
          ))}
        </div>
      ) : (
        <p>No tasks match the selected filter.</p>
      )}
    </main>
  );
};

export default BusinessTaskDashboard;