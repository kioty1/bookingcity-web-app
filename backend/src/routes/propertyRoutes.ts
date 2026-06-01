import { Router } from "express";
import prisma from "../prisma";
import { authenticateToken, authorizeRoles, AuthRequest } from "../middleware/authMiddleware";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadsPath = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = Router();

// GET /api/properties/my/listings
// Logged-in user can see all own listings with all statuses.
router.get("/my/listings", authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "User is not authenticated",
      });
    }

    const properties = await prisma.property.findMany({
      where: {
        ownerId: req.user.id,
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
        id: "desc",
      },
    });

    res.json(properties);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to load user listings",
      errorMessage: error.message,
      errorCode: error.code,
    });
  }
});

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
// Logged-in user can create a new listing.
// The ownerId is taken from JWT token, not from request body.
router.post(
  "/",
  authenticateToken,
  upload.single("image"),
  async (req: AuthRequest & { file?: Express.Multer.File }, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "User is not authenticated",
        });
      }

      const { title, city, address, type, description, price } = req.body;

      if (!title || !city || !type || !price) {
        return res.status(400).json({
          message: "title, city, type and price are required",
        });
      }

      const property = await prisma.property.create({
        data: {
          ownerId: req.user.id,
          title,
          city,
          address,
          type,
          description,
          price: Number(price),
          status: "ootel",
        },
      });

      if (req.file) {
        await prisma.image.create({
          data: {
            propertyId: property.id,
            url: `/uploads/${req.file.filename}`,
          },
        });
      }

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
// User can edit only own property.
// Admin can edit any property.
router.put("/:id", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);

    if (!req.user) {
      return res.status(401).json({
        message: "User is not authenticated",
      });
    }

    const existingProperty = await prisma.property.findUnique({
      where: { id },
    });

    if (!existingProperty) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    const isOwner = existingProperty.ownerId === req.user.id;
    const isAdmin = req.user.role === "administraator";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You can edit only your own properties",
      });
    }

    const { title, city, address, type, description, price, status } = req.body;

    const property = await prisma.property.update({
      where: { id },
      data: {
        title,
        city,
        address,
        type,
        description,
        price,
        status: isAdmin ? status : existingProperty.status,
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
});

// DELETE /api/properties/:id
// User can deactivate only own property.
// Admin can deactivate any property.
router.delete("/:id", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);

    if (!req.user) {
      return res.status(401).json({
        message: "User is not authenticated",
      });
    }

    const existingProperty = await prisma.property.findUnique({
      where: { id },
    });

    if (!existingProperty) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    const isOwner = existingProperty.ownerId === req.user.id;
    const isAdmin = req.user.role === "administraator";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You can deactivate only your own properties",
      });
    }

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
});

export default router;