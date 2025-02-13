import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/rsl";

// Create a new RSL entry
export const createRSL = async (rslData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, rslData);
    return response.data;
  } catch (error) {
    console.error("Error creating RSL:", error.response?.data || error.message);
    throw error;
  }
};

// Get all RSL entries
export const getAllRSLs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching RSLs:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get a single RSL by ID
export const getRSLById = async (rslId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${rslId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching RSL:", error.response?.data || error.message);
    throw error;
  }
};

// Update an RSL entry by ID
export const updateRSLById = async (rslId, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${rslId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating RSL:", error.response?.data || error.message);
    throw error;
  }
};

// Delete an RSL entry by ID
export const deleteRSLById = async (rslId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${rslId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting RSL:", error.response?.data || error.message);
    throw error;
  }
};


