import axios from "axios";

// Function to create headers for Axios requests
const createHeadersForAxios = (defaultHeaders = {}) => {
  // Check if the user is logged in by looking for the token in localStorage
  const token = localStorage.getItem("token");

  // If the token exists, return the headers with the Authorization key
  if (token) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        ...defaultHeaders, // Merge with any default headers passed in
      },
    };
  }

  // If there's no token, return the default headers only
  return {
    headers: {
      ...defaultHeaders, // Merge with any default headers passed in
    },
  };
};

// Function to create data
const createData = async (url, data, defaultHeaders = {}) => {
  try {
    const headers = createHeadersForAxios(defaultHeaders);
    const response = await axios.post(url, data, headers);
    return response.data;
  } catch (error) {
    console.error("Error creating data:", error);
    throw error;
  }
};

// Function to update data
const updateData = async (url, data, defaultHeaders = {}) => {
  try {
    const headers = createHeadersForAxios(defaultHeaders);
    const response = await axios.put(url, data, headers);
    return response.data;
  } catch (error) {
    console.error("Error updating data:", error);
    throw error;
  }
};

// Function to delete data
const deleteData = async (url, defaultHeaders = {}) => {
  try {
    const headers = createHeadersForAxios(defaultHeaders);
    const response = await axios.delete(url, headers);
    return response.data;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
};

// Function to get data
const getData = async (url, defaultHeaders = {}) => {
  try {
    const headers = createHeadersForAxios(defaultHeaders);
    const response = await axios.get(url, headers);
    return response.data;
  } catch (error) {
    console.error("Error getting data:", error);
    throw error;
  }
};
const deleteFile = async (filename) => {
  const url = "http://localhost:5001/files/delete/" + filename;
  try {
    const response = await deleteData(url);
    return response;
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
};
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await createData(
      "http://localhost:5001/files/upload",
      formData,
      {
        "Content-Type": "multipart/form-data",
      }
    );
    return response.filename;
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
};

export { createData, updateData, deleteData, getData, uploadFile, deleteFile };
