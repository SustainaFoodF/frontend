import { useState } from "react";
import { addProductToCart } from "../../services/cartService";

export default function ProductCard({ product, index, setReloadNavbar }) {
  const [showCountOption, setShowCountOption] = useState(false);
  const [count, setCount] = useState(0);
  const handleAddToCart = () => {
    addProductToCart(product, count);
    setReloadNavbar((prev) => !prev);
    setShowCountOption(false);

    setCount(1);
  };
  return (
    <div className="product" key={index}>
      <div className="s1">
        <img
          src={`http://localhost:5001/uploads/${product.image}`}
          alt={"no img"}
        />
      </div>
      <div className="s2">
        <h3>{product.prix} DT</h3>
        <p>{product.label}</p>
      </div>
      <div className="s3">
        <p>Quantite : {product.quantity}</p>
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
    </div>
  );
}
