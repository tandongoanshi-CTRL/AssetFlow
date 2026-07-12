"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../db/prisma");
const auth_1 = require("../middleware/auth");
const adminRouter = (0, express_1.Router)();
exports.adminRouter = adminRouter;
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
adminRouter.patch('/users/:id/role', auth_1.requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    if (!role || !['DEPT_HEAD', 'ASSET_MANAGER'].includes(role)) {
        res.status(400).json({ error: 'Role must be DEPT_HEAD or ASSET_MANAGER' });
        return;
    }
    const user = await prisma_1.prisma.user.update({ where: { id }, data: { role: role } });
    res.json({ user });
});
