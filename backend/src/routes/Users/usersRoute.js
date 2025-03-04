import express from "express";
import {
  loginUser,
  registerUser,
  deleteUser,
  getUserById,
  getAllUsers,
  updateUser,
  getAllAgents
} from "../../controllers/Users/index.js";
const users = express.Router();

users.get("/agents", getAllAgents);
users.get("/", getAllUsers); 
users.get("/:id", getUserById);
users.put("/:id", updateUser);
users.delete("/:id", deleteUser); 
users.post("/login", loginUser);
users.post("/register", registerUser);

export default users;
