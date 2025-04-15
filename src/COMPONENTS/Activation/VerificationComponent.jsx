import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VerificationComponent = () => {
  const { confirmationCode } = useParams(); // Make sure this matches your route
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const response = await axios.post('http://localhost:5001/auth/verify', {
          activationCode: confirmationCode, // Use the correct variable here
        });
        
        if (response.data.success) {
          setIsVerified(true);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Erreur lors de la vérification. Veuillez réessayer.');
        console.error(err);
      }
    };

    verifyAccount();
  }, [confirmationCode]);

  return (
    <div>
      {isVerified ? (
        <h2>Votre compte a été vérifié avec succès !</h2>
      ) : (
        <div>
          <h2>Vérification de votre compte...</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default VerificationComponent;