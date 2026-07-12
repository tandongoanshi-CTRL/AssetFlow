import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma';

export async function closeAuditCycle(auditCycleId: string) {
  return prisma.$transaction(async (tx) => {
    const auditCycle = await tx.auditCycle.findUnique({ where: { id: auditCycleId } });
    if (!auditCycle) throw new Error('Audit cycle not found');
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
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable
  });
}
