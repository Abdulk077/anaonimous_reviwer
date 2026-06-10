import express from "express";
import dotenv from "dotenv";
import prisma, { connectDB } from "./config/db.config.js";
import authRoutes from "./routes/auth.route.js";
import postRouter from "./routes/posts.route.js";
import commentRouter from "./routes/comment.route.js";
import adminRouter from "./routes/admin.route.js";
import userRouter from "./routes/user.route.js";
import cors from "cors";
import pm2 from "pm2";
//import { rateLimiter } from "./middleware/ratelimiter.middleware.js";
// loading dot env
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
//app.use(rateLimiter);
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/admin", adminRouter);
app.use("/api/users", userRouter);

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
  } catch (err) {
    console.warn("DB not connected:", err.message);
    // app still runs, just no DB
  }
});