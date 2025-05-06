import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductByCategoryId } from "../../services/prodcutService";
import { getCategoryById } from "../../services/categoryService";
import Navbar from "../Navbar/Navbar";
import HomeCategories from "../Category/HomeCategories";
import Footer1 from "../Footer/Footer1";
import Footer2 from "../Footer/Footer2";
import "./index.css";
import ProductsComponent from "./products";
export default function ClientCategory() {
  const { categoryId } = useParams(); // Get the categoryId from the URL
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadnavbar, setReloadNavbar] = useState(false);
  const fetchCategory = async () => {
    try {
      if (categoryId) {
        // Fetch category details
        console.log("im here");
        const result = await getCategoryById(categoryId);

        // Fetch products based on categoryId
        const productResult = await getProductByCategoryId(categoryId);

        // If category is found, update state
        if (result) {
          setCategory(result);
        } else {
          setError("Category not found.");
        }

        // If products are found, update state
        if (productResult) {
          setProducts(productResult);
        } else {
          setError("No products found in this category.");
        }
      }
    } catch (err) {
      setError("An error occurred while fetching the data.");
      console.error(err);
    } finally {
      setLoading(false); // Stop loading when both fetches are complete
    }
  };
  useEffect(() => {
    fetchCategory();
  }, [categoryId]); // Re-run when categoryId changes

  // Loading and error handling
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      {" "}
      <Navbar reloadnavbar={reloadnavbar} />
      <HomeCategories />
      <div className="allproducts">
        <h1>{category.label}</h1>
        <ProductsComponent
          products={products}
          setReloadNavbar={setReloadNavbar}
        />
      </div>
      <Footer1 /> <Footer2 />
    </>
  );
}
