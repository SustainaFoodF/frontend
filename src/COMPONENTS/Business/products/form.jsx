import React, { useState, useEffect } from "react";
import "./form.css"; // Import CSS file
import { getAllCategoriesByUser } from "../../../services/categoryService";
import { createProduct, updateProduct } from "../../../services/prodcutService";

export default function ProductForm({ notifyParent, selectedProduct }) {
  console.log(selectedProduct?.category?._id);
  const action = selectedProduct == null ? "add" : "edit";
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const refreshData = async () => {
    setLoadingCategories(true);
    const result = await getAllCategoriesByUser();
    setCategories(result);
    setLoadingCategories(false);
  };
  useEffect(() => {
    refreshData();
  }, []);
  // Initialize state
  const [data, setData] = useState({
    label: "",
    description: "",
    category: "",
    quantity: 0,
    prix: 0.0,
    dateExp: "",
    image: null,
  });

  // Pre-fill form if editing
  useEffect(() => {
    if (selectedProduct) {
      setData({
        label: selectedProduct.label,
        description: selectedProduct.description || "",
        category: selectedProduct.category
          ? selectedProduct.category._id.toString()
          : "", // Convert ObjectId to string
        quantity: selectedProduct.quantity,
        prix: selectedProduct.prix,
        dateExp: selectedProduct.dateExp
          ? new Date(selectedProduct.dateExp).toISOString().split("T")[0]
          : "",
        image: null,
      });
    }
  }, [selectedProduct]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setData((prev) => ({ ...prev, image: e.target.files[0] }));
  };
  const validateForm = () => {
    if (!data.label.trim()) {
      setError("Le label est requis.");
      return false;
    }
    if (!data.category) {
      setError("Veuillez sélectionner une catégorie.");
      return false;
    }
    if (data.quantity <= 0) {
      setError("La quantité doit être supérieure à zéro.");
      return false;
    }
    if (data.prix <= 0) {
      setError("Le prix doit être supérieur à zéro.");
      return false;
    }
    if (data.dateExp && data.dateExp !== "") {
      const today = new Date();
      const selectedDate = new Date(data.dateExp);
      if (selectedDate <= today) {
        setError("La date d'expiration doit être ultérieure à aujourd'hui.");
        return false;
      }
    } else {
      setError("La date d'expiration doit être ultérieure à aujourd'hui.");
      return false;
    }
    setError("");
    return true;
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("label", data.label);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("quantity", data.quantity);
    formData.append("prix", data.prix);
    formData.append("dateExp", data.dateExp);
    if (data.image) {
      formData.append("image", data.image);
    }

    try {
      if (action === "add") {
        await createProduct(formData);
      } else {
        await updateProduct(selectedProduct._id, formData);
      }

      notifyParent(); // Notify parent to refresh product list
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };
  if (loadingCategories) {
    return <>... loading </>;
  } else {
    return (
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="label">Label</label>
          <input
            id="label"
            name="label"
            type="text"
            value={data.label}
            onChange={handleChange}
            placeholder="Enter product label"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={data.description}
            onChange={handleChange}
            placeholder="Enter product description"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select name="category" onChange={handleChange} value={data.category}>
            <option value="">Sélectionner une catégorie</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id.toString()}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            value={data.quantity}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="prix">Prix</label>
          <input
            id="prix"
            name="prix"
            type="number"
            step="0.01"
            value={data.prix}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="dateExp">Expiration Date</label>
          <input
            id="dateExp"
            name="dateExp"
            type="date"
            value={data.dateExp}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Product Image</label>
          <input id="image" type="file" onChange={handleFileChange} />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" className="submit-btn">
          {action === "add" ? "Ajouter" : "Modifier"}
        </button>
      </form>
    );
  }
}
