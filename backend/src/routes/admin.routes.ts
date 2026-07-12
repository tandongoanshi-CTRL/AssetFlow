import { Router } from 'express';
import { prisma } from '../db/prisma';
import { requireAuth } from '../middleware/auth';
import { requireRoles } from '../middleware/rbac';

const adminRouter = Router();

adminRouter.patch('/users/:id/role', requireAuth, requireRoles(['ADMIN']), async (req, res) => {

  const { id } = req.params;
  const { role } = req.body as { role?: string };
  if (!role || !['DEPT_HEAD', 'ASSET_MANAGER'].includes(role)) {
    res.status(400).json({ error: 'Role must be DEPT_HEAD or ASSET_MANAGER' });
    return;
  }

  const user = await prisma.user.update({ where: { id }, data: { role: role as any } });
  res.json({ user });
});

export { adminRouter };
