import RSLModel from "../../models/Rsl/rslModel.js";

const createRSL = async (req, res) => {
  try {
    const {
      rslName,
      firstName,
      lastName,
      email,
      phoneNumber,
      addressLine1,
      area,
      city,
      postCode,
      website,
    } = req.body;
    const logo = req.file ? req.file.filename : null;
    const newRSL = await RSLModel.createRSL({
      rslName,
      firstName,
      lastName,
      email,
      phoneNumber,
      addressLine1,
      area,
      city,
      postCode,
      website,
      logo,
    });

    res.status(201).json({
      success: true,
      message: "RSL Created Successfully",
      data: newRSL,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error Creating RSL",
      error: error.message,
    });
  }
};

export default createRSL;
