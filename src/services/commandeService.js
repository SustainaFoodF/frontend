import { getCartFromLocalStorage } from "./cartService";
import { createData, getData, updateData } from "./helpers";

const apiUrl = "http://localhost:5001/command";

export const createCommand = async (dateLivraison, location, phoneNumber) => {
  try {
    const cart = getCartFromLocalStorage();
    const response = await createData(`${apiUrl}/create`, {
      cart,
      dateLivraison,
      location,
      phoneNumber,
    });
    return response;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};
export const getCommandByUser = async () => {
  try {
    const response = await getData(`${apiUrl}/me`);
    return response;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};
export const payCommand = async (commandId) => {
  const response = await updateData(`${apiUrl}/${commandId}/verifyPayment`);
  return response;
};
