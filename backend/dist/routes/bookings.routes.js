"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingsRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../db/prisma");
const auth_1 = require("../middleware/auth");
const booking_service_1 = require("../services/booking.service");
const bookingsRouter = (0, express_1.Router)();
exports.bookingsRouter = bookingsRouter;
bookingsRouter.post('/', auth_1.requireAuth, async (req, res) => {
    try {
        const booking = await (0, booking_service_1.createBooking)({
            assetId: req.body.assetId,
            bookedById: req.auth?.userId ?? req.body.bookedById,
            startDatetime: new Date(req.body.startDatetime),
            endDatetime: new Date(req.body.endDatetime)
        });
        res.status(201).json({ booking });
    }
    catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Booking failed' });
    }
});
bookingsRouter.get('/', auth_1.requireAuth, async (_req, res) => {
    const bookings = await prisma_1.prisma.resourceBooking.findMany();
    res.json({ bookings });
});
