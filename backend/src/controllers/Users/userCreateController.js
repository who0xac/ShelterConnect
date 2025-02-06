import UserModel from "../../models/Users/userModel.js";

export default async function createUser(req, res) {
  try {
  
    const user = req.body;

    
    if (!user || typeof user !== "object") {
      return res
        .status(400)
        .json({ success: false, message: "Expected a user object." });
    }

   
    const newUser = await UserModel.createUser(user);
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
 
    res.status(500).json({ success: false, message: error.message });
  }
}
