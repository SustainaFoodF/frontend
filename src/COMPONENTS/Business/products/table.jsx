import { useState } from "react";
import "./table.css";
import { deleteProduct } from "../../../services/prodcutService";
export default function ProductsTable({
  setOpenAddForm,
  products,
  refreshData,
  setSelectedProduct,
}) {
  const [showOptions, setShowOptions] = useState(null);

  const handleOptionClick = (id) => {
    setShowOptions(showOptions === id ? null : id); // Toggle dropdown visibility
  };
  const handleUpdate = (product) => {
    setSelectedProduct(product);
    setOpenAddForm(true);
  };
  const handleDelete = async (id) => {
    await deleteProduct(id);
    await refreshData();
  };

  return (
    <div className="products-container">
      <h1 className="products-title">All Products</h1>
      <div className="products-grid">
        <div
          className="product-card add-button"
          onClick={() => setOpenAddForm(true)}
        >
          <h2 className="product-name">Create New Product</h2>
          <i class="fa-solid fa-plus"></i>
        </div>

        {products.map((product) => (
          <div key={product._id} className="product-card">
            {/* Product Image */}
            {product.image && (
              <img
                src={`http://localhost:5001/uploads/${product.image}`}
                alt={product.label}
                className="product-image"
              />
            )}

            {/* Product Details */}
            <h2 className="product-name">{product.label}</h2>
            <p className="product-description">
              {product.description?.slice(1, 70) + " ..."}
            </p>

            {/* Category Badge */}
            <div className="product-info">
              <p className="product-category">
                <span className="badge badge-category">
                  {product.category?.label || "Non spécifié"}
                </span>
              </p>

              {/* Quantity & Price Badges */}
              <p className="product-quantity">
                <span className="badge badge-quantity">
                  Quantité: {product.quantity}
                </span>
              </p>
              <p className="product-price">
                <span className="badge badge-price">
                  Prix: {product.prix} DT
                </span>
              </p>

              {/* Expiration Date */}
              {product.dateExp && (
                <p className="product-expiry">
                  <span className="badge badge-expiry">
                    Expiration: {new Date(product.dateExp).toLocaleDateString()}
                  </span>
                </p>
              )}
            </div>
            {/* Product Options */}
            <div className="product-options">
              <button
                className="options-btn"
                onClick={() => handleOptionClick(product._id)}
              >
                ...
              </button>

              {/* Dropdown menu for options */}
              {showOptions === product._id && (
                <div className="options-dropdown">
                  <button onClick={() => handleUpdate(product)}>
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(product._id)}>
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
