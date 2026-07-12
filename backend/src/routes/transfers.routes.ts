import { NextFunction, Request, Response, Router } from 'express';
import { prisma } from '../db/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { createTransferRequest, approveTransferRequest } from '../services/transfer.service';

const transfersRouter = Router();

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

transfersRouter.post('/', requireAuth, async (req, res) => {
  try {
    const transfer = await createTransferRequest({
      assetId: req.body.assetId,
      requestedById: req.auth?.userId ?? req.body.requestedById,
      targetUserId: req.body.targetUserId,
      targetDepartmentId: req.body.targetDepartmentId
    });
    res.status(201).json({ transfer });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Transfer request failed' });
  }
});

transfersRouter.patch('/:id/approve', requireAuth, requireRole(['ASSET_MANAGER', 'DEPT_HEAD', 'ADMIN']), async (req, res) => {
  try {
    const result = await approveTransferRequest(req.params.id);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Transfer approval failed' });
  }
});

export { transfersRouter };
