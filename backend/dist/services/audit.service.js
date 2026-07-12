"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeAuditCycle = closeAuditCycle;
const client_1 = require("@prisma/client");
const prisma_1 = require("../db/prisma");
async function closeAuditCycle(auditCycleId) {
    return prisma_1.prisma.$transaction(async (tx) => {
        const auditCycle = await tx.auditCycle.findUnique({ where: { id: auditCycleId } });
        if (!auditCycle)
            throw new Error('Audit cycle not found');
        const updatedCycle = await tx.auditCycle.update({ where: { id: auditCycleId }, data: { status: 'CLOSED' } });
        const missingItems = await tx.auditItem.findMany({
            where: { auditCycleId, verificationStatus: 'MISSING' },
            include: { asset: true }
        });
        for (const item of missingItems) {
            await tx.asset.update({ where: { id: item.assetId }, data: { state: 'LOST' } });
        }
        return {
            auditCycle: updatedCycle,
            missingCount: missingItems.length,
            summary: `${missingItems.length} missing items were marked as lost.`
        };
    }, {
        isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable
    });
}
