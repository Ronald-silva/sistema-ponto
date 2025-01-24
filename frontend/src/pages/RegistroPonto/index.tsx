import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { WebcamCapture } from '../../components/WebcamCapture';
import { ObraSelector } from '../../components/ObraSelector';

interface RegistroPonto {
  id: number;
  data: string;
  tipo: 'ENTRADA' | 'SAIDA';
}

const steps = ['Selecionar Obra', 'Validação Facial', 'Confirmar Registro'];

export function RegistroPonto() {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [validationPassed, setValidationPassed] = useState(false);
  const [selectedObraId, setSelectedObraId] = useState<number | null>(user?.obra_atual_id || null);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleObraSelect = async (obraId: number) => {
    try {
      setError(null);
      setLoading(true);
      
      // Atualiza a obra atual do usuário
      await api.post(`/usuarios/${user?.id}/obra-atual`, { obra_id: obraId });
      setSelectedObraId(obraId);
      handleNext();
    } catch (error: any) {
      console.error('Erro ao selecionar obra:', error);
      setError(error.response?.data?.error || 'Erro ao selecionar obra');
    } finally {
      setLoading(false);
    }
  };

  const handleValidationResult = useCallback((isValid: boolean) => {
    setValidationPassed(isValid);
    if (isValid) {
      handleNext();
    }
  }, []);

  const handleRegistro = useCallback(async () => {
    if (!validationPassed || !selectedObraId) {
      setError('É necessário completar todas as etapas anteriores');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await api.post('/registros-ponto', {
        usuario_id: user?.id,
        obra_id: selectedObraId
      });

      setSuccess('Registro de ponto realizado com sucesso!');
      setActiveStep(0);
      setValidationPassed(false);
    } catch (error: any) {
      console.error('Erro ao registrar ponto:', error);
      setError(error.response?.data?.error || 'Erro ao registrar ponto');
    } finally {
      setLoading(false);
    }
  }, [user, selectedObraId, validationPassed]);

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Selecione a obra onde você está trabalhando:
            </Typography>
            <ObraSelector onObraSelect={handleObraSelect} />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Posicione seu rosto para validação facial:
            </Typography>
            <WebcamCapture 
              mode="validacao"
              onValidationResult={handleValidationResult}
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="subtitle1" gutterBottom>
              Confirme seu registro de ponto:
            </Typography>
            <Button
              variant="contained"
              onClick={handleRegistro}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Confirmar Registro'}
            </Button>
          </Box>
        );
      default:
        return 'Etapa desconhecida';
    }
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Registro de Ponto
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0 || loading}
          >
            Voltar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
} 