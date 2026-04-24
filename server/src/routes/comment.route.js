import express from "express";
import { authorize } from "../middleware/auth.middleware.js";
import {
  createComment,
  updateComment,
  deleteComment,
  getCommentsByPostId,
  getCommentsByUserId,
} from "../controller/comment.controller.js";
const router = express.Router();

router.post("/:postId", authorize("REVIEWER"), createComment);
router.put("/:id", authorize("REVIEWER"), updateComment);
router.delete("/id", authorize("REVIEWER"), deleteComment);
// getiing comemnt as per now post id route for that
// student can see the comment not create or update or delete comment
router.get("/:postId",authorize("STUDENT"), getCommentsByPostId);
// getting comment by comment by user id 
router.get("/:userId", authorize("REVIEWER"), getCommentsByUserId);


export default router;
