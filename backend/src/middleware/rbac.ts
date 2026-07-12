import { NextFunction, Response } from 'express';
import { AuthRequest } from './auth';

export type Role = 'EMPLOYEE' | 'DEPT_HEAD' | 'ASSET_MANAGER' | 'ADMIN';

export function requireRoles(roles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const auth = req.auth;
    if (!auth) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (!roles.includes(auth.role as Role)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    next();
  };
}

