import { render, screen, fireEvent } from '@testing-library/react';
import { WebcamCapture } from './index';
import { vi } from 'vitest';

describe('WebcamCapture', () => {
  const mockOnValidationResult = vi.fn();
  const mockOnPhotoCapture = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly in registration mode', () => {
    render(
      <WebcamCapture 
        onPhotoCapture={mockOnPhotoCapture}
        onError={mockOnError}
        onValidationResult={mockOnValidationResult}
        isRegistration={true}
      />
    );

    expect(screen.getByText('Capturar Foto')).toBeInTheDocument();
  });

  it('should render correctly in validation mode', () => {
    render(
      <WebcamCapture 
        onPhotoCapture={mockOnPhotoCapture}
        onError={mockOnError}
        onValidationResult={mockOnValidationResult}
      />
    );

    expect(screen.getByText('Validar')).toBeInTheDocument();
  });

  // ... existing tests ...
}); 