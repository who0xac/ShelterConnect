
import User from "../../schemas/Users/userSchema.js";


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

  // Create multiple users
  async createUsers(users) {
    return await User.insertMany(users); // Insert an array of users
  }

  // Find user by ID
  async findUserById(userId) {
    return await User.findById(userId);
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
