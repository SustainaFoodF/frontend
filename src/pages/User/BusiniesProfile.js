import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer1 from "../../COMPONENTS/Footer/Footer1";
import Footer2 from "../../COMPONENTS/Footer/Footer2";
import Navbar from "../../COMPONENTS/Navbar/Navbar";
import SingleBanner from "../../COMPONENTS/Banners/SingleBanner";
import BSidebar from "../../COMPONENTS/UserProfile/BSidebar";
import AccountSettings from "../../COMPONENTS/UserProfile/AccountSettings";
import ChangePassword from "../../COMPONENTS/UserProfile/ChangePassword";
import Liste from "../../COMPONENTS/UserProfile/List";
import "./BusiniesProfile.css";
import loginImage from "../../pages/user-profile-icon-symbol-template-free-vector.jpg";
import { FaCommentDots } from "react-icons/fa"; 

const BusinessProfile = () => {
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
                const response = await fetch(`http://localhost:5001/user/email/${email}`);
                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status}`);
                }
                const data = await response.json();
                if (data.success && data.user) {
                    setUser(data.user);
                } else {
                    throw new Error("Les données utilisateur sont invalides.");
                }
            } catch (err) {
                setError("Erreur lors de la récupération des informations utilisateur.");
                console.error(err);
            }
        };

        fetchUserByEmail();
    }, [email, activepage]); // Ajout de `activepage` pour suivre les mises à jour

    return (
        <div className='userprofile'>
            <Navbar />
            <SingleBanner 
                heading="My Profile"
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
                <h2 className="profile-name">{user?.name || "User Name"}</h2>
                <p className="profile-role">{user?.role || "Role inconnu"}</p>
            </div>

            <div className='userprofilein'>
                <div className='left'>
                    <BSidebar activepage={activepage} />
                </div>
                <div className='right'>
                    {activepage === 'accountsettings' && <AccountSettings />}
                    {activepage === 'changepassword' && <ChangePassword />}
                    {activepage === 'article-list' && <Liste />} 
                </div>
            </div>

            <Footer1 />
            <Footer2 />
        </div>
    );
};

export default BusinessProfile;
