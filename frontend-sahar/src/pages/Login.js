import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import "./Login.css";
import { FcGoogle } from "react-icons/fc"; // Icône Google

// Importation correcte de l'image
import loginImage from "../pages/1.png";
import Navbar from "../COMPONENTS/Navbar/Navbar";

function Login() {
  const location = useLocation(); // Récupère l'URL actuelle
  const [tryToLoginFromGoogle, setTryToLoginFromGoogle] = useState(false);
  const saveLoginDataToLocalStorage = (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("loggedInUser", user.name);
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("loggedInUserId", user._id);
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("image", user?.image);
    localStorage.setItem("cart", JSON.stringify([]));
  };
  const navigateUser = (user) => {
    navigate(`/${user.role}/accountsettings`);
  };
  useEffect(() => {
    const fetchUserData = async () => {
      const params = new URLSearchParams(location.search);
      const tokenFromUrl = params.get("token"); // Récupère le paramètre 'token'

      if (tokenFromUrl) {
        setTryToLoginFromGoogle(true);
        try {
          const response = await fetch(
            `http://localhost:5001/auth/loginWithToken/${tokenFromUrl}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
            }
          );

          const result = await response.json();
          console.log("🔐 Réponse du serveur:", result);

          // Vérification si la réponse contient bien un token et un utilisateur
          const { token, user } = result;
          if (token && user && user._id) {
            handleSuccess("Connexion réussie !");
            saveLoginDataToLocalStorage(user, token);
            console.log("   " + token + "  ")

            // Redirection basée sur le rôle utilisateur
            setTimeout(() => {
              navigateUser(user);
            }, 1000);
          } else {
            handleError("Connexion échouée. Vérifiez vos informations.");
          }
        } catch (error) {
          console.error("Erreur:", error.message);
        }
      }
    };

    fetchUserData();
  }, [location]);

  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password)
      return handleError("Email and password are required");

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
      if (token && user && user._id) {
        handleSuccess("Connexion réussie !");

        saveLoginDataToLocalStorage(user, token);
        // Redirection basée sur le rôle utilisateur
        setTimeout(() => {
          navigateUser(user);
        }, 1000);
      } else {
        handleError("Connexion échouée. Vérifiez vos informations.");
      }
    } catch (err) {
      console.error("❌ Erreur lors du login:", err.message);
      handleError("Erreur serveur. Veuillez réessayer.");
    }
  };
  const handleGoogleLogin = () => {
    setTryToLoginFromGoogle(true); // Active le mode chargement
    window.location.href = "http://localhost:5001/auth/google"; // Redirige vers ton backend
  };
  return (
    <>
      <Navbar reloadnavbar={false} />
      <div className="login-container">
        {/* Image de la page de connexion */}
        <div className="login-image">
          <img src={loginImage} alt="Login Illustration" />
        </div>

        {/* Formulaire de connexion */}
        <div className="login-form">
          <h1>Welcome Back</h1>
          <p>Please enter your credentials to continue</p>
          {tryToLoginFromGoogle ? (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <p>Logging in with Google...</p>
            </div>
          ) : (
            <>
              <button
                className="google-login-button"
                onClick={handleGoogleLogin}
              >
                <FcGoogle className="google-icon" />
                Sign in with Google
              </button>
              <p>Or</p>
              <form onSubmit={handleLogin}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  onChange={handleChange}
                  value={loginInfo.email}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  value={loginInfo.password}
                />

                {/* Bouton de soumission */}
                <button type="submit" className="login-button">
                  Login
                </button>
                {/* Lien vers la page d'inscription */}
                <p>
                  Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
                <Link to="/forgot-password" className="forgot-password-link">
                  Forgot Password?
                </Link>
              </form>
            </>
          )}

          <ToastContainer />
        </div>
      </div>
    </>
  );
}

export default Login;
