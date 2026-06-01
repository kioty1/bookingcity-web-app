import { Router } from "express";
import prisma from "../prisma";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

// GET /api/users
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    res.json(users);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to load users",
      errorMessage: error.message,
      errorCode: error.code,
    });
  }
});

// GET /api/users/:id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        properties: true,
        bookings: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to load user",
      errorMessage: error.message,
      errorCode: error.code,
    });
  }
});

// GET /api/users/admin/owners-properties
router.get(
  "/admin/owners-properties",
  authenticateToken,
  authorizeRoles("administraator"),
  async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        where: {
          role: {
            in: ["omanik", "administraator"],
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          properties: {
            select: {
              id: true,
              title: true,
              city: true,
              address: true,
              type: true,
              description: true,
              price: true,
              status: true,
            },
            orderBy: {
              id: "asc",
            },
          },
        },
        orderBy: {
          id: "asc",
        },
      });

      res.json(users);
    } catch (error: any) {
      res.status(500).json({
        message: "Failed to load users with properties",
        errorMessage: error.message,
        errorCode: error.code,
      });
    }
  }
);

export default router;