"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = adminMiddleware;
function adminMiddleware(request, response, next) {
    const { role } = request.user;
    if (role !== 'ADMIN') {
        throw new Error('Acesso não autorizado');
    }
    return next();
}
