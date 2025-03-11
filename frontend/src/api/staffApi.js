import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/staff";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Authorization header with token for all requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  // console.log("Token from localStorage:", token); // Debug log

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Request headers:", config.headers); // Debug log
  }
  return config;
});

// Function to create staff
export const createStaff = async (staffData) => {
  try {
    // Retrieve the token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }



    const decodedToken = JSON.parse(atob(token.split(".")[1])); 

    const userId = decodedToken.id;
    const userEmail = decodedToken.email; 

    const requestData = {
      ...staffData,
      addedBy: userId, 
      correspondingEmail: userEmail, 
    };

    // Send POST request to the API
    const response = await axiosInstance.post("/", requestData);

    console.log("Staff created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating staff:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Get all staff members
export const getAllStaff = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching your staff members:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get a single staff member by ID
export const getStaffById = async (staffId) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/${staffId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching staff member:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Update a staff member by ID
export const updateStaffById = async (staffId, updatedData) => {
  try {
    const response = await axiosInstance.put(
      `${API_BASE_URL}/${staffId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating staff member:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Delete a staff member by ID
export const deleteStaffById = async (staffId) => {
  try {
    const response = await axiosInstance.delete(`${API_BASE_URL}/${staffId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting staff member:",
      error.response?.data || error.message
    );
    throw error;
  }
};
