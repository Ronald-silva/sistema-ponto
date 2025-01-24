import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';

interface TutorialStep {
  label: string;
  description: string;
  image: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    label: 'Posicionamento',
    description: 'Centralize seu rosto na câmera, mantendo uma distância adequada (30-50cm da tela)',
    image: '/tutorial/step1.svg'
  },
  {
    label: 'Iluminação',
    description: 'Certifique-se de estar em um ambiente bem iluminado, evitando luz direta no rosto',
    image: '/tutorial/step2.svg'
  },
  {
    label: 'Expressão',
    description: 'Mantenha uma expressão neutra, olhos abertos e olhando diretamente para a câmera',
    image: '/tutorial/step3.svg'
  },
  {
    label: 'Orientação',
    description: 'Mantenha a cabeça reta, evitando inclinações ou rotações',
    image: '/tutorial/step4.svg'
  }
];

interface FaceTutorialProps {
  open: boolean;
  onClose: () => void;
}

export function FaceTutorial({ open, onClose }: FaceTutorialProps) {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFinish = () => {
    setActiveStep(0);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Tutorial de Reconhecimento Facial
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {tutorialSteps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>
                  <Typography variant="subtitle1">
                    {step.label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {step.description}
                    </Typography>
                    <Box
                      component="img"
                      src={step.image}
                      alt={step.label}
                      sx={{
                        width: '100%',
                        maxWidth: 300,
                        height: 'auto',
                        display: 'block',
                        margin: '0 auto',
                        mb: 2
                      }}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
                      >
                        Voltar
                      </Button>
                      <Button
                        variant="contained"
                        onClick={index === tutorialSteps.length - 1 ? handleFinish : handleNext}
                      >
                        {index === tutorialSteps.length - 1 ? 'Concluir' : 'Próximo'}
                      </Button>
                    </Box>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Pular Tutorial
        </Button>
      </DialogActions>
    </Dialog>
  );
} 