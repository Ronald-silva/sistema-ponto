"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
exports.auth = {
    jwt: {
        secret: process.env.JWT_SECRET || 'default-secret-key',
        expiresIn: '1d'
    }
};
