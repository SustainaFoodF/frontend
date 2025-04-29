import { createData, updateData, deleteData, getData } from "./helpers"; // Adjust path to your helper

const apiUrl = "http://localhost:5001/category";

// Function to create a category
export const createCategory = async (categoryData) => {
  try {
    const response = await createData(`${apiUrl}/create`, categoryData);
    return response;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

// Function to get all categorys
export const getAllCategoriesByUser = async () => {
  try {
    const response = await getData(`${apiUrl}/byUser`);
    return response;
  } catch (error) {
    console.error("Error fetching categorys:", error);
    throw error;
  }
};
export const getAllCategories = async () => {
  try {
    const response = await getData(`${apiUrl}`);
    return response;
  } catch (error) {
    console.error("Error fetching categorys:", error);
    throw error;
  }
};
// Function to get a category by ID
export const getCategoryById = async (categoryId) => {
  try {
    const response = await getData(`${apiUrl}/${categoryId}`);
    return response;
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    throw error;
  }
};

// Function to update a category
export const updateCategory = async (categoryId, updatedData) => {
  try {
    const response = await updateData(`${apiUrl}/${categoryId}`, updatedData);
    return response;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}; // Function to delete a category
export const deleteCategory = async (categoryId) => {
  try {
    const response = await deleteData(`${apiUrl}/${categoryId}`);
    return response;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
