import * as faceapi from 'face-api.js';
import { cacheModels } from './cacheService';

let modelsLoaded = false;

export async function loadModels() {
  if (modelsLoaded) return;

  try {
    // Primeiro, tenta carregar os modelos do cache
    await cacheModels();

    // Carrega os modelos usando o cache
    await Promise.all([
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
    ]);
    
    modelsLoaded = true;
    console.log('Modelos carregados com sucesso');
  } catch (error) {
    console.error('Erro ao carregar modelos:', error);
    throw new Error('Não foi possível carregar os modelos de reconhecimento facial');
  }
}

export async function detectFace(imageElement: HTMLImageElement | HTMLVideoElement): Promise<faceapi.FaceDetection | null> {
  try {
    await loadModels();
    const detection = await faceapi.detectSingleFace(imageElement);
    return detection || null;
  } catch (error) {
    console.error('Erro ao detectar face:', error);
    return null;
  }
}

export async function compareFaces(
  descriptor1: Float32Array,
  descriptor2: Float32Array,
  threshold = 0.6
): Promise<boolean> {
  try {
    const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
    return distance < threshold;
  } catch (error) {
    console.error('Erro ao comparar faces:', error);
    return false;
  }
}

export async function getFaceDescriptor(imageElement: HTMLImageElement | HTMLVideoElement): Promise<Float32Array | null> {
  try {
    await loadModels();
    const detection = await faceapi
      .detectSingleFace(imageElement)
      .withFaceLandmarks()
      .withFaceDescriptor();

    return detection?.descriptor || null;
  } catch (error) {
    console.error('Erro ao extrair descritor facial:', error);
    return null;
  }
}

function createImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
} 