import { createContext, useContext } from 'react'

interface Company {
  id: string
  name: string
}

const companies = [
  { id: '1', name: 'CDG Engenharia' },
  { id: '2', name: 'Urban Engenharia' },
  { id: '3', name: 'Consórcio Aquiraz PDD' },
  { id: '4', name: 'Consórcio BCL' },
  { id: '5', name: 'Consórcio BME' },
  { id: '6', name: 'Consórcio BBJ' }
]

interface CompaniesContextData {
  data: Company[]
}

const CompaniesContext = createContext({} as CompaniesContextData)

export function CompaniesProvider({ children }: { children: React.ReactNode }) {
  return (
    <CompaniesContext.Provider
      value={{
        data: companies
      }}
    >
      {children}
    </CompaniesContext.Provider>
  )
}

export function useCompanies() {
  const context = useContext(CompaniesContext)

  if (!context) {
    throw new Error('useCompanies must be used within a CompaniesProvider')
  }

  return context
} 