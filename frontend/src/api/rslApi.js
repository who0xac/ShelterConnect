import axios from "axios";
const API_BASE_URL = "http://localhost:3000/api/rsl";

// Utility function to validate RSL ID
const isValidRSLId = (rslId) => {
  return typeof rslId === "string" || typeof rslId === "number";
};

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
  if (!isValidRSLId(rslId)) {
    throw new Error("Invalid RSL ID. Please provide a valid ID.");
  }

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
  if (!isValidRSLId(rslId)) {
    throw new Error("Invalid RSL ID. Please provide a valid ID.");
  }

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
  if (!isValidRSLId(rslId)) {
    throw new Error("Invalid RSL ID. Please provide a valid ID.");
  }

  try {
    const response = await axios.delete(`${API_BASE_URL}/${rslId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting RSL:", error.response?.data || error.message);
    throw error;
  }
};

// Get only RSL names
export const getRSLNames = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);

    let rslInfo = [];

    // Handle both response formats
    if (Array.isArray(response.data)) {
      rslInfo = response.data.map((rsl) => ({
        id: rsl._id, 
        rslName: rsl.rslName,
        originalObject: rsl, 
      }));
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      rslInfo = response.data.data.map((rsl) => ({
        id: rsl._id, 
        rslName: rsl.rslName,
        
      }));
    } else {
      console.error("Unexpected response format:", response.data);
      throw new Error("Unexpected response format from the API.");
    }

    console.log("Extracted RSL info:", rslInfo);
    return rslInfo;
  } catch (error) {
    console.error(
      "Error fetching RSL info:",
      error.response?.data || error.message
    );
    return [];
  }
};
