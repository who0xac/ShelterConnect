import UserModel from "../../models/Users/userModel.js";

export default async function getUserByEmail(req, res) {
  try {
   
    const user = await UserModel.findUserByEmail(req.params.email);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
