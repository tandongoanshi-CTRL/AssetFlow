import { NextFunction, Request, Response, Router } from 'express';
import { prisma } from '../db/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

const adminRouter = Router();

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

adminRouter.patch('/users/:id/role', requireAuth, requireRole(['ADMIN']), async (req, res) => {
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
