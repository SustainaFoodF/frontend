import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import DashboardHome from './pages/dashboardhome';
import { useEffect, useState } from 'react';
import RefrshHandler from './RefrshHandler';
import UserProfile from './pages/User/UserProfile';
import LivreurProfile from './pages/User/LivreurProfile';
import BusinessProfile from './pages/User/BusiniesProfile';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Récupérer le rôle et vérifier l'authentification au chargement de la page
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const PrivateRoute = ({ element, allowedRoles }) => {
    if (!isAuthenticated) return <Navigate to="/login" />;

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to="/" />; // Redirection vers Home si l'utilisateur n'est pas autorisé
    }

    return element;
  };

  return (
    <div className="App">
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Route protégée pour Admin */}

        <Route path="/DashboardHome" element={<PrivateRoute element={<DashboardHome />} allowedRoles={["admin"]} />} />
        
        {/* Routes pour les autres rôles */}
        <Route path="/user/:activepage" element={<PrivateRoute element={<UserProfile />} allowedRoles={["user"]} />} />
        <Route path="/livreure" element={<PrivateRoute element={<LivreurProfile />} allowedRoles={["livreur"]} />} />
        <Route path="/bussniess" element={<PrivateRoute element={<BusinessProfile />} allowedRoles={["business"]} />} />
      </Routes>
    </div>
  );
}

export default App;
