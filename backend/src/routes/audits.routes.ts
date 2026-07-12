import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requireRoles } from '../middleware/rbac';
import { closeAuditCycle } from '../services/audit.service';

const auditsRouter = Router();

auditsRouter.post('/close', requireAuth, requireRoles(['ADMIN']), async (req, res) => {
  try {
    const result = await closeAuditCycle(req.body.auditCycleId);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Audit closure failed' });
  }
});

export { auditsRouter };
