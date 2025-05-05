import React, { useState, useEffect } from 'react';
import './Livraison.css';
import { getLivreurTasks, updateTaskStatus } from '../../services/api';

const LivraisonHistory = () => {
  const [stats, setStats] = useState({
    name: 'Loading...',
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    pickedUp: 0,
    averageDeliveryTime: 0,
    totalDistance: 0
  });
  
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    date: '',
    status: 'all'
  });

  // Get delivery person info from localStorage
  const deliveryPersonId = localStorage.getItem('loggedInUserId');
  const name = localStorage.getItem('loggedInUser');

  useEffect(() => {
    const fetchDeliveries = async () => {
      if (!deliveryPersonId) return;
      
      try {
        setLoading(true);
        const response = await getLivreurTasks(deliveryPersonId);
        const tasks = response.data.data || response.data;
        
        // Format deliveries for display
        const formattedDeliveries = tasks.map(task => {
          // Get the latest status update timestamp
          const latestStatus = task.statusHistory && task.statusHistory.length > 0 
            ? task.statusHistory[task.statusHistory.length - 1] 
            : null;
          
          // Find completion time from status history
          const completionStatus = task.statusHistory?.find(status => status.status === 'Completed');
          const pickupStatus = task.statusHistory?.find(status => status.status === 'Picked Up');
          
          return {
            id: task._id,
            orderNumber: task._id.toString().slice(-6).toUpperCase(),
            address: task.dropoff?.address || 'Address not available',
            businessName: task.pickup?.businessName || 'Unknown Business',
            clientName: task.dropoff?.clientName || 'Unknown Client',
            scheduledDate: formatDate(task.estimatedDeliveryTime),
            scheduledTime: formatTime(task.estimatedDeliveryTime),
            fullDateTime: task.estimatedDeliveryTime,
            status: task.status || 'Pending',
            statusLower: (task.status || 'Pending').toLowerCase().replace(' ', '_'),
            items: task.details?.orderItems || [],
            price: task.details?.totalValue || 0,
            distance: task.distance || 0,
            completedAt: completionStatus?.timestamp || null,
            pickedUpAt: pickupStatus?.timestamp || null,
            lastUpdated: latestStatus?.timestamp || task.updatedAt,
            paymentMethod: task.details?.paymentMethod || 'N/A',
            specialInstructions: task.details?.specialInstructions || '',
            deliveryInstructions: task.dropoff?.deliveryInstructions || ''
          };
        });
        
        setDeliveries(formattedDeliveries);
        
        // Update stats
        const completed = tasks.filter(t => t.status === 'Completed').length;
        const pending = tasks.filter(t => t.status === 'Pending').length;
        const inProgress = tasks.filter(t => t.status === 'In Progress').length;
        const pickedUp = tasks.filter(t => t.status === 'Picked Up').length;
        
        // Calculate average delivery time for completed deliveries with full status history
        let totalDeliveryTime = 0;
        let completedWithTime = 0;
        let totalDistance = 0;
        
        tasks.forEach(task => {
          // Add distance to total
          if (task.distance) {
            totalDistance += task.distance;
          }
          
          if (task.status === 'Completed' && task.statusHistory) {
            const pickupStatus = task.statusHistory.find(s => s.status === 'Picked Up');
            const completedStatus = task.statusHistory.find(s => s.status === 'Completed');
            
            if (pickupStatus && completedStatus) {
              const startTime = new Date(pickupStatus.timestamp);
              const endTime = new Date(completedStatus.timestamp);
              const deliveryTime = (endTime - startTime) / (1000 * 60); // in minutes
              
              if (deliveryTime > 0) {
                totalDeliveryTime += deliveryTime;
                completedWithTime++;
              }
            }
          }
        });
        
        const averageDeliveryTime = completedWithTime > 0 
          ? Math.round(totalDeliveryTime / completedWithTime) 
          : 0;
        
        setStats({
          name: name || 'Delivery Person',
          total: tasks.length,
          completed,
          pending,
          inProgress,
          pickedUp,
          averageDeliveryTime,
          totalDistance: parseFloat(totalDistance.toFixed(1))
        });
        
      } catch (err) {
        console.error("Error fetching delivery history:", err);
        setError("Couldn't load your delivery history. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDeliveries();
  }, [deliveryPersonId, name]);

  // Format date for display (YYYY-MM-DD)
  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return '';
    
    try {
      const date = new Date(dateTimeString);
      return date.toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  };
  
  // Format time for display (HH:MM)
  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return 'Not scheduled';
    
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Handle status update
  const handleStatusUpdate = async (deliveryId, newStatus) => {
    try {
      await updateTaskStatus(deliveryId, newStatus);
      
      // Update local state
      setDeliveries(prev => {
        const updated = prev.map(delivery => {
          if (delivery.id === deliveryId) {
            return { 
              ...delivery, 
              status: newStatus,
              statusLower: newStatus.toLowerCase().replace(' ', '_'),
              lastUpdated: new Date()
            };
          }
          return delivery;
        });
        return updated;
      });
      
      // Recalculate stats
      const statusCounts = {
        completed: 0,
        pending: 0,
        in_progress: 0,
        picked_up: 0
      };
      
      deliveries.forEach(delivery => {
        const statusKey = delivery.status.toLowerCase().replace(' ', '_');
        if (statusCounts.hasOwnProperty(statusKey)) {
          statusCounts[statusKey]++;
        }
      });
      
      setStats(prev => ({
        ...prev,
        completed: statusCounts.completed,
        pending: statusCounts.pending,
        inProgress: statusCounts.in_progress,
        pickedUp: statusCounts.picked_up
      }));
      
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Couldn't update the delivery status. Please try again.");
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Apply filters
  const filteredDeliveries = deliveries.filter(delivery => {
    // Status filter
    if (filters.status !== 'all' && 
        delivery.statusLower !== filters.status) {
      return false;
    }
    
    // Date filter - match against scheduled date
    if (filters.date && delivery.scheduledDate) {
      return delivery.scheduledDate === filters.date;
    }
    
    return true;
  });

  // Format status for display
  const formatStatus = (status) => {
    const statusMap = {
      pending: 'Pending',
      in_progress: 'In Progress',
      picked_up: 'Picked Up',
      completed: 'Completed'
    };
    
    return statusMap[status.toLowerCase().replace(' ', '_')] || status;
  };

  if (loading) {
    return <div className="loading-spinner">Loading delivery history...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Calculate total earnings from completed deliveries
  const totalEarnings = deliveries
    .filter(delivery => delivery.status === 'Completed')
    .reduce((sum, delivery) => sum + delivery.price, 0)
    .toFixed(2);

  return (
    <div className="livraison-container">
      {/* History Header */}
      <div className="dashboard-header">
        <h1>Delivery History & Statistics</h1>
      </div>
      
      {/* Enhanced Stats Section */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Delivery Agent</span>
          <span className="stat-value">{stats.name}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Deliveries</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Completed</span>
          <span className="stat-value">{stats.completed}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">In Progress</span>
          <span className="stat-value">{stats.inProgress}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Picked Up</span>
          <span className="stat-value">{stats.pickedUp}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pending</span>
          <span className="stat-value">{stats.pending}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Earnings</span>
          <span className="stat-value">${totalEarnings}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Avg. Delivery Time</span>
          <span className="stat-value">{stats.averageDeliveryTime} min</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Distance</span>
          <span className="stat-value">{stats.totalDistance} km</span>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="filter-group">
          <label className="filter-label">Delivery Date</label>
          <input 
            type="date" 
            className="filter-input" 
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
          />
        </div>
        <div className="filter-group">
          <label className="filter-label">Status</label>
          <select 
            className="filter-input"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="picked_up">Picked Up</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="deliveries-table">
        <div className="table-header">
          <h2>Delivery History</h2>
        </div>
        
        <div className="table-responsive">
          {filteredDeliveries.length === 0 ? (
            <div className="empty-state">
              No deliveries match your filters
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Pickup From</th>
                  <th>Deliver To</th>
                  <th>Scheduled</th>
                  <th>Status</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.map((delivery) => (
                  <tr key={delivery.id}>
                    <td>{delivery.orderNumber}</td>
                    <td>{delivery.businessName}</td>
                    <td>{delivery.clientName}<br/>
                        <small className="address-text">{delivery.address}</small>
                    </td>
                    <td>{delivery.scheduledTime}</td>
                    <td>
                      <span className={`status-badge ${delivery.statusLower}`}>
                        {delivery.status}
                      </span>
                    </td>
                    <td>
                      <ul className="order-items">
                        {delivery.items.slice(0, 2).map((item, i) => (
                          <li key={i}>
                            {item.name} (x{item.quantity})
                            {item.notes && <small className="item-notes"> - {item.notes}</small>}
                          </li>
                        ))}
                        {delivery.items.length > 2 && (
                          <li>+{delivery.items.length - 2} more</li>
                        )}
                      </ul>
                    </td>
                    <td>${delivery.price.toFixed(2)}</td>
                    <td>
                      {delivery.status === 'Pending' && (
                        <button 
                          onClick={() => handleStatusUpdate(delivery.id, 'In Progress')}
                          className="action-button"
                        >
                          Start
                        </button>
                      )}
                      {delivery.status === 'In Progress' && (
                        <button 
                          onClick={() => handleStatusUpdate(delivery.id, 'Picked Up')}
                          className="action-button"
                        >
                          Picked Up
                        </button>
                      )}
                      {delivery.status === 'Picked Up' && (
                        <button 
                          onClick={() => handleStatusUpdate(delivery.id, 'Completed')}
                          className="action-button"
                        >
                          Complete
                        </button>
                      )}
                      {delivery.status === 'Completed' && (
                        <span>Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default LivraisonHistory;