import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import './Login.css';

// Importation correcte de l'image
import loginImage from '../pages/1.png';
import Navbar from '../COMPONENTS/Navbar/Navbar';

function Login() {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) return handleError("Email and password are required");

        try {
            console.log("📤 Envoi des informations de connexion:", loginInfo);

            const response = await fetch("http://localhost:5001/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginInfo),
            });

            const result = await response.json();
            console.log("🔐 Réponse du serveur:", result);

            // Vérification si la réponse contient bien un token et un utilisateur
            const { token, user } = result;
            if (token && user) {
                handleSuccess("Connexion réussie !");

                // Stockage des informations utilisateur
                localStorage.setItem("token", token);
                localStorage.setItem("loggedInUser", user.name);
                localStorage.setItem("userRole", user.role);
                localStorage.setItem("loggedInUserId", user._id);
                localStorage.setItem("userEmail", user.email); 

                console.log("✅ User ID stocké dans localStorage:", user._id);
                console.log("✅ Email stocké dans localStorage:", user.email);

                // Redirection basée sur le rôle utilisateur
                setTimeout(() => {
                    if (user.role === "business") {
                        navigate("/bussniess");
                    } else if (user.role === "livreur") {
                        navigate("/livreure");
                    } else if (user.role === "admin") {
                        navigate("/DashboardHome");
                    } else {
                        navigate("/user/:activepage");
                    }
                }, 1000);
            } else {
                handleError("Connexion échouée. Vérifiez vos informations.");
            }
        } catch (err) {
            console.error("❌ Erreur lors du login:", err.message);
            handleError("Erreur serveur. Veuillez réessayer.");
        }
    };

    return (
        <>
            <Navbar reloadnavbar={false} /> 
            <div className='login-container'>
                {/* Image de la page de connexion */}
                <div className='login-image'>
                    <img src={loginImage} alt='Login Illustration' />
                </div>
    
                {/* Formulaire de connexion */}
                <div className='login-form'>
                    <h1>Welcome Back</h1>
                    <p>Please enter your credentials to continue</p>
                    <form onSubmit={handleLogin}>
                        <input 
                            type='email' 
                            name='email' 
                            placeholder='Email Address' 
                            onChange={handleChange} 
                            value={loginInfo.email} 
                        />
                        <input 
                            type='password' 
                            name='password' 
                            placeholder='Password' 
                            onChange={handleChange} 
                            value={loginInfo.password} 
                        />
    
                        {/* Bouton de soumission */}
                        <button type='submit' className='login-button'>Login</button>
    
                        {/* Lien vers la page d'inscription */}
                        <p>Don't have an account? <Link to='/signup'>Sign up</Link></p>
                        <Link to="/forgot-password" className="forgot-password-link">
                Forgot Password?
              </Link>

                    </form>
                    <ToastContainer />
                </div>
            </div>
        </>
    );
}

export default Login;
