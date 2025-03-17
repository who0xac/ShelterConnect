import jwt from "jsonwebtoken";
import UserModel from "../models/Users/userModel.js";
import StaffModel from "../models/Staff/staffModel.js"; 
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from request headers
    const token = req.header("Authorization")?.split(" ")[1]; 

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access Denied. No token provided.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    let user;

    // First, check in UserModel
    user = await UserModel.findById(req.user.id);
    if (!user) {
      user = await StaffModel.findStaffById(req.user.id);
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    req.user.role = user.role; 
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

export default authMiddleware;
