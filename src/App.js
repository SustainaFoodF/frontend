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



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <div className="App">
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
        <Route path="/user/:activepage" element={<UserProfile />} />
        <Route path="/livreur" element={<LivreurProfile />} />
        <Route path="/business" element={<BusinessProfile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        
        <Route path="/confirm/:confirmationCode" element={<Activation />} />
        <Route path="/resetpassword/:token" element={<ResetPassword />} />
        
        
      </Routes>
    </div>
  );
}

export default App;
