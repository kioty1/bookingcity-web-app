import { Router } from "express";
import prisma from "../prisma";
import { authenticateToken, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// GET /api/bookings
router.get(
  "/",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "User is not authenticated",
        });
      }

      if (req.user.role !== "administraator") {
        return res.status(403).json({
          message: "Only administrator can see all bookings",
        });
      }

      const bookings = await prisma.booking.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          property: {
            include: {
              images: true,
              owner: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
          payment: true,
          review: true,
        },
        orderBy: {
          id: "desc",
        },
      });

      return res.json(bookings);
    } catch (error: any) {
      return res.status(500).json({
        message: "Failed to load bookings",
        errorMessage: error.message,
        errorCode: error.code,
      });
    }
  }
);

// GET /api/bookings/my
// Logged-in user can see their own bookings.
router.get("/my", authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "User is not authenticated",
      });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        property: {
          include: {
            images: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    return res.json(bookings);
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to load my bookings",
      errorMessage: error.message,
      errorCode: error.code,
    });
  }
});

// GET /api/bookings/owner
// Owner can see booking requests for their properties.
router.get("/owner", authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "User is not authenticated",
      });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        property: {
          ownerId: req.user.id,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        property: {
          include: {
            images: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    return res.json(bookings);
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to load owner bookings",
      errorMessage: error.message,
      errorCode: error.code,
    });
  }
});

// GET /api/bookings/:id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        property: true,
        payment: true,
        review: true,
      },
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json(booking);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to load booking",
      errorMessage: error.message,
      errorCode: error.code,
    });
  }
});

// POST /api/bookings
// Logged-in user can create a booking request.
router.post("/", authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "User is not authenticated",
      });
    }

    const { propertyId, startDate, endDate } = req.body;

    if (propertyId === undefined || propertyId === null || !startDate || !endDate) {
      return res.status(400).json({
        message: "Property, start date and end date are required",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({
        message: "End date must be after start date",
      });
    }

    const property = await prisma.property.findUnique({
      where: {
        id: Number(propertyId),
      },
    });

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    if (property.status !== "aktiivne") {
      return res.status(400).json({
        message: "Only active listings can be booked",
      });
    }

    const existingBooking = await prisma.booking.findFirst({
      where: {
        propertyId: Number(propertyId),
        status: {
          in: ["ootel", "kinnitatud"],
        },
        startDate: {
          lt: end,
        },
        endDate: {
          gt: start,
        },
      },
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "This listing is already booked for selected dates",
      });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: req.user.id,
        propertyId: Number(propertyId),
        startDate: start,
        endDate: end,
        status: "ootel",
      },
    });

    return res.status(201).json({
      message: "Booking request created successfully",
      booking,
    });
  } catch (error: any) {
    console.error("Create booking error:", error);

    return res.status(500).json({
      message: "Failed to create booking",
      errorMessage: error.message,
      errorCode: error.code,
    });
  }
});

// PUT /api/bookings/:id/status
// Owner or admin can confirm/cancel booking.
router.put("/:id/status", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!req.user) {
      return res.status(401).json({
        message: "User is not authenticated",
      });
    }

    if (!status) {
      return res.status(400).json({
        message: "status is required",
      });
    }

    const allowedStatuses = ["ootel", "kinnitatud", "tuhistatud"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Allowed values: ootel, kinnitatud, tuhistatud",
      });
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      include: {
        property: true,
      },
    });

    if (!existingBooking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const isOwner = existingBooking.property.ownerId === req.user.id;
    const isAdmin = req.user.role === "administraator";
    const isBookingUser = existingBooking.userId === req.user.id;

    if (!isOwner && !isAdmin && !isBookingUser) {
      return res.status(403).json({
        message: "You are not allowed to update this booking",
      });
    }

    if (isBookingUser && !isOwner && !isAdmin && status !== "tuhistatud") {
      return res.status(403).json({
        message: "Client can only cancel own booking",
      });
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status,
      },
    });

    return res.json({
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to update booking status",
      errorMessage: error.message,
      errorCode: error.code,
    });
  }
});

export default router;