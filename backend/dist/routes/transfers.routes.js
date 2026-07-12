"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transfersRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const transfer_service_1 = require("../services/transfer.service");
const transfersRouter = (0, express_1.Router)();
exports.transfersRouter = transfersRouter;
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
transfersRouter.post('/', auth_1.requireAuth, async (req, res) => {
    try {
        const transfer = await (0, transfer_service_1.createTransferRequest)({
            assetId: req.body.assetId,
            requestedById: req.auth?.userId ?? req.body.requestedById,
            targetUserId: req.body.targetUserId,
            targetDepartmentId: req.body.targetDepartmentId
        });
        res.status(201).json({ transfer });
    }
    catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Transfer request failed' });
    }
});
transfersRouter.patch('/:id/approve', auth_1.requireAuth, requireRole(['ASSET_MANAGER', 'DEPT_HEAD', 'ADMIN']), async (req, res) => {
    try {
        const result = await (0, transfer_service_1.approveTransferRequest)(req.params.id);
        res.json({ result });
    }
    catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Transfer approval failed' });
    }
});
