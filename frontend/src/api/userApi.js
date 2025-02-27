import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = "http://localhost:3000/api/users";
const API_BASE_URL2 = "http://localhost:3000/api/staff";


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

    // Try fetching from User API
    let response = await fetch(`${API_BASE_URL}/${userId}`);
    let result = await response.json();

    // If not found in Users, try Staff API
    if (!response.ok || !result.data) {
      response = await fetch(`${API_BASE_URL2}/${userId}`);
      result = await response.json();
    }

    // If user is still not found, navigate to login
    if (!result.data) {
      console.error("User data is missing in response");
      navigate("/");
      return;
    }

    // Set the user name
    setUserName(`${result.data.firstName} ${result.data.lastName}`);
  } catch (error) {
    console.error("Error fetching user data:", error);
    navigate("/");
  }
};

