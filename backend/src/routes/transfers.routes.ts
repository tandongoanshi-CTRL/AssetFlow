import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requireRoles } from '../middleware/rbac';
import { createTransferRequest, approveTransferRequest } from '../services/transfer.service';

const transfersRouter = Router();

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

transfersRouter.patch('/:id/approve', requireAuth, requireRoles(['ASSET_MANAGER', 'DEPT_HEAD', 'ADMIN']), async (req, res) => {
  try {
    const result = await approveTransferRequest(req.params.id);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Transfer approval failed' });
  }
});

export { transfersRouter };
