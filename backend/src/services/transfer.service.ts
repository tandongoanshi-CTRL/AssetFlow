import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma';

export async function createTransferRequest(input: {
  assetId: string;
  requestedById: string;
  targetUserId?: string;
  targetDepartmentId?: string;
}) {
  return prisma.transferRequest.create({
    data: {
      assetId: input.assetId,
      requestedById: input.requestedById,
      targetUserId: input.targetUserId,
      targetDepartmentId: input.targetDepartmentId,
      status: 'REQUESTED'
    }
  });
}

export async function approveTransferRequest(transferId: string) {
  return prisma.$transaction(async (tx) => {
    const transfer = await tx.transferRequest.findUnique({ where: { id: transferId } });
    if (!transfer) throw new Error('Transfer request not found');
    const activeAllocation = await tx.allocation.findFirst({ where: { assetId: transfer.assetId, status: 'ACTIVE' } });
    if (activeAllocation) {
      await tx.allocation.update({
        where: { id: activeAllocation.id },
        data: { returnedAt: new Date(), status: 'RETURNED' }
      });
    }

    const newAllocation = await tx.allocation.create({
      data: {
        assetId: transfer.assetId,
        assignedToUserId: transfer.targetUserId,
        assignedToDepartmentId: transfer.targetDepartmentId,
        status: 'ACTIVE'
      }
    });

    await tx.asset.update({ where: { id: transfer.assetId }, data: { state: 'ALLOCATED' } });
    await tx.transferRequest.update({ where: { id: transferId }, data: { status: 'APPROVED' } });
    return { newAllocation };
  }, {
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable
  });
}
