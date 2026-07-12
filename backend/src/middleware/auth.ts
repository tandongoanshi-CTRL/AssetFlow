import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/prisma';
import { env } from '../env';

export interface AuthRequest extends Request {
  auth?: {
    userId: string;
    role: string;
  };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization as string | undefined;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.jwtSecret) as { sub: string; role: string };
    prisma.user
      .findUnique({ where: { id: payload.sub } })
      .then((user) => {
        if (!user || user.status !== 'ACTIVE') {
          res.status(401).json({ error: 'Invalid session' });
          return;
        }
        req.auth = { userId: user.id, role: user.role };
        next();
      })
      .catch(() => res.status(401).json({ error: 'Invalid session' }));
  } catch {
    res.status(401).json({ error: 'Invalid session' });
  }
}

export function signToken(userId: string, role: string): string {
  return jwt.sign({ sub: userId, role }, env.jwtSecret, { expiresIn: `${env.sessionTtlSeconds}s` });
}
