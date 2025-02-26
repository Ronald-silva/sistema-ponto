"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuthenticated = ensureAuthenticated;
const jsonwebtoken_1 = require("jsonwebtoken");
function ensureAuthenticated(request, response, next) {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        response.status(401).json({ error: 'Token não fornecido' });
        return;
    }
    const [, token] = authHeader.split(' ');
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET || 'default_secret');
        request.user = {
            id: decoded.sub,
            role: decoded.role
        };
        next();
    }
    catch (_a) {
        response.status(401).json({ error: 'Token inválido' });
    }
}
