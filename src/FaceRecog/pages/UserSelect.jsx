import { useEffect, useState } from "react";
import User from "../components/User";
import { RadioGroup } from "@headlessui/react";
import { Link } from "react-router-dom";
import axios from "axios";

function UserSelect() {
  const [selected, setSelected] = useState();
  const [errorMessage, setErrorMessage] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const backendUrl = "http://localhost:5001";

  const handleEmailSearch = () => {
    setLoading(true);
    axios
      .get(`${backendUrl}/getUserByEmail?email=${email}`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setUsers(res.data);
          setSelected(res.data[0]);
          setErrorMessage(null);
        } else {
          setErrorMessage("User not found.");
          setUsers([]);
          setSelected(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        setErrorMessage("Error fetching user.");
        setUsers([]);
        setSelected(null);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <style>
        {`
          .container {
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .main-content {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            background: linear-gradient(to right, #EFF6FF, #F3E8FF);
          }
          .card {
            background-color: white;
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
            border-radius: 0.5rem;
            padding: 1.5rem;
            width: 90%;
            max-width: 28rem;
          }
          .title {
            font-size: 2.25rem;
            font-weight: 800;
            color: #4F46E5;
            margin-bottom: 2rem;
            text-align: center;
          }
          .input-container {
            margin-bottom: 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .email-input {
            border: 1px solid #D1D5DB;
            padding: 0.75rem;
            border-radius: 0.375rem;
            margin-bottom: 1rem;
            width: 100%;
          }
          .email-input:focus {
            outline: none;
            box-shadow: 0 0 0 2px #6366F1;
          }
          .search-button {
            background-color: #6366F1;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 0.375rem;
            transition: background-color 0.3s;
          }
          .search-button:hover {
            background-color: #4F46E5;
          }
          .error-message {
            color: #EF4444;
            margin-top: 0.5rem;
          }
          .user-list {
            max-height: 23.75rem;
            overflow-y: auto;
            padding: 0.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .user-list-items {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            width: 100%;
          }
          .proceed-link {
            margin-top: 1.5rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.375rem;
            background-color: #6366F1;
            padding: 0.75rem 2rem;
            font-size: 0.875rem;
            font-weight: 600;
            color: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s;
            width: 100%;
            text-align: center;
            text-decoration: none;
          }
          .proceed-link:hover {
            background-color: #4F46E5;
          }
          .proceed-icon {
            margin-left: 0.5rem;
            width: 1.25rem;
            height: 1.25rem;
          }
          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            border: 0;
          }
        `}
      </style>
      <div className="container">
        <div className="main-content">
          <div className="card">
            <h1 className="title">Log In</h1>
            <div className="input-container">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter user email"
                className="email-input"
              />
              <button onClick={handleEmailSearch} className="search-button">
                {loading ? "Searching..." : "Search User"}
              </button>
              {errorMessage && (
                <p className="error-message">{errorMessage}</p>
              )}
            </div>
            <div className="user-list">
              <RadioGroup value={selected} onChange={setSelected}>
                <RadioGroup.Label className="sr-only">Select User</RadioGroup.Label>
                <div className="user-list-items">
                  {users.map((account) => (
                    <User key={account.id} user={account} />
                  ))}
                </div>
              </RadioGroup>
            </div>
            <Link
              to="/loginface"
              state={{ account: selected }}
              className="proceed-link"
            >
              Proceed
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="proceed-icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserSelect;