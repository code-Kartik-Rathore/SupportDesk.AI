import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/user.js";
import ticketRoutes from "./routes/ticket.js";
import inngestRouter from "./inngest/index.js";

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://supportdesk-ai-frontend.onrender.com" // your actual frontend URL
  ],
  credentials: true
}))
app.use(express.json());
app.use(inngestRouter); // Inngest endpoint
app.use("/api/auth", userRoutes);
app.use("/api/tickets", ticketRoutes);

mongoose
  .connect(process.env.MONGO_URI?.trim())
  .then(() => {
    console.log("MongoDB connected ✅");
    app.listen(PORT, () => console.log("🚀 Server at http://localhost:3000"));
  })
  .catch((err) => console.error("❌ MongoDB error: ", err));
