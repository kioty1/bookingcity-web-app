import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma";
import z from 'zod';
import { authenticateToken, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    if (name.length <= 1) {
      return res.status(400).json({
        message: "The name must be more than 1 character long",
      });
    }

    const emailRegex: RegExp = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Please enter a valid email address'
      });
    }

     const resPassword = passwordSchema.safeParse(password);

     if(!resPassword.success){
        message: resPassword.error.errors[0].message;
     }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role || "klient",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Registration failed",
      errorMessage: error.message,
      errorCode: error.code,
    });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }


    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "default_secret",
      {
        expiresIn: "1h",
      }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3600000,
    });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Login failed",
      errorMessage: error.message,
      errorCode: error.code,
    });
  }
});

// GET /api/auth/me
router.get("/me", authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "User is not authenticated",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found. Please login again.",
      });
    }

    res.json({
      message: "User authenticated successfully",
      user,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to get current user",
      errorMessage: error.message,
      errorCode: error.code,
    });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.json({
    message: "Logout successful",
  });
});


const passwordSchema = z.string({
    required_error: "A password is required",
})
.min(6, 'The password must be longer than 6 characters')
.regex(/[A-Z]/, 'Must contain at least one uppercase letter')
.regex(/[a-z]/, 'Must contain at least one lowercase letter ')
.regex(/\d/, 'Must contain at least one number')
.regex(/[@$!%*?&]/, 'There must be at least one special character');

export default router;