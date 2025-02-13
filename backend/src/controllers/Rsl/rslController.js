import RSLModel from "../../models/Rsl/rslModel.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Ensure 'uploads' directory exists
const uploadDir = "./uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const upload = multer({ storage }).single("logo");

// Create RSL
const createRSL = async (req, res) => {
  try {
    const logo = req.file ? `/uploads/${req.file.filename}` : null;
    const newRSL = await RSLModel.createRSL({ ...req.body, logo });

    res.status(201).json({
      success: true,
      message: "RSL Created Successfully",
      data: newRSL,
    });
  } catch (error) {
    res.status(error.code === 11000 ? 400 : 500).json({
      success: false,
      message: error.code === 11000 ? "Duplicate entry detected" : "Error Creating RSL",
      error: error.message,
    });
  }
};

// Delete RSL
const deleteRSLById = async (req, res) => {
  try {
    const deletedRSL = await RSLModel.deleteRSL(req.params.id);
    if (!deletedRSL) {
      return res.status(404).json({ success: false, message: "RSL Not Found" });
    }
    res.status(200).json({ success: true, message: "RSL Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Deleting RSL", error: error.message });
  }
};

// Get All RSLs
const getAllRSLs = async (req, res) => {
  try {
    const rslList = await RSLModel.getAllRSLs();
    res.status(200).json({ success: true, data: rslList });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Fetching RSLs", error: error.message });
  }
};

// Get RSL By ID
const getRSLById = async (req, res) => {
  try {
    const rsl = await RSLModel.findRSLById(req.params.id);
    if (!rsl) {
      return res.status(404).json({ success: false, message: "RSL Not Found" });
    }
    res.status(200).json({ success: true, data: rsl });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Fetching RSL", error: error.message });
  }
};

// Update RSL
const updateRSLById = async (req, res) => {
  try {
    // Remove visibleTo from the request body if it exists
    const updateData = { ...req.body };
    delete updateData.visibleTo; // Ignore visibleTo field for now

    const updatedRSL = await RSLModel.updateRSLById(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedRSL) {
      return res.status(404).json({
        success: false,
        message: "RSL Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "RSL Updated Successfully",
      data: updatedRSL,
    });
  } catch (error) {
    const statusCode = error.code === 11000 ? 400 : 500;
    const message =
      error.code === 11000 ? "Duplicate entry detected" : "Error Updating RSL";

    res.status(statusCode).json({
      success: false,
      message: message,
      error: error.message,
    });
  }
};

// Upload Image
const uploadImage = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "File upload failed", error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({ success: true, message: "File uploaded successfully", url: fileUrl });
  });
};

export {
  createRSL,
  deleteRSLById,
  getAllRSLs,
  getRSLById,
  updateRSLById,
  uploadImage,
};
