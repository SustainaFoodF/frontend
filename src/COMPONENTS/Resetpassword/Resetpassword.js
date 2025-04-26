import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams
import "./Resetpassword.css";

const ResetPassword = () => {
  const { token } = useParams(); // Get the token from the URL
  const [password, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:5001/auth/reset-password/${token}`, // Use the token here
        { password }
      );
      // Set the success message
      setMessage("Mot de passe modifié avec succès !");
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du mot de passe :", error); // Log the error
      setMessage("Erreur lors de la réinitialisation du mot de passe.");
    }
  };

  return (
    <div className="form-container">
      <h2>Réinitialiser le Mot de Passe</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Entrez votre nouveau mot de passe"
          value={password}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Réinitialiser le mot de passe</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ResetPassword;