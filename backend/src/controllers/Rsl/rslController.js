import RSLModel from "../../models/Rsl/rslModel.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Ensure 'uploads' folder exists
const uploadDir = "./uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set storage engine
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname)); // Unique filename
  },
});

// File upload middleware
const upload = multer({ storage }).single("logo");

// Create RSL
async function createRSL(req, res) {
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

    const logo = req.file ? `/uploads/${req.file.filename}` : null;

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
    if (error.code === 11000) {
      // MongoDB duplicate key error
      return res.status(400).json({
        success: false,
        message: "Duplicate entry detected. RSL already exists.",
        error: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Error Creating RSL",
      error: error.message,
    });
  }
}

// Delete RSL
async function deleteRSLById(req, res) {
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

// Get All RSLs
async function getAllRSLs(req, res) {
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

// Get RSL By ID
async function getRSLById(req, res) {
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

// Update RSL
async function updateRSLById(req, res) {
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
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "Duplicate entry detected. Email or other unique field already exists.",
        error: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Error Updating RSL",
      error: error.message,
    });
  }
}

// Upload Image
function uploadImage(req, res) {
  upload(req, res, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "File upload failed", error: err.message });
    }
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
    return res
      .status(200)
      .json({ message: "File uploaded successfully", url: fileUrl });
  });
}

export {
  createRSL,
  deleteRSLById,
  getAllRSLs,
  getRSLById,
  updateRSLById,
  uploadImage,
};
