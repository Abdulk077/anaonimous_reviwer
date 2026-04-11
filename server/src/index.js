
import express from "express";
import dotenv from "dotenv";
import prisma, {connectDB} from "./config/db.config.js";
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.send("Hello World!"); 
});

app.listen(PORT, async() => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
}); 