import { useEffect, useState } from "react";
import "./index.css"; // Import the styles
import CategoriesTable from "./table";
import CategoryForm from "./form";
import { getAllCategoriesByUser } from "../../../services/categoryService";

export default function Categories() {
  const [openAddForm, setOpenAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const refreshData = async () => {
    setLoading(true);
    const result = await getAllCategoriesByUser();
    if (result) {
      setCategories(result);
    }
    setLoading(false);
    setOpenAddForm(false);
  };
  useEffect(() => {
    refreshData();
  }, []);

  return (
    <>
      {openAddForm ? (
        <CategoryForm
          notifyParent={refreshData}
          selectedCategory={selectedCategory}
        />
      ) : (
        <>
          {loading ? (
            "loading..."
          ) : (
            <CategoriesTable
              setOpenAddForm={setOpenAddForm}
              categories={categories}
              refreshData={refreshData}
              setSelectedCategory={setSelectedCategory}
            />
          )}
        </>
      )}
    </>
  );
}
