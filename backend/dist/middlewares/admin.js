"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = adminMiddleware;
function adminMiddleware(request, response, next) {
    const { user } = request;
    if (!user) {
        return response.status(401).json({ error: 'Usuário não autenticado' });
    }
    if (user.role !== 'ADMIN') {
        return response.status(403).json({ error: 'Acesso negado' });
    }
    return next();
}
