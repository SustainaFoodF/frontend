// src/pages/PrivacyPolicy.jsx
import React from "react";
import "./PrivacyPolicy.css";
import Navbar from "../COMPONENTS/Navbar/Navbar";
import Footer1 from "../COMPONENTS/Footer/Footer1";
import Footer2 from "../COMPONENTS/Footer/Footer2";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar reloadnavbar={false} />
      <div className="privacy-policy-container">
        <section className="privacy-header">
          <h1>Privacy Policy 🔐</h1>
          <p>Your privacy matters. Here's how we protect it at SustainaFood.</p>
        </section>

        <section className="privacy-section">
          <h2>🔎 What Information We Collect</h2>
          <p>We may collect personal details such as name, email, and preferences to personalize your experience.</p>
        </section>

        <section className="privacy-section">
          <h2>🛡️ How We Use Your Data</h2>
          <p>Your data is used strictly to improve your experience, send important updates, and manage your account.</p>
        </section>

        <section className="privacy-section">
          <h2>🤝 Your Rights</h2>
          <p>You can always request to view, edit, or delete your data. Just reach out to us!</p>
        </section>

        <section className="privacy-section">
          <h2>🔐 Data Protection</h2>
          <p>We take security seriously. All data is encrypted and safely stored.</p>
        </section>

        <section className="cta">
          <h2>Need More Info?</h2>
          <p>Contact us any time — we’re here for you.</p>
          <button onClick={() => window.location.href = "/signup"}>Join Us Now 💚</button>
        </section>
      </div>
      <Footer1 />
      <Footer2 />
    </>
  );
};

export default PrivacyPolicy;