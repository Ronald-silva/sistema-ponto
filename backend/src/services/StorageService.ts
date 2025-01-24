import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

export class StorageService {
  private client: S3Client;
  private bucket: string;

  constructor() {
    this.bucket = process.env.AWS_S3_BUCKET || '';
    this.client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
      }
    });
  }

  async uploadBase64Image(base64Image: string, prefix: string): Promise<string> {
    try {
      // Remove o prefixo data:image/jpeg;base64, se existir
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // Gera um nome único para o arquivo
      const fileName = `${prefix}/${randomUUID()}.jpg`;

      // Configura o upload para o S3
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileName,
        Body: buffer,
        ContentType: 'image/jpeg',
        ContentEncoding: 'base64'
      });

      // Realiza o upload
      await this.client.send(command);

      // Retorna a URL do arquivo
      return `https://${this.bucket}.s3.amazonaws.com/${fileName}`;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw new Error('Erro ao fazer upload da imagem');
    }
  }
} 