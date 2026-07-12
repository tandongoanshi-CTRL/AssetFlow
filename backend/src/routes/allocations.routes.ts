import { NextFunction, Request, Response, Router } from 'express';
import { createAllocation } from '../services/allocation.service';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { prisma } from '../db/prisma';

const allocationsRouter = Router();

function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    if (!authReq.auth || !roles.includes(authReq.auth.role)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    next();
  };
}

allocationsRouter.post('/', requireAuth, requireRole(['ASSET_MANAGER', 'ADMIN']), async (req, res) => {
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
