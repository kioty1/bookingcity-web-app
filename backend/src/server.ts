import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./prisma";
import propertyRoutes from "./routes/propertyRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import { authenticateToken, authorizeRoles } from "./middleware/authMiddleware";
import cookieParser from "cookie-parser";
import path from "path";


dotenv.config();

const app = express();


app.use(cors({
origin: 'http://localhost:8080',
credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const uploadsPath = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsPath));

app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
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

app.get("/api/protected/profile", authenticateToken, (req, res) => {
  res.json({
    message: "This is a protected route",
    user: (req as any).user,
  });
});

app.get(
  "/api/protected/admin",
  authenticateToken,
  authorizeRoles("administraator"),
  (req, res) => {
    res.json({
      message: "This route is only for admin users",
      user: (req as any).user,
    });
  }
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});