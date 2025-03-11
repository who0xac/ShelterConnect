import bcrypt from "bcryptjs";
import StaffModel from "../../models/Staff/staffModel.js";
import UserModel from "../../models/Users/userModel.js";
import dotenv from "dotenv";

dotenv.config();

// Create Staff
async function createStaff(req, res) {
  try {
    const { email, password, addedBy, ...otherData } = req.body;
    if (!addedBy) {
      return res.status(400).json({
        success: false,
        message: "AddedBy field is required.",
      });
    }

    const addedByUser = await UserModel.findById(addedBy);
    if (!addedByUser) {
      return res.status(404).json({
        success: false,
        message: "User not found for the given addedBy ID.",
      });
    }

    const correspondingEmail = addedByUser.email;
    const existingStaff = await StaffModel.findOne({ email });
    if (existingStaff) {
      return res.status(409).json({
        success: false,
        message: "Staff already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newStaff = await StaffModel.createStaff({
      email,
      password: hashedPassword,
      addedBy,
      correspondingEmail,
      ...otherData,
    });

    res.status(201).json({
      success: true,
      message: "Staff created successfully",
      data: newStaff,
    });
  } catch (error) {
    console.error("Error creating staff:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email or username already exists.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Something went wrong while creating staff.",
    });
  }
}

// Get Staff by ID
async function getStaffById(req, res) {
  try {
    const staff = await StaffModel.findStaffById(req.params.id);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }
    res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    console.error("Get staff by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving staff",
    });
  }
}

async function getMyStaff(req, res) {
  try {
    // Get user ID from the authenticated request
    const userId = req.user.id;

    // Get staff members added by this user
    const staffMembers = await StaffModel.getStaffByCreator(userId);

    res.status(200).json({
      success: true,
      data: staffMembers,
    });
  } catch (error) {
    console.error("Get my staff error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving your staff members",
    });
  }
}

// Get All Staff
async function getAllStaff(req, res) {
  try {
    const staffMembers = await StaffModel.getAllStaff();
    res.status(200).json({
      success: true,
      data: staffMembers,
    });
  } catch (error) {
    console.error("Get all staff error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving staff members",
    });
  }
}

// Update Staff
async function updateStaff(req, res) {
  try {
    const { password, ...otherData } = req.body;
    let updateData = { ...otherData };

    // If password is being updated, hash it first
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }

    const updatedStaff = await StaffModel.updateStaffById(
      req.params.id,
      updateData
    );

    if (!updatedStaff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    const staffWithoutPassword = await StaffModel.findStaffById(
      updatedStaff._id
    );

    res.status(200).json({
      success: true,
      message: "Staff updated successfully",
      data: staffWithoutPassword,
    });
  } catch (error) {
    console.error("Update staff error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating staff",
    });
  }
}

// Delete Staff
async function deleteStaff(req, res) {
  try {
    const deletedStaff = await StaffModel.deleteStaff(req.params.id);

    if (!deletedStaff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Staff deleted successfully",
    });
  } catch (error) {
    console.error("Delete staff error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting staff",
    });
  }
}

export {
  createStaff,
  getStaffById,
  getAllStaff,
  updateStaff,
  deleteStaff,
  getMyStaff,
};
