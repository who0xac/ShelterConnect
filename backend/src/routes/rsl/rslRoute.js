import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import {
  createRSL,
  getAllRSLs,
  getRSLByUserId,
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

const upload = multer({ storage }).single("logo");

const rsl = express.Router();

// ✅ Update RSL (With File Upload)
rsl.put("/:id", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "File upload failed", error: err });
    }

    if (req.file) {
      // If a new file is uploaded, add it to req.body
      req.body.logo = `/uploads/${req.file.filename}`;

      // Get the old logo path from DB
      const oldRSL = await RSLModel.getRSLById(req.params.id);
      if (oldRSL && oldRSL.logo) {
        const oldLogoPath = `.${oldRSL.logo}`;
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath); // Delete old logo
        }
      }
    }

    updateRSLById(req, res);
  });
});

rsl.post("/", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "File upload failed", error: err });
    }

    req.body.logo = req.file ? `/uploads/${req.file.filename}` : null;
    createRSL(req, res);
  });
});

rsl.get("/", getAllRSLs);
rsl.get("/:id", getRSLByUserId);
rsl.delete("/:id", deleteRSLById);

export default rsl;
