"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maintenanceRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const maintenance_service_1 = require("../services/maintenance.service");
const maintenanceRouter = (0, express_1.Router)();
exports.maintenanceRouter = maintenanceRouter;
maintenanceRouter.post('/', auth_1.requireAuth, async (req, res) => {
    try {
        const maintenance = await (0, maintenance_service_1.createMaintenanceRequest)({
            assetId: req.body.assetId,
            raisedById: req.auth?.userId ?? req.body.raisedById,
            description: req.body.description,
            priority: req.body.priority
        });
        res.status(201).json({ maintenance });
    }
    catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Maintenance request failed' });
    }
});
maintenanceRouter.patch('/:id/status', auth_1.requireAuth, (0, rbac_1.requireRoles)(['ASSET_MANAGER', 'ADMIN']), async (req, res) => {
    try {
        const maintenance = await (0, maintenance_service_1.updateMaintenanceStatus)(req.params.id, req.body.status);
        res.json({ maintenance });
    }
    catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Maintenance update failed' });
    }
});
