import { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { WebcamCapture } from '../../components/WebcamCapture';

export function CadastroFoto() {
  const [fotoCapturada, setFotoCapturada] = useState<string | null>(null);

  const handlePhotoCapture = (imageSrc: string) => {
    setFotoCapturada(imageSrc);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Cadastro de Foto
      </Typography>

      <Box sx={{ mt: 2 }}>
        <WebcamCapture 
          onPhotoCapture={handlePhotoCapture}
          onValidationResult={() => {}}
          isRegistration={true}
        />
      </Box>

      {fotoCapturada && (
        <Box sx={{ mt: 2 }}>
          <img src={fotoCapturada} alt="Foto capturada" style={{ maxWidth: '100%' }} />
        </Box>
      )}
    </Container>
  );
} 