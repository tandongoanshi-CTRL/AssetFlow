"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.signToken = signToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../db/prisma");
const env_1 = require("../env");
function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const token = header.slice(7);
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
        prisma_1.prisma.user
            .findUnique({ where: { id: payload.sub } })
            .then((user) => {
            if (!user || user.status !== 'ACTIVE') {
                res.status(401).json({ error: 'Invalid session' });
                return;
            }
            req.auth = { userId: user.id, role: user.role };
            next();
        })
            .catch(() => res.status(401).json({ error: 'Invalid session' }));
    }
    catch {
        res.status(401).json({ error: 'Invalid session' });
    }
}
function signToken(userId, role) {
    return jsonwebtoken_1.default.sign({ sub: userId, role }, env_1.env.jwtSecret, { expiresIn: `${env_1.env.sessionTtlSeconds}s` });
}
