"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const prisma_1 = require("../db/prisma");
const auth_1 = require("../middleware/auth");
const authRouter = (0, express_1.Router)();
exports.authRouter = authRouter;
const signupSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8)
});
authRouter.post('/signup', async (req, res) => {
    try {
        const parsed = signupSchema.parse(req.body);
        const passwordHash = await bcryptjs_1.default.hash(parsed.password, 10);
        const user = await prisma_1.prisma.user.create({
            data: {
                name: parsed.name,
                email: parsed.email,
                passwordHash,
                role: 'EMPLOYEE',
                status: 'ACTIVE'
            }
        });
        res.status(201).json({ user, token: (0, auth_1.signToken)(user.id, user.role) });
    }
    catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Signup failed' });
    }
});
authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user || user.status !== 'ACTIVE') {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
    }
    const isValid = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!isValid) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
    }
    res.json({ user, token: (0, auth_1.signToken)(user.id, user.role) });
});
authRouter.get('/me', auth_1.requireAuth, async (req, res) => {
    const authUser = req.auth;
    if (!authUser) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const user = await prisma_1.prisma.user.findUnique({ where: { id: authUser.userId } });
    res.json({ user });
});
