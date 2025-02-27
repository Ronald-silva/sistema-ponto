"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = require("jsonwebtoken");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../config/auth");
async function authMiddleware(request, response, next) {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        throw new Error('JWT token is missing');
    }
    const [, token] = authHeader.split(' ');
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, auth_1.auth.jwt.secret);
        const { sub, role } = decoded;
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: sub },
        });
        if (!user) {
            throw new Error('User not found');
        }
        request.user = {
            id: sub,
            role,
        };
        return next();
    }
    catch (_a) {
        throw new Error('Invalid JWT token');
    }
}
