import Property from "../../schemas/Properties/propertySchema.js";

class PropertyModel {
  // Create a new Property
  async createProperty(data) {
    const property = new Property(data);
    return await property.save();
  }

  // Find Property by ID
  async findPropertyById(propertyId) {
    return await Property.findById(propertyId)
      .populate("rslTypeGroup")
      .populate("addedBy");
  }

  // Get all active Properties
  async getAllProperties() {
    return await Property.find({ isDeleted: false })
      .populate("rslTypeGroup")
      .populate("addedBy");
  }

  // Get only deleted Properties
  async getDeletedProperties() {
    return await Property.find({ isDeleted: true })
      .populate("rslTypeGroup")
      .populate("addedBy");
  }

  // Delete Property by ID (Soft delete)
  async deleteProperty(propertyId) {
    return await Property.findByIdAndUpdate(
      propertyId,
      { isDeleted: true, status: 0 },
      { new: true }
    );
  }

  // Update Property by ID
  async updatePropertyById(propertyId, data) {
    return await Property.findByIdAndUpdate(propertyId, data, { new: true });
  }

  // Get Properties by User ID
  async getPropertiesByUser(userId) {
    return await Property.find({ addedBy: userId, isDeleted: false })
      .populate("rslTypeGroup")
      .populate("addedBy");
  }
}

export default new PropertyModel();
