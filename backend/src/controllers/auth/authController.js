import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../../models/Users/userModel.js";
import dotenv from "dotenv";

dotenv.config();

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "User Not Exists" });
    }

    //  Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



export const registerUser = async (req, res) => {
  try {

    const { email, password, ...otherData } = req.body;


    const existingUser = await UserModel.findUserByEmail(email);
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserModel.createUser({
      email,
      password: hashedPassword,
      ...otherData,
    });


    return res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error(" Registration Error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message || "Unknown error occurred",
    });
  }
};
