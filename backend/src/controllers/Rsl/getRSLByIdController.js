import RSLModel from "../../models/Rsl/rslModel.js";

export default async function getRSLById(req, res) {
  try {
    const { id } = req.params;
    const rsl = await RSLModel.findRSLById(id);

    if (!rsl) {
      return res.status(404).json({ success: false, message: "RSL Not Found" });
    }

    res.status(200).json({ success: true, data: rsl });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error Fetching RSL",
      error: error.message,
    });
  }
}
