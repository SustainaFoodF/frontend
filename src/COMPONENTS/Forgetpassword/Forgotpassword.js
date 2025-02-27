import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Importer les styles
import "./Forgetpassword.css";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/auth/forgot-password", { email });
      toast.success(response.data); // Affiche le message de succès
      setEmail(""); // Effacer le champ de saisie
    } catch (error) {
      // Vérifier si l'erreur a une réponse et afficher le message
      if (error.response && error.response.data) {
        toast.error(error.response.data); // Afficher le message d'erreur du serveur
      } else {
        toast.error("Erreur lors de l'envoi du lien de réinitialisation."); // Message d'erreur par défaut
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Réinitialiser le Mot de Passe</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Entrez votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Envoyer</button>
      </form>
      <ToastContainer /> {/* Conteneur pour afficher les notifications */}
    </div>
  );
};

export default ForgetPassword;