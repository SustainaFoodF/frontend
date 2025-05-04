import React, { useEffect, useState } from "react";
import "./AffecterTaches.css";

const AffecterTaches = () => {
  const [orders, setOrders] = useState([]);
  const [deliverers, setDeliverers] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedDeliverer, setSelectedDeliverer] = useState("");
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingDeliverers, setLoadingDeliverers] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5001/command");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        setErrorMessage("Erreur lors de la récupération des commandes.");
      } finally {
        setLoadingOrders(false);
      }
    };

    const fetchDeliverers = async () => {
      try {
        const response = await fetch("http://localhost:5001/auth/livreurs");
        const data = await response.json();
        if (data.deliverers) {
          setDeliverers(data.deliverers);
        } else if (Array.isArray(data)) {
          setDeliverers(data);
        } else {
          setDeliverers([data]);
        }
      } catch (error) {
        setErrorMessage("Erreur lors de la récupération des livreurs.");
      } finally {
        setLoadingDeliverers(false);
      }
    };

    fetchOrders();
    fetchDeliverers();
  }, []);

  const calculateTotal = (command) =>
    command.products.reduce(
      (sum, item) => sum + item?.product.prix * item.quantity,
      0
    );

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleAssignTask = async () => {
    if (!selectedOrder || !selectedDeliverer) {
      alert("Veuillez sélectionner une commande et un livreur.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/command/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commandId: selectedOrder,
          delivererId: selectedDeliverer,
        }),
      });

      if (response.ok) {
        alert("✅ Tâche affectée avec succès !");
        setSelectedOrder("");
        setSelectedDeliverer("");
      } else {
        alert("❌ Erreur lors de l'affectation.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      alert("❌ Une erreur est survenue.");
    }
  };

  return (
    <div className="affectertaches">
      <h2>Affecter une tâche</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <div className="form-group">
        <label>Commande :</label>
        <select
          value={selectedOrder}
          onChange={(e) => setSelectedOrder(e.target.value)}
          disabled={loadingOrders || orders.length === 0}
        >
          <option value="">-- Sélectionnez une commande --</option>
          {loadingOrders ? (
            <option>Chargement...</option>
          ) : (
            orders.map((command) => (
              <option key={command._id} value={command._id}>
                {command.owner.name} —{" "}
                {command.products.map((p) => p.product.label).join(", ")} —{" "}
                {formatDate(command.dateLivraison)} —{" "}
                {calculateTotal(command).toFixed(2)} Dt
              </option>
            ))
          )}
        </select>
      </div>

      <div className="form-group">
        <label>Livreur :</label>
        <select
          value={selectedDeliverer}
          onChange={(e) => setSelectedDeliverer(e.target.value)}
          disabled={loadingDeliverers || deliverers.length === 0}
        >
          <option value="">-- Sélectionnez un livreur --</option>
          {loadingDeliverers ? (
            <option>Chargement...</option>
          ) : (
            deliverers.map((deliverer) => (
              <option key={deliverer._id} value={deliverer._id}>
                {deliverer.name}
              </option>
            ))
          )}
        </select>
      </div>

      <button
        className="assign-button"
        onClick={handleAssignTask}
        disabled={loadingOrders || loadingDeliverers}
      >
        ✅ Affecter
      </button>
    </div>
  );
};

export default AffecterTaches;
