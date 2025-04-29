import { useEffect, useState } from "react";
import ProductCard from "./productCard";

export default function ProductsComponent({ products, setReloadNavbar }) {
  const [search, setSearch] = useState("");
  const [filtredProducts, setFiltredProdcuts] = useState(products);
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
