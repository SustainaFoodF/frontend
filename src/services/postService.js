import { createData, updateData, deleteData, getData } from "./helpers"; // Adjust path to your helper

const apiUrl = "http://localhost:5001/posts";

// Function to create a post
export const createPost = async (postData) => {
  try {
    const response = await createData(`${apiUrl}/create`, postData);
    return response;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

// Function to get all posts
export const getAllPosts = async () => {
  try {
    const response = await getData(apiUrl);
    return response;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

// Function to get a post by ID
export const getPostById = async (postId) => {
  try {
    const response = await getData(`${apiUrl}/${postId}`);
    return response;
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    throw error;
  }
};

// Function to update a post
export const updatePost = async (postId, updatedData) => {
  try {
    const response = await updateData(`${apiUrl}/${postId}`, updatedData);
    return response;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};
export const addReview = async (postId, type) => {
  try {
    const response = await updateData(`${apiUrl}/${postId}/review`, {
      type,
    });
    return response;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};
// Function to delete a post
export const deletePost = async (postId) => {
  try {
    const response = await deleteData(`${apiUrl}/${postId}`);
    return response;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

export const deleteReview = async (postId, type) => {
  try {
    const response = await updateData(`${apiUrl}/${postId}/delete-review`, {
      type,
    });
    return response;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};
