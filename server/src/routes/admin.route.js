import express from "express";
import { authorize } from "../middleware/auth.middleware.js";
import { changeUserRole } from "../controller/role.controller.js";
const router = express.Router();

router.post("/change-role",authorize("ADMIN"), changeUserRole);

export default router; 