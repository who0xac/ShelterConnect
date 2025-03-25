import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/tenants";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Function to create tenant
export const createTenant = async (tenantData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const decodedToken = JSON.parse(atob(token.split(".")[1]));

    const userId = decodedToken.id;
    const userEmail = decodedToken.email || "default@example.com"; 
    const userName = decodedToken.name || userEmail.split("@")[0]; 

    const requestData = {
      ...tenantData,
      addedBy: userId,
      userName: userName,
      addedAt: new Date().toISOString(),
    };

    const response = await axiosInstance.post("/", requestData);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating tenant:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Get all tenants
export const getAllTenants = async () => {
  try {
    const response = await axiosInstance.get("/");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching tenants:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get a single tenant by ID
export const getTenantById = async (tenantId) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/${tenantId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching tenant:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Update a tenant by ID
export const updateTenantById = async (tenantId, updatedData) => {
  try {
    const response = await axiosInstance.put(
      `${API_BASE_URL}/${tenantId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating tenant:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Delete a tenant by ID
export const deleteTenantById = async (tenantId) => {
  try {
    const response = await axiosInstance.delete(`${API_BASE_URL}/${tenantId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting tenant:",
      error.response?.data || error.message
    );
    throw error;
  }
};
