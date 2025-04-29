import React, { useState } from "react";
import "./form.css"; // Import CSS file
import {
  createCategory,
  updateCategory,
} from "../../../services/categoryService";

export default function CategoryForm({ notifyParent, selectedCategory }) {
  const action = selectedCategory == null ? "add" : "edit";
  const [label, setLabel] = useState(
    selectedCategory ? selectedCategory.label : ""
  );
  const [description, setDescription] = useState(
    selectedCategory ? selectedCategory.description : ""
  ); // Add description state

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!label.trim()) return; // Ensure the label is not empty
    if (action === "add") {
      await createCategory({ label, description }); // Include description in the createCategory request
    } else {
      await updateCategory(selectedCategory._id, {
        label,
        description,
      });
    }
    notifyParent(); // Notify parent component (e.g., to refresh the list of categories)
  };

  return (
    <form onSubmit={handleSubmit} className="category-form">
      <div className="form-group">
        <label htmlFor="label">Category Label</label>
        <input
          id="label"
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Enter category label"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter category description"
        />
      </div>

      <button type="submit" className="submit-btn">
        {action === "add" ? "Ajouter" : "Modifier"}
      </button>
    </form>
  );
}
