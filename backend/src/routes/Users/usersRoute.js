import express from "express";
import {
  createUser,
  getUser,
  deleteUser,
  getUserByEmail,
  updateUser,
  getUserById,
} from "../../controllers/Users/index.js";

const users = express.Router();

users.post("/", createUser);
users.get("/", getUser);
users.get("/:email", getUserByEmail);
users.put("/:id", updateUser);
users.delete("/:id", deleteUser);
users.get("id/:id", getUserById);

export default users;
