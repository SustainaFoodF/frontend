import { useEffect, useState } from "react";
import ProductCard from "./productCard";
import axios from "axios"; // Import axios pour effectuer des requêtes API

export default function ProductsComponent({ products, setReloadNavbar }) {
  const [search, setSearch] = useState("");
  const [filtredProducts, setFiltredProdcuts] = useState(products);
  const [promoProducts, setPromoProducts] = useState([]); // État pour les produits en promotion
  const [promoLoading, setPromoLoading] = useState(true); // État pour le chargement des produits en promo
  console.log(products);
  useEffect(() => {
    if (products) {
      if (search === "") {
        setFiltredProdcuts(products);
      } else {
        const newProducts = products.filter((e) =>
          e.label.toLowerCase().includes(search.toLowerCase())
        );
        setFiltredProdcuts(newProducts);
      }
    }
  }, [search, products]);
  // Charger les produits en promotion au montage
  useEffect(() => {
    const fetchPromoProducts = async () => {
      setPromoLoading(true); // Début du chargement
      try {
        const response = await axios.get("http://localhost:5001/product/promo-products"); // Remplacez par votre endpoint réel
        setPromoProducts(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits en promotion :", error);
      } finally {
        setPromoLoading(false); // Fin du chargement
      }
    };

    fetchPromoProducts();
  }, []);
  return (
    <>
      <div className="searchbar">
        <input
          type="text"
          placeholder="Search for products and categories"
          className="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </div>
      {/* Section Produits en Promotion */}
      <h2>Produits en Promotion</h2>
      <div className="promo-products">
        {promoLoading ? (
          <p>Chargement des produits en promotion...</p>
        ) : promoProducts.length > 0 ? (
          promoProducts.map((item, index) => (
            <ProductCard
              product={item}
              key={index}
              setReloadNavbar={setReloadNavbar}
            />
          ))
        ) : (
          <p>Aucun produit en promotion actuellement.</p>
        )}
      </div>
      <div className="products">
        {filtredProducts
          .filter((p) => p.quantity > 0)
          .map((item, index) => (
            <ProductCard
              product={item}
              key={index}
              setReloadNavbar={setReloadNavbar}
            />
          ))}
      </div>
    </>
  );
}
