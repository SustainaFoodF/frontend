import { createData, getData } from "./helpers";

const apiUrl = "http://localhost:5001/product";

export const addReview = async (productId, rating) => {
  try {
    const response = await createData(
      `${apiUrl}/${productId}/reviews`,
      { rating }
    );
    return response;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

export const getProductReviews = async (productId) => {
  try {
    const response = await getData(`${apiUrl}/${productId}/reviews`);
    return {
      reviews: response.reviews || [],
      averageRating: response.averageRating || 0
    };
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    return {
      reviews: [],
      averageRating: 0
    };
  }
};