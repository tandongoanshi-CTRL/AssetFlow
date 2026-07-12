"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditsRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const audit_service_1 = require("../services/audit.service");
const auditsRouter = (0, express_1.Router)();
exports.auditsRouter = auditsRouter;
auditsRouter.post('/close', auth_1.requireAuth, (0, rbac_1.requireRoles)(['ADMIN']), async (req, res) => {
    try {
        const result = await (0, audit_service_1.closeAuditCycle)(req.body.auditCycleId);
        res.json({ result });
    }
    catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Audit closure failed' });
    }
});
