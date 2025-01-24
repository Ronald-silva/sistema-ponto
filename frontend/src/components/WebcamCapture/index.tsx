import { useRef, useCallback, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, MobileStepper, Paper, Typography, CircularProgress } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight, Close } from '@mui/icons-material';
import { analyzeFaceQuality } from '../../services/faceQualityService';
import { getFaceDescriptor } from '../../services/faceRecognition';
import { loadModels, detectFace, compareFaces } from '../../services/faceRecognition';
import { FaceTutorial } from '../FaceTutorial';

interface WebcamCaptureProps {
  onValidationResult?: (isValid: boolean) => void;
  onPhotoCapture?: (photoData: string) => void;
  onError?: (error: string) => void;
  isRegistration?: boolean;
  mode?: 'validacao' | 'registro';
}

interface TutorialStep {
  label: string;
  description: string;
  image: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    label: 'Posicionamento',
    description: 'Centralize seu rosto na frente da câmera',
    image: '/tutorial/step1.svg'
  },
  {
    label: 'Iluminação',
    description: 'Certifique-se de estar em um ambiente bem iluminado',
    image: '/tutorial/step2.svg'
  },
  {
    label: 'Expressão',
    description: 'Mantenha uma expressão neutra e os olhos abertos',
    image: '/tutorial/step3.svg'
  },
  {
    label: 'Orientação',
    description: 'Mantenha a cabeça reta, sem inclinação',
    image: '/tutorial/step4.svg'
  }
];

export function WebcamCapture({ onValidationResult, onPhotoCapture, onError, isRegistration = false, mode = 'registro' }: WebcamCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [qualityIssues, setQualityIssues] = useState<string[]>([]);
  const [qualityScore, setQualityScore] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const maxSteps = tutorialSteps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCloseTutorial = () => {
    setShowTutorial(false);
  };

  const capture = useCallback(async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        onValidationResult?.(false);
        return;
      }

      try {
        // Criar um elemento de imagem para processar o screenshot
        const img = new Image();
        img.src = imageSrc;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        // Primeiro verifica a qualidade da imagem
        const quality = await analyzeFaceQuality(img);
        setQualityIssues(quality.issues);
        setQualityScore(quality.score);

        if (!quality.isAcceptable) {
          onValidationResult?.(false);
          return;
        }

        // Se a qualidade for aceitável, extrai o descritor facial
        const descriptor = await getFaceDescriptor(img);
        if (!descriptor) {
          onValidationResult?.(false);
          return;
        }

        onValidationResult?.(true);
      } catch (error) {
        onValidationResult?.(false);
      }
    }
  }, [onValidationResult]);

  // Função para analisar a qualidade em tempo real
  useEffect(() => {
    let animationFrameId: number;
    let isProcessing = false;

    const analyzeFrame = async () => {
      if (isProcessing || !webcamRef.current?.video) {
        animationFrameId = requestAnimationFrame(analyzeFrame);
        return;
      }

      isProcessing = true;
      setIsAnalyzing(true);

      try {
        const canvas = document.createElement('canvas');
        const video = webcamRef.current.video;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          const quality = await analyzeFaceQuality(canvas);
          setQualityIssues(quality.issues);
          setQualityScore(quality.score);
        }
      } catch (error) {
        console.error('Erro na análise em tempo real:', error);
      } finally {
        isProcessing = false;
        setIsAnalyzing(false);
      }

      animationFrameId = requestAnimationFrame(analyzeFrame);
    };

    analyzeFrame();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 640, margin: '0 auto' }}>
      <Box sx={{ position: 'relative' }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 640,
            height: 480,
            facingMode: "user"
          }}
          style={{ width: '100%', borderRadius: 8 }}
        />
        
        {/* Overlay com guias de posicionamento */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}
        >
          <Box
            sx={{
              border: '2px dashed',
              borderColor: qualityScore >= 0.7 ? 'success.main' : 'warning.main',
              borderRadius: '50%',
              width: 200,
              height: 200,
              opacity: 0.5,
              transition: 'all 0.3s ease'
            }}
          />
        </Box>

        {/* Indicador de análise */}
        {isAnalyzing && (
          <CircularProgress
            size={24}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16
            }}
          />
        )}
      </Box>
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          onClick={capture}
          disabled={qualityScore < 0.7 || isAnalyzing}
        >
          {isRegistration ? 'Cadastrar Face' : 'Validar Face'}
        </Button>
      </Box>

      {qualityIssues.length > 0 && (
        <Paper 
          elevation={3} 
          sx={{ 
            mt: 2, 
            p: 2, 
            backgroundColor: qualityScore < 0.7 ? '#ffebee' : '#e8f5e9',
            transition: 'background-color 0.3s ease'
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Qualidade da Imagem: {Math.round(qualityScore * 100)}%
          </Typography>
          <Typography 
            variant="body2" 
            color={qualityScore < 0.7 ? 'error' : 'success.main'}
            sx={{ transition: 'color 0.3s ease' }}
          >
            {qualityIssues.join(', ')}
          </Typography>
        </Paper>
      )}

      <Dialog 
        open={showTutorial} 
        maxWidth="sm" 
        fullWidth
        onClose={handleCloseTutorial}
      >
        <DialogTitle>
          Tutorial de Reconhecimento Facial
          <IconButton
            aria-label="close"
            onClick={handleCloseTutorial}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ maxWidth: 400, flexGrow: 1, margin: '0 auto' }}>
            <Paper
              square
              elevation={0}
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: 50,
                pl: 2,
                bgcolor: 'background.default',
              }}
            >
              <Typography>{tutorialSteps[activeStep].label}</Typography>
            </Paper>
            <Box
              component="img"
              sx={{
                height: 255,
                display: 'block',
                maxWidth: 400,
                overflow: 'hidden',
                width: '100%',
              }}
              src={tutorialSteps[activeStep].image}
              alt={tutorialSteps[activeStep].label}
            />
            <Paper
              square
              elevation={0}
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: 50,
                pl: 2,
                bgcolor: 'background.default',
              }}
            >
              <Typography>{tutorialSteps[activeStep].description}</Typography>
            </Paper>
            <MobileStepper
              steps={maxSteps}
              position="static"
              activeStep={activeStep}
              nextButton={
                <Button
                  size="small"
                  onClick={handleNext}
                  disabled={activeStep === maxSteps - 1}
                >
                  Próximo
                  <KeyboardArrowRight />
                </Button>
              }
              backButton={
                <Button 
                  size="small" 
                  onClick={handleBack} 
                  disabled={activeStep === 0}
                >
                  <KeyboardArrowLeft />
                  Anterior
                </Button>
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTutorial}>Fechar Tutorial</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 