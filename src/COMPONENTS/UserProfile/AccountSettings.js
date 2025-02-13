import React, { useEffect, useState } from "react";
import './AccountSettings.css'
import loginImage from '../../pages/user-profile-icon-symbol-template-free-vector.jpg';

const AccountSettings = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const storedEmail = localStorage.getItem("userEmail");
        console.log("🔍 Email récupéré depuis localStorage :", storedEmail);

        if (!storedEmail) {
            setError("🚨 Aucun email trouvé. Veuillez vous reconnecter.");
        } else {
            setEmail(storedEmail);
        }
    }, []);

    useEffect(() => {
        if (!email) return;

        const fetchUserByEmail = async () => {
            try {
                console.log("🔄 Requête en cours pour récupérer l'utilisateur...");
                const response = await fetch(`http://localhost:5001/user/email/${email}`);

                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                console.log("✅ Données utilisateur récupérées :", data);

                if (data.success && data.user) {
                    setUser(data.user);
                } else {
                    throw new Error("Les données utilisateur sont invalides.");
                }
            } catch (err) {
                setError("Erreur lors de la récupération des informations utilisateur.");
                console.error("❌ Détails de l'erreur :", err);
            }
        };

        fetchUserByEmail();
    }, [email]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleSaveChanges = async () => {
        if (!user) return;
        
        console.log("🔄 Enregistrement des modifications :", user);

        try {
            const response = await fetch(`http://localhost:5001/user/email/${email}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: user.name,
                    role: user.role,
                    image: user.image, 
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccessMessage("✅ Modifications enregistrées avec succès !");
                console.log("✅ Mise à jour réussie :", data);
            } else {
                setError("🚨 Échec de la mise à jour de l'utilisateur.");
            }
        } catch (err) {
            setError("❌ Erreur lors de la mise à jour de l'utilisateur.");
            console.error(err);
        }
    };

    return (
      <div className='accountsettings'>
        <h1 className='mainhead1'>Personal Information</h1>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        {/* 📌 Image de profil */}
        <div className="profile-image-container">
            <img src={user?.imageUrl || loginImage} alt="Profile" className="profile-image" />
        </div>

        <div className='form'>
          <div className='form-group'>
            <label htmlFor='name'>Your Name <span>*</span></label>
            <input 
              type='text' 
              name='name' 
              id='name' 
              value={user?.name || ''} 
              onChange={handleInputChange} 
              disabled={!user} 
            />
          </div>

          <div className='form-group'>
            <label htmlFor='role'>Role <span>*</span></label>
            <input 
              type='text' 
              name='role' 
              id='role' 
              value={user?.role || ''} 
              onChange={handleInputChange} 
              disabled={!user}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='email'>Email <span>*</span></label>
            <input 
              type='email' 
              name='email' 
              id='email' 
              value={user?.email || ''} 
              disabled
            />
          </div>
        </div>

        <button 
          className='mainbutton1' 
          onClick={handleSaveChanges} 
          disabled={!user} 
        >
          Save Changes
        </button>
      </div>
    );
};

export default AccountSettings;
