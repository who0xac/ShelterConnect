import UserModel from "../../models/Users/userModel.js";

export default async function createUser(req, res) {
  try {
    const newUser = await UserModel.createUser(req.body);
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
