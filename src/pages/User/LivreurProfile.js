import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer1 from "../../COMPONENTS/Footer/Footer1";
import Footer2 from "../../COMPONENTS/Footer/Footer2";
import SingleBanner from "../../COMPONENTS/Banners/SingleBanner";
import AccountSettings from "../../COMPONENTS/UserProfile/AccountSettings";
import ChangePassword from "../../COMPONENTS/UserProfile/ChangePassword";
import Liste from "../../COMPONENTS/UserProfile/Livraison";
import "./LivreurProfile.css";
import loginImage from "../../pages/user-profile-icon-symbol-template-free-vector.jpg";
import { FaCommentDots } from "react-icons/fa";
import LivreurSidebar from "../../COMPONENTS/UserProfile/LivreurSidebar";
import LivreurNavbar from "../../COMPONENTS/Navbar/LivreurNavBar";


const LivreurProfile = () => {
  const { activepage } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
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
            console.log("📸 Image récupérée :", data.user.image);
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
  }, [email, activepage]);

  return (
    <div className="livreurprofile">
      <LivreurNavbar />
      <SingleBanner
        heading="Profil du Livreur"
        bannerimage="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=774&q=80"
      />

      {error && <p className="error-message">{error}</p>}

      <div className="profile-header">
        <div className="profile-image-container">
          <img
            src={
              user?.image
                ? user.image.startsWith("https://")
                  ? user.image // External URL
                  : user.image.startsWith("data:image")
                  ? user.image // Base64 Image
                  : `http://localhost:5001/uploads/${user.image}` // Local file
                : loginImage // Default image
            }
            alt="Profile"
            className="profile-image"
          />
          <button className="chat-icon">
            <FaCommentDots />
          </button>
        </div>
        <h2 className="profile-name">{user?.name || "Nom du Livreur"}</h2>
        <p className="profile-role">{user?.role || "Rôle inconnu"}</p>
      </div>

      <div className="livreurprofilein">
        <div className="left">
          <LivreurSidebar activepage={activepage} />
        </div>
        <div className="right">
          {activepage === "accountsettings" && <AccountSettings />}
          {activepage === "history" && <Liste />}
          {activepage === "changepassword" && <ChangePassword />}
          {/* {activepage === "orders" && <TaskDashboard />} */}
          
        </div>
      </div>

      <Footer1 />
      <Footer2 />
    </div>
  );
};

export default LivreurProfile;
