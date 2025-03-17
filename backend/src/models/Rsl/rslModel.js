import RSL from "../../schemas/Rsl/rslSchema.js";

class RSLModel {
  // Create a new RSL
  async createRSL(data) {
    const rsl = new RSL(data);
    return await rsl.save();
  }

  // Find RSL by ID
  async findRSLById(rslId) {
    return await RSL.findById(rslId);
  }

  // Get all active RSLs
  async getAllRSLs() {
    return await RSL.find({ isDeleted: false });
  }

  // Get only deleted RSLs
  async getDeletedRSLs() {
    return await RSL.find({ isDeleted: true });
  }

  // Delete RSL by ID
  async deleteRSL(rslId) {
    return await RSL.findByIdAndUpdate(
      rslId,
      { isDeleted: true, status: 0 },
      { new: true }
    );
  }

  // update rsl
  async updateRSLById(rslId, data) {
    return await RSL.findByIdAndUpdate(rslId, data, { new: true });
  }

  // Get RSLs visible to a specific Managing Agent
  async getRSLsForMA(managingAgentId) {
    return await RSL.find({ visibleTo: managingAgentId, isDeleted: false });
  }
}

export default new RSLModel();
