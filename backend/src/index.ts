import { env } from './env';
import { app } from './app';
import { startCronWorkers } from './worker/cron';

app.listen(env.port, () => {
  console.log(`AssetFlow API listening on http://localhost:${env.port}`);
});

void startCronWorkers();
