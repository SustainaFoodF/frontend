import React from 'react';
import Footer1 from '../COMPONENTS/Footer/Footer1';
import Footer2 from '../COMPONENTS/Footer/Footer2';
import NavbarLivreur from '../COMPONENTS/NavbarLivreur/navbarlivreur';
import Livraison from '../COMPONENTS/UserProfile/Livraison'
import './livreurhome.css';

const LivreurHome = () => {
  return (
    <div className="livreur-home-container">
      <NavbarLivreur reloadnavbar={false} />

      {/* Contenu principal */}
      <div className="content-container">
      <Livraison/>
      </div>

      <Footer1 />
      <Footer2 />
    </div>
  );
};

export default LivreurHome;