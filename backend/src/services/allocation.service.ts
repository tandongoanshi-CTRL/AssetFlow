import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma';

export async function createAllocation(input: {
  assetId: string;
  assignedToUserId?: string;
  assignedToDepartmentId?: string;
  expectedReturnDate?: Date;
}) {
  return prisma.$transaction(async (tx) => {
    const asset = await tx.asset.findUnique({ where: { id: input.assetId } });
    if (!asset) throw new Error('Asset not found');
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
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable
  });
}
