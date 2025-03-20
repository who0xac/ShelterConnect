import User from "../../schemas/Users/userSchema.js";
import tenantModel from "../Tenant/tenantModel.js";
import propertiesModel from "../Properties/propertiesModel.js";
import staffModel from "../Staff/staffModel.js";

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

  // Find user by ID
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

  // Get all users where role is 2 (Agents) and fetch their properties, tenants, and staff
  async getAllAgents() {
    try {
      // console.log("Fetching agents from database...");
      // Fetch all users with role === 2 (agents) and isDeleted === false
      const agents = await User.find({ role: 2, isDeleted: false });

      // Fetch additional details for each agent
      const agentData = await Promise.all(
        agents.map(async (agent) => {
          // console.log(`Fetching details for agent: ${agent._id}`);
          const properties = await propertiesModel.getPropertiesByUser(
            agent._id
          );
          const tenants = await tenantModel.getTenantsByUser(agent._id);
          const staff = await staffModel.getStaffByCreator(agent._id);

          const rsls = await this.getUserRSLs(agent._id);

          // Return the agent with populated details
          return {
            ...agent._doc,
            properties,
            tenants,
            staff,
            rsls: rsls.rsls,
          };
        })
      );

      return agentData;
    } catch (error) {
      console.error("Error fetching agents in UserModel:", error);
      throw error;
    }
  }

  // Add RSLs to a user
  async addRSLsToUser(userId, rslIds) {
    return await User.findByIdAndUpdate(
      userId,
      { $addToSet: { rsls: { $each: rslIds } } },
      { new: true }
    );
  }

  // Remove RSLs from a user
  async removeRSLsFromUser(userId, rslIds) {
    return await User.findByIdAndUpdate(
      userId,
      { $pull: { rsls: { $in: rslIds } } },
      { new: true }
    );
  }

  // Get all RSLs for a user
  async getUserRSLs(userId) {
    return await User.findById(userId)
      .select("rsls")
      .populate("rsls", "rslName area");
  }

  // Update RSLs for a user
  async updateUserRSLs(userId, rslIds) {
    return await User.findByIdAndUpdate(
      userId,
      { rsls: rslIds },
      { new: true }
    );
  }
}

export default new UserModel();
