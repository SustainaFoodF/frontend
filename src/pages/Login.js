import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import "./Login.css";
import { FcGoogle } from "react-icons/fc"; // Google Icon
import { FaFaceGrin } from "react-icons/fa6"; // FaceID Icon

// Correct image import
import loginImage from "../pages/1.png";
import Navbar from "../COMPONENTS/Navbar/Navbar";

function Login() {
  const location = useLocation(); // Get current URL
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
      const tokenFromUrl = params.get("token"); // Get 'token' parameter

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
          console.log("🔐 Server response:", result);

          // Check if response contains token and user
          const { token, user } = result;
          if (token && user && user._id) {
            handleSuccess("Login successful!");
            saveLoginDataToLocalStorage(user, token);
            console.log("   " + token + "  ")

            // Redirect based on user role
            setTimeout(() => {
              navigateUser(user);
            }, 1000);
          } else {
            handleError("Login failed. Please check your details.");
          }
        } catch (error) {
          console.error("Error:", error.message);
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
      console.log("📤 Sending login details:", loginInfo);

      const response = await fetch("http://localhost:5001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginInfo),
      });

      const result = await response.json();
      console.log("🔐 Server response:", result);

      // Check if response contains token and user
      const { token, user } = result;
      if (token && user && user._id) {
        handleSuccess("Login successful!");

        saveLoginDataToLocalStorage(user, token);
        // Redirect based on user role
        setTimeout(() => {
          navigateUser(user);
        }, 1000);
      } else {
        handleError("Login failed. Please check your details.");
      }
    } catch (err) {
      console.error("❌ Login error:", err.message);
      handleError("Server error. Please try again.");
    }
  };
  const handleGoogleLogin = () => {
    setTryToLoginFromGoogle(true); // Enable loading mode
    window.location.href = "http://localhost:5001/auth/google"; // Redirect to backend
  };

  const handleFaceIDLogin = () => {
    navigate("/user-select"); // Redirect to user-select path
  };

  return (
    <>
      <Navbar reloadnavbar={false} />
      <div className="login-container">
        {/* Login page image */}
        <div className="login-image">
          <img src={loginImage} alt="Login Illustration" />
        </div>

        {/* Login form */}
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
              <button
                className="faceid-login-button"
                onClick={handleFaceIDLogin}
              >
                <FaFaceGrin className="faceid-icon" />
                Login with FaceID
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

                {/* Submit button */}
                <button type="submit" className="login-button">
                  Login
                </button>
                {/* Link to signup page */}
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