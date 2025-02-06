import axios from "axios";

const API_BASE_URL = "http://localhost:3000"; 

// Create a new user (supports single and multiple users)
export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, userData);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating user:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
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
    const response = await axios.get(`${API_BASE_URL}/users/id/${userId}`);
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
    const response = await axios.put(
      `${API_BASE_URL}/users/${userId}`,
      updatedData
    );
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
    const response = await axios.delete(`${API_BASE_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting user:",
      error.response?.data || error.message
    );
    throw error;
  }
};
