import { Router } from "express";
import prisma from "../prisma";

const router = Router();

// GET /api/bookings
router.get("/", async (req, res) => {
  try {
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
        property: true,
        payment: true,
        review: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to load bookings",
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
router.post("/", async (req, res) => {
  try {
    const { userId, propertyId, startDate, endDate } = req.body;

    if (!userId || !propertyId || !startDate || !endDate) {
      return res.status(400).json({
        message: "userId, propertyId, startDate and endDate are required",
      });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: Number(userId),
        propertyId: Number(propertyId),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: "ootel",
      },
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to create booking",
      errorMessage: error.message,
      errorCode: error.code,
    });
  }
});

// PUT /api/bookings/:id/status
router.put("/:id/status", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

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

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status,
      },
    });

    res.json({
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to update booking status",
      errorMessage: error.message,
      errorCode: error.code,
    });
  }
});

export default router;