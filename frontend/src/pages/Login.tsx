import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Center,
  useToast,
  Select
} from '@chakra-ui/react'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { MOCK_DATA } from '../mocks/data'

export function Login() {
  const [cpf, setCpf] = useState('')
  const [obra, setObra] = useState('')
  const [perfil, setPerfil] = useState('FUNCIONARIO')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!cpf || (perfil === 'FUNCIONARIO' && !obra)) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos',
        status: 'error',
        duration: 3000
      })
      return
    }

    try {
      setLoading(true)
      
      const usuario = MOCK_DATA.usuarios.find(u => 
        u.cpf === cpf && u.perfil === perfil
      )

      if (!usuario) {
        throw new Error('Usuário não encontrado')
      }

      if (perfil === 'FUNCIONARIO' && usuario.obra !== obra) {
        throw new Error('Obra não corresponde')
      }

      login(usuario, 'mock-token')
      navigate(perfil === 'ADMIN' ? '/admin' : '/registro')
      
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao fazer login',
        status: 'error',
        duration: 3000
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Center w="100vw" h="100vh" bg="gray.50">
      <Box 
        w="100%" 
        maxW="400px" 
        p={8} 
        borderWidth={1} 
        borderRadius={8} 
        boxShadow="lg"
        bg="white"
      >
        <VStack spacing={6}>
          <Heading size="lg">Login</Heading>
          <Text color="gray.600">Sistema de Controle de Horas Extras</Text>
          
          <FormControl>
            <FormLabel>Tipo de Acesso</FormLabel>
            <Select 
              value={perfil} 
              onChange={(e) => setPerfil(e.target.value)}
            >
              <option value="FUNCIONARIO">Funcionário</option>
              <option value="ADMIN">Administrador</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>CPF</FormLabel>
            <Input 
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="Digite seu CPF"
              bg="white"
              disabled={loading}
            />
          </FormControl>

          {perfil === 'FUNCIONARIO' && (
            <FormControl isRequired>
              <FormLabel>Obra</FormLabel>
              <Input 
                value={obra}
                onChange={(e) => setObra(e.target.value)}
                placeholder="Digite o código da obra"
                bg="white"
                disabled={loading}
              />
            </FormControl>
          )}

          <Button 
            colorScheme="blue" 
            width="100%"
            onClick={handleSubmit}
            size="lg"
            isLoading={loading}
          >
            Entrar
          </Button>
        </VStack>
      </Box>
    </Center>
  )
} 