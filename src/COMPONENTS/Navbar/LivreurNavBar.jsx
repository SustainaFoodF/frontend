import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import logo from "../../ASSETS/logo.png";
import "./Navbar.css"; // You can reuse the same CSS or create a specific one for livreur

const LivreurNavbar = () => {
  const navigate = useNavigate();
  const isLoggedUser = 
    localStorage.getItem("token") !== undefined &&
    localStorage.getItem("token") !== null;
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="livreur-nav">
      <div className="s1">
        <img 
          src={logo} 
          alt="logo" 
          className="logo" 
          onClick={() => navigate("/livreur")}
          style={{ cursor: "pointer" }}
        />

        <div className="right">
          <Dropdown>
            <Dropdown.Toggle variant="" id="dropdown-basic">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {isLoggedUser ? (
                <>
                  <Dropdown.Item as={Link} to="/livreur/accountsettings">
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </>
              ) : (
                <>
                  <Dropdown.Item as={Link} to="/login">
                    Login
                  </Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <div className="s2 livreur-links">
        <Link to="/livreur">Dashboard</Link>
        <Link to="/livreur/orders">My Deliveries</Link>
        <Link to="/livreur/availability">Availability</Link>
        <Link to="/livreur/stats">Statistics</Link>
      </div>
    </nav>
  );
};

export default LivreurNavbar;