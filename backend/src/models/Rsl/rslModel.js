import RSL from "../../schemas/Rsl/rslSchema.js";

class RSLModel {
  // Create a new RSL
  async createRSL(data) {
    const rsl = new RSL(data);
    return await rsl.save();
  }

  // Create multiple RSLs
  async createRSLs(rslList) {
    return await RSL.insertMany(rslList);
  }

  // Find RSL by ID
  async findRSLById(rslId) {
    return await RSL.findById(rslId);
  }

  // Get all RSLs
  async getAllRSLs() {
    return await RSL.find();
  }

  // Delete RSL by ID
  async deleteRSLById(rslId) {
    return await RSL.findByIdAndDelete(rslId);
  }

  // Update RSL details by ID
  async updateRSLById(rslId, data) {
    return await RSL.findByIdAndUpdate(rslId, data, { new: true });
  }
}

export default new RSLModel();
