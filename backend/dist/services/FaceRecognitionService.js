"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaceRecognitionService = void 0;
const client_rekognition_1 = require("@aws-sdk/client-rekognition");
class FaceRecognitionService {
    constructor() {
        this.client = new client_rekognition_1.RekognitionClient({
            region: process.env.AWS_REGION || 'sa-east-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            },
        });
        this.collectionId = process.env.AWS_REKOGNITION_COLLECTION_ID || 'employee-faces';
    }
    async registerFace(imageBuffer, externalImageId) {
        var _a;
        const params = {
            CollectionId: this.collectionId,
            Image: {
                Bytes: imageBuffer,
            },
            ExternalImageId: externalImageId,
            DetectionAttributes: ['ALL'],
            MaxFaces: 1,
            QualityFilter: 'HIGH',
        };
        try {
            const command = new client_rekognition_1.IndexFacesCommand(params);
            const response = await this.client.send(command);
            if (!response.FaceRecords || response.FaceRecords.length === 0) {
                throw new Error('Nenhum rosto detectado na imagem');
            }
            const faceId = (_a = response.FaceRecords[0].Face) === null || _a === void 0 ? void 0 : _a.FaceId;
            if (!faceId) {
                throw new Error('Falha ao obter o ID do rosto');
            }
            return faceId;
        }
        catch (error) {
            console.error('Erro ao registrar rosto:', error);
            throw new Error('Falha ao registrar rosto no sistema');
        }
    }
    async verifyFace(imageBuffer) {
        var _a;
        const params = {
            CollectionId: this.collectionId,
            Image: {
                Bytes: imageBuffer,
            },
            MaxFaces: 1,
            FaceMatchThreshold: 95,
        };
        try {
            const command = new client_rekognition_1.SearchFacesByImageCommand(params);
            const response = await this.client.send(command);
            if (!response.FaceMatches || response.FaceMatches.length === 0) {
                return null;
            }
            const match = response.FaceMatches[0];
            if (match.Similarity && match.Similarity < 95) {
                return null;
            }
            return ((_a = match.Face) === null || _a === void 0 ? void 0 : _a.ExternalImageId) || null;
        }
        catch (error) {
            console.error('Erro ao verificar rosto:', error);
            throw new Error('Falha ao verificar rosto no sistema');
        }
    }
    async deleteFace(faceId) {
        const params = {
            CollectionId: this.collectionId,
            FaceIds: [faceId],
        };
        try {
            const command = new client_rekognition_1.DeleteFacesCommand(params);
            await this.client.send(command);
        }
        catch (error) {
            console.error('Erro ao deletar rosto:', error);
            throw new Error('Falha ao remover rosto do sistema');
        }
    }
}
exports.FaceRecognitionService = FaceRecognitionService;
