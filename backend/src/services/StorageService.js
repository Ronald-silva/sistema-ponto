"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const crypto_1 = require("crypto");
class StorageService {
    constructor() {
        this.bucket = process.env.AWS_S3_BUCKET || '';
        this.client = new client_s3_1.S3Client({
            region: process.env.AWS_REGION || 'us-east-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
            }
        });
    }
    uploadBase64Image(base64Image, prefix) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Remove o prefixo data:image/jpeg;base64, se existir
                const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');
                // Gera um nome único para o arquivo
                const fileName = `${prefix}/${(0, crypto_1.randomUUID)()}.jpg`;
                // Configura o upload para o S3
                const command = new client_s3_1.PutObjectCommand({
                    Bucket: this.bucket,
                    Key: fileName,
                    Body: buffer,
                    ContentType: 'image/jpeg',
                    ContentEncoding: 'base64'
                });
                // Realiza o upload
                yield this.client.send(command);
                // Retorna a URL do arquivo
                return `https://${this.bucket}.s3.amazonaws.com/${fileName}`;
            }
            catch (error) {
                console.error('Erro ao fazer upload da imagem:', error);
                throw new Error('Erro ao fazer upload da imagem');
            }
        });
    }
}
exports.StorageService = StorageService;
