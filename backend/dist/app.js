"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = require("./routes/auth.routes");
const projects_routes_1 = require("./routes/projects.routes");
const timeRecord_routes_1 = require("./routes/timeRecord.routes");
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://192.168.1.72:5173',
        'http://192.168.1.72:5174',
        'https://sistema-ponto.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
app.use((req, res, next) => {
    console.log('Nova requisição:');
    console.log(`Método: ${req.method}`);
    console.log(`URL: ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('Origin:', req.headers.origin);
    next();
});
app.use('/auth', auth_routes_1.authRoutes);
app.use('/projects', projects_routes_1.projectsRoutes);
app.use('/time-records', timeRecord_routes_1.timeRecordRoutes);
app.use((err, req, res, next) => {
    console.error('Erro na requisição:');
    console.error('URL:', req.url);
    console.error('Método:', req.method);
    console.error('Headers:', req.headers);
    console.error('Erro:', err);
    console.error('Stack:', err.stack);
    res.status(500).json({ error: 'Erro interno do servidor' });
});
