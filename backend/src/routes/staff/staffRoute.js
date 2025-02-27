import express from 'express';
import {createStaff,getAllStaff,getStaffById,updateStaff,deleteStaff} from '../../controllers/Staff/index.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const staff = express.Router();

staff.get("/", getAllStaff);
staff.get("/:id",  getStaffById);
staff.put("/:id",  updateStaff);
staff.delete("/:id",  deleteStaff);
staff.post("/", authMiddleware, createStaff);

export default staff;