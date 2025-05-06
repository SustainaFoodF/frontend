import React from 'react';
import './WhatsAppButton.css';

const WhatsAppButton = () => {
  const handleClick = () => {
    window.open('https://wa.me/+21656440114', '_blank');
  };

  return (
    <div className="whatsapp-button" onClick={handleClick}>
      <i className="fab fa-whatsapp"></i>
    </div>
  );
};

export default WhatsAppButton;