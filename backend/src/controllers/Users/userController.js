import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../../models/Users/userModel.js";
import dotenv from "dotenv";
import StaffModel from "../../models/Staff/staffModel.js";

dotenv.config();

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Try finding the user in both collections
    let user = await UserModel.findUserByEmail(email);
    let userType = "user";

    if (!user) {
      user = await StaffModel.findStaffByEmail(email);
      userType = "staff";
    }

    // If user not found in both collections
    if (!user || user.isDeleted) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, userType },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
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

    const existingUser = await UserModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserModel.createUser({
      email,
      password: hashedPassword,
      ...otherData,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

//  Delete User
async function DeleteUser(req, res) {
  try {
    const deletedUser = await UserModel.DeleteUser(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User  deleted successfully" });
  } catch (error) {
    console.error(" Delete error:", error);
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

// Get All Users (excluding deleted users)
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

export {
  loginUser,
  registerUser,
  DeleteUser,
  getUserById,
  getAllUsers,
  updateUser,
};
