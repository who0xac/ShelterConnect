import Staff from "../../schemas/Staff/staffSchema.js";

class StaffModel {
  // create staff 
  async createStaff(data) {
    const staff = new Staff(data);
    return await staff.save();
  }

  // find staff 
  async findOne(query) {
    return await Staff.findOne(query);
  }
  //get staff by creator
  async getStaffByCreator(userId) {
    return await Staff.find({ addedBy: userId, isDeleted: false });
  }
  // find staff by id 
  async findStaffById(staffId) {
    return await Staff.findById(staffId);
  }

  //get all staff 
  async getAllStaff() {
    return await Staff.find({ isDeleted: false });
  }

  // delete staff 
  async deleteStaff(staffId) {
    return await Staff.findByIdAndUpdate(
      staffId,
      { isDeleted: true, status: 0 },
      { new: true }
    );
  }

  // update staff by id  
  async updateStaffById(staffId, data) {
    return await Staff.findByIdAndUpdate(staffId, data, { new: true });
  }

  // find staff by email  
  async findStaffByEmail(email) {
    return await Staff.findOne({ email, isDeleted: false });
  }
}



export default new StaffModel();
