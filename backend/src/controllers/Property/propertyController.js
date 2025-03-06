import PropertyModel from "../../models/Properties/propertiesModel.js";
import UserModel from "../../models/Users/userModel.js";
import StaffModel from "../../models/Staff/staffModel.js";

  // Create Property
 async function createProperty(req, res) {
   try {
     const { addedBy, ...propertyData } = req.body;

     if (!addedBy) {
       return res.status(400).json({
         success: false,
         message: "AddedBy field is required.",
       });
     }

     // Check if addedBy is in UserModel or StaffModel
     let addedByUser = await UserModel.findById(addedBy);
     if (!addedByUser) {
       addedByUser = await StaffModel.findStaffById(addedBy);
     }

     // If addedByUser is still null, return error
     if (!addedByUser) {
       return res.status(404).json({
         success: false,
         message: "User or Staff not found for the given addedBy ID.",
       });
     }

     // Create Property
     const property = await PropertyModel.createProperty({
       addedBy,
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
      const userId = req.user.id; // Extracted from the authenticated request
      const user = await UserModel.findById(userId); // Fetch the user

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Fetch property with filtered RSLs
      const property = await PropertyModel.getPropertyWithFilteredRSLs(
        propertyId,
        user
      );

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
     const userId = req.user.id; // Extracted from the authenticated request
     const user = await UserModel.findById(userId); // Fetch the user

     if (!user) {
       return res
         .status(404)
         .json({ success: false, message: "User not found" });
     }

     let properties = await PropertyModel.getAllProperties();

     // Filter RSLs for Role 2 (User) and Role 3 (Staff)
     properties = await Promise.all(
       properties.map(async (property) => {
         if (user.role === 2) {
           // Role 2: Show only RSLs assigned to the User
           property.rsls = property.rsls.filter((rsl) =>
             user.rsls.includes(rsl._id)
           );
         } else if (user.role === 3) {
           // Role 3: Check who added the staff
           if (user.addedBy.role === 1) {
             // Added by Role 1 (Admin): Show all RSLs
             return property;
           } else if (user.addedBy.role === 2) {
             // Added by Role 2 (User): Filter RSLs
             const addedByUser = await UserModel.findById(user.addedBy);
             property.rsls = property.rsls.filter((rsl) =>
               addedByUser.rsls.includes(rsl._id)
             );
           }
         }
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
    const user = await UserModel.findById(userId); // Fetch the user

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let properties = await PropertyModel.getPropertiesByUser(userId);

    // Filter RSLs for Role 2 (User) and Role 3 (Staff)
    properties = await Promise.all(
      properties.map(async (property) => {
        if (user.role === 2) {
          // Role 2: Show only RSLs assigned to the User
          property.rsls = property.rsls.filter((rsl) =>
            user.rsls.includes(rsl._id)
          );
        } else if (user.role === 3) {
          // Role 3: Check who added the staff
          if (user.addedBy.role === 1) {
            // Added by Role 1 (Admin): Show all RSLs
            return property;
          } else if (user.addedBy.role === 2) {
            // Added by Role 2 (User): Filter RSLs
            const addedByUser = await UserModel.findById(user.addedBy);
            property.rsls = property.rsls.filter((rsl) =>
              addedByUser.rsls.includes(rsl._id)
            );
          }
        }
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


  export { createProperty, deleteProperty,updateProperty,getAllProperties,getPropertyById,getUserProperties}