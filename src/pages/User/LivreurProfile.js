import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer1 from "../../COMPONENTS/Footer/Footer1";
import Footer2 from "../../COMPONENTS/Footer/Footer2";
import NavbarLivreur from "../../COMPONENTS/NavbarLivreur/navbarlivreur";
import SingleBanner from "../../COMPONENTS/Banners/SingleBanner";
import LivreurSidebar from "../../COMPONENTS/UserProfile/LivreurSidebar";
import AccountSettings from "../../COMPONENTS/UserProfile/AccountSettings";
import ChangePassword from "../../COMPONENTS/UserProfile/ChangePassword";
import LivreurHome from "../../pages/livreurhome";
import "./LivreurProfile.css";
import loginImage from "../../pages/user-profile-icon-symbol-template-free-vector.jpg";
import { FaCommentDots } from "react-icons/fa"; 
import LegalNotice from "../../COMPONENTS/UserProfile/LegalNotice";

const LivreurProfile = () => {
    const { activepage } = useParams();
    const navigate = useNavigate();
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
                const response = await fetch(`http://localhost:5001/user/email/${email}`);
                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status}`);
                }
                const data = await response.json();

                if (data.success && data.user) {
                    if (data.user.role !== "livreur") {
                        setError("❌ Accès refusé : Ce compte n'est pas un livreur.");
                        setTimeout(() => navigate("/userprofile"), 2000); // Redirection vers UserProfile après 2s
                    } else {
                        setUser(data.user);
                    }
                } else {
                    throw new Error("Les données utilisateur sont invalides.");
                }
            } catch (err) {
                setError("Erreur lors de la récupération des informations du livreur.");
                console.error(err);
            }
        };

        fetchUserByEmail();
    }, [email, activepage, navigate]);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className='livreurprofile'>
            <NavbarLivreur />
            <SingleBanner 
                heading="Profil du Livreur"
                bannerimage="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=774&q=80" 
            />

            <div className="profile-header">
                <div className="profile-image-container">
                    <img 
                        src={user?.image ? 
                            (user.image.startsWith("data:image") ? user.image : `http://localhost:5001/uploads/${user.image}`) 
                            : loginImage} 
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

            <div className='livreurprofilein'>
                <div className='left'>
                    <LivreurSidebar activepage={activepage} />
                </div>
                <div className='right'>
                    {activepage === 'accountsettings' && <AccountSettings />}
                    {activepage === 'changepassword' && <ChangePassword userId={user._id}  />}
                    {activepage === 'LivreurHome' && <LivreurHome />} 
                    {activepage === 'legalnotice' && <LegalNotice />}
                </div>
            </div>

            <Footer1 />
            <Footer2 />
        </div>
    );
};

export default LivreurProfile;
