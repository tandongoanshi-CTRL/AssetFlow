import { NextFunction, Request, Response, Router } from 'express';
import { prisma } from '../db/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { createMaintenanceRequest, updateMaintenanceStatus } from '../services/maintenance.service';

const maintenanceRouter = Router();

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

maintenanceRouter.post('/', requireAuth, async (req, res) => {
  try {
    const maintenance = await createMaintenanceRequest({
      assetId: req.body.assetId,
      raisedById: req.auth?.userId ?? req.body.raisedById,
      description: req.body.description,
      priority: req.body.priority
    });
    res.status(201).json({ maintenance });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Maintenance request failed' });
  }
});

maintenanceRouter.patch('/:id/status', requireAuth, requireRole(['ASSET_MANAGER', 'ADMIN']), async (req, res) => {
  try {
    const maintenance = await updateMaintenanceStatus(req.params.id, req.body.status);
    res.json({ maintenance });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Maintenance update failed' });
  }
});

export { maintenanceRouter };
