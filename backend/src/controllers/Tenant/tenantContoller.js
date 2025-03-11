import TenantModel from "../../models/Tenant/tenantModel.js";
import PropertyModel from "../../models/Properties/propertiesModel.js";
import UserModel from "../../models/Users/userModel.js";

// Create Tenant
async function createTenant(req, res) {
  try {
    console.log("Request Body:", req.body); // Debug: Log the request body

    const {
      addedBy,
      property,
      tenantSignature,
      supportWorkerSignature,
      ...tenantData
    } = req.body;

    // Validate required fields
    if (!addedBy || !property) {
      return res.status(400).json({
        success: false,
        message: "AddedBy and Property fields are required.",
      });
    }

    // Check if user exists
    const addedByUser = await UserModel.findById(addedBy);
    if (!addedByUser) {
      return res.status(404).json({
        success: false,
        message: "User not found for the given addedBy ID.",
      });
    }

    // Check if property exists
    const propertyExists = await PropertyModel.findPropertyById(property);
    if (!propertyExists) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found." });
    }

    // Create tenant with signature data
    const tenant = await TenantModel.createTenant({
      addedBy,
      property,
      tenantSignature, // Ensure this is included
      supportWorkerSignature, // Ensure this is included
      ...tenantData,
    });

    res.status(201).json({
      success: true,
      message: "Tenant created successfully",
      data: tenant,
    });
  } catch (error) {
    console.error("Error creating tenant:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while creating tenant.",
    });
  }
}
// Get Tenant by ID
async function getTenantById(req, res) {
  try {
    const tenant = await TenantModel.findTenantById(req.params.id);
    if (!tenant) {
      return res
        .status(404)
        .json({ success: false, message: "Tenant not found" });
    }
    res.status(200).json({ success: true, data: tenant });
  } catch (error) {
    console.error("Get tenant by ID error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving tenant" });
  }
}

// Get All Tenants
async function getAllTenants(req, res) {
  try {
    const tenants = await TenantModel.getAllTenants();
    res.status(200).json({ success: true, data: tenants });
  } catch (error) {
    console.error("Get all tenants error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving tenants" });
  }
}

// Update Tenant
async function updateTenant(req, res) {
  try {
    console.log("Request Body:", req.body); // Debug: Log the request body

    const { tenantSignature, supportWorkerSignature, ...updatedData } =
      req.body;

    // Update tenant with signature data
    const updatedTenant = await TenantModel.updateTenantById(req.params.id, {
      tenantSignature, // Ensure this is included
      supportWorkerSignature, // Ensure this is included
      ...updatedData,
    });

    if (!updatedTenant) {
      return res
        .status(404)
        .json({ success: false, message: "Tenant not found" });
    }

    res.status(200).json({
      success: true,
      message: "Tenant updated successfully",
      data: updatedTenant,
    });
  } catch (error) {
    console.error("Update tenant error:", error);
    res.status(500).json({ success: false, message: "Error updating tenant" });
  }
}
// Delete Tenant 
async function deleteTenant(req, res) {
  try {
    const deletedTenant = await TenantModel.deleteTenant(req.params.id);
    if (!deletedTenant) {
      return res
        .status(404)
        .json({ success: false, message: "Tenant not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Tenant deleted successfully" });
  } catch (error) {
    console.error("Delete tenant error:", error);
    res.status(500).json({ success: false, message: "Error deleting tenant" });
  }
}

// Get Tenants for the Logged-in User
async function getUserTenants(req, res) {
  try {
    const userId = req.user.id;
    const tenants = await TenantModel.getTenantsByUser(userId);
    res.status(200).json({ success: true, data: tenants });
  } catch (error) {
    console.error("Get user tenants error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving tenants" });
  }
}

export {
  createTenant,
  getTenantById,
  getAllTenants,
  updateTenant,
  deleteTenant,
  getUserTenants,
};
