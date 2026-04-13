
import express from "express";
import dotenv from "dotenv";
import prisma, {connectDB} from "./config/db.config.js";
import authRoutes from "./routes/auth.route.js";
import postRouter from "./routes/posts.route.js";
import commentRouter from "./routes/comment.route.js";
import adminRouter from "./routes/admin.route.js";
// loading dot env

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.send("Hello World!"); 
});
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/admin", adminRouter);
app.listen(PORT, async() => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
}); 