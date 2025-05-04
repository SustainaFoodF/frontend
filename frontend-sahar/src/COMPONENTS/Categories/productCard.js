import { useState } from "react";
import { addProductToCart } from "../../services/cartService";
import { getNutritionInfo } from "../../services/nutritionService";
import "./productCard.css";

export default function ProductCard({ product, index, setReloadNavbar }) {
  const [showCountOption, setShowCountOption] = useState(false);
  const [count, setCount] = useState(0);
  const [nutritionInfo, setNutritionInfo] = useState(null);
  const [showNutrition, setShowNutrition] = useState(false);

  const handleAddToCart = () => {
    addProductToCart(product, count);
    setReloadNavbar((prev) => !prev);
    setShowCountOption(false);
    setCount(1);
  };

  const handleShowNutrition = async () => {
    try {
      const info = await getNutritionInfo(product.label);
      setNutritionInfo(info);
      setShowNutrition(true);
    } catch (error) {
      console.error("Failed to fetch nutrition info:", error);
      setNutritionInfo({
        error: "Impossible de charger les informations nutritionnelles",
      });
      setShowNutrition(true); // Montre quand même la section avec le message d'erreur
    }
  };

  const handleHideNutrition = () => {
    setShowNutrition(false);
  };

  return (
    <div className="product" key={index}>
      {/* Badge En Promotion */}
      {product.isPromo && (
        <div className="promo-badge">
          <span>En Promotion</span>
        </div>
      )}

      <div className="s1">
        <img
          src={`http://localhost:5001/uploads/${product.image}`}
          alt={"no img"}
        />
      </div>
      <div className="s2">
        {product.isPromo ? (
          <>
            <h3>
              <span className="old-price">{product.oldPrice} DT</span>
              <span className="promo-price">{product.prix} DT</span>
            </h3>
          </>
        ) : (
          <h3>{product.prix} DT</h3>
        )}
        <p>{product.label}</p>
      </div>
      <div className="s3">
        <p>Quantite : {product.quantity}</p>
      </div>

      {/* Message Spécial pour Produits en Promotion */}
      {product.isPromo && (
        <div className="promo-message">
          <p>Profitez de cette offre spéciale avant qu'elle n'expire !</p>
        </div>
      )}

      {showCountOption ? (
        <div className="addbtn">
          <div className="qty">
            <button
              onClick={() => {
                if (count > 1) {
                  setCount(count - 1);
                }
              }}
            >
              -
            </button>
            <p>{count}</p>
            <button
              onClick={() => {
                if (count < product.quantity) setCount(count + 1);
              }}
            >
              +
            </button>
          </div>
          <button
            className="addtocart"
            onClick={() => {
              handleAddToCart();
            }}
          >
            Add to cart
          </button>
          <button
            className="cancelFromCard"
            onClick={() => {
              setShowCountOption(false);
              setCount(1);
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="addbtn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
            onClick={() => setShowCountOption(true)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </div>
      )}

      <div className="nutrition-section">
        {!showNutrition ? (
          <button
            className="nutrition-btn show-btn"
            onClick={handleShowNutrition}
          >
            Show Nutrition Info
          </button>
        ) : (
          <div className="nutrition-info">
            <h4>Nutrition Information:</h4>
            {nutritionInfo ? (
              <ul>
                <li>Calories: {nutritionInfo.calories}</li>
                <li>Proteins: {nutritionInfo.proteins}g</li>
                <li>Fats: {nutritionInfo.fats}g</li>
                <li>Carbs: {nutritionInfo.carbs}g</li>
              </ul>
            ) : (
              <p>Loading nutrition info...</p>
            )}
            <button
              className="nutrition-btn hide-btn"
              onClick={handleHideNutrition}
            >
              Hide Nutrition Info
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
