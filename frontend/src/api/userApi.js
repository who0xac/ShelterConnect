import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:3000/api/users";
const API_BASE_URL2 = "http://localhost:3000/api/staff";


const api = axios.create({
  baseURL: API_BASE_URL,
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("Interceptor triggered", error.response?.status); 
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("expiresAt");
      // toast.info("Session expired, logging out...", {
      //   position: "top-right",
      //   autoClose: 3000,
      // });
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// Use the Axios instance for API calls
export const loginUser = async (email, password) => {
  try {
    const response = await api.post(`/login`, { email, password });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Login failed";
    throw new Error(errorMessage);
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

export const getAllUsers = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching users:",
      error.response?.data || error.message
    );
    return null;
  }
};

export const getAllAgents = async () => {
  try {
    const response = await api.get("/agents");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching agents:",
      error.response?.data || error.message
    );
    return null;
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
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      navigate("/");
      return;
    }

    // Decode token to get user ID
    const decoded = jwtDecode(token);
    const userId = decoded.id;

    // Set authorization headers
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    let response;

    try {
            response = await api.get(`/${userId}`, config);
    } catch (error) {
      console.warn("User not found in /api/users, checking /api/staff...");

      try {
        
        response = await axios.get(`${API_BASE_URL2}/${userId}`, config);
      } catch (staffError) {
        console.error("User not found in both APIs.");
        navigate("/");
        return;
      }
    }

    const userData = response.data?.data;
    if (!userData) {
      console.error("User data is empty.");
      navigate("/");
      return;
    }
    setUserName(`${userData.firstName} ${userData.lastName}`);
    return userId;
  } catch (error) {
    console.error("Error fetching user data:", error);
    navigate("/");
  }
};

// Get RSLs for a user
export const getUserRSLs = async (userId) => {
  try {
    const response = await api.get(`/${userId}/rsls`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user RSLs:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Update RSLs for a user
export const updateUserRSLs = async (userId, rslIds) => {
  try {
    const response = await api.put(`/${userId}/rsls`, { rslIds });
    return response.data;
  } catch (error) {
    console.error(
      "Error updating user RSLs:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getCurrentUserRoleAndPermissions = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return null;
    }

    const decoded = jwtDecode(token);
    const userId = decoded.id;

    // Set authorization headers
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    let response;

    try {
    
      response = await api.get(`/${userId}`, config);
    } catch (error) {
      console.warn("User not found in /api/users, checking /api/staff...");

      try {
       
        response = await axios.get(`${API_BASE_URL2}/${userId}`, config);
      } catch (staffError) {
        console.error("User not found in both APIs.");
        return null;
      }
    }

    const userData = response.data?.data;
    if (!userData) {
      console.error("User data is empty.");
      return null;
    }

    return {
      role: userData.role,
      permissions: userData.permissions,
    };
  } catch (error) {
    console.error("Error fetching current user role and permissions:", error);
    return null;
  }
};
