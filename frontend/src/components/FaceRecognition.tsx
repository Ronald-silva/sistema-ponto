import { useRef, useState, useCallback, useEffect } from 'react'
import Webcam from 'react-webcam'
import * as faceapi from 'face-api.js'

interface FaceRecognitionProps {
  onCapture: (faceData: { descriptor: Float32Array; matchScore?: number }) => void
  referenceDescriptor?: Float32Array
  width?: number
  height?: number
}

export function FaceRecognition({ onCapture, referenceDescriptor, width = 640, height = 480 }: FaceRecognitionProps) {
  const webcamRef = useRef<Webcam>(null)
  const [isModelLoading, setIsModelLoading] = useState(true)
  const [error, setError] = useState<string>()

  // Carregar modelos do face-api
  useEffect(() => {
    async function loadModels() {
      try {
        console.log('Carregando modelos...')
        
        // Definir caminho dos modelos
        const modelPath = '/models'
        
        // Carregar modelos
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(modelPath),
          faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
          faceapi.nets.faceRecognitionNet.loadFromUri(modelPath)
        ])

        console.log('Modelos carregados com sucesso!')
        setIsModelLoading(false)
      } catch (err) {
        console.error('Erro ao carregar modelos:', err)
        setError('Erro ao carregar modelos de reconhecimento facial')
      }
    }
    loadModels()
  }, [])

  const capture = useCallback(async () => {
    if (!webcamRef.current) return

    try {
      console.log('Capturando imagem...')
      const imageSrc = webcamRef.current.getScreenshot()
      if (!imageSrc) {
        console.error('Erro: Não foi possível capturar imagem da webcam')
        setError('Erro ao capturar imagem da webcam')
        return
      }

      // Criar elemento de imagem para o face-api
      const img = new Image()
      img.src = imageSrc

      // Esperar a imagem carregar
      await new Promise((resolve) => {
        img.onload = resolve
      })

      console.log('Detectando rosto...')
      // Detectar face e extrair descritor
      const detections = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor()

      if (!detections) {
        console.error('Erro: Nenhum rosto detectado')
        setError('Nenhum rosto detectado. Por favor, centralize seu rosto na câmera.')
        return
      }

      console.log('Rosto detectado:', detections)
      let matchScore: number | undefined

      // Se tiver um descritor de referência, calcular a similaridade
      if (referenceDescriptor) {
        console.log('Calculando similaridade...')
        const distance = faceapi.euclideanDistance(detections.descriptor, referenceDescriptor)
        matchScore = 1 - distance // Converter distância em score (0-1)
        console.log('Score de similaridade:', matchScore)
      }

      onCapture({
        descriptor: detections.descriptor,
        matchScore
      })
      setError(undefined)
    } catch (err) {
      console.error('Erro ao processar imagem:', err)
      setError('Erro ao processar imagem')
    }
  }, [onCapture, referenceDescriptor])

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-700">
        {error}
      </div>
    )
  }

  if (isModelLoading) {
    return (
      <div className="flex h-[480px] items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50">
        <div className="text-center text-zinc-500">
          <div className="mb-2 h-5 w-5 animate-spin rounded-full border-2 border-zinc-500 border-t-transparent" />
          <p>Carregando modelos de reconhecimento facial...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          width,
          height,
          facingMode: 'user'
        }}
        width={width}
        height={height}
      />
      <div className="p-4">
        <button
          onClick={capture}
          className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-[--primary] font-medium text-white shadow-sm transition-colors hover:bg-[--primary-dark] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>Capturar</span>
        </button>
      </div>
    </div>
  )
}
