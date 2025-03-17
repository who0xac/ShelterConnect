import PropertyModel from "../../models/Properties/propertiesModel.js";
import UserModel from "../../models/Users/userModel.js";
import StaffModel from "../../models/Staff/staffModel.js";
import mongoose from "mongoose";

// Create Property
async function createProperty(req, res) {
  try {
    const { addedBy, rslTypeGroup, ...propertyData } = req.body;

    if (!addedBy) {
      return res.status(400).json({
        success: false,
        message: "AddedBy field is required.",
      });
    }

    let addedByUser = await UserModel.findById(addedBy);
    if (!addedByUser) {
      addedByUser = await StaffModel.findStaffById(addedBy);
    }
    if (!addedByUser) {
      return res.status(404).json({
        success: false,
        message: "User or Staff not found for the given addedBy ID.",
      });
    }

    const isValidObjectId = mongoose.Types.ObjectId.isValid(rslTypeGroup);
    if (!isValidObjectId) {
      return res.status(400).json({
        success: false,
        message: "Invalid rslTypeGroup ID. It must be a valid ObjectId.",
      });
    }

    const property = await PropertyModel.createProperty({
      addedBy,
      rslTypeGroup: new mongoose.Types.ObjectId(rslTypeGroup),
      ...propertyData,
    });

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: property,
    });
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while creating property.",
    });
  }
}

// Get Property by ID
async function getPropertyById(req, res) {
  try {
    const propertyId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role; 

    let user = await UserModel.findById(userId);
    if (!user) {
      user = await StaffModel.findStaffById(userId);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const property = await PropertyModel.findPropertyById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    if (userRole === 3 && property.addedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this property.",
      });
    }

    res.status(200).json({ success: true, data: property });
  } catch (error) {
    console.error("Get property by ID error:", error);
    res.status(500).json({ success: false, message: "Error retrieving property" });
  }
}

// Get All Properties
async function getAllProperties(req, res) {
  try {
    const userId = req.user.id;
    let user = await UserModel.findById(userId);
    if (!user) {
      user = await StaffModel.findStaffById(userId);
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const properties = await PropertyModel.getAllProperties();
    res.status(200).json({ success: true, data: properties });
  } catch (error) {
    console.error("Get all properties error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving properties" });
  }
}

// Get User Properties 
async function getUserProperties(req, res) {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let user;
    if (userRole === 3) {
      user = await StaffModel.findStaffById(userId);
    } else {
      user = await UserModel.findById(userId);
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const properties = await PropertyModel.getPropertiesByUser(userId);
    res.status(200).json({ success: true, data: properties });
  } catch (error) {
    console.error("Get user properties error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving properties" });
  }
}

// Update Property
async function updateProperty(req, res) {
  try {
    const { _id, addedBy, ...updateData } = req.body; 
    if (req.user.role === 3) {
      delete updateData.addedBy;
    }

    const updatedProperty = await PropertyModel.updatePropertyById(
      req.params.id,
      updateData
    );

    if (!updatedProperty) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: updatedProperty,
    });
  } catch (error) {
    console.error("Update property error:", error);
    res.status(500).json({ success: false, message: "Error updating property" });
  }
}
// Delete Property
async function deleteProperty(req, res) {
  try {
    const deletedProperty = await PropertyModel.deleteProperty(req.params.id);
    if (!deletedProperty) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    console.error("Delete property error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error deleting property" });
  }
}

export {
  createProperty,
  getPropertyById,
  getAllProperties,
  getUserProperties,
  updateProperty,
  deleteProperty,
};
