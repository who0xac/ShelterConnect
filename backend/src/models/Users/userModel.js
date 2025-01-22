import mongoose from "mongoose";
import userSchema from "../../schemas/Users/userSchema.js";

const User = mongoose.model("User", userSchema);

class UserModel {
  // Create a new user
  async createUser(data) {
    const user = new User(data);
    return await user.save();
  }

  // Find a user by email
  async findUserByEmail(email) {
    return await User.findOne({ email });
  }

  // Get all users
  async getAllUsers() {
    return await User.find();
  }

  // Delete user by ID
  async deleteUserById(userId) {
    return await User.findByIdAndDelete(userId);
  }

  // Update user details by ID
  async updateUserById(userId, data) {
    return await User.findByIdAndUpdate(userId, data, { new: true });
  }
}

export default new UserModel();
