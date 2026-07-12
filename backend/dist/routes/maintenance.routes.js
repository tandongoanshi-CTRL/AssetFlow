"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maintenanceRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const maintenance_service_1 = require("../services/maintenance.service");
const maintenanceRouter = (0, express_1.Router)();
exports.maintenanceRouter = maintenanceRouter;
function requireRole(roles) {
    return (req, res, next) => {
        const authReq = req;
        if (!authReq.auth || !roles.includes(authReq.auth.role)) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        next();
    };
}
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
maintenanceRouter.patch('/:id/status', auth_1.requireAuth, requireRole(['ASSET_MANAGER', 'ADMIN']), async (req, res) => {
    try {
        const maintenance = await (0, maintenance_service_1.updateMaintenanceStatus)(req.params.id, req.body.status);
        res.json({ maintenance });
    }
    catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Maintenance update failed' });
    }
});
