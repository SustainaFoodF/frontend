import React from 'react';
import './Livraison.css'; // Import du fichier CSS

const Livraison = () => {
  // Données statiques du livreur
  const deliveryPerson = {
    id: ':  54321',
    name: ':  Jean Dupont',
    totalDeliveries: 10,
    completedDeliveries: 7,
    pendingDeliveries: 3,
  };

  // Données statiques des livraisons
  const deliveries = [
    {
      orderId: '12345',
      orderNumber: 'CMD123456',
      clientId: '67890',
      deliveryAddress: '123 Rue de l\'Exemple, 75001 Paris',
      deliveryDateTime: '2023-10-15 14:30',
      status: 'pending',
      items: [
        { name: 'Pizza', quantity: 2, price: 10 },
        { name: 'Burger', quantity: 1, price: 15 },
      ],
      totalPrice: 35,
    },
    {
      orderId: '67890',
      orderNumber: 'CMD789012',
      clientId: '54321',
      deliveryAddress: '456 Avenue des Champs, 75008 Paris',
      deliveryDateTime: '2023-10-16 18:00',
      status: 'completed',
      items: [
        { name: 'Sushi', quantity: 3, price: 20 },
      ],
      totalPrice: 60,
    },
    {
      orderId: '11223',
      orderNumber: 'CMD334455',
      clientId: '99887',
      deliveryAddress: '789 Boulevard de la Liberté, 75010 Paris',
      deliveryDateTime: '2023-10-17 12:00',
      status: 'in_progress',
      items: [
        { name: 'Pasta', quantity: 1, price: 12 },
        { name: 'Salad', quantity: 2, price: 8 },
      ],
      totalPrice: 28,
    },
  ];

  return (
    <div className="livraison-container">
      {/* Section des statistiques du livreur */}
      <div className="livreur-stats">
        <h2>Statistiques du Livreur</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Nom</span>
            <span className="stat-value">{deliveryPerson.name}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total des Livraisons</span>
            <span className="stat-value">{deliveryPerson.totalDeliveries}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Livraisons Complétées</span>
            <span className="stat-value">{deliveryPerson.completedDeliveries}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Livraisons en Attente</span>
            <span className="stat-value">{deliveryPerson.pendingDeliveries}</span>
          </div>
        </div>
      </div>

      {/* Filtres par date et statut */}
      <div className="filters">
        <h2>Filtres</h2>
        <div className="filter-group">
          <label>Date: </label>
          <input type="date" className="filter-input" />
        </div>
        <div className="filter-group">
          <label>Statut: </label>
          <select className="filter-input">
            <option value="all">Tous</option>
            <option value="pending">En Attente</option>
            <option value="in_progress">En Cours</option>
            <option value="completed">Complétée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>
      </div>

      {/* Tableau des livraisons */}
      <div className="livraison-table">
        <h2>Détails des Livraisons</h2>
        <table>
          <thead>
            <tr>
              <th>Numéro de Commande</th>
              <th>Adresse de Livraison</th>
              <th>Date et Heure</th>
              <th>Statut</th>
              <th>Articles</th>
              <th>Prix Total</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery, index) => (
              <tr key={index}>
                <td>{delivery.orderNumber}</td>
                <td>{delivery.deliveryAddress}</td>
                <td>{delivery.deliveryDateTime}</td>
                <td>
                  <span className={`status-badge ${delivery.status}`}>
                    {delivery.status}
                  </span>
                </td>
                <td>
                  <ul>
                    {delivery.items.map((item, i) => (
                      <li key={i}>
                        {item.name} (x{item.quantity}) - {item.price}DT
                      </li>
                    ))}
                  </ul>
                </td>
                <td>{delivery.totalPrice}DT</td>
               
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Livraison;