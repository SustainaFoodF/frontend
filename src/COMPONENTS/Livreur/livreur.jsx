import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TaskDashboard from './components/TaskDashboard';
import TaskDetail from './components/TaskDetail';
import './styles.css';

const Livreur = () => {
  return (
    <div className="livreur-container">
      <Routes>
        <Route index element={<TaskDashboard />} />
        <Route path="tasks/:id" element={<TaskDetail />} />
        <Route path="profile" element={<div className="layout">Profile page coming soon</div>} />
        <Route path="*" element={<Navigate to="/livreur" replace />} />
      </Routes>
    </div>
  );
};

export default Livreur;