import express from "express";
import {
  loginUser,
  registerUser,
  DeleteUser,
  getUserById,
  getAllUsers,
  updateUser,
} from "../../controllers/Users/index.js";
const users = express.Router();

users.get("/", getAllUsers); 
users.get("/:id", getUserById);
users.put("/:id", updateUser);
users.delete("/:id", DeleteUser); 
users.post("/login", loginUser);
users.post("/register", registerUser);

export default users;
