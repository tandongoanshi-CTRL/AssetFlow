"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCronWorkers = startCronWorkers;
const node_cron_1 = __importDefault(require("node-cron"));
const prisma_1 = require("../db/prisma");
function startCronWorkers() {
    return node_cron_1.default.schedule('0 0 * * *', async () => {
        const overdueAllocations = await prisma_1.prisma.allocation.findMany({
            where: {
                status: 'ACTIVE',
                expectedReturnDate: { lt: new Date() }
            }
        });
        if (overdueAllocations.length > 0) {
            await prisma_1.prisma.allocation.updateMany({
                where: { id: { in: overdueAllocations.map((allocation) => allocation.id) } },
                data: { status: 'OVERDUE' }
            });
            await prisma_1.prisma.notification.createMany({
                data: overdueAllocations.map((allocation) => ({
                    title: 'Allocation overdue',
                    message: `Allocation ${allocation.id} is now overdue.`,
                    userId: null
                }))
            });
        }
    });
}
