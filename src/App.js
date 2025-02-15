import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import DashboardHome from './pages/dashboardhome';
import { useState } from 'react';
import RefrshHandler from './RefrshHandler';
import UserProfile from './pages/User/UserProfile';
import LivreurProfile from './pages/User/LivreurProfile';
import BusinessProfile from './pages/User/BusiniesProfile';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />
  }

  return (
    <div className="App">
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        
                <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path="/DashboardHome" element={<PrivateRoute element={<DashboardHome />} />} />
        
        <Route path='/user/:activepage' element={<UserProfile/>} />
        <Route path='/livreure' element={<LivreurProfile/>} />
        <Route path='/bussniess' element={<BusinessProfile/>} />


      </Routes>
    </div>
  );
}

export default App;
