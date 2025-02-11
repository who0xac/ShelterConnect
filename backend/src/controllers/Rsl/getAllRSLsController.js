import RSLModel from "../../models/Rsl/rslModel.js";

export default async function getAllRSLs(req, res) {
  try {
    const rslList = await RSLModel.getAllRSLs();
    res.status(200).json({ success: true, data: rslList });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error Fetching RSLs",
      error: error.message,
    });
  }
}
