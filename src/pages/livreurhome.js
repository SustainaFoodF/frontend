import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Footer1 from "../COMPONENTS/Footer/Footer1";
import Footer2 from "../COMPONENTS/Footer/Footer2";
import Sidebar from "../COMPONENTS/Livreur/components/Sidebar";
import TaskDashboard from "../COMPONENTS/Livreur/components/TaskDashboard";
import TaskDetail from "../COMPONENTS/Livreur/components/TaskDetail";
import NotificationsPanel from "../COMPONENTS/Livreur/components/NotificationsPanel";
import "./livreurhome.css";
import LivreurNavbar from "../COMPONENTS/Navbar/LivreurNavBar";

const Livreurhome = () => {
  const livreurId = localStorage.getItem('loggedInUserId');

  return (
    <div className="livreur-home-container">
      <LivreurNavbar  />
      
      <div className="livreur-content-wrapper">
        <Sidebar />
        <div className="livreur-main-content">
            <Routes>
            <Route index element={<TaskDashboard />} />
            <Route path="tasks" element={<TaskDashboard />} />
            <Route path="tasks/:id" element={<TaskDetail />} />
            <Route path="notifications" element={
                <NotificationsPanel 
                livreurId={livreurId}
                onClose={() => {
                    window.history.back();
                }}
                />
            } />
            <Route path="accountsettings" element={<Navigate to="/livreur/accountsettings" replace />} />
            <Route path="*" element={<Navigate to="tasks" replace />} />
            </Routes>
        </div>
      </div>

      <Footer1 />
      <Footer2 />
    </div>
  );
};

export default Livreurhome;