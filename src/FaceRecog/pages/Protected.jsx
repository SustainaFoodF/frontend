import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Protected() {
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("faceAuth")) {
      navigate("/login");
    }

    const { account } = JSON.parse(localStorage.getItem("faceAuth"));
    setAccount(account);
  }, []);

  if (!account) {
    return null;
  }

  return (
    <>
      <style>
        {`
          .container {
            height: 100%;
            display: flex;
            align-items: center;
            background-color: #e0e7ff;
            flex-direction: column;
            justify-content: center;
            gap: 2.5rem;
          }
          .heading {
            font-family: 'Poppins', sans-serif;
            font-size: 1.5rem;
            color: #16a34a;
          }
          .card {
            padding-top: 2rem;
            padding-bottom: 2rem;
            padding-left: 2rem;
            padding-right: 2rem;
            width: 450px;
            height: 250px;
            margin-left: auto;
            margin-right: auto;
            background-color: #ffffff;
            border-radius: 0.75rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            display: flex;
            align-items: center;
            gap: 1.5rem;
            overflow: hidden;
          }
          .card-image {
            display: block;
            margin-left: auto;
            margin-right: auto;
            height: 9rem;
            border-radius: 0.75rem;
            flex-shrink: 0;
          }
          .card-content {
            text-align: center;
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
          }
          .card-details {
            display: flex;
            flex-direction: column;
            gap: 0.125rem;
          }
          .card-email {
            font-size: 1rem;
            color: #000000;
          }
          .card-name {
            font-size: 2.25rem;
            color: #000000;
            font-weight: 600;
          }
          .card-verified {
            color: #22c55e;
            font-weight: 500;
            border: 2px solid #dcfce7;
            border-radius: 9999px;
            width: fit-content;
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
          .logout-button {
            display: flex;
            gap: 0.5rem;
            width: fit-content;
            margin-top: 1.25rem;
            cursor: pointer;
            padding: 0.5rem 0.75rem;
            border-radius: 9999px;
            background: linear-gradient(to right, #f87171, #ef4444);
          }
          .logout-text {
            color: #ffffff;
          }
          .logout-icon {
            width: 1.5rem;
            height: 1.5rem;
            fill: none;
            stroke: #ffffff;
            stroke-width: 1.5;
          }
        `}
      </style>
      <div className="container">
        <h1 className="heading">You have successfully logged In.</h1>
        <div className="card">
          <img
            className="card-image"
            src={account.picture}
            alt={account.name}
          />
          <div className="card-content">
            <div className="card-details">
              <p className="card-email">{account.email}</p>
              <p className="card-name">{account.name}</p>
              <p className="card-verified">verified</p>
            </div>
            <div
              onClick={() => {
                localStorage.removeItem("faceAuth");
                navigate("/");
              }}
              className="logout-button"
            >
              <span className="logout-text">Log Out</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="logout-icon"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Protected;