import { NextFunction, Request, Response, Router } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { closeAuditCycle } from '../services/audit.service';

const auditsRouter = Router();

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

auditsRouter.post('/close', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const result = await closeAuditCycle(req.body.auditCycleId);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Audit closure failed' });
  }
});

export { auditsRouter };
