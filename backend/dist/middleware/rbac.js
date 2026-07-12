"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRoles = requireRoles;
function requireRoles(roles) {
    return (req, res, next) => {
        const auth = req.auth;
        if (!auth) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        if (!roles.includes(auth.role)) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        next();
    };
}
