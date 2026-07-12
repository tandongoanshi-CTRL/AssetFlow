"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allocationsRouter = void 0;
const express_1 = require("express");
const allocation_service_1 = require("../services/allocation.service");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const prisma_1 = require("../db/prisma");
const allocationsRouter = (0, express_1.Router)();
exports.allocationsRouter = allocationsRouter;
allocationsRouter.post('/', auth_1.requireAuth, (0, rbac_1.requireRoles)(['ASSET_MANAGER', 'ADMIN']), async (req, res) => {
    try {
        const allocation = await (0, allocation_service_1.createAllocation)(req.body);
        res.status(201).json({ allocation });
    }
    catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Allocation failed' });
    }
});
allocationsRouter.get('/', auth_1.requireAuth, async (_req, res) => {
    const allocations = await prisma_1.prisma.allocation.findMany({ include: { asset: true, assignedToUser: true } });
    res.json({ allocations });
});
