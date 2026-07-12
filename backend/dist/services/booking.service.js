"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBooking = createBooking;
const client_1 = require("@prisma/client");
const prisma_1 = require("../db/prisma");
async function createBooking(input) {
    return prisma_1.prisma.$transaction(async (tx) => {
        const asset = await tx.asset.findUnique({ where: { id: input.assetId } });
        if (!asset)
            throw new Error('Asset not found');
        if (!asset.isBookable)
            throw new Error('Asset is not bookable');
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
        if (overlap)
            throw new Error('Booking overlaps with an existing reservation');
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
        isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable
    });
}
