import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaClock, FaPhone, FaInfoCircle, FaBox, FaMoneyBillWave, FaExchangeAlt } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import IssueReportingModal from './IssueReportingModal';
import '../styles.css';
import './TaskDetail.css';

// Fix for default Leaflet marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/livreur/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setTask(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching task details:", err);
        setError(err.response?.data?.message || "Failed to load task details");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [id]);

  // Geocode addresses to coordinates
  useEffect(() => {
    const geocodeAddress = async (address, setCoords) => {
      if (!address) return;
      try {
        // Using OpenStreetMap Nominatim for geocoding (replace with your preferred geocoding API)
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
          params: {
            q: address,
            format: 'json',
            limit: 1
          }
        });
        if (response.data.length > 0) {
          const { lat, lon } = response.data[0];
          setCoords([parseFloat(lat), parseFloat(lon)]);
        }
      } catch (err) {
        console.error("Error geocoding address:", err);
      }
    };

    if (task?.data?.pickup?.address) {
      geocodeAddress(task.data.pickup.address, setPickupCoords);
    }
    if (task?.data?.dropoff?.address) {
      geocodeAddress(task.data.dropoff.address, setDropoffCoords);
    }
  }, [task]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/livreur/tasks/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTask({
        ...task,
        data: {
          ...task.data,
          status: newStatus
        }
      });
    } catch (err) {
      console.error("Error updating task status:", err);
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) {
    return (
      <main className="main-content">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading task details...</p>
        </div>
      </main>
    );
  }

  if (error || !task) {
    return (
      <main className="main-content">
        <div className="error-message">
          <FaInfoCircle className="error-icon" />
          <h3>{error || "Task not found"}</h3>
          <button onClick={() => navigate('/livreur/tasks')} className="view-button">
            Back to Tasks
          </button>
        </div>
      </main>
    );
  }

  const pickup = task.data.pickup || {};
  const dropoff = task.data.dropoff || {};
  const details = task.data.details || {};
  const orderItems = details.orderItems || [];

  const statusColorMap = {
    'pending': '#f97316',
    'in-progress': '#3b82f6',
    'picked-up': '#8b5cf6',
    'completed': '#10b981',
    'default': '#6b7280'
  };

  return (
    <main className="main-content">
      <div className="breadcrumb">
        <span onClick={() => navigate('/livreur/tasks')}>Tasks</span>  
        <span> Task #{task._id?.slice(-6) || id}</span>
      </div>

      <div className="task-header">
        <h1>Task Details</h1>
        <div className="status-badge" style={{ backgroundColor: statusColorMap[task.data.status.toLowerCase().replace(' ', '-')] }}>
          {task.data.status}
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Delivery Details
        </button>
        <button 
          className={`tab-button ${activeTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveTab('items')}
        >
          Order Items ({orderItems.length})
        </button>
      </div>

      {activeTab === 'details' ? (
        <div className="task-details-container">
          <div className="detail-section">
            <h2><FaExchangeAlt className="section-icon" /> Pickup & Delivery</h2>
            <div className="location-card">
              <div className="location-header">
                <FaMapMarkerAlt className="location-icon pickup" />
                <h3>Pickup Location</h3>
              </div>
              <p className="business-name">{pickup.businessName || 'N/A'}</p>
              <p className="address">{pickup.address || 'No address specified'}</p>
              <div className="contact-info">
                <FaClock className="info-icon" />
                <span>Pickup Time: {new Date(pickup.pickupTime).toLocaleString()}</span>
              </div>
              <div className="contact-info">
                <FaPhone className="info-icon" />
                <span>{pickup.contactPerson || 'N/A'}: {pickup.contactPhone || 'No phone'}</span>
              </div>
            </div>

            <div className="location-card">
              <div className="location-header">
                <FaMapMarkerAlt className="location-icon dropoff" />
                <h3>Delivery Location</h3>
              </div>
              <p className="client-name">{dropoff.clientName || 'N/A'}</p>
              <p className="address">{dropoff.address || 'No address specified'}</p>
              {dropoff.deliveryInstructions && (
                <div className="instructions">
                  <FaInfoCircle className="info-icon" />
                  <span>{dropoff.deliveryInstructions}</span>
                </div>
              )}
              <div className="contact-info">
                <FaPhone className="info-icon" />
                <span>Contact: {dropoff.contactPhone || 'No phone'}</span>
              </div>
            </div>
          </div>

          <div className="map-container">
            {pickupCoords && dropoffCoords ? (
              <MapContainer
                center={pickupCoords}
                zoom={13}
                style={{ height: '400px', width: '100%' }}
                className="rounded-lg shadow-md"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={pickupCoords}>
                  <Popup>Pickup: {pickup.address}</Popup>
                </Marker>
                <Marker position={dropoffCoords}>
                  <Popup>Dropoff: {dropoff.address}</Popup>
                </Marker>
                <Polyline positions={[pickupCoords, dropoffCoords]} color="blue" />
              </MapContainer>
            ) : (
              <div className="map-placeholder">
                <div className="map-text">
                  {pickupCoords || dropoffCoords
                    ? 'Loading map...'
                    : 'Unable to load map: Invalid address'}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="order-items-container">
          <h2><FaBox className="section-icon" /> Order Items</h2>
          {orderItems.length > 0 ? (
            <div className="items-grid">
              {orderItems.map((item, index) => (
                <div key={index} className="item-card">
                  <h3>{item.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                  {item.notes && <p className="notes">Notes: {item.notes}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-items">No items listed for this order</p>
          )}

          <div className="payment-summary">
            <h3><FaMoneyBillWave className="section-icon" /> Payment Summary</h3>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${details.totalValue?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="summary-row">
              <span>Payment Method:</span>
              <span>{details.paymentMethod || 'N/A'}</span>
            </div>
            {details.specialInstructions && (
              <div className="special-instructions">
                <FaInfoCircle className="info-icon" />
                <span>{details.specialInstructions}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="action-buttons">
        {task.data.status === "Pending" && (
          <button 
            className="action-button accept-button" 
            onClick={() => handleStatusUpdate("In Progress")}
          >
            Accept Task
          </button>
        )}

        {task.data.status === "In Progress" && (
          <button 
            className="action-button pickup-button" 
            onClick={() => handleStatusUpdate("Picked Up")}
          >
            Mark as Picked Up
          </button>
        )}

        {task.data.status === "Picked Up" && (
          <button 
            className="action-button deliver-button" 
            onClick={() => handleStatusUpdate("Completed")}
          >
            Mark as Delivered
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
  );
};

export default TaskDetail;