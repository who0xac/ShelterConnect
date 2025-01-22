import express from 'express';
import {
  createUser,
  getUser,
  deleteUser,
  getUserByEmail,
  updateUser,
} from "../../controllers/Users/index.js"; 

const users = express.Router();

users.post("/", createUser);  
users.get("/", getUser);  
users.get("/:email", getUserByEmail);  
users.put("/:id", updateUser);  
users.delete("/:id", deleteUser);

export default users;