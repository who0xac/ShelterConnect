import express from "express";
import {
  createTenant,
  getTenantById,
  // getAllTenants,
  updateTenant,
  deleteTenant,
  getUserTenants,
} from "../../controllers/Tenant/index.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const tenant = express.Router();

tenant.post("/", authMiddleware, createTenant);
tenant.get("/", authMiddleware, getUserTenants);
// tenant.get("/all", authMiddleware, getAllTenants);
tenant.get("/:id", authMiddleware, getTenantById);
tenant.put("/:id", authMiddleware, updateTenant);
tenant.delete("/:id", authMiddleware, deleteTenant);

export default tenant;
