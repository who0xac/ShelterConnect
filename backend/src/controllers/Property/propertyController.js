import PropertyModel from "../../models/Properties/propertiesModel.js";
import UserModel from "../../models/Users/userModel.js";
import StaffModel from "../../models/Staff/staffModel.js";
import RSLModel from "../../models/RSL/rslModel.js"; 


async function getFilteredRSLs(user) {
  let rsls = []; // Placeholder for filtered RSLs

  // Fetch all RSLs from the database using RSLModel's method
  const allRSLs = await RSLModel.getAllRSLs();

  // Role 1: Show all RSLs (Admin/Global Access)
  if (user.role === 1) {
    rsls = allRSLs;
  }
  // Role 2: Show only RSLs in the user's rsls array
  else if (user.role === 2) {
    // Ensure the comparison is done with the same type (e.g., string or ObjectId)
    rsls = allRSLs.filter((rsl) =>
      user.rsls.some((userRslId) => userRslId.toString() === rsl._id.toString())
    );
  }
  // Role 3: Show RSLs based on who added the user
  else if (user.role === 3) {
    // Fetch the user who added this user (addedBy)
    const addedByUser = await UserModel.findById(user.addedBy);

    if (addedByUser) {
      // If added by Role 1, show all RSLs
      if (addedByUser.role === 1) {
        rsls = allRSLs;
      }
      // If added by Role 2, show RSLs from addedByUser's rsls array
      else if (addedByUser.role === 2) {
        rsls = allRSLs.filter((rsl) =>
          addedByUser.rsls.some(
            (addedByRslId) => addedByRslId.toString() === rsl._id.toString()
          )
        );
      }
    }
  }

  return rsls;
}



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

    // Ensure rslTypeGroup is a valid ObjectId
    const mongoose = require("mongoose");
    const isValidObjectId = mongoose.Types.ObjectId.isValid(rslTypeGroup);
    if (!isValidObjectId) {
      return res.status(400).json({
        success: false,
        message: "Invalid rslTypeGroup ID. It must be a valid ObjectId.",
      });
    }

    // Create Property
    const property = await PropertyModel.createProperty({
      addedBy,
      rslTypeGroup: new mongoose.Types.ObjectId(rslTypeGroup), // Convert to ObjectId
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
    let user = await UserModel.findById(userId);
    if (!user) {
      user = await StaffModel.findStaffById(userId);
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Get property and filter RSLs based on user role
    const property = await PropertyModel.findPropertyById(propertyId);
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    // Filter RSLs for this user
    const filteredRSLs = await getFilteredRSLs(user);
    property.rsls = property.rsls.filter((rsl) =>
      filteredRSLs.some((filteredRSL) => filteredRSL._id.equals(rsl._id))
    );

    res.status(200).json({ success: true, data: property });
  } catch (error) {
    console.error("Get property by ID error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving property" });
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

    // Get all properties
    let properties = await PropertyModel.getAllProperties();

    // Filter RSLs based on user role
    properties = await Promise.all(
      properties.map(async (property) => {
        // Get filtered RSLs for this user
        const filteredRSLs = await getFilteredRSLs(user);

        // Update property.rsls with filtered RSLs
        property.rsls = property.rsls.filter((rsl) =>
          filteredRSLs.some((filteredRSL) => filteredRSL._id.equals(rsl._id))
        );

        return property;
      })
    );

    res.status(200).json({ success: true, data: properties });
  } catch (error) {
    console.error("Get all properties error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving properties" });
  }
}

// Get Properties for the Logged-in User
async function getUserProperties(req, res) {
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

    // Get properties for the user
    let properties = await PropertyModel.getPropertiesByUser(userId);

    // Filter RSLs based on user role
    properties = await Promise.all(
      properties.map(async (property) => {
        // Get filtered RSLs for this user
        const filteredRSLs = await getFilteredRSLs(user);

        // Update property.rsls with filtered RSLs
        property.rsls = property.rsls.filter((rsl) =>
          filteredRSLs.some((filteredRSL) => filteredRSL._id.equals(rsl._id))
        );

        return property;
      })
    );

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
    const updatedProperty = await PropertyModel.updatePropertyById(
      req.params.id,
      req.body
    );
    if (!updatedProperty) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }
    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: updatedProperty,
    });
  } catch (error) {
    console.error("Update property error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating property" });
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
