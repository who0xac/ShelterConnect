import User from "../../schemas/Users/userSchema.js";
class UserModel {
  // Create a new user
  async createUser(data) {
    const user = new User(data);
    return await user.save();
  }

  // Find user by email
  async findUserByEmail(email) {
    return await User.findOne({ email, isDeleted: false });
  }

  // Find user by ID
  async findUserById(userId) {
    return await User.findOne({ _id: userId, isDeleted: false });
  }

  // Find user by ID (added this method to match findById call)
  async findById(userId) {
    return await User.findById(userId);
  }

  // Get all active users
  async getAllUsers() {
    return await User.find({ isDeleted: false });
  }

  // Delete user by ID
  async DeleteUser(userId) {
    return await User.findByIdAndUpdate(
      userId,
      { isDeleted: true, status: 0 },
      { new: true }
    );
  }

  // Update user details by ID
  async updateUserById(userId, data) {
    return await User.findByIdAndUpdate(userId, data, { new: true });
  }
}

export default new UserModel();
