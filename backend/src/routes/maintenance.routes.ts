import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requireRoles } from '../middleware/rbac';
import { createMaintenanceRequest, updateMaintenanceStatus } from '../services/maintenance.service';

const maintenanceRouter = Router();

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

maintenanceRouter.patch('/:id/status', requireAuth, requireRoles(['ASSET_MANAGER', 'ADMIN']), async (req, res) => {
  try {
    const maintenance = await updateMaintenanceStatus(req.params.id, req.body.status);
    res.json({ maintenance });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Maintenance update failed' });
  }
});

export { maintenanceRouter };
