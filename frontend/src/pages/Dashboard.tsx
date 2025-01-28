import { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  Card,
  CardBody,
  Spinner,
  Center,
  VStack
} from '@chakra-ui/react'
import { useAuth } from '../contexts/AuthContext'

interface DashboardStats {
  totalFuncionarios: number;
  obrasAtivas: number;
  horasExtrasMes: number;
  registrosHoje: number;
}

export function Dashboard() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalFuncionarios: 0,
    obrasAtivas: 0,
    horasExtrasMes: 0,
    registrosHoje: 0
  })

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch('http://localhost:3333/api/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setStats(data.stats)
        }
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [token])

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    )
  }

  return (
    <Box p={8}>
      <VStack spacing={8} align="stretch">
        <Grid templateColumns="repeat(auto-fit, minmax(240px, 1fr))" gap={6}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Funcionários Ativos</StatLabel>
                <StatNumber>{stats.totalFuncionarios}</StatNumber>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Obras em Andamento</StatLabel>
                <StatNumber>{stats.obrasAtivas}</StatNumber>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Horas Extras no Mês</StatLabel>
                <StatNumber>{stats.horasExtrasMes}h</StatNumber>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Registros Hoje</StatLabel>
                <StatNumber>{stats.registrosHoje}</StatNumber>
              </Stat>
            </CardBody>
          </Card>
        </Grid>
      </VStack>
    </Box>
  )
}
