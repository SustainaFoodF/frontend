// src/services/messageService.js
import { createData, getData, deleteData } from "./helpers"; // adapte le chemin si besoin

const apiUrl = "http://localhost:5001/messages";

// Create a message (used when user submits the contact form)
export const createMessage = async (messageData) => {
  try {
    const response = await createData(apiUrl, messageData);
    return response;
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
};

// Get all messages (for admin or backoffice)
export const getAllMessages = async () => {
  try {
    const response = await getData(apiUrl);
    return response;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

// Get a specific message by ID
export const getMessageById = async (messageId) => {
  try {
    const response = await getData(`${apiUrl}/${messageId}`);
    return response;
  } catch (error) {
    console.error("Error fetching message by ID:", error);
    throw error;
  }
};

// Delete a message (by admin maybe)
export const deleteMessage = async (messageId) => {
  try {
    const response = await deleteData(`${apiUrl}/${messageId}`);
    return response;
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};
