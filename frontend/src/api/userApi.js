import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = "http://localhost:3000/api/users";

// User Login API
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Login failed";
  }
};

// User Registration API
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching users:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get a single user by ID
export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Update a user by ID
export const updateUserById = async (userId, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${userId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating user:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Delete a user by ID
export const deleteUserById = async (userId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting user:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get current user
export const getCurrentUser = async (navigate, setUserName) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      navigate("/");
      return;
    }

    // Decode token to get user ID
    const decoded = jwtDecode(token);
    const userId = decoded.id;

    // Fetch user details from API
    const response = await fetch(`${API_BASE_URL}/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    // Extract user object
    const result = await response.json();
    console.log("User Data Response:", result);

    if (result.data) {
      setUserName(`${result.data.firstName} ${result.data.lastName}`);
    } else {
      console.error("User data is missing in response");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};
