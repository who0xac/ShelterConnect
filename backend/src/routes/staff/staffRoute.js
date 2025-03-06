import express from "express";
import {
  createStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  getMyStaff,
} from "../../controllers/Staff/index.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const staff = express.Router();


staff.get("/", authMiddleware, getMyStaff);
staff.post("/", authMiddleware, createStaff);
staff.get("/:id", authMiddleware, getStaffById);
staff.put("/:id", authMiddleware, updateStaff);
staff.delete("/:id", authMiddleware, deleteStaff);

export default staff;
