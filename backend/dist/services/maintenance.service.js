"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMaintenanceRequest = createMaintenanceRequest;
exports.updateMaintenanceStatus = updateMaintenanceStatus;
const client_1 = require("@prisma/client");
const prisma_1 = require("../db/prisma");
async function createMaintenanceRequest(input) {
    return prisma_1.prisma.maintenanceRequest.create({
        data: {
            assetId: input.assetId,
            raisedById: input.raisedById,
            description: input.description,
            priority: input.priority,
            status: 'PENDING'
        }
    });
}
async function updateMaintenanceStatus(id, status) {
    return prisma_1.prisma.$transaction(async (tx) => {
        const request = await tx.maintenanceRequest.findUnique({ where: { id } });
        if (!request)
            throw new Error('Maintenance request not found');
        const updated = await tx.maintenanceRequest.update({
            where: { id },
            data: { status }
        });
        if (status === 'APPROVED') {
            await tx.asset.update({ where: { id: request.assetId }, data: { state: 'UNDER_MAINTENANCE' } });
        }
        if (status === 'RESOLVED') {
            await tx.asset.update({ where: { id: request.assetId }, data: { state: 'AVAILABLE' } });
        }
        return updated;
    }, {
        isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable
    });
}
