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

  // Get all users where role is 2 (Agents) and fetch their properties, tenants, and staff
  async getAllAgents() {
  try {
    console.log("Fetching agents from database..."); // Log to confirm the method is called
    // Fetch all users with role === 2 (agents) and isDeleted === false
    const agents = await User.find({ role: 2, isDeleted: false });

    // Fetch additional details for each agent
    const agentData = await Promise.all(
      agents.map(async (agent) => {
        console.log(`Fetching details for agent: ${agent._id}`); // Log each agent
        const properties = await propertiesModel.getPropertiesByUser(agent._id);
        const tenants = await tenantModel.getTenantsByUser(agent._id);
        const staff = await staffModel.getStaffByCreator(agent._id);

        // Return the agent with populated details
        return {
          ...agent._doc,
          properties,
          tenants,
          staff,
        };
      })
    );

    return agentData;
  } catch (error) {
    console.error("Error fetching agents in UserModel:", error);
    throw error; // Throw the error so the controller can handle it
  }
}
}

export default new UserModel();
