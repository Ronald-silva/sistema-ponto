import { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { WebcamCapture } from '../../components/WebcamCapture';

export function CadastroFoto() {
  const [photoData, setPhotoData] = useState<string | null>(null);

  const handlePhotoCapture = (photoData: string) => {
    setPhotoData(photoData);
    // Aqui você pode implementar o envio da foto para o backend
  };

  const handleError = (error: string) => {
    console.error('Erro na captura da foto:', error);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Cadastro de Foto
        </Typography>
        
        <WebcamCapture 
          onPhotoCapture={handlePhotoCapture}
          onError={handleError}
          isRegistration={true}
        />
      </Box>
    </Container>
  );
} 