"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../db/prisma");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const adminRouter = (0, express_1.Router)();
exports.adminRouter = adminRouter;
adminRouter.patch('/users/:id/role', auth_1.requireAuth, (0, rbac_1.requireRoles)(['ADMIN']), async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    if (!role || !['DEPT_HEAD', 'ASSET_MANAGER'].includes(role)) {
        res.status(400).json({ error: 'Role must be DEPT_HEAD or ASSET_MANAGER' });
        return;
    }
    const user = await prisma_1.prisma.user.update({ where: { id }, data: { role: role } });
    res.json({ user });
});
