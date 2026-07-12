import { Request, Response, Router } from 'express';
import { prisma } from '../db/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { createBooking } from '../services/booking.service';

const bookingsRouter = Router();

bookingsRouter.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const booking = await createBooking({
      assetId: req.body.assetId,
      bookedById: req.auth?.userId ?? req.body.bookedById,
      startDatetime: new Date(req.body.startDatetime),
      endDatetime: new Date(req.body.endDatetime)
    });
    res.status(201).json({ booking });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Booking failed' });
  }
});

bookingsRouter.get('/', requireAuth, async (_req, res) => {
  const bookings = await prisma.resourceBooking.findMany();
  res.json({ bookings });
});

export { bookingsRouter };
