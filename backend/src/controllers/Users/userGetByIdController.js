import UserModel from "../../models/Users/userModel.js";

export default async function getUserById(req, res) {
  try {
    const user = await UserModel.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
