import {
  RekognitionClient,
  IndexFacesCommand,
  SearchFacesByImageCommand,
  DeleteFacesCommand,
  IndexFacesCommandInput,
  SearchFacesByImageCommandInput,
  DeleteFacesCommandInput,
} from '@aws-sdk/client-rekognition';

export class FaceRecognitionService {
  private client: RekognitionClient;
  private collectionId: string;

  constructor() {
    this.client = new RekognitionClient({
      region: process.env.AWS_REGION || 'sa-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
    this.collectionId = process.env.AWS_REKOGNITION_COLLECTION_ID || 'employee-faces';
  }

  /**
   * Registra o rosto de um funcionário no AWS Rekognition
   * @param imageBuffer Buffer da imagem do rosto
   * @param externalImageId ID externo para referência (geralmente o ID do usuário)
   * @returns ID do rosto registrado no AWS Rekognition
   */
  async registerFace(imageBuffer: Buffer, externalImageId: string): Promise<string> {
    const params: IndexFacesCommandInput = {
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
      const command = new IndexFacesCommand(params);
      const response = await this.client.send(command);

      if (!response.FaceRecords || response.FaceRecords.length === 0) {
        throw new Error('Nenhum rosto detectado na imagem');
      }

      const faceId = response.FaceRecords[0].Face?.FaceId;
      if (!faceId) {
        throw new Error('Falha ao obter o ID do rosto');
      }

      return faceId;
    } catch (error) {
      console.error('Erro ao registrar rosto:', error);
      throw new Error('Falha ao registrar rosto no sistema');
    }
  }

  /**
   * Verifica se um rosto corresponde a algum funcionário registrado
   * @param imageBuffer Buffer da imagem do rosto para verificação
   * @returns ID externo do funcionário se houver correspondência, null caso contrário
   */
  async verifyFace(imageBuffer: Buffer): Promise<string | null> {
    const params: SearchFacesByImageCommandInput = {
      CollectionId: this.collectionId,
      Image: {
        Bytes: imageBuffer,
      },
      MaxFaces: 1,
      FaceMatchThreshold: 95, // Alta confiança para evitar falsos positivos
    };

    try {
      const command = new SearchFacesByImageCommand(params);
      const response = await this.client.send(command);

      if (!response.FaceMatches || response.FaceMatches.length === 0) {
        return null;
      }

      const match = response.FaceMatches[0];
      if (match.Similarity && match.Similarity < 95) {
        return null;
      }

      return match.Face?.ExternalImageId || null;
    } catch (error) {
      console.error('Erro ao verificar rosto:', error);
      throw new Error('Falha ao verificar rosto no sistema');
    }
  }

  /**
   * Remove o rosto de um funcionário do sistema
   * @param faceId ID do rosto no AWS Rekognition
   */
  async deleteFace(faceId: string): Promise<void> {
    const params: DeleteFacesCommandInput = {
      CollectionId: this.collectionId,
      FaceIds: [faceId],
    };

    try {
      const command = new DeleteFacesCommand(params);
      await this.client.send(command);
    } catch (error) {
      console.error('Erro ao deletar rosto:', error);
      throw new Error('Falha ao remover rosto do sistema');
    }
  }
}
