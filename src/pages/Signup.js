import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import './Signup.css';

// Importation correcte de l'image
import signupImage from '../pages/1.png';

function Signup() {
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: '',
        role: 'client' // Valeur par défaut
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupInfo({ ...signupInfo, [name]: value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password, role } = signupInfo;
        if (!name || !email || !password || !role) {
            return handleError('All fields are required');
        }
        try {
            const response = await fetch('http://localhost:5001/auth/Signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupInfo)
            });
            const result = await response.json();
            if (result.success) {
                handleSuccess(result.message);
                setTimeout(() => navigate('/login'), 1000);
            } else {
                handleError(result.error || result.message);
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    return (
        <div className='signup-container'>
            {/* Image de la page d'inscription */}
            <div className='signup-image'>
                <img src={signupImage} alt='Signup Illustration' />
            </div>

            {/* Formulaire d'inscription */}
            <div className='signup-form'>
                <h1>Create Account</h1>
                <p>Please enter personal information to continue</p>
                <form onSubmit={handleSignup}>
                    <div className='input-group'>
                        <input 
                            type='text' 
                            name='name' 
                            placeholder='Full Name' 
                            onChange={handleChange} 
                            value={signupInfo.name} 
                        />
                    </div>
                    <input 
                        type='email' 
                        name='email' 
                        placeholder='Email Address' 
                        onChange={handleChange} 
                        value={signupInfo.email} 
                    />
                    <input 
                        type='password' 
                        name='password' 
                        placeholder='Password' 
                        onChange={handleChange} 
                        value={signupInfo.password} 
                    />

                    {/* Boutons radio pour choisir le rôle */}
                    <div className="role-selection">
                        <label>Select Role</label>
                        <div className="role-options">
                            <label className={`role-btn ${signupInfo.role === 'client' ? 'selected' : ''}`}>
                                <input 
                                    type="radio" 
                                    name="role" 
                                    value="client" 
                                    checked={signupInfo.role === 'client'}
                                    onChange={handleChange}
                                />
                                Client
                            </label>
                            <label className={`role-btn ${signupInfo.role === 'business' ? 'selected' : ''}`}>
                                <input 
                                    type="radio" 
                                    name="role" 
                                    value="business" 
                                    checked={signupInfo.role === 'business'}
                                    onChange={handleChange}
                                />
                                Business
                            </label>
                        </div>
                    </div>

                    {/* Bouton de soumission */}
                    <button type='submit' className='signup-button'>Create Account</button>

                    {/* Lien vers la page de connexion */}
                    <p>Already have an account? <Link to='/login'>Login</Link></p>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
}

export default Signup;
