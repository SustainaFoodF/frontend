import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserAddress.css'; 

const UserAddress = ({ userId }) => {
    // State variables
    const [show, setShow] = useState(false); // Controls the visibility of the address form
    const [savedAddresses, setSavedAddresses] = useState([]); // Stores the fetched addresses
    const [formData, setFormData] = useState({
        street: '',
        postalCode: '',
        city: '',
        country: ''
    }); // Stores form data for adding/editing addresses
    const [editId, setEditId] = useState(null); // Tracks the address being edited
    const [loading, setLoading] = useState(false); // Tracks loading state
    const [error, setError] = useState(''); // Stores error messages

    // Fetch addresses when the component mounts or when userId changes
    useEffect(() => {
        if (userId) {
            fetchAddresses();
            console.log("User ID:", userId);
        } else {
            setError("User ID is missing");
        }
    }, [userId]);

    // Function to fetch addresses from the backend
    const fetchAddresses = async () => {
        if (!userId) {
            setError("User ID is missing");
            return;
        }
    
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`http://localhost:5001/users/${userId}/addresses`);
            console.log("Addresses fetched:", response.data.addresses);
            setSavedAddresses(response.data.addresses); // Update state with fetched addresses
        } catch (err) {
            setError('Failed to fetch addresses');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes in the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Save or update an address
    const handleSaveAddress = async () => {
        if (!userId) {
            setError("User ID is missing");
            return;
        }

        // Validate required fields
        if (!formData.street || !formData.postalCode || !formData.city || !formData.country) {
            setError('Required fields are missing');
            return;
        }

        setLoading(true);
        setError(''); // Clear previous errors
        try {
            let response;
            if (editId) {
                // Update an existing address
                response = await axios.put(`http://localhost:5001/users/${userId}/addresses/${editId}`, formData);
            } else {
                // Add a new address
                response = await axios.post(`http://localhost:5001/users/${userId}/addresses`, formData);
            }

            if (response.data.success) {
                fetchAddresses(); // Refresh the address list
                setShow(false); // Hide the form
                setFormData({ // Reset form data
                    street: '',
                    postalCode: '',
                    city: '',
                    country: ''
                });
                setEditId(null); // Clear edit ID
            } else {
                setError('Failed to save address: ' + response.data.message);
            }
        } catch (err) {
            setError('Failed to save address: ' + (err.response?.data?.message || err.message));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Delete an address
    const handleDeleteAddress = async (id) => {
        if (!userId) {
            setError("User ID is missing");
            return;
        }

        setLoading(true);
        setError(''); // Clear previous errors
        try {
            await axios.delete(`http://localhost:5001/users/${userId}/address/${id}`);
            fetchAddresses(); // Refresh the address list
        } catch (err) {
            setError('Failed to delete address: ' + (err.response?.data?.message || err.message));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Edit an address
    const handleEditAddress = (address) => {
        setFormData(address); // Populate the form with the address data
        setEditId(address._id); // Set the address ID being edited
        setShow(true); // Show the form
    };

    return (
        <div className='useraddress'>
            {loading && <p>Loading...</p>}
            {error && <p className='error'>{error}</p>}

            {/* Display the list of addresses */}
            {!show && <h1 className='mainhead1'>Your Address</h1>}
            {!show && (
                <div className='addressin'>
                    {savedAddresses.map((item) => (
                        <div className='address' key={item._id}>
                            <span>{item.street}</span>,
                            <span>{item.postalCode}</span>,
                            <span>{item.city}</span>,
                            <span>{item.country}</span>
                            <div className='delbtn' onClick={() => handleDeleteAddress(item._id)}>
                                {/* Delete button SVG */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <div className='editbtn' onClick={() => handleEditAddress(item)}>
                                {/* Edit button SVG */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Button to add a new address */}
            {!show && (
                <div className='addnewbtn' onClick={() => setShow(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </div>
            )}

            {/* Form for adding/editing an address */}
            {show && (
                <div className='addnew'>
                    <h1 className='mainhead1'>{editId ? 'Edit Address' : 'Add New Address'}</h1>
                    <div className='form'>
                        <div className='form-group'>
                            <label htmlFor='street'>Street</label>
                            <input
                                type="text"
                                name="street"
                                value={formData.street}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='postalCode'>Postal Code</label>
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='city'>City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='country'>Country</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <button className='mainbutton1' onClick={handleSaveAddress}>
                        {editId ? 'Update' : 'Save'}
                    </button>
                    <button className='mainbutton1' onClick={() => setShow(false)}>
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserAddress;