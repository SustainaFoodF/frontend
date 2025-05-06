import { useEffect, useState } from "react";
import ProductCard from "./productCard";
import axios from "axios";

export default function ProductsComponent({ products, setReloadNavbar }) {
  const [search, setSearch] = useState("");
  const [filtredProducts, setFiltredProducts] = useState(products);
  const [promoProducts, setPromoProducts] = useState([]);
  const [promoLoading, setPromoLoading] = useState(true);

  const isNotExpired = (product) => {
    if (!product.dateExp) return true;
    const expirationDate = new Date(product.dateExp);
    const today = new Date();
    return expirationDate >= today;
  };

  useEffect(() => {
    if (products) {
      const nonExpiredProducts = products.filter(isNotExpired);
      if (search === "") {
        setFiltredProducts(nonExpiredProducts);
      } else {
        const newProducts = nonExpiredProducts.filter((e) =>
          e.label.toLowerCase().includes(search.toLowerCase())
        );
        setFiltredProducts(newProducts);
      }
    }
  }, [search, products]);

  useEffect(() => {
    const fetchPromoProducts = async () => {
      setPromoLoading(true);
      try {
        const response = await axios.get("http://localhost:5001/product/promo-products");
        const nonExpiredPromoProducts = response.data.filter(isNotExpired);
        setPromoProducts(nonExpiredPromoProducts);
      } catch (error) {
        console.error("Erreur API promo-products :", error);
        const localPromoProducts = products.filter(p => p.isPromo && isNotExpired(p));
        setPromoProducts(localPromoProducts);
      } finally {
        setPromoLoading(false);
      }
    };

    fetchPromoProducts();
  }, [products]);

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

      <h2>Produits en Promotion</h2>
      <div className="promo-products">
        {promoLoading ? (
          <p>Chargement des produits en promotion...</p>
        ) : promoProducts.length > 0 ? (
          promoProducts.map((item, index) => (
            <ProductCard
              product={item}
              key={item._id || index}
              setReloadNavbar={setReloadNavbar}
            />
          ))
        ) : (
          <p>Aucun produit en promotion actuellement.</p>
        )}
      </div>

      <h2>Nos Produits</h2>
      <div className="products">
        {filtredProducts
          .filter((p) => p.quantity > 0 && !p.isPromo) // Afficher uniquement les produits non en promotion
          .map((item, index) => (
            <ProductCard
              product={item}
              key={item._id || index}
              setReloadNavbar={setReloadNavbar}
            />
          ))}
      </div>
    </>
  );
}