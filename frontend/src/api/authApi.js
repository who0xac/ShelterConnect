import axios from "axios";

const API_BASE_URL = "http://localhost:3000/auth"; 

// User Login API
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password,
    });
    return response.data; // Returns token
  } catch (error) {
    throw error.response?.data?.message || "Login failed";
  }
};

// User Registration API
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return response.data; // Returns success message
  } catch (error) {
    throw error.response?.data?.message;
  }
};
