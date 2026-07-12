import { Router } from 'express';
import { createAllocation } from '../services/allocation.service';
import { requireAuth } from '../middleware/auth';
import { requireRoles } from '../middleware/rbac';
import { prisma } from '../db/prisma';

const allocationsRouter = Router();

allocationsRouter.post('/', requireAuth, requireRoles(['ASSET_MANAGER', 'ADMIN']), async (req, res) => {
  try {
    const allocation = await createAllocation(req.body);
    res.status(201).json({ allocation });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Allocation failed' });
  }
});

allocationsRouter.get('/', requireAuth, async (_req, res) => {
  const allocations = await prisma.allocation.findMany({ include: { asset: true, assignedToUser: true } });
  res.json({ allocations });
});

export { allocationsRouter };
