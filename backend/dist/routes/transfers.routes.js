"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transfersRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const transfer_service_1 = require("../services/transfer.service");
const transfersRouter = (0, express_1.Router)();
exports.transfersRouter = transfersRouter;
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
transfersRouter.patch('/:id/approve', auth_1.requireAuth, (0, rbac_1.requireRoles)(['ASSET_MANAGER', 'DEPT_HEAD', 'ADMIN']), async (req, res) => {
    try {
        const result = await (0, transfer_service_1.approveTransferRequest)(req.params.id);
        res.json({ result });
    }
    catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Transfer approval failed' });
    }
});
