import { useProjects } from '../hooks/useProjects'

interface ProjectDropdownProps {
  companyId?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function ProjectDropdown({ 
  companyId,
  value,
  onChange,
  disabled 
}: ProjectDropdownProps) {
  const { 
    data: projects = [], 
    isLoading, 
    error 
  } = useProjects(companyId)

  if (error) {
    return (
      <select
        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm disabled:bg-gray-100"
        disabled
      >
        <option>Erro ao carregar projetos</option>
      </select>
    )
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled || isLoading}
      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm disabled:bg-gray-100"
    >
      <option value="">
        {isLoading ? 'Carregando...' : 'Selecione um projeto'}
      </option>
      
      {projects.map(project => (
        <option key={project.id} value={project.id}>
          {project.name}
        </option>
      ))}
    </select>
  )
} 