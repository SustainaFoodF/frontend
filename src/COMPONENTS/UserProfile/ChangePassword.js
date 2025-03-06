import React, { useState, useEffect } from 'react'; 
import axios from 'axios';

const ChangePassword = ({ userId }) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChangePassword = async () => {
        if (!userId) {
            setError("Utilisateur non identifié.");
            return;
        }

        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("Tous les champs sont obligatoires.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Les nouveaux mots de passe ne correspondent pas.");
            return;
        }

        try {
            // Optionnel : récupérer le token depuis le stockage local si tu utilises JWT
            const token = localStorage.getItem("token");

            const response = await axios.put(
                `http://localhost:5001/auth/change-password/${userId}`,
                { oldPassword, newPassword },
                {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "", // Ajoute l'authentification si nécessaire
                        "Content-Type": "application/json",
                    },
                }
            );

            setMessage(response.data.message);
            setError("");

            // Réinitialiser les champs après un succès
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setError(err.response?.data?.message || "Une erreur s'est produite.");
        }
    };

    // Effacer les messages après 5 secondes
    useEffect(() => {
        if (message || error) {
            const timer = setTimeout(() => {
                setMessage("");
                setError("");
            }, 5000);
            
            return () => clearTimeout(timer);
        }
    }, [message, error]);

    return (
        <div className='accountsettings'>
            <h1 className='mainhead1'>Changer le mot de passe</h1>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}

            <div className='form'>
                <div className='form-group'>
                    <label htmlFor='oldpass'>Ancien mot de passe <span>*</span></label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='newpass'>Nouveau mot de passe <span>*</span></label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='confirmpass'>Confirmer le mot de passe <span>*</span></label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
            </div>

            <button className='mainbutton1' onClick={handleChangePassword}>
                Enregistrer les modifications
            </button>
        </div>
    );
};

export default ChangePassword;
