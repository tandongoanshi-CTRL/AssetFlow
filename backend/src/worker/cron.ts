import cron from 'node-cron';
import { prisma } from '../db/prisma';

export function startCronWorkers() {
  return cron.schedule('0 0 * * *', async () => {
    const overdueAllocations = await prisma.allocation.findMany({
      where: {
        status: 'ACTIVE',
        expectedReturnDate: { lt: new Date() }
      }
    });

    if (overdueAllocations.length > 0) {
      await prisma.allocation.updateMany({
        where: { id: { in: overdueAllocations.map((allocation) => allocation.id) } },
        data: { status: 'OVERDUE' }
      });

      await prisma.notification.createMany({
        data: overdueAllocations.map((allocation) => ({
          title: 'Allocation overdue',
          message: `Allocation ${allocation.id} is now overdue.`,
          userId: null
        }))
      });
    }
  });
}
