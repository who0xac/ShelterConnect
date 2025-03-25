import express from "express";
import {
  loginUser,
  registerUser,
  deleteUser,
  getUserById,
  getAllUsers,
  updateUser,
  getAllAgents,
  updateUserRSLs, 
  getUserRSLs, 
} from "../../controllers/Users/index.js";

const users = express.Router();

users.get("/agents", getAllAgents);
users.get("/", getAllUsers);
users.get("/:id", getUserById);
users.put("/:id", updateUser);
users.delete("/:id", deleteUser);
users.post("/login", loginUser);
users.post("/register", registerUser);
users.put("/:userId/rsls", updateUserRSLs); 
users.get("/:userId/rsls", getUserRSLs); 

export default users;
