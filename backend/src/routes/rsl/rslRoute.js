import express from "express";
import {
  createRSL,
  getAllRSLs,
  getRSLByUserId,
  deleteRSLById,
  updateRSLById,
  uploadImage
} from "../../controllers/Rsl/index.js";

const rsl = express.Router();

rsl.post("/", createRSL);
rsl.get("/", getAllRSLs);
rsl.get("/:id", getRSLByUserId);
rsl.delete("/:id", deleteRSLById);
rsl.put("/:id", updateRSLById);
rsl.post("/:id", uploadImage);


export default rsl;  