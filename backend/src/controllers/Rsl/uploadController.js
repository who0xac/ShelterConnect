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

// Upload API
export default function uploadImage(req, res) {
  upload(req, res, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "File upload failed", error: err });
    }
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
    return res
      .status(200)
      .json({ message: "File uploaded successfully", url: fileUrl });
  });
}
