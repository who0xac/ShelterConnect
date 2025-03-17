import Tenant from "../../schemas/Tenants/tenantSchema.js";

class TenantModel {
  // Create a new Tenant
  async createTenant(data) {
    const tenant = new Tenant(data);
    return await tenant.save();
  }

  // Find Tenant by ID
  async findTenantById(tenantId) {
    return await Tenant.findById(tenantId)
      .populate("property")
      .populate("addedBy");
  }

  // Get all active Tenants
  async getAllTenants() {
    return await Tenant.find({ isDeleted: false })
      .populate("property")
      .populate("addedBy");
  }

  // Get only deleted Tenants
  async getDeletedTenants() {
    return await Tenant.find({ isDeleted: true })
      .populate("property")
      .populate("addedBy");
  }

  //  delete Tenant by ID
  async deleteTenant(tenantId) {
    return await Tenant.findByIdAndUpdate(
      tenantId,
      { isDeleted: true, status: 0 },
      { new: true }
    );
  }

  // Update Tenant by ID
  async updateTenantById(tenantId, data) {
    return await Tenant.findByIdAndUpdate(tenantId, data, { new: true });
  }

  // Get Tenants by User ID
  async getTenantsByUser(userId) {
    return await Tenant.find({ addedBy: userId, isDeleted: false })
      .populate("property")
      .populate("addedBy");
  }
}

export default new TenantModel();
