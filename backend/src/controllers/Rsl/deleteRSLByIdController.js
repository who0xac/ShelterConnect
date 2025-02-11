import RSLModel from "../../models/Rsl/rslModel.js";

export default async function deleteRSLById(req, res) {
  try {
    const { id } = req.params;
    const deletedRSL = await RSLModel.deleteRSLById(id);

    if (!deletedRSL) {
      return res.status(404).json({ success: false, message: "RSL Not Found" });
    }

    res
      .status(200)
      .json({ success: true, message: "RSL Deleted Successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error Deleting RSL",
      error: error.message,
    });
  }
}
