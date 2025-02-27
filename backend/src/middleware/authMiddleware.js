import jwt from "jsonwebtoken";
import { PAGE_ACCESS } from "../config/roles.js";

const authMiddleware = (pageName) => (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    const userRole = req.user.role;

    // Check if the user's role has access to the requested page
    if (!PAGE_ACCESS[userRole]?.includes(pageName)) {
      return res
        .status(403)
        .json({ message: "Access denied: Insufficient permissions" });
    }

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

export default authMiddleware;
