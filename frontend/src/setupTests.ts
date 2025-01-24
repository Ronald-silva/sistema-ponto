import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mock do requestAnimationFrame
global.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 0);
};

global.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};

// Mock do HTMLCanvasElement
const mockContext = {
  drawImage: jest.fn(),
  getImageData: jest.fn(() => ({
    data: new Uint8ClampedArray(100),
  })),
  canvas: document.createElement('canvas')
} as unknown as CanvasRenderingContext2D;

type GetContextFn = {
  (contextId: '2d', options?: CanvasRenderingContext2DSettings): CanvasRenderingContext2D | null;
  (contextId: 'bitmaprenderer', options?: ImageBitmapRenderingContextSettings): ImageBitmapRenderingContext | null;
  (contextId: 'webgl', options?: WebGLContextAttributes): WebGLRenderingContext | null;
  (contextId: 'webgl2', options?: WebGLContextAttributes): WebGL2RenderingContext | null;
};

HTMLCanvasElement.prototype.getContext = jest.fn((contextId: string) => {
  if (contextId === '2d') {
    return mockContext;
  }
  return null;
}) as unknown as GetContextFn; 