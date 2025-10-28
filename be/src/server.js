import dotenv from "dotenv";
import express from "express";
import tasksRouter from "./routes/tasksRouters.js";
import { connectDB } from "./config/db.js";
import cors from "cors";
dotenv.config();

const PORT = process.env.PORT || 5001;
const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/api/tasks", tasksRouter);
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on ${PORT}");
  });
});
