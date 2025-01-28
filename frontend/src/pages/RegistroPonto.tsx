import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  HStack,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Card,
  CardHeader,
  CardBody,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { FaceCapture } from '../components/FaceCapture'
import { useNavigate } from 'react-router-dom'

// Adicione esta interface no início do arquivo
interface Registro {
  id: string;
  tipo: 'ENTRADA' | 'SAIDA';
  dataHora: string;
  horasExtras?: number;
  foto?: string;
}

export function RegistroPonto() {
  const { usuario, token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [tipoRegistro, setTipoRegistro] = useState<'ENTRADA' | 'SAIDA' | null>(null)
  const [registros, setRegistros] = useState<Registro[]>([])
  const toast = useToast()
  const navigate = useNavigate()

  const handleRegistro = (tipo: 'ENTRADA' | 'SAIDA') => {
    setTipoRegistro(tipo)
    setShowCamera(true)
  }

  const carregarHistorico = async () => {
    try {
      const response = await fetch('http://localhost:3333/api/registros', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        // Ordena por data, mais recentes primeiro
        setRegistros(data.sort((a: Registro, b: Registro) => 
          new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()
        ))
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
    }
  }

  useEffect(() => {
    carregarHistorico()
  }, [token])

  const handlePhotoCapture = async (photo: string) => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3333/api/registros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tipo: tipoRegistro,
          foto: photo
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao registrar ponto')
      }

      toast({
        title: 'Sucesso',
        description: `${tipoRegistro === 'ENTRADA' ? 'Entrada' : 'Saída'} registrada com sucesso`,
        status: 'success',
        duration: 3000
      })
      carregarHistorico()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao registrar ponto',
        status: 'error',
        duration: 3000
      })
    } finally {
      setLoading(false)
      setShowCamera(false)
    }
  }

  return (
    <Box maxW="800px" mx="auto" p={4}>
      <VStack spacing={6}>
        <Card w="100%">
          <CardHeader>
            <HStack justify="space-between" w="100%">
              <Box>
                <Heading size="lg">Registro de Ponto</Heading>
                <Text>{usuario?.nome}</Text>
                <Text>Obra: {usuario?.obra_atual}</Text>
              </Box>
              <Button 
                colorScheme="blue" 
                onClick={() => navigate('/admin')}
              >
                Painel Admin
              </Button>
            </HStack>
          </CardHeader>
          <CardBody>
            <HStack spacing={4} justify="center">
              <Button
                colorScheme="green"
                onClick={() => handleRegistro('ENTRADA')}
                isLoading={loading}
              >
                Registrar Entrada
              </Button>
              <Button
                colorScheme="red"
                onClick={() => handleRegistro('SAIDA')}
                isLoading={loading}
              >
                Registrar Saída
              </Button>
            </HStack>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <VStack align="stretch" spacing={1}>
              <Heading size={{ base: "sm", md: "md" }}>Histórico de Horas Extras</Heading>
              <Text color="gray.500" fontSize="sm">
                Últimos 30 dias
              </Text>
            </VStack>
          </CardHeader>
          <CardBody overflowX="auto" p={0}>
            <Table variant="simple" size={{ base: "sm", md: "md" }}>
              <Thead>
                <Tr>
                  <Th>Data</Th>
                  <Th>Hora</Th>
                  <Th>Tipo</Th>
                  <Th isNumeric>H. Extras</Th>
                </Tr>
              </Thead>
              <Tbody>
                {registros.map((registro, index) => (
                  <Tr key={index}>
                    <Td whiteSpace="nowrap">
                      {new Date(registro.dataHora).toLocaleDateString()}
                    </Td>
                    <Td whiteSpace="nowrap">
                      {new Date(registro.dataHora).toLocaleTimeString()}
                    </Td>
                    <Td>{registro.tipo === 'ENTRADA' ? 'Entrada' : 'Saída'}</Td>
                    <Td isNumeric>{registro.horasExtras?.toFixed(1)}h</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </VStack>

      <Modal 
        isOpen={showCamera} 
        onClose={() => setShowCamera(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Registrar {tipoRegistro === 'ENTRADA' ? 'Entrada' : 'Saída'}
          </ModalHeader>
          <ModalBody pb={6}>
            <FaceCapture
              onPhotoCapture={handlePhotoCapture}
              onClose={() => setShowCamera(false)}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
} 