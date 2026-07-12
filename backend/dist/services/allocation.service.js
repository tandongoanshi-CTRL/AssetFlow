"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAllocation = createAllocation;
const client_1 = require("@prisma/client");
const prisma_1 = require("../db/prisma");
async function createAllocation(input) {
    return prisma_1.prisma.$transaction(async (tx) => {
        const asset = await tx.asset.findUnique({ where: { id: input.assetId } });
        if (!asset)
            throw new Error('Asset not found');
        if (asset.state !== 'AVAILABLE') {
            const activeAllocation = await tx.allocation.findFirst({
                where: { assetId: input.assetId, status: 'ACTIVE' },
                include: { assignedToUser: true, assignedToDepartment: true }
            });
            throw new Error(activeAllocation ? `Asset is already allocated to ${activeAllocation.assignedToUser?.name ?? activeAllocation.assignedToDepartment?.name ?? 'another party'}` : 'Asset is not available');
        }
        const allocation = await tx.allocation.create({
            data: {
                assetId: input.assetId,
                assignedToUserId: input.assignedToUserId,
                assignedToDepartmentId: input.assignedToDepartmentId,
                expectedReturnDate: input.expectedReturnDate,
                status: 'ACTIVE'
            }
        });
        await tx.asset.update({ where: { id: input.assetId }, data: { state: 'ALLOCATED' } });
        return allocation;
    }, {
        isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable
    });
}
