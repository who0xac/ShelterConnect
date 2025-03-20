import jwt from "jsonwebtoken";
import UserModel from "../models/Users/userModel.js";
import StaffModel from "../models/Staff/staffModel.js"; // Import Staff model
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from request headers
    const token = req.header("Authorization").split(" ")[1]; // "Bearer <token>"

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access Denied. No token provided.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request

    let user;

    // First, check in UserModel
    user = await UserModel.findById(req.user.id);

    // If not found in UserModel, check in StaffModel
    if (!user) {
      user = await StaffModel.findStaffById(req.user.id);
    }

    // If still not found, return error
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    // Attach role & continue
    req.user.role = user.role; // Assign role from database
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
