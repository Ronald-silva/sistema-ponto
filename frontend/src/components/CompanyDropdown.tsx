import { Dispatch, SetStateAction } from 'react'
import { api } from '../lib/api'
import { useQuery } from '@tanstack/react-query'

interface Company {
  id: string
  name: string
}

interface CompanyDropdownProps {
  selectedCompany: string | null
  onSelect: Dispatch<SetStateAction<string | null>>
  disabled?: boolean
}

export function CompanyDropdown({
  selectedCompany,
  onSelect,
  disabled = false
}: CompanyDropdownProps) {
  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ['companies'],
    queryFn: async () => {
      const response = await api.get('/companies')
      return response.data
    }
  })

  return (
    <div className="relative">
      <select
        value={selectedCompany || ''}
        onChange={e => onSelect(e.target.value || null)}
        disabled={disabled || isLoading}
        className="h-10 w-full appearance-none rounded-lg border border-[--border] bg-white px-3 py-2 text-sm text-[--text] shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-25 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">
          {isLoading ? 'Carregando empresas...' : 'Selecione uma empresa'}
        </option>
        {companies.map(company => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
} 