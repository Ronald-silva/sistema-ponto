"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAdmin = ensureAdmin;
function ensureAdmin(request, response, next) {
    const { user } = request;
    if (!(user === null || user === void 0 ? void 0 : user.role) || user.role !== 'ADMIN') {
        return response.status(403).json({ error: 'Acesso negado' });
    }
    return next();
}
