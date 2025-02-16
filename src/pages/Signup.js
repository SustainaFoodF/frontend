import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import './Signup.css';
import signupImage from '../pages/1.png';
import Navbar from '../COMPONENTS/Navbar/Navbar';

function Signup() {
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: '',
        image: '',
        role: 'client'
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupInfo({ ...signupInfo, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSignupInfo({ ...signupInfo, image: reader.result }); // Stocker l'image en Base64
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password, role, image } = signupInfo;
        
        if (!name || !email || !password || !role) {
            return handleError('All fields are required');
        }

        try {
            const response = await fetch('http://localhost:5001/auth/Signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role, image }) // Envoi correct de l'image
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
        <>
        <Navbar reloadnavbar={false} />  

        <div className='signup-container'>
            <div className='signup-image'>
                <img src={signupImage} alt='Signup Illustration' />
            </div>

            <div className='signup-form'>
                <h1>Create Account</h1>
                <p>Please enter personal information to continue</p>
                <form onSubmit={handleSignup}>
                    <input type='text' name='name' placeholder='Full Name' onChange={handleChange} value={signupInfo.name} />
                    <input type='email' name='email' placeholder='Email Address' onChange={handleChange} value={signupInfo.email} />
                    <input type='password' name='password' placeholder='Password' onChange={handleChange} value={signupInfo.password} />
                    
                    {/* Affichage de l'image sélectionnée */}
                    {signupInfo.image && <img src={signupInfo.image} alt="Preview" className="preview-image" />}

                    {/* Champ pour télécharger une image */}
                    <input type='file' accept='image/*' onChange={handleImageChange}         className="preview-image" 
                    />

                    <div className='role-selection'>
                        <label>Select Role</label>
                        <div className='role-options'>
                            <label className={`role-btn ${signupInfo.role === 'client' ? 'selected' : ''}`}>
                                <input type='radio' name='role' value='client' checked={signupInfo.role === 'client'} onChange={handleChange} />
                                Client
                            </label>
                            <label className={`role-btn ${signupInfo.role === 'business' ? 'selected' : ''}`}>
                                <input type='radio' name='role' value='business' checked={signupInfo.role === 'business'} onChange={handleChange} />
                                Business
                            </label>
                            <label className={`role-btn ${signupInfo.role === 'livreur' ? 'selected' : ''}`}>
                                <input type='radio' name='role' value='livreur' checked={signupInfo.role === 'livreur'} onChange={handleChange} />
                                Livreur
                            </label>
                        </div>
                    </div>

                    <button type='submit' className='signup-button'>Create Account</button>
                    <p>Already have an account? <Link to='/login'>Login</Link></p>
                </form>
                <ToastContainer />
                </div>
        </div>
    </>
    );
}

export default Signup;
