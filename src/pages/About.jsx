// src/pages/About.jsx
import React from "react";
import "./About.css";
import Navbar from "../COMPONENTS/Navbar/Navbar";
import Footer1 from "../COMPONENTS/Footer/Footer1";
import Footer2 from "../COMPONENTS/Footer/Footer2";
import { useNavigate } from "react-router-dom";
const About = () => {
    const navigate = useNavigate();
  return (
    <>
     <Navbar reloadnavbar={false} />
     <div className="about-us-container">
      <section className="hero-section">
        <h1>Welcome to SustainaFood 🌿</h1>
        <p>Empowering communities to fight food waste and build a sustainable future.</p>
      </section>

      <section className="mission-vision">
        <div className="mission">
          <h2>Our Mission</h2>
          <p>
            At SustainaFood, we aim to reduce food waste by connecting individuals,
            supermarkets, and restaurants. We believe in giving a second life to good food.
          </p>
        </div>
        <div className="vision">
          <h2>Our Vision</h2>
          <p>
            A world where no good food goes to waste — where sustainability meets technology
            to build a better tomorrow.
          </p>
        </div>
      </section>

      <section className="values">
        <h2>Our Core Values</h2>
        <ul>
          <li>♻️ Sustainability First</li>
          <li>🤝 Community Empowerment</li>
          <li>🚀 Innovation-Driven</li>
          <li>💚 Transparency & Trust</li>
        </ul>
      </section>

      <section className="team">
        <h2>Meet the Team</h2>
        <p>
          We're a passionate group of students, engineers, and food-lovers who want to change
          the world one rescued meal at a time.
        </p>
      </section>

      <section className="cta">
        <h2>Join Our Journey</h2>
        <p>
          Whether you're a donor, restaurant, or simply someone who cares —
          SustainaFood is your place to make a difference.
        </p>
        <button onClick={() => navigate("/signup")}>Let’s Rescue Food Together  💚</button>
      </section>
    </div>
          <Footer1></Footer1>
          <Footer2 />
    </>
  );
};

export default About;