// src/pages/ContactUs.jsx
import React, { useState } from "react";
import Navbar from "../COMPONENTS/Navbar/Navbar";
import Footer1 from "../COMPONENTS/Footer/Footer1";
import Footer2 from "../COMPONENTS/Footer/Footer2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createMessage } from "../services/messageService"; // Import du service
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Utilisation du service messageService
      const result = await createMessage(formData);
      
      console.log("✅ Réponse:", result);

      if (result) {
        toast.success(result.message || "Votre message a été envoyé avec succès !");
        setFormData({ fullName: "", email: "", message: "" });
      } else {
        toast.error(result.message || "Une erreur est survenue, veuillez réessayer.");
      }
    } catch (err) {
      console.error("⚠️ Erreur:", err);
      toast.error(err.message || "Erreur lors de l'envoi du message, veuillez réessayer.");
    }
  };

  return (
    <>
      <Navbar reloadnavbar={false} />
      <div className="contact-container">
        <section className="contact-header">
          <h1>Contact Us 📩</h1>
          <p>Have a question or feedback? We'd love to hear from you!</p>
        </section>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Your full name"
          />

          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />

          <label htmlFor="message">Your Message</label>
          <textarea
            id="message"
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message here..."
          />

          <button type="submit">Send Message 🚀</button>
        </form>
      </div>

      <Footer1 />
      <Footer2 />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  );
};

export default ContactUs;
