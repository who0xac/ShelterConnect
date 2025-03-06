import express from "express";
import {
  loginUser,
  registerUser,
  deleteUser,
  getUserById,
  getAllUsers,
  updateUser,
  getAllAgents,
  updateUserRSLs, // Add this
  getUserRSLs, // Add this
} from "../../controllers/Users/index.js";

const users = express.Router();

// Existing routes
users.get("/agents", getAllAgents);
users.get("/", getAllUsers);
users.get("/:id", getUserById);
users.put("/:id", updateUser);
users.delete("/:id", deleteUser);
users.post("/login", loginUser);
users.post("/register", registerUser);

// New RSL routes
users.put("/:userId/rsls", updateUserRSLs); // Add this
users.get("/:userId/rsls", getUserRSLs); // Add this

export default users;
