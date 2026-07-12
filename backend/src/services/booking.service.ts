import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma';

export async function createBooking(input: {
  assetId: string;
  bookedById: string;
  startDatetime: Date;
  endDatetime: Date;
}) {
  return prisma.$transaction(async (tx) => {
    const asset = await tx.asset.findUnique({ where: { id: input.assetId } });
    if (!asset) throw new Error('Asset not found');
    if (!asset.isBookable) throw new Error('Asset is not bookable');

    const overlap = await tx.resourceBooking.findFirst({
      where: {
        assetId: input.assetId,
        status: { not: 'CANCELLED' },
        OR: [
          {
            startDatetime: { lt: input.endDatetime },
            endDatetime: { gt: input.startDatetime }
          }
        ]
      }
    });

    if (overlap) throw new Error('Booking overlaps with an existing reservation');

    return tx.resourceBooking.create({
      data: {
        assetId: input.assetId,
        bookedById: input.bookedById,
        startDatetime: input.startDatetime,
        endDatetime: input.endDatetime,
        status: 'UPCOMING'
      }
    });
  }, {
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable
  });
}
