import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../../models/Users/userModel.js";
import StaffModel from "../../models/Staff/staffModel.js";

dotenv.config();

// User Login
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    let user = await UserModel.findUserByEmail(email);
    let userType = "user";

    if (!user) {
      user = await StaffModel.findStaffByEmail(email);
      userType = "staff";
    }

    console.log("User found:", user);

    if (!user || user.isDeleted) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("Stored Password:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("User Role:", user.role);

    const expiresIn = "7d";
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

    const token = jwt.sign(
      { id: user._id, role: user.role, userType },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    res
      .status(200)
      .json({ message: "Login successful", token, userType, expiresAt });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

// User Registration
async function registerUser(req, res) {
  try {
    const { email, password, ...otherData } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if user already exists
    const existingUser = await UserModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await UserModel.createUser({
      email,
      password: hashedPassword,
      ...otherData,
    });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

// Delete User
async function deleteUser(req, res) {
  try {
    const deletedUser = await UserModel.DeleteUser(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

// Get User by ID
async function getUserById(req, res) {
  try {
    const user = await UserModel.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ data: user });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

// Get All Users
async function getAllUsers(req, res) {
  try {
    const users = await UserModel.getAllUsers();
    res.status(200).json({ data: users });
  } catch (error) {
    console.error("Get all users error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

// Update User
async function updateUser(req, res) {
  try {
    const updatedUser = await UserModel.updateUserById(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ data: updatedUser });
  } catch (error) {
    console.error("Update user error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

// Get All Agents
async function getAllAgents(req, res) {
  try {
    const agents = await UserModel.getAllAgents();
    res.status(200).json({ success: true, data: agents });
  } catch (error) {
    console.error("Get all agents error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch agents",
      error: error.message,
    });
  }
}

// Add or Update RSLs for a user
async function updateUserRSLs(req, res) {
  try {
    const { userId } = req.params;
    const { rslIds } = req.body;

    if (!rslIds || !Array.isArray(rslIds)) {
      return res.status(400).json({
        success: false,
        message: "Invalid RSL IDs provided",
      });
    }

    const updatedUser = await UserModel.updateUserRSLs(userId, rslIds);
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "RSLs updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update RSLs error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Get RSLs for a user
async function getUserRSLs(req, res) {
  try {
    const { userId } = req.params;
    console.log("User ID received:", userId);
    const userRSLs = await UserModel.getUserRSLs(userId);
    if (!userRSLs) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User RSLs fetched successfully",
      data: userRSLs,
    });
  } catch (error) {
    console.error("Get user RSLs error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export {
  loginUser,
  registerUser,
  deleteUser,
  getUserById,
  getAllUsers,
  updateUser,
  getAllAgents,
  updateUserRSLs,
  getUserRSLs,
};
