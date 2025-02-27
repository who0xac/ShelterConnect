// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token using jwt.verify()
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Make sure you're using the same secret as when creating the token
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Token verification error:", error); // Add this for debugging
    res.status(401).json({
      message: "Invalid token",
      error: error.message,
    });
  }
};

export default authMiddleware;
