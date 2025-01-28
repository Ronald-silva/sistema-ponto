import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { AppRoutes } from './routes'
import { DataHora } from './components/DataHora'

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <BrowserRouter>
          <DataHora />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default App
