import { useState } from "react";
import { deleteCategory } from "../../../services/categoryService";

export default function CategoriesTable({
  setOpenAddForm,
  categories,
  refreshData,
  setSelectedCategory,
}) {
  const [showOptions, setShowOptions] = useState(null);

  const handleOptionClick = (id) => {
    setShowOptions(showOptions === id ? null : id); // Toggle dropdown visibility
  };
  const handleUpdate = (category) => {
    setSelectedCategory(category);
    setOpenAddForm(true);
  };
  const handleDelete = async (id) => {
    await deleteCategory(id);
    await refreshData();
  };

  return (
    <div className="categories-container">
      <h1 className="categories-title">All Categories</h1>
      <div className="categories-grid">
        <div
          className="category-card add-button"
          onClick={() => setOpenAddForm(true)}
        >
          <h2 className="category-name">Create New Category</h2>
          <i class="fa-solid fa-plus"></i>
        </div>

        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <h2 className="category-name">{category.label}</h2>
            <p className="category-description">{category.description}</p>
            <div className="category-options">
              <button
                className="options-btn"
                onClick={() => handleOptionClick(category._id)}
              >
                ...
              </button>

              {/* Dropdown menu for options */}
              {showOptions === category._id && (
                <div className="options-dropdown">
                  <button onClick={() => handleUpdate(category)}>Update</button>
                  <button onClick={() => handleDelete(category._id)}>
                    Delete
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
