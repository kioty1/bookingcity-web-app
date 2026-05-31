import { Router } from "express";
import prisma from "../prisma";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

// GET /api/properties
// Client sees only active properties
router.get("/", async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      where: {
        status: "aktiivne",
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        images: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    res.json(properties);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to load properties",
      errorMessage: error.message,
      errorCode: error.code,
    });
  }
});

// GET /api/properties/admin/all
router.get(
  "/admin/all",
  authenticateToken,
  authorizeRoles("administraator"),
  async (req, res) => {
    try {
      const properties = await prisma.property.findMany({
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          images: true,
        },
        orderBy: {
          id: "asc",
        },
      });

      res.json(properties);
    } catch (error: any) {
      res.status(500).json({
        message: "Failed to load all properties",
        errorMessage: error.message,
        errorCode: error.code,
      });
    }
  }
);


// GET /api/properties/:id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        images: true,
        bookings: true,
        dates: true,
      },
    });

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    res.json(property);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to load property",
      errorMessage: error.message,
      errorCode: error.code,
    });
  }
});

// POST /api/properties
router.post(
  "/",
  authenticateToken,
  authorizeRoles("omanik", "administraator"),
  async (req, res) => {
    try {
      const {
        ownerId,
        title,
        city,
        address,
        type,
        description,
        price,
        status,
      } = req.body;

      if (!ownerId || !title || !city || !type || !price) {
        return res.status(400).json({
          message: "ownerId, title, city, type and price are required",
        });
      }

      const property = await prisma.property.create({
        data: {
          ownerId: Number(ownerId),
          title,
          city,
          address,
          type,
          description,
          price,
          status: status || "aktiivne",
        },
      });

      res.status(201).json({
        message: "Property created successfully",
        property,
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Failed to create property",
        errorMessage: error.message,
        errorCode: error.code,
      });
    }
  }
);

// PUT /api/properties/:id
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("omanik", "administraator"),
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      const {
        title,
        city,
        address,
        type,
        description,
        price,
        status,
      } = req.body;

      const property = await prisma.property.update({
        where: { id },
        data: {
          title,
          city,
          address,
          type,
          description,
          price,
          status,
        },
      });

      res.json({
        message: "Property updated successfully",
        property,
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Failed to update property",
        errorMessage: error.message,
        errorCode: error.code,
      });
    }
  }
);

// DELETE /api/properties/:id
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("omanik", "administraator"),
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      const property = await prisma.property.update({
        where: { id },
        data: {
          status: "blokeeritud",
        },
      });

      res.json({
        message: "Property deactivated successfully",
        property,
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Failed to deactivate property",
        errorMessage: error.message,
        errorCode: error.code,
      });
    }
  }
);

export default router;