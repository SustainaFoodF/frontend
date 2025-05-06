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
import BusinessProfile from "./pages/User/BusiniesProfile";
import Activation from "./COMPONENTS/Activation/VerificationComponent";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ClientCategory from "./COMPONENTS/Categories";
import Cart from "./COMPONENTS/Cart/Cart";
import Livreurhome from "./pages/livreurhome";
import "../src/COMPONENTS/Livreur/styles.css";
import LivreurProfile from "./pages/User/LivreurProfile";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import ContactUs from "./pages/ContactUs";


import LoginFace from "./FaceRecog/pages/Login";
import UserSelect from "./FaceRecog/pages/UserSelect";
import Protected from "./FaceRecog/pages/Protected";





function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const clientId = "25896799255-5aeddf554q7636tdd7t16ifbah7us55f.apps.googleusercontent.com";

  const PrivateRoute = ({ element }) => {
    console.log("isAuthenticated", isAuthenticated);
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
          
          <Route path="/about" element={<About />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/termsandconditions" element={<TermsAndConditions />} />
          <Route path="/contact" element={<ContactUs />} />


          <Route path="/livreur"  element={<Livreurhome />}  />
          <Route path="/livreur/:activepage" element={<LivreurProfile />}  />




          <Route path="/business/:activepage" element={<BusinessProfile />} />
          <Route path="/categories/:categoryId" element={<ClientCategory />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/confirm/:confirmationCode" element={<Activation />} />
          <Route path="/resetpassword/:token" element={<ResetPassword />} />

// Face Recog Routes 



<Route path="user-select" element={<UserSelect />} />
        <Route path="loginface" element={<LoginFace />} />
        <Route path="protected" element={<Protected />} />
        <Route path="*" element={<Navigate to="/" />} />



        <Route path="client-dashboard" element={<UserProfile />} />
        
        <Route path="business-dashboard" element={<BusinessProfile />} />

        <Route path="livreur-dashboard" element={<LivreurProfile />} />




        </Routes>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;