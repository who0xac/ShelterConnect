import RSLModel from "../../models/Rsl/rslModel.js";

export default async function updateRSLById(req, res) {
  try {
    const { id } = req.params;
    const updatedRSL = await RSLModel.updateRSLById(id, req.body);

    if (!updatedRSL) {
      return res.status(404).json({ success: false, message: "RSL Not Found" });
    }

    res.status(200).json({
      success: true,
      message: "RSL Updated Successfully",
      data: updatedRSL,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error Updating RSL",
      error: error.message,
    });
  }
}
