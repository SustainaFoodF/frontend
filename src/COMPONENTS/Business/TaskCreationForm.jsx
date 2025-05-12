import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaUser, FaPhone, FaBox, FaClock, FaInfoCircle, FaTimes, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import './TaskCreationForm.css';
import axios from 'axios';

const TaskCreationForm = ({ command, onClose }) => {
  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:5001';
  
  // Initialize form with command data if available
  const [formData, setFormData] = useState({
    pickup: {
      businessName: '',
      address: '',
      contactPerson: '',
      contactPhone: '',
      pickupTime: new Date().toISOString().slice(0, 16)
    },
    dropoff: {
      clientName: '',
      address: '',
      contactPhone: '',
      deliveryInstructions: ''
    },
    details: {
      orderItems: [],
      totalValue: 0,
      paymentMethod: 'Cash on Delivery',
      specialInstructions: ''
    },
    assignedTo: '',
    estimatedDeliveryTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16), // Default to tomorrow
    distance: 5 // Default distance in KM
  });

  const [availableLivreurs, setAvailableLivreurs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [livreursLoading, setLivreursLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [BusinessId, setBusinessId] = useState('');
  const [user, setUserId] = useState('');
  useEffect(() => {
    const id = localStorage.getItem('loggedInUserId');
    if (id) {
      setBusinessId(id);
    }
  }, []);

  useEffect(() => {
    const name = localStorage.getItem('loggedInUser');
    if (name) {
      setUserId(name);
    }
  }, []);

  
  // Parse command data when available
  useEffect(() => {
    if (command) {
      try {
        // Convert command data to task format
        const pickupAddress = command.location || (command.owner?.addresses?.[0]?.street || '');
        const dropoffAddress = command.location || (command.owner?.addresses?.[0]?.street || '');
        
        setFormData(prev => ({
          ...prev,
          pickup: {
            ...prev.pickup,
            businessName: command.products?.[0]?.product?.owner?.name || 'Business Name',
            address: pickupAddress,
            contactPerson: 'Store Manager',
            contactPhone: command.phoneNumber || ''
          },
          dropoff: {
            ...prev.dropoff,
            clientName: command.owner?.name || '',
            address: dropoffAddress,
            contactPhone: command.phoneNumber || '',
            deliveryInstructions: ''
          },
          details: {
            ...prev.details,
            orderItems: command.products?.map(item => ({
              name: item.product?.label || 'Product',
              quantity: item.quantity || 1,
              notes: ''
            })) || [],
            totalValue: command.totalPrice || 0,
            paymentMethod: command.isPaid ? 'Prepaid' : 'Cash on Delivery'
          },
          estimatedDeliveryTime: command.dateLivraison ? 
            new Date(command.dateLivraison).toISOString().slice(0, 16) : 
            new Date(Date.now() + 86400000).toISOString().slice(0, 16)
        }));
      } catch (err) {
        console.error("Error parsing command data:", err);
        setError("Failed to process order data. Some fields may need to be filled manually.");
      }
    }
  }, [command]);

  useEffect(() => {
    const fetchLivreurs = async () => {
      try {
        setLivreursLoading(true);
        const response = await fetch("http://localhost:5001/auth/livreurs", {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch deliverers');
        }
        
        const data = await response.json();
        
        // Handle different response formats
        const livreurs = Array.isArray(data) ? data : 
                        Array.isArray(data.data) ? data.data : 
                        Array.isArray(data.users) ? data.users : [];
        
        setAvailableLivreurs(livreurs);
      } catch (err) {
        console.error("Error fetching livreurs:", err);
        setError("Failed to load deliverers. Please try again later.");
        setAvailableLivreurs([]);
      } finally {
        setLivreursLoading(false);
      }
    };

    fetchLivreurs();
  }, []);

  const validateForm = () => {
    // Check required fields
    if (!formData.pickup.businessName || !formData.pickup.address) {
      setError("Pickup information is incomplete");
      return false;
    }
    
    if (!formData.dropoff.clientName || !formData.dropoff.address) {
      setError("Delivery information is incomplete");
      return false;
    }
    
    if (!formData.assignedTo) {
      setError("Please select a deliverer");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      console.log('Form data being sent:', JSON.stringify(formData, null, 2)); // Debug log
      
      // 1. Create the delivery task
      const taskResponse = await axios.post(
        `${API_BASE_URL}/livreur/tasks`, 
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      console.log('Task creation response:', taskResponse); // Debug log
      
      const taskData = taskResponse.data.data || taskResponse.data;
      
      // 2. If we have a command, assign the deliverer to it
      if (command?._id) {
        console.log('Attempting to assign deliverer to command...'); // Debug log
        const assignResponse = await axios.post(
          `${API_BASE_URL}/command/assign`, 
          {
            commandId: command._id,
            delivererId: formData.assignedTo,
            taskId: taskData._id
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        console.log('Assign deliverer response:', assignResponse); // Debug log
      }
      
      setSuccessMessage(`Task created successfully and assigned to deliverer`);
      setFormSubmitted(true);
      
      setTimeout(() => {
        onClose && onClose();
            navigate('/business/affectertaches');
      }, 1500);
      
    } catch (err) {
      console.error("Full error object:", err); // Debug log
      console.error("Error response data:", err.response?.data); // Debug log
      setError(err.response?.data?.message || 
               err.response?.data?.error || 
               err.message || 
               "Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (path, value) => {
    const keys = path.split('.');
    setFormData(prev => {
      const newData = { ...prev };
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] = { ...current[keys[i]] };
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  // Add or remove order items
  const handleAddOrderItem = () => {
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        orderItems: [
          ...prev.details.orderItems,
          { name: '', quantity: 1, notes: '' }
        ]
      }
    }));
  };

  const handleRemoveOrderItem = (index) => {
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        orderItems: prev.details.orderItems.filter((_, i) => i !== index)
      }
    }));
  };

  const handleOrderItemChange = (index, field, value) => {
    setFormData(prev => {
      const newOrderItems = [...prev.details.orderItems];
      newOrderItems[index] = {
        ...newOrderItems[index],
        [field]: field === 'quantity' ? parseInt(value) || 1 : value
      };
      
      return {
        ...prev,
        details: {
          ...prev.details,
          orderItems: newOrderItems
        }
      };
    });
  };

  return (
    <div className="task-creation-modal">
      <div className="task-creation-content">
        <div className="modal-header">
          <h2>{command ? 'Create Delivery Task for Order' : 'Create New Delivery Task'}</h2>
          <button className="close-button" onClick={onClose} disabled={loading}>
            <FaTimes />
          </button>
        </div>
        
        {error && (
          <div className="error-message">
            <FaExclamationTriangle /> {error}
          </div>
        )}
        
        {successMessage && !error && (
          <div className="success-message">
            <FaCheck /> {successMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-sections-container">
            {/* Left Column */}
            <div className="form-column">
              <div className="form-section">
                <h3><FaMapMarkerAlt className="icon" /> Pickup Information</h3>
                
                <div className="form-group">
                  <label>Business Name <span className="required">*</span></label>
                  <input 
                    type="text" 
                    value={formData.pickup.businessName}
                    onChange={(e) => handleInputChange('pickup.businessName', e.target.value)}
                    required
                    placeholder="Enter business name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Pickup Address <span className="required">*</span></label>
                  <input 
                    type="text" 
                    value={formData.pickup.address}
                    onChange={(e) => handleInputChange('pickup.address', e.target.value)}
                    required
                    placeholder="Enter full address"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Contact Person</label>
                    <input 
                      type="text" 
                      value={formData.pickup.contactPerson}
                      onChange={(e) => handleInputChange('pickup.contactPerson', e.target.value)}
                      placeholder="Contact name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Contact Phone <span className="required">*</span></label>
                    <input 
                      type="tel" 
                      value={formData.pickup.contactPhone}
                      onChange={(e) => handleInputChange('pickup.contactPhone', e.target.value)}
                      required
                      placeholder="+216XXXXXXXX"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Pickup Time <span className="required">*</span></label>
                  <input 
                    type="datetime-local" 
                    value={formData.pickup.pickupTime}
                    onChange={(e) => handleInputChange('pickup.pickupTime', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="form-section">
                <h3><FaBox className="icon" /> Order Details</h3>
                
                <div className="order-items-container">
                  {formData.details.orderItems.length > 0 ? (
                    formData.details.orderItems.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="form-row">
                          <div className="form-group item-name">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => handleOrderItemChange(index, 'name', e.target.value)}
                              placeholder="Item name"
                              required
                            />
                          </div>
                          <div className="form-group item-quantity">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleOrderItemChange(index, 'quantity', e.target.value)}
                              required
                            />
                          </div>
                          <button 
                            type="button" 
                            className="remove-item-button"
                            onClick={() => handleRemoveOrderItem(index)}
                          >
                            <FaTimes />
                          </button>
                        </div>
                        <div className="form-group">
                          <input
                            type="text"
                            value={item.notes}
                            onChange={(e) => handleOrderItemChange(index, 'notes', e.target.value)}
                            placeholder="Item notes (optional)"
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-items-message">
                      <p>No items added to this delivery task.</p>
                    </div>
                  )}
                  
                  <button 
                    type="button" 
                    className="add-item-button"
                    onClick={handleAddOrderItem}
                  >
                    + Add Item
                  </button>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Total Value (DT)</label>
                    <input 
                      type="number" 
                      min="0" 
                      step="0.01"
                      value={formData.details.totalValue}
                      onChange={(e) => handleInputChange('details.totalValue', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Payment Method</label>
                    <select
                      value={formData.details.paymentMethod}
                      onChange={(e) => handleInputChange('details.paymentMethod', e.target.value)}
                    >
                      <option value="Cash on Delivery">Cash on Delivery</option>
                      <option value="Prepaid">Prepaid</option>
                      <option value="Credit Card">Credit Card</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Special Instructions</label>
                  <textarea 
                    value={formData.details.specialInstructions}
                    onChange={(e) => handleInputChange('details.specialInstructions', e.target.value)}
                    rows="2"
                    placeholder="Any special handling instructions"
                  />
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="form-column">
              <div className="form-section">
                <h3><FaMapMarkerAlt className="icon" /> Delivery Information</h3>
                
                <div className="form-group">
                  <label>Client Name <span className="required">*</span></label>
                  <input 
                    type="text" 
                    value={formData.dropoff.clientName}
                    onChange={(e) => handleInputChange('dropoff.clientName', e.target.value)}
                    required
                    placeholder="Client's full name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Delivery Address <span className="required">*</span></label>
                  <input 
                    type="text" 
                    value={formData.dropoff.address}
                    onChange={(e) => handleInputChange('dropoff.address', e.target.value)}
                    required
                    placeholder="Enter full delivery address"
                  />
                </div>
                
                <div className="form-group">
                  <label>Contact Phone <span className="required">*</span></label>
                  <input 
                    type="tel" 
                    value={formData.dropoff.contactPhone}
                    onChange={(e) => handleInputChange('dropoff.contactPhone', e.target.value)}
                    required
                    placeholder="+216XXXXXXXX"
                  />
                </div>
                
                <div className="form-group">
                  <label>Delivery Instructions</label>
                  <textarea 
                    value={formData.dropoff.deliveryInstructions}
                    onChange={(e) => handleInputChange('dropoff.deliveryInstructions', e.target.value)}
                    rows="3"
                    placeholder="Building access details, landmarks, etc."
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Estimated Delivery <span className="required">*</span></label>
                    <input 
                      type="datetime-local" 
                      value={formData.estimatedDeliveryTime}
                      onChange={(e) => handleInputChange('estimatedDeliveryTime', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Estimated Distance (km)</label>
                    <input 
                      type="number" 
                      min="0.1" 
                      step="0.1"
                      value={formData.distance}
                      onChange={(e) => handleInputChange('distance', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h3><FaUser className="icon" /> Assign Deliverer</h3>
                {livreursLoading ? (
                  <div className="loading-state">
                    <div className="spinner"></div>
                    <span>Loading available deliverers...</span>
                  </div>
                ) : availableLivreurs.length > 0 ? (
                  <>
                    <div className="livreur-selection">
                      <select
                        value={formData.assignedTo}
                        onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                        required
                        className="livreur-select"
                        disabled={loading}
                      >
                        <option value="">Select a deliverer</option>
                        {availableLivreurs.map(livreur => (
                          <option key={livreur._id} value={livreur._id}>
                            {livreur.name} ({livreur.email})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="livreur-count">
                      {availableLivreurs.length} deliverer{availableLivreurs.length !== 1 ? 's' : ''} available
                    </div>
                  </>
                ) : (
                  <div className="no-deliverers">
                    <FaExclamationTriangle className="warning-icon" />
                    <div>
                      <p className="warning-title">No deliverers available</p>
                      <p className="warning-message">Please add livreurs to the system first</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={onClose}
              disabled={loading || formSubmitted}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading || formSubmitted || availableLivreurs.length === 0}
              className={`submit-button ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Creating Task...
                </>
              ) : formSubmitted ? (
                <>Task Created</>
              ) : (
                <>Create Delivery Task</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskCreationForm;