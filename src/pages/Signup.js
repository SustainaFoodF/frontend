import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Signup.css';
import signupImage from '../pages/1.png';
import Navbar from '../COMPONENTS/Navbar/Navbar';
import { GoogleLogin } from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";
function Signup() {
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: '',
        image: '',
        role: 'client'
    });
    const [loadingSteps, setLoadingSteps] = useState([]);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupInfo({ ...signupInfo, [name]: value });
    };
    const handleGoogleSuccess = (response) => {
        const { credential } = response; // JWT token
        const decoded = jwtDecode(credential); // Decode JWT
    
        setSignupInfo({
            name: `${decoded.given_name} ${decoded.family_name}`,
        
          email: decoded.email,
          image: decoded.picture,
          password: "",
          role: "client",
        });
      };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSignupInfo({ ...signupInfo, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password, role, image } = signupInfo;
    
        if (!name || !email || !password || !role) {
            return toast.error('all fields are required');
        }
    
        try {
            setLoadingSteps(["Verifying your information...", "Creating your account...", "Almost there..."]);
    
            const response = await fetch('http://localhost:5001/auth/Signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role, image })
            });
    
            console.log("🚀 Response status:", response.status);  // Log status
            const responseText = await response.text();  // Get the raw response text
            console.log("📩 Response text:", responseText);
    
            if (!response.ok) {
                console.error("❌ Erreur API:", responseText);
                return toast.error(`Erreur serveur: ${responseText}`);
            }
    
            // Attempt to parse the response as JSON
            try {
                const result = JSON.parse(responseText);  // Try parsing JSON
                console.log("✅ Réponse JSON:", result);
    
                if (result.success) {
                    toast.success(result.message || 'Your account has been created successfully !');
                    setTimeout(() => navigate('/login'), 1500);
                } else {
                    toast.success(result.message || 'Your account has been created successfully !');
                    setTimeout(() => navigate('/login'), 1500);
                }
            } catch (error) {
                console.error("❗ Erreur de parsing JSON:", error);
                toast.error('Erreur lors de la lecture de la réponse serveur.');
            }
    
        } catch (err) {
            console.error("⚠️ Erreur de connexion:", err);
            toast.error('Erreur de connexion au serveur, veuillez réessayer.');
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
                    <h1>Create an Account</h1>
                    <p>Please enter your information to continue</p>
                    <p>Or</p>
                    <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => console.log("Google Sign-In Failed")}
      />

                    <form onSubmit={handleSignup}>
                        <input type='text' name='name' placeholder='Your Name' onChange={handleChange} value={signupInfo.name} />
                        <input type='email' name='email' placeholder='Email Address' onChange={handleChange} value={signupInfo.email} />
                        <input type='password' name='password' placeholder='Password' onChange={handleChange} value={signupInfo.password} />

                        {signupInfo.image && <img src={signupInfo.image} alt='Preview' className='preview-image' />}
                        <input type='file' accept='image/*' onChange={handleImageChange} className='preview-image' />

                        <div className='role-selection'>
                            <label> Select Role : </label>
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
                        <p>Do you already have an account? <Link to='/login'> Login here </Link></p>
                    </form>

                    <div className='loading-steps'>
                        {loadingSteps.map((step, index) => (
                            <p key={index} className="loading-step">{step}</p>
                        ))}
                    </div>

                    <ToastContainer />
                </div>
            </div>
        </>
    );
}

export default Signup;
