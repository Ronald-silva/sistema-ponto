"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaceRecognitionController = void 0;
const prisma_1 = require("../lib/prisma");
const FaceRecognitionService_1 = require("../services/FaceRecognitionService");
class FaceRecognitionController {
    constructor() {
        this.faceRecognitionService = new FaceRecognitionService_1.FaceRecognitionService();
    }
    async register(request, response) {
        var _a;
        const { userId } = request.params;
        const imageBuffer = (_a = request.file) === null || _a === void 0 ? void 0 : _a.buffer;
        if (!imageBuffer) {
            return response.status(400).json({ error: 'Imagem não fornecida' });
        }
        try {
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                return response.status(404).json({ error: 'Usuário não encontrado' });
            }
            if (user.faceId) {
                await this.faceRecognitionService.deleteFace(user.faceId);
            }
            const faceId = await this.faceRecognitionService.registerFace(imageBuffer, userId);
            await prisma_1.prisma.user.update({
                where: { id: userId },
                data: { faceId },
            });
            return response.json({ message: 'Rosto registrado com sucesso', faceId });
        }
        catch (error) {
            console.error('Erro ao registrar rosto:', error);
            return response.status(500).json({ error: 'Falha ao registrar rosto' });
        }
    }
    async verify(request, response) {
        var _a;
        const imageBuffer = (_a = request.file) === null || _a === void 0 ? void 0 : _a.buffer;
        if (!imageBuffer) {
            return response.status(400).json({ error: 'Imagem não fornecida' });
        }
        try {
            const userId = await this.faceRecognitionService.verifyFace(imageBuffer);
            if (!userId) {
                return response.status(401).json({ error: 'Rosto não reconhecido' });
            }
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            });
            if (!user) {
                return response.status(404).json({ error: 'Usuário não encontrado' });
            }
            return response.json({ message: 'Rosto verificado com sucesso', user });
        }
        catch (error) {
            console.error('Erro ao verificar rosto:', error);
            return response.status(500).json({ error: 'Falha ao verificar rosto' });
        }
    }
    async delete(request, response) {
        const { userId } = request.params;
        try {
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                return response.status(404).json({ error: 'Usuário não encontrado' });
            }
            if (!user.faceId) {
                return response.status(400).json({ error: 'Usuário não possui rosto registrado' });
            }
            await this.faceRecognitionService.deleteFace(user.faceId);
            await prisma_1.prisma.user.update({
                where: { id: userId },
                data: { faceId: null },
            });
            return response.json({ message: 'Rosto removido com sucesso' });
        }
        catch (error) {
            console.error('Erro ao remover rosto:', error);
            return response.status(500).json({ error: 'Falha ao remover rosto' });
        }
    }
}
exports.FaceRecognitionController = FaceRecognitionController;
