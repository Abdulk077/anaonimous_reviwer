import exprees from "express";
import { authorize } from "../middleware/auth.middleware.js";
import { getUserDetails} from "../controller/user.controller.js";
const router = exprees.Router();

// fo givining the user detail of user as per the user quer
router.get("/:userId", authorize("STUDENT"), getUserDetails);

export default router;