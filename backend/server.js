import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/posts.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use(postRoutes);
app.use(userRoutes);
app.use(express.static("uploads"));

const start = async () => {
  try {
    const connectDB = await mongoose.connect(process.env.MONGO_URL);
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
