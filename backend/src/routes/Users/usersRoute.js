import express from "express";
import {
  loginUser,
  registerUser,
  getAllUsers,
  deleteUser,
  getUserByEmail,
  updateUser,
  getUserById,
} from "../../controllers/Users/index.js";

const users = express.Router();


users.get("/", getAllUsers);
users.get("/email/:email", getUserByEmail);
users.put("/:id", updateUser);
users.delete("/:id", deleteUser);
users.get("/:id", getUserById);
users.post('/login', loginUser);
users.post('/register', registerUser);

export default users;
