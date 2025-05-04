import React, { useState, useRef } from "react";
import axios from "axios";
import "./foodGenerator.css";

const FoodGenerator = () => {
  const [images, setImages] = useState([]);
  const [detectedIngredients, setDetectedIngredients] = useState([]);
  const [ingredientStatuses, setIngredientStatuses] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qualityStatus, setQualityStatus] = useState("");

  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const API_KEY = "b7b9e5d40991478da4c131d80c6366a4";

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setShowCamera(true);
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Unable to access the camera.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        const file = new File([blob], `captured-${Date.now()}.png`, {
          type: "image/png",
        });
        setImages((prev) => [...prev, file]);
        stopCamera();
      },
      "image/png"
    );
  };

  const simulateIngredientStatuses = (ingredients) => {
    const statuses = ["Good", "Average", "Bad"];
    const result = {};
    ingredients.forEach((ingredient) => {
      result[ingredient] = statuses[Math.floor(Math.random() * statuses.length)];
    });
    return result;
  };

  const computeOverallQuality = (ingredientStatusMap) => {
    const values = Object.values(ingredientStatusMap);
    if (values.every((s) => s === "Good")) return "Good";
    if (values.every((s) => s === "Bad")) return "Bad";
    return "Average";
  };

  const handleUpload = async () => {
    if (images.length === 0) {
      setError("Please select or capture at least one image.");
      return;
    }

    setLoading(true);
    setError("");
    setDetectedIngredients([]);
    setQualityStatus("");
    setIngredientStatuses({});

    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await axios.post(
        "http://localhost:5001/product/recipes",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "apiKey": API_KEY, // <-- Clé API ajoutée ici
          },
        }
      );

      const ingredients = response.data.detectedIngredients || [];
      setDetectedIngredients(ingredients);

      const statusMap = simulateIngredientStatuses(ingredients);
      setIngredientStatuses(statusMap);
      setQualityStatus(computeOverallQuality(statusMap));
    } catch (err) {
      console.error(err);
      setError("An error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Upload or Capture Food Images</h2>

      <div className="upload-buttons">
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="file-input-hidden"
        />
        <label htmlFor="file-upload" className="custom-upload-button">
          📁 Select Images
        </label>

        <button className="custom-upload-button" onClick={startCamera}>
          📷 Open Camera
        </button>
      </div>

      {showCamera && (
        <div className="camera-section">
          <video ref={videoRef} autoPlay playsInline className="camera-video" />
          <div className="camera-controls">
            <button className="capture-button" onClick={capturePhoto}>
              📸 Take Photo
            </button>
            <button className="cancel-button" onClick={stopCamera}>
              ❌ Cancel
            </button>
          </div>
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      )}

      {images.length > 0 && (
        <div className="image-preview-container">
          {images.map((image, index) => (
            <div key={index} className="image-card">
              <img
                src={URL.createObjectURL(image)}
                alt="Selected"
                className="preview-image"
              />
              <button
                className="remove-button"
                onClick={() => handleRemoveImage(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="upload-button-container">
        <button
          className="upload-button"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Quality"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {qualityStatus && (
        <div className={`status-indicator status-${qualityStatus.toLowerCase()}`}>
          <strong>Estimated Quality:</strong> {qualityStatus}
        </div>
      )}

      <hr className="divider" />

      {detectedIngredients.length > 0 && (
        <div className="ingredients-section">
          <h3>Detected Ingredients:</h3>
          <ul className="ingredient-list">
            {detectedIngredients.map((ingredient, idx) => (
              <li key={idx}>
                {ingredient}:{" "}
                <strong
                  className={`ingredient-status status-${ingredientStatuses[ingredient]?.toLowerCase()}`}
                >
                  {ingredientStatuses[ingredient] || "Unknown"}
                </strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FoodGenerator;
