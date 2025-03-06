import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaHome, FaCog, FaBars, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./dashboardhome.css";

const DashboardHome = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", role: "", email: "" });

  useEffect(() => {
    fetchUsers();

    // 🔒 Bloque l'accès si l'utilisateur n'est pas connecté
    const email = localStorage.getItem("userEmail");
    if (!email) {
      navigate("/login");
    }

    // 🛑 Empêche de revenir à cette page après déconnexion
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };

  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5001/users");
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear(); // 🔥 Supprime tout du localStorage
    sessionStorage.clear(); // 🔥 Vide aussi sessionStorage
    caches.keys().then((names) => {
      names.forEach((name) => caches.delete(name)); // 🔥 Vide le cache du navigateur
    });

    // ⏳ Petit délai pour garantir la suppression des données
    setTimeout(() => {
      navigate("/login", { replace: true }); // 🔄 Redirection forcée
      window.location.reload(); // 🔄 Recharge la page pour vider complètement la session
    }, 500);
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setFormData({ name: user.name, role: user.role, email: user.email });
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5001/users/${editUser._id}`, formData);
      fetchUsers();
      setShowModal(false);
      Swal.fire("Updated!", "User updated successfully", "success");
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire("Error!", "Failed to update user", "error");
    }
  };

  const deleteUser = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5001/users/${id}`);
          setUsers(users.filter((user) => user._id !== id));
          Swal.fire("Deleted!", "User has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal.fire("Error!", "Failed to delete user", "error");
        }
      }
    });
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
        <ul>
          <li>
            <FaHome /> {isOpen && <span>Home</span>}
          </li>
          <li onClick={handleLogout} style={{ cursor: "pointer" }}>
            <FaCog /> {isOpen && <span>Logout</span>}
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <h1>Dashboard Home</h1>
        <p>Welcome to your dashboard.</p>

        {/* Users Table */}
        <div className="table-container">
          <h2>Users List</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>{user.email}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(user)}>
                      <FaEdit />
                    </button>
                    <button className="delete-btn" onClick={() => deleteUser(user._id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Update User Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Edit User</h2>
              <label>Name:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <label>Role:</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
              <label>Email:</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <div className="modal-actions">
                <button onClick={handleUpdate}>Update</button>
                <button onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
