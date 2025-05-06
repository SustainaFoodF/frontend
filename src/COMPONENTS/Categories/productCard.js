import { useState, useEffect } from "react";
import { addProductToCart } from "../../services/cartService";
import { getNutritionInfo } from "../../services/nutritionService";
import { StarRatingDisplay, StarRatingInput } from "./StarRating";
import { addReview, getProductReviews } from "../../services/reviewService";
import "./productCard.css";

export default function ProductCard({ product, index, setReloadNavbar, currentUser }) {
  const [showCountOption, setShowCountOption] = useState(false);
  const [count, setCount] = useState(0);
  const [nutritionInfo, setNutritionInfo] = useState(null);
  const [showNutrition, setShowNutrition] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [showRatingInput, setShowRatingInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(product.averageRating || 0);
  const [reviewCount, setReviewCount] = useState(product.reviews?.length || 0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { reviews, averageRating } = await getProductReviews(product._id);
        setAverageRating(averageRating);
        setReviewCount(reviews.length);
        const userReview = reviews.find(r => r.user._id === currentUser?._id);
        if (userReview) setUserRating(userReview.rating);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [product._id, currentUser]);

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
      setShowNutrition(true);
    }
  };

  const handleHideNutrition = () => {
    setShowNutrition(false);
  };

  const submitRating = async () => {
    if (userRating === 0) return;
    setIsLoading(true);
    try {
      await addReview(product._id, userRating);
      const { reviews, averageRating } = await getProductReviews(product._id);
      setAverageRating(averageRating);
      setReviewCount(reviews.length);
      setShowRatingInput(false);
    } catch (error) {
      console.error("Error submitting rating:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="product" key={index}>
      <div className="s1">
        <img
          src={`http://localhost:5001/uploads/${product.image}`}
          alt={product.label}
        />
      </div>
      <div className="s2">
        {product.isPromo ? (
          <h3>
            <span className="old-price">{product.prix.toFixed(2)} DT</span>
            <span className="new-price">{product.nouveauPrix.toFixed(2)} DT</span>
          </h3>
        ) : (
          <h3>{product.prix.toFixed(2)} DT</h3>
        )}
        <p>{product.label}</p>
        
        {/* Nouveau: Affichage des étoiles */}
        <div className="rating-section">
          <StarRatingDisplay rating={averageRating} />
          <span className="rating-count">({reviewCount} avis)</span>
        </div>
      </div>
      <div className="s3">
        <p>Quantité : {product.quantity}</p>
      </div>

      {product.isPromo && (
        <div className="promo-message">
          <p>Profitez de cette offre spéciale avant qu'elle n'expire !</p>
        </div>
      )}

      {/* Nouveau: Contrôles de notation */}
      <div className="rating-controls">
        <button className="rate-button" onClick={() => setShowRatingInput(!showRatingInput)}>
          Rate this product
        </button>

        {showRatingInput && (
          <div className="rating-input-container">
            <StarRatingInput rating={userRating} setRating={setUserRating} />
            <div className="rating-buttons">
              <button className="submit-rating" onClick={submitRating} disabled={isLoading}>
                {isLoading ? "Envoi..." : "Submit"}
              </button>
              <button className="cancel-rating" onClick={() => setShowRatingInput(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

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