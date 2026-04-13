import express from "express";
import { authorize } from "../middleware/auth.middleware.js";
import { createComment ,updateComment, deleteComment } from "../controller/comment.controller.js";
const router = express.Router();

router.post("/", authorize("REVIEWER"), createComment);
router.put("/:id", authorize("REVIEWER"), updateComment);
router.delete("/id", authorize("REVIEWER"), deleteComment);
// getiing comemnt as per now post id route for that
//router.get('/',);


export default router;
