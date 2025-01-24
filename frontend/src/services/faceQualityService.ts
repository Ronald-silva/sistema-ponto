import * as faceapi from 'face-api.js';

interface QualityResult {
  score: number;
  issues: string[];
  isAcceptable: boolean;
}

export async function analyzeFaceQuality(
  element: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
): Promise<QualityResult> {
  try {
    // Detectar face e landmarks
    const detection = await faceapi.detectSingleFace(element)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      return {
        score: 0,
        issues: ['Nenhuma face detectada'],
        isAcceptable: false
      };
    }

    const issues: string[] = [];
    let totalScore = 1.0;

    // Verificar tamanho da face
    const faceSize = detection.detection.box.width * detection.detection.box.height;
    const elementSize = element.width * element.height;
    const faceSizeRatio = faceSize / elementSize;

    if (faceSizeRatio < 0.1) {
      issues.push('Rosto muito pequeno');
      totalScore *= 0.5;
    }

    // Verificar confiança da detecção
    if (detection.detection.score < 0.9) {
      issues.push('Baixa confiança na detecção');
      totalScore *= detection.detection.score;
    }

    // Verificar olhos abertos usando landmarks
    const landmarks = detection.landmarks;
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
    
    const leftEyeAspectRatio = getEyeAspectRatio(leftEye);
    const rightEyeAspectRatio = getEyeAspectRatio(rightEye);

    if (leftEyeAspectRatio < 0.2 || rightEyeAspectRatio < 0.2) {
      issues.push('Olhos fechados');
      totalScore *= 0.7;
    }

    // Verificar rotação da face usando landmarks
    const jawline = landmarks.getJawOutline();
    const faceAngle = calculateFaceAngle(jawline);
    
    if (Math.abs(faceAngle) > 15) {
      issues.push('Cabeça muito inclinada');
      totalScore *= 0.8;
    }

    // Verificar iluminação
    const brightness = await calculateImageBrightness(element);
    if (brightness < 0.3) {
      issues.push('Iluminação insuficiente');
      totalScore *= 0.6;
    } else if (brightness > 0.9) {
      issues.push('Iluminação muito forte');
      totalScore *= 0.7;
    }

    return {
      score: totalScore,
      issues,
      isAcceptable: totalScore >= 0.7 && issues.length === 0
    };
  } catch (error) {
    console.error('Erro ao analisar qualidade facial:', error);
    return {
      score: 0,
      issues: ['Erro ao analisar qualidade facial'],
      isAcceptable: false
    };
  }
}

function getEyeAspectRatio(eyePoints: faceapi.Point[]): number {
  // Calcular a proporção altura/largura do olho
  const eyeWidth = Math.abs(eyePoints[3].x - eyePoints[0].x);
  const eyeHeight = Math.abs(eyePoints[4].y - eyePoints[2].y);
  return eyeHeight / eyeWidth;
}

function calculateFaceAngle(jawline: faceapi.Point[]): number {
  // Calcular o ângulo da linha da mandíbula em relação à horizontal
  const dx = jawline[jawline.length - 1].x - jawline[0].x;
  const dy = jawline[jawline.length - 1].y - jawline[0].y;
  return Math.atan2(dy, dx) * (180 / Math.PI);
}

async function calculateImageBrightness(
  element: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
): Promise<number> {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  if (!context) {
    return 0.5; // Valor padrão se não conseguir calcular
  }

  canvas.width = element.width;
  canvas.height = element.height;
  context.drawImage(element, 0, 0);

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  let sum = 0;

  // Calcular a média de brilho dos pixels
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    sum += (r + g + b) / 3;
  }

  return sum / (data.length / 4) / 255; // Normalizar para 0-1
} 