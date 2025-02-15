import React, { useEffect, useState } from "react";
import "./List.css";

const List = () => {
    const [items, setItems] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch("http://localhost:5001/articles"); // Remplace avec ton endpoint réel
                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status}`);
                }
                const data = await response.json();
                setItems(data);
            } catch (err) {
                setError("Erreur lors du chargement des articles.");
                console.error(err);
            }
        };

        fetchItems();
    }, []);

    return (
        <div className="list-container">
            <h2 className="list-title">Liste des Articles</h2>

            {error && <p className="error-message">{error}</p>}

            <ul className="list-items">
                {items.length > 0 ? (
                    items.map((item) => (
                        <li key={item.id} className="list-item">
                            <img src={item.image} alt={item.title} className="item-image" />
                            <div className="item-details">
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </div>
                        </li>
                    ))
                ) : (
                    <p className="no-items">Aucun article disponible.</p>
                )}
            </ul>
        </div>
    );
};

export default List;
