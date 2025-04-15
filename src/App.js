import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import ForgotPassword from "./COMPONENTS/Forgetpassword/Forgotpassword";
import ResetPassword from "./COMPONENTS/Resetpassword/Resetpassword";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Login from "./pages/Login";
import DashboardHome from "./pages/dashboardhome";
import { useState } from "react";

import RefrshHandler from "./RefrshHandler";
import UserProfile from "./pages/User/UserProfile";
import LivreurProfile from "./pages/User/LivreurProfile";
import BusinessProfile from "./pages/User/BusiniesProfile";
import Activation from "./COMPONENTS/Activation/VerificationComponent";

import { GoogleOAuthProvider } from "@react-oauth/google";
import HomeCategories from "./COMPONENTS/Category/HomeCategories";
import ClientCategory from "./COMPONENTS/Categories";
import Cart from "./COMPONENTS/Cart/Cart";


import Livreur from "../src/COMPONENTS/Livreur/livreur";

// Import the styles
import "../src/COMPONENTS/Livreur/styles.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const clientId = "25896799255-5aeddf554q7636tdd7t16ifbah7us55f.apps.googleusercontent.com";

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <div className="App">
      <GoogleOAuthProvider clientId={clientId}>
        <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={<PrivateRoute element={<DashboardHome />} />}
          />
          <Route path="/client/:activepage" element={<UserProfile />} />
          
          <Route path="/livreur/*" element={<PrivateRoute element={<Livreur />} />} />
          
                    
          <Route path="/business/:activepage" element={<BusinessProfile />} />
          <Route path="/categories/:categoryId" element={<ClientCategory />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/confirm/:confirmationCode" element={<Activation />} />
          <Route path="/resetpassword/:token" element={<ResetPassword />} />
        </Routes>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;