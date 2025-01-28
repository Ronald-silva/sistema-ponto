import { Text, HStack, Box } from '@chakra-ui/react'
import { useState, useEffect } from 'react'

export function DataHora() {
  const [dataHora, setDataHora] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setDataHora(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatarData = () => {
    return dataHora.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatarHora = () => {
    return dataHora.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <Box position="fixed" top={4} right={4}>
      <HStack spacing={2} bg="white" p={2} borderRadius="md" boxShadow="sm">
        <Text color="gray.500" fontSize="sm">
          {formatarData()}
        </Text>
        <Text color="gray.500" fontSize="sm">
          {formatarHora()}
        </Text>
      </HStack>
    </Box>
  )
} 