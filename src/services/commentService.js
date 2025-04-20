import { createData, updateData } from "./helpers"; // Adjust path to your helper

const apiUrl = "http://localhost:5001/comments";

// Function to create a post
export const createComment = async (postData) => {
  try {
    const response = await createData(`${apiUrl}/create`, postData);
    return response;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

// Function to update a post
export const updateComment = async (postId, commentId, value) => {
  try {
    const response = await updateData(`${apiUrl}`, {
      postId,
      commentId,
      value,
    });
    return response;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};
// Function to delete a post
export const deleteComment = async (postId, commentId) => {
  try {
    const response = await updateData(`${apiUrl}/deleteComment`, {
      postId,
      commentId,
    });
    return response;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};
