import express from "express";
import {
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyById,
  getUserProperties,
  
} from "../../controllers/Property/index.js";
import authMiddleware from "../../middleware/authMiddleware.js"; 
const property = express.Router();

property.get("/", authMiddleware, getUserProperties);
property.get("/:id", authMiddleware, getPropertyById); 
property.put("/:id", authMiddleware, updateProperty); 
property.delete("/:id", authMiddleware, deleteProperty); 
property.post("/", authMiddleware, createProperty); 



export default property;
