import express from "express";
import {authorize} from "../middleware/auth.middleware.js";
const router = express.Router();
import { createPost, getPosts, updatePost, deletePost } from "../controller/post.controller.js";
// Define your post routes here
router.post("/", authorize("STUDENT"),createPost);
router.put("/:id", authorize("STUDENT"),updatePost);
router.delete("/:id", authorize("STUDENT"),deletePost);
// getting posts
router.get("/", authorize,getPosts);
//router.get("/:id",authorize, getPostById);
export default router;