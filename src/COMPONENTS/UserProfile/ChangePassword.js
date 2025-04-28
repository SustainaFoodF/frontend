import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [userEmail, setUserEmail] = useState(""); // Utiliser l'email au lieu de l'ID utilisateur

    // Utiliser useEffect pour récupérer l'email de l'utilisateur au montage du composant
    useEffect(() => {
        const storedUserEmail = localStorage.getItem("userEmail"); // Récupérer l'email depuis localStorage
        console.log("Stored Email from localStorage:", storedUserEmail); // Débogage

        if (storedUserEmail) {
            setUserEmail(storedUserEmail);
        } else {
            setError("Email utilisateur manquant.");
        }
    }, []); // Cette fonction sera exécutée une seule fois au montage

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setError("Les nouveaux mots de passe ne correspondent pas.");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5001/users/change-password/${userEmail}`, {
                oldPassword,
                newPassword,
                confirmPassword
            });
            setMessage(response.data.message);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Une erreur s'est produite.");
        }
    };

    return (
        <div className='accountsettings'>
            <h1 className='mainhead1'>Change Password</h1>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}

            <div className='form'>
                <div className='form-group'>
                    <label htmlFor='oldpass'>Old Password <span>*</span></label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='newpass'>New Password <span>*</span></label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='confirmpass'>Confirm New Password <span>*</span></label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
            </div>

            <button className='mainbutton1' onClick={handleChangePassword}>
                Save Changes
            </button>
        </div>
    );
}

export default ChangePassword;