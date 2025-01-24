/** @jest-environment jsdom */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import { WebcamCapture } from './index';
import { analyzeFaceQuality } from '../../services/faceQualityService';
import { getFaceDescriptor } from '../../services/faceRecognition';
import { vi } from 'vitest';

// Mock dos módulos externos
jest.mock('react-webcam', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: function MockWebcam(props: any) {
      return React.createElement('video', {
        'data-testid': 'mock-webcam',
        ref: props.ref,
        style: props.style
      });
    }
  };
});

jest.mock('../../services/faceQualityService', () => ({
  analyzeFaceQuality: jest.fn()
}));

jest.mock('../../services/faceRecognition', () => ({
  getFaceDescriptor: jest.fn()
}));

describe('WebcamCapture', () => {
  const mockOnValidationResult = vi.fn();
  const mockOnPhotoCapture = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock da qualidade facial com valor aceitável
    (analyzeFaceQuality as jest.MockedFunction<typeof analyzeFaceQuality>).mockResolvedValue({
      score: 0.8,
      issues: [],
      isAcceptable: true
    });
    // Mock do descritor facial
    (getFaceDescriptor as jest.MockedFunction<typeof getFaceDescriptor>).mockResolvedValue(new Float32Array(128));
  });

  it('should render correctly in registration mode', () => {
    render(
      <WebcamCapture
        onPhotoCapture={mockOnPhotoCapture}
        onError={mockOnError}
        isRegistration={true}
      />
    );
    expect(screen.getByText(/Capturar Foto/i)).toBeInTheDocument();
  });

  it('should render correctly in validation mode', () => {
    render(
      <WebcamCapture
        onValidationResult={mockOnValidationResult}
        onError={mockOnError}
      />
    );
    expect(screen.getByText(/Validar/i)).toBeInTheDocument();
  });

  it('deve mostrar o tutorial inicialmente e permitir fechá-lo', async () => {
    render(
      <WebcamCapture
        onPhotoCapture={mockOnPhotoCapture}
        onError={mockOnError}
      />
    );

    // Verifica se o tutorial está visível
    expect(screen.getByText('Tutorial de Reconhecimento Facial')).toBeVisible();

    // Fecha o tutorial
    fireEvent.click(screen.getByText('Fechar Tutorial'));

    // Verifica se o tutorial foi fechado
    await waitFor(() => {
      expect(screen.queryByText('Tutorial de Reconhecimento Facial')).not.toBeVisible();
    });
  });

  it('deve navegar pelos passos do tutorial corretamente', () => {
    render(
      <WebcamCapture
        onPhotoCapture={mockOnPhotoCapture}
        onError={mockOnError}
      />
    );

    // Verifica o primeiro passo
    expect(screen.getByText('Posicionamento')).toBeInTheDocument();

    // Avança para o próximo passo
    fireEvent.click(screen.getByText('Próximo'));
    expect(screen.getByText('Iluminação')).toBeInTheDocument();

    // Avança mais um passo
    fireEvent.click(screen.getByText('Próximo'));
    expect(screen.getByText('Expressão')).toBeInTheDocument();

    // Volta um passo
    fireEvent.click(screen.getByText('Anterior'));
    expect(screen.getByText('Iluminação')).toBeInTheDocument();
  });

  it('deve mostrar feedback de qualidade em tempo real', async () => {
    (analyzeFaceQuality as jest.MockedFunction<typeof analyzeFaceQuality>).mockResolvedValue({
      score: 0.6,
      issues: ['Iluminação insuficiente'],
      isAcceptable: false
    });

    render(
      <WebcamCapture
        onPhotoCapture={mockOnPhotoCapture}
        onError={mockOnError}
      />
    );

    // Aguarda o feedback de qualidade aparecer
    await waitFor(() => {
      expect(screen.getByText('Qualidade da Imagem: 60%')).toBeInTheDocument();
      expect(screen.getByText('Iluminação insuficiente')).toBeInTheDocument();
    });
  });

  it('deve chamar onPhotoCapture quando a qualidade é boa', async () => {
    const mockDescriptor = new Float32Array(128);
    (getFaceDescriptor as jest.MockedFunction<typeof getFaceDescriptor>).mockResolvedValue(mockDescriptor);

    render(
      <WebcamCapture
        onPhotoCapture={mockOnPhotoCapture}
        onError={mockOnError}
      />
    );

    // Simula o clique no botão de captura
    const captureButton = screen.getByText(/Validar Face|Cadastrar Face/);
    fireEvent.click(captureButton);

    // Verifica se onPhotoCapture foi chamado com o descritor correto
    await waitFor(() => {
      expect(mockOnPhotoCapture).toHaveBeenCalledWith(mockDescriptor);
    });
  });

  it('deve chamar onError quando a qualidade é ruim', async () => {
    (analyzeFaceQuality as jest.MockedFunction<typeof analyzeFaceQuality>).mockResolvedValue({
      score: 0.5,
      issues: ['Rosto muito pequeno'],
      isAcceptable: false
    });

    render(
      <WebcamCapture
        onPhotoCapture={mockOnPhotoCapture}
        onError={mockOnError}
      />
    );

    // Simula o clique no botão de captura
    const captureButton = screen.getByText(/Validar Face|Cadastrar Face/);
    fireEvent.click(captureButton);

    // Verifica se onError foi chamado com a mensagem correta
    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith(expect.stringContaining('Qualidade da imagem insuficiente'));
    });
  });

  it('deve desabilitar o botão quando a qualidade é baixa', async () => {
    (analyzeFaceQuality as jest.MockedFunction<typeof analyzeFaceQuality>).mockResolvedValue({
      score: 0.5,
      issues: ['Rosto muito pequeno'],
      isAcceptable: false
    });

    render(
      <WebcamCapture
        onPhotoCapture={mockOnPhotoCapture}
        onError={mockOnError}
      />
    );

    // Verifica se o botão está desabilitado
    await waitFor(() => {
      const button = screen.getByText(/Validar Face|Cadastrar Face/);
      expect(button).toBeDisabled();
    });
  });

  it('deve mostrar o indicador de análise durante o processamento', async () => {
    render(
      <WebcamCapture
        onPhotoCapture={mockOnPhotoCapture}
        onError={mockOnError}
      />
    );

    // Verifica se o indicador de análise está visível
    await waitFor(() => {
      const progressIndicator = document.querySelector('.MuiCircularProgress-root');
      expect(progressIndicator).toBeInTheDocument();
    });
  });
}); 