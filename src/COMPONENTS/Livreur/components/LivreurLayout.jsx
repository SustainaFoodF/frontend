// LivreurLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import LivreurNavbar from  '../../Navbar/LivreurNavBar'
import Sidebar from '../components/Sidebar';
import '../styles.css';
import './LivreurLayout.css';

const LivreurLayout = () => {
  return (
    <div className="livreur-app">
      <Sidebar />
      <div className="main-content">
        <LivreurNavbar />
        <div className="content-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LivreurLayout;