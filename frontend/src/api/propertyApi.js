import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/properties";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Authorization header with token for all requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("Token from localStorage:", token); // Debug log

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Request headers:", config.headers); // Debug log
  }
  return config;
});

// Function to create property
export const createProperty = async (propertyData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const decodedToken = JSON.parse(atob(token.split(".")[1]));

    const userId = decodedToken.id;
    const userEmail = decodedToken.email || "default@example.com"; // Fallback email
    const userName = decodedToken.name || userEmail.split("@")[0]; // Safe fallback for userName

    const requestData = {
      ...propertyData,
      addedBy: userId,
      userName: userName, // Use the safer userName
      addedAt: new Date().toISOString(),
    };

    const response = await axiosInstance.post("/", requestData);

    console.log("Property created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating property:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};


// Get all properties
export const getAllProperties = async () => {
  try {
    const response = await axiosInstance.get("/"); 
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user properties:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get a single property by ID
export const getPropertyById = async (propertyId) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching property:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Update a property by ID
export const updatePropertyById = async (propertyId, updatedData) => {
  try {
    const response = await axiosInstance.put(
      `${API_BASE_URL}/${propertyId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating property:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Delete a property by ID
export const deletePropertyById = async (propertyId) => {
  try {
    const response = await axiosInstance.delete(
      `${API_BASE_URL}/${propertyId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting property:",
      error.response?.data || error.message
    );
    throw error;
  }
};

