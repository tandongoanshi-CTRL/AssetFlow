import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../db/prisma';
import { requireAuth, signToken } from '../middleware/auth';

const authRouter = Router();

const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8)
});

authRouter.post('/signup', async (req, res) => {
  try {
    const parsed = signupSchema.parse(req.body);
    const passwordHash = await bcrypt.hash(parsed.password, 10);
    const user = await prisma.user.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        passwordHash,
        role: 'EMPLOYEE',
        status: 'ACTIVE'
      }
    });

    res.status(201).json({ user, token: signToken(user.id, user.role) });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Signup failed' });
  }
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.status !== 'ACTIVE') {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  res.json({ user, token: signToken(user.id, user.role) });
});

authRouter.get('/me', requireAuth, async (req, res) => {
  const authUser = req.auth;
  if (!authUser) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: authUser.userId } });
  res.json({ user });
});

export { authRouter };
