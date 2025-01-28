import { useState } from 'react'
import { Box, VStack, Button, Text, Input, HStack } from '@chakra-ui/react'

interface FaceCaptureProps {
  onPhotoCapture: (photo: string) => void;
  onClose: () => void;
}

export function FaceCapture({ onPhotoCapture, onClose }: FaceCaptureProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Função para comprimir a imagem
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string

        img.onload = () => {
          const canvas = document.createElement('canvas')
          // Define tamanho máximo
          const MAX_WIDTH = 800
          const MAX_HEIGHT = 600
          
          let width = img.width
          let height = img.height

          // Redimensiona mantendo proporção
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height
          
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)

          // Comprime para JPEG com qualidade 0.7 (70%)
          const compressedImage = canvas.toDataURL('image/jpeg', 0.7)
          resolve(compressedImage)
        }

        img.onerror = () => {
          reject(new Error('Erro ao processar imagem'))
        }
      }

      reader.onerror = () => {
        reject(new Error('Erro ao ler arquivo'))
      }
    })
  }

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      setError(null)

      // Verifica se é uma imagem
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecione uma imagem válida')
        return
      }

      // Comprime a imagem antes de enviar
      const compressedImage = await compressImage(file)
      onPhotoCapture(compressedImage)
      onClose()

    } catch (err) {
      setError('Erro ao processar a imagem')
    } finally {
      setLoading(false)
    }
  }

  return (
    <VStack spacing={4} width="100%">
      <Box width="100%">
        <Input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCapture}
          display="none"
          id="camera-input"
        />
        <HStack spacing={2}>
          <Button
            as="label"
            htmlFor="camera-input"
            colorScheme="blue"
            width="100%"
            cursor="pointer"
            isLoading={loading}
          >
            Tirar Foto
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            isDisabled={loading}
          >
            Cancelar
          </Button>
        </HStack>
      </Box>

      {error && (
        <Text color="red.500" fontSize="sm" textAlign="center">
          {error}
        </Text>
      )}
    </VStack>
  )
} 