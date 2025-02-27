import Staff from "../../schemas/Staff/staffSchema.js";

class StaffModel {
  async createStaff(data) {
    const staff = new Staff(data);
    return await staff.save();
  }

  async findOne(query) {
    return await Staff.findOne(query);
  }

  async findStaffById(staffId) {
    return await Staff.findById(staffId);
  }

  async getAllStaff() {
    return await Staff.find({ isDeleted: false });
  }

  async deleteStaff(staffId) {
    return await Staff.findByIdAndUpdate(
      staffId,
      { isDeleted: true, status: 0 },
      { new: true }
    );
  }

  async updateStaffById(staffId, data) {
    return await Staff.findByIdAndUpdate(staffId, data, { new: true });
  }
}

export default new StaffModel();
