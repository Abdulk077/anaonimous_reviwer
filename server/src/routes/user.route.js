import exprees from "express";
import { authorize } from "../middleware/auth.middleware";

const router = exprees.Router();

// fo givining the user detail of user as per the user quer
router.get("/:userId",authorize("STUDENT"), );

export default router;