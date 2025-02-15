import React, { useEffect, useState } from "react";
import "./Livraison.css";

const Livraison = () => {
    const [livraisons, setLivraisons] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const email = localStorage.getItem("userEmail");
        if (!email) {
            setError("🚨 Aucun email trouvé. Veuillez vous reconnecter.");
            return;
        }

        const fetchLivraisons = async () => {
            try {
                const response = await fetch(`http://localhost:5001/livraisons/livreur/${email}`);
                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status}`);
                }
                const data = await response.json();
                if (data.success && data.livraisons) {
                    setLivraisons(data.livraisons);
                } else {
                    throw new Error("Données de livraison invalides.");
                }
            } catch (err) {
                setError("Erreur lors de la récupération des livraisons.");
                console.error(err);
            }
        };

        fetchLivraisons();
    }, []);

    return (
        <div className="livraison-container">
            <h2>Mes Livraisons</h2>
            {error && <p className="error-message">{error}</p>}
            {livraisons.length === 0 ? (
                <p>Aucune livraison en cours.</p>
            ) : (
                <ul className="livraison-list">
                    {livraisons.map((livraison) => (
                        <li key={livraison.id} className="livraison-item">
                            <p><strong>Commande :</strong> {livraison.commande}</p>
                            <p><strong>Adresse :</strong> {livraison.adresse}</p>
                            <p><strong>Statut :</strong> {livraison.statut}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Livraison;
