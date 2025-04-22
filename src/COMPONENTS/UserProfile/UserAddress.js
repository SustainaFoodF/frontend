import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserAddress.css';

const UserAddress = ({ userId }) => {
    // State variables
    const [show, setShow] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [formData, setFormData] = useState({
        street: '',
        postalCode: '',
        city: '',
        country: ''
    });
    const [formErrors, setFormErrors] = useState({
        street: '',
        postalCode: '',
        city: '',
        country: ''
    });
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Base API URL
    const API_BASE_URL = 'http://localhost:5001';

    // Validation rules
    const validateField = (name, value) => {
        switch (name) {
            case 'street':
                return value.trim() === '' ? 'Street is required' : '';
            case 'postalCode':
                if (value.trim() === '') return 'Postal code is required';
                if (!/^[a-zA-Z0-9\s-]{3,10}$/.test(value)) return 'Invalid postal code format';
                return '';
            case 'city':
                return value.trim() === '' ? 'City is required' : '';
            case 'country':
                return value.trim() === '' ? 'Country is required' : '';
            default:
                return '';
        }
    };

    // Handle input changes with validation
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        setFormData({
            ...formData,
            [name]: value,
        });
        
        setFormErrors({
            ...formErrors,
            [name]: validateField(name, value)
        });
    };

    // Validate entire form
    const validateForm = () => {
        const errors = {
            street: validateField('street', formData.street),
            postalCode: validateField('postalCode', formData.postalCode),
            city: validateField('city', formData.city),
            country: validateField('country', formData.country)
        };
        
        setFormErrors(errors);
        return !Object.values(errors).some(error => error !== '');
    };

    // Fetch addresses when the component mounts or when userId changes
    useEffect(() => {
        if (userId) {
            fetchAddresses();
        } else {
            setError("User ID is missing");
        }
    }, [userId]);

    const fetchAddresses = async () => {
        if (!userId) {
            setError("User ID is missing");
            return;
        }
    
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`${API_BASE_URL}/users/${userId}/addresses`);
            setSavedAddresses(response.data.addresses || []);
        } catch (err) {
            setError('Failed to fetch addresses');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAddress = async () => {
        if (!userId) {
            setError("User ID is missing");
            return;
        }

        if (!validateForm()) {
            setError('Please fix the errors in the form');
            return;
        }

        setLoading(true);
        setError('');
        try {
            let response;
            if (editId) {
                // Using singular /address for PUT as per your backend
                response = await axios.put(`${API_BASE_URL}/users/${userId}/address/${editId}`, formData);
            } else {
                // Using plural /addresses for POST as per your backend
                response = await axios.post(`${API_BASE_URL}/users/${userId}/addresses`, formData);
            }

            if (response.data.success) {
                fetchAddresses();
                setShow(false);
                setFormData({
                    street: '',
                    postalCode: '',
                    city: '',
                    country: ''
                });
                setEditId(null);
                setFormErrors({
                    street: '',
                    postalCode: '',
                    city: '',
                    country: ''
                });
            } else {
                setError('Failed to save address: ' + (response.data.message || 'Unknown error'));
            }
        } catch (err) {
            if (err.response?.status === 404) {
                setError('Address not found');
            } else {
                setError('Failed to save address: ' + (err.response?.data?.message || err.message));
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAddress = async (id) => {
        if (!userId) {
            setError("User ID is missing");
            return;
        }

        if (!window.confirm('Are you sure you want to delete this address?')) {
            return;
        }

        setLoading(true);
        setError('');
        try {
            // Using singular /address for DELETE as per your backend
            await axios.delete(`${API_BASE_URL}/users/${userId}/address/${id}`);
            fetchAddresses();
        } catch (err) {
            if (err.response?.status === 404) {
                setError('Address not found');
            } else {
                setError('Failed to delete address: ' + (err.response?.data?.message || err.message));
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditAddress = (address) => {
        const { _id, ...addressData } = address; // Destructure to remove _id
        setFormData(addressData);
        setEditId(_id); // Store the ID separately
        setShow(true);
        setFormErrors({
            street: '',
            postalCode: '',
            city: '',
            country: ''
        });
    };

    return (
        <div className='useraddress'>
            {loading && <div className="loading-overlay">Loading...</div>}
            {error && <p className='error'>{error}</p>}

            {!show && <h1 className='mainhead1'>Your Addresses</h1>}
            {!show && (
                <div className='addressin'>
                    {savedAddresses.length > 0 ? (
                        savedAddresses.map((item) => (
                            <div className='address' key={item._id}>
                                <span>{item.street}</span>,
                                <span>{item.postalCode}</span>,
                                <span>{item.city}</span>,
                                <span>{item.country}</span>
                                <div className='editbtn' onClick={() => handleEditAddress(item)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                </div>
                                <div className='delbtn' onClick={() => handleDeleteAddress(item._id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No addresses saved yet</p>
                    )}
                </div>
            )}

            {!show && (
                <div className='addnewbtn' onClick={() => {
                    setShow(true);
                    setFormData({
                        street: '',
                        postalCode: '',
                        city: '',
                        country: ''
                    });
                    setFormErrors({
                        street: '',
                        postalCode: '',
                        city: '',
                        country: ''
                    });
                    setEditId(null);
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </div>
            )}

{show && (
    <div className='addnew'>
        <h1 className='mainhead1'>{editId ? 'Edit Address' : 'Add New Address'}</h1>
        <div className='form'>
            {['street', 'postalCode', 'city', 'country'].map((field) => (
                <div className='form-group' key={field}>
                    <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    <input
                        type="text"
                        name={field}
                        value={formData[field]}
                        onChange={handleInputChange}
                        required
                        className={formErrors[field] ? 'error-input' : ''}
                    />
                    {formErrors[field] && <span className="error-text">{formErrors[field]}</span>}
                </div>
            ))}
        </div>
        <div className="form-actions">
            <button className='mainbutton1' onClick={handleSaveAddress} disabled={loading}>
                {loading ? 'Processing...' : editId ? 'Update' : 'Save'}
            </button>
            <button className='mainbutton1 cancel-btn' onClick={() => setShow(false)} disabled={loading}>
                Cancel
            </button>
        </div>
    </div>
)}
        </div>
    );
};

export default UserAddress;