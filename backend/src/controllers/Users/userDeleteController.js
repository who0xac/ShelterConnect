import UserModel from "../../models/Users/userModel.js";

export default async function deleteUser(req, res) {
  try {
    const deletedUser = await UserModel.deleteUserById(req.params.id);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
