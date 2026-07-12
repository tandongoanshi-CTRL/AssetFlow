import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma';

export async function createMaintenanceRequest(input: {
  assetId: string;
  raisedById: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}) {
  return prisma.maintenanceRequest.create({
    data: {
      assetId: input.assetId,
      raisedById: input.raisedById,
      description: input.description,
      priority: input.priority,
      status: 'PENDING'
    }
  });
}

export async function updateMaintenanceStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'TECHNICIAN_ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED') {
  return prisma.$transaction(async (tx) => {
    const request = await tx.maintenanceRequest.findUnique({ where: { id } });
    if (!request) throw new Error('Maintenance request not found');

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
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable
  });
}
