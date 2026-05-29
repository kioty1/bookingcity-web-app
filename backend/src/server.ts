import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./prisma";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "BookingCity backend API is running",
  });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.json({
      message: "Database connection works",
      users,
    });
  } catch (error: any) {
    console.error("Database error:", error);

    res.status(500).json({
      message: "Database connection error",
      errorMessage: error.message,
      errorCode: error.code,
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});