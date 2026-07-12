import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { env } from './env';
import { authRouter } from './routes/auth.routes';
import { adminRouter } from './routes/admin.routes';
import { allocationsRouter } from './routes/allocations.routes';
import { transfersRouter } from './routes/transfers.routes';
import { bookingsRouter } from './routes/bookings.routes';
import { maintenanceRouter } from './routes/maintenance.routes';
import { auditsRouter } from './routes/audits.routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/allocations', allocationsRouter);
app.use('/api/transfers', transfersRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/maintenance', maintenanceRouter);
app.use('/api/audits', auditsRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

export { app };
