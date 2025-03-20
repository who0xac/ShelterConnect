import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import {
  createRSL,
  getAllRSLs,
  getRSLById,
  deleteRSLById,
  updateRSLById,
} from "../../controllers/Rsl/index.js";
import RSLModel from "../../models/Rsl/rslModel.js";

const uploadDir = "./uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const rsl = express.Router();

rsl.post("/", upload.single("logo"), async (req, res) => {
  try {
    req.body.logo = req.file ? `/uploads/${req.file.filename}` : null;
    await createRSL(req, res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating RSL", error: error.message });
  }
});

rsl.put("/:id", upload.single("logo"), async (req, res) => {
  try {
    const rslId = req.params.id;
    let updatedData = { ...req.body };
    const oldRSL = await RSLModel.findRSLById(rslId);
    if (!oldRSL) {
      return res.status(404).json({ message: "RSL not found" });
    }

    if (req.file) {
      updatedData.logo = `/uploads/${req.file.filename}`;
      if (oldRSL.logo) {
        const oldLogoPath = `.${oldRSL.logo}`;
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
    }

    req.body = updatedData;
    await updateRSLById(req, res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating RSL", error: error.message });
  }
});

rsl.get("/", getAllRSLs);
rsl.get("/:id", getRSLById);
rsl.delete("/:id", deleteRSLById);

export default rsl;
