import UserModel from "../../models/Users/userModel.js";

export default async function getAllUsers(req, res) {
  try {
    const users = await UserModel.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
