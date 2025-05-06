import { createData, updateData, deleteData, getData } from "./helpers"; // Adjust path to your helper

const apiUrl = "http://localhost:5001/product";

// Function to create a product
export const createProduct = async (productData) => {
  try {
    const response = await createData(
      `${apiUrl}/create`,
      productData,
      { "Content-Type": "multipart/form-data" } // Required for file upload
    );
    return response;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Function to get all products
export const getAllProductsByUser = async () => {
  try {
    const response = await getData(`${apiUrl}/byUser`);
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Function to get a product by ID
export const getProductById = async (productId) => {
  try {
    const response = await getData(`${apiUrl}/${productId}`);
    return response;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
};

// Function to update a product
export const updateProduct = async (productId, updatedData) => {
  try {
    const response = await updateData(
      `${apiUrl}/${productId}`,
      updatedData,
      { "Content-Type": "multipart/form-data" } // Required for file upload
    );
    return response;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}; // Function to delete a product
export const deleteProduct = async (productId) => {
  try {
    const response = await deleteData(`${apiUrl}/${productId}`);
    return response;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
export const getProductByCategoryId = async (catId) => {
  try {
    const response = await getData(`${apiUrl}/byCategory/${catId}`);
    return response;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
