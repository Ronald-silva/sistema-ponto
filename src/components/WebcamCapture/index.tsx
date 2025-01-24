import { useRef, useCallback, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Box, Button, CircularProgress } from '@mui/material';
import { loadModels, detectFace } from '../../services/faceRecognition';

interface WebcamCaptureProps {
  onValidationResult: (result: boolean) => void;
  onPhotoCapture?: (imageSrc: string) => void;
  onError?: (error: string) => void;
  isRegistration?: boolean;
}

export function WebcamCapture({ 
  onValidationResult, 
  onPhotoCapture, 
  onError,
  isRegistration = false 
}: WebcamCaptureProps) {
  // ... existing code ...
} 