import PropertyModel from "../../models/Properties/propertiesModel.js";
import UserModel from "../../models/Users/userModel.js";


  // Create Property
  async function createProperty(req, res) {
    try {
      const { addedBy, ...propertyData } = req.body;
      if (!addedBy) {
        return res
          .status(400)
          .json({ success: false, message: "AddedBy field is required." });
      }

      const addedByUser = await UserModel.findById(addedBy);
      if (!addedByUser) {
        return res
          .status(404)
          .json({
            success: false,
            message: "User not found for the given addedBy ID.",
          });
      }

      const property = await PropertyModel.createProperty({
        addedBy,
        ...propertyData,
      });
      res
        .status(201)
        .json({
          success: true,
          message: "Property created successfully",
          data: property,
        });
    } catch (error) {
      console.error("Error creating property:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Something went wrong while creating property.",
        });
    }
  }

  // Get Property by ID
  async function getPropertyById(req, res) {
    try {
      const property = await PropertyModel.findPropertyById(req.params.id);
      if (!property) {
        return res
          .status(404)
          .json({ success: false, message: "Property not found" });
      }
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
      const properties = await PropertyModel.getAllProperties();
      res.status(200).json({ success: true, data: properties });
    } catch (error) {
      console.error("Get all properties error:", error);
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
      res
        .status(200)
        .json({
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
// Get Properties for the Logged-in User
async function getUserProperties(req, res) {
  try {
    const userId = req.user.id; // Extracted from the authenticated request

    const properties = await PropertyModel.getPropertiesByUser(userId);
    res.status(200).json({ success: true, data: properties });
  } catch (error) {
    console.error("Get user properties error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving properties" });
  }
}

  export { createProperty, deleteProperty,updateProperty,getAllProperties,getPropertyById,getUserProperties}