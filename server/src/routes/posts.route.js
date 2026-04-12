import express from "express";
import {authorize} from "../middleware/auth.middleware.js";
const router = express.Router();

// Define your post routes here
router.get("/create-post", authorize("REVIEWER"), async (req, res) => {
  // Logic to create a post
  res.status(200).json({ message: "Post created successfully!" });
});

export default router;