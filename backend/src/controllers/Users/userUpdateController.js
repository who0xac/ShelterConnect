import UserModel from "../../models/Users/userModel.js";

export default async function updateUser(req, res) {
  try {
    const updatedUser = await UserModel.updateUserById(req.params.id, req.body);
    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
