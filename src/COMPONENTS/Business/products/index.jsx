import { useEffect, useState } from "react";
import "./index.css"; // Import the styles
import ProductForm from "./form";
import ProductsTable from "./table";
import { getAllProductsByUser } from "../../../services/prodcutService";

export default function Products() {
  const [openAddForm, setOpenAddForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const refreshData = async () => {
    setLoading(true);
    const result = await getAllProductsByUser();
    if (result) {
      setProducts(result);
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
        <>
          <ProductForm
            notifyParent={refreshData}
            selectedProduct={selectedProduct}
          />
        </>
      ) : (
        <>
          {loading ? (
            "loading..."
          ) : (
            <>
              {" "}
              <ProductsTable
                setOpenAddForm={setOpenAddForm}
                products={products}
                refreshData={refreshData}
                setSelectedProduct={setSelectedProduct}
              />
            </>
          )}
        </>
      )}
    </>
  );
}
