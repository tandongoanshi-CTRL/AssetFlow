"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditsRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const audit_service_1 = require("../services/audit.service");
const auditsRouter = (0, express_1.Router)();
exports.auditsRouter = auditsRouter;
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
auditsRouter.post('/close', auth_1.requireAuth, requireRole(['ADMIN']), async (req, res) => {
    try {
        const result = await (0, audit_service_1.closeAuditCycle)(req.body.auditCycleId);
        res.json({ result });
    }
    catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Audit closure failed' });
    }
});
