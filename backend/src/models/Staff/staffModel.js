import Staff from "../../schemas/Staff/staffSchema.js";
import User from "../../schemas/Users/userSchema.js";

class StaffModel {
  async createStaff(data) {
    try {
      const user = await User.findById(data.addedBy);
      if (!user) throw new Error("Admin/MA not found");

      data.correspondingEmail = user.correspondingEmail;

      const staff = new Staff(data);
      return await staff.save();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findStaffById(staffId) {
    return await Staff.findOne({ _id: staffId, isDeleted: false, status: 1 })
      .populate("addedBy", "correspondingEmail")
      .lean();
  }

  async getAllStaff() {
    return await Staff.find({ isDeleted: false, status: 1 })
      .populate("addedBy", "correspondingEmail")
      .lean();
  }

  async deleteStaffById(staffId) {
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
