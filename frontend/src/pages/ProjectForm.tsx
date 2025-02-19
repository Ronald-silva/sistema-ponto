import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { OvertimeRulesForm } from '../components/OvertimeRulesForm'
import { AdminHeader } from '../components/AdminHeader'
import { api } from '../lib/api'

// Tipos para as regras de hora extra
interface OvertimeRule {
  type: string        // Tipo da regra (WEEKDAY, NIGHT_SHIFT, etc.)
  multiplier: number  // Valor em porcentagem (50 para 50%)
  description: string // Descrição legível da regra
}

// Interface principal do projeto
interface Project {
  id?: string
  name: string
  description?: string
  location: string
  company: string
  status: 'ACTIVE' | 'COMPLETED' | 'SUSPENDED' | 'CANCELLED'
  category: 'CONSTRUCTION' | 'RENOVATION' | 'MAINTENANCE' | 'INFRASTRUCTURE' | 'OTHER'
  start_date: string
  estimated_end_date?: string
  overtimeRules: OvertimeRule[] // Array de regras de hora extra
  active: boolean
}

// Opções para os selects
const statusOptions = [
  { value: 'ACTIVE', label: 'Em Andamento' },
  { value: 'COMPLETED', label: 'Concluída' },
  { value: 'SUSPENDED', label: 'Suspensa' },
  { value: 'CANCELLED', label: 'Cancelada' }
]

const categoryOptions = [
  { value: 'CONSTRUCTION', label: 'Construção Civil' },
  { value: 'RENOVATION', label: 'Reforma' },
  { value: 'MAINTENANCE', label: 'Manutenção' },
  { value: 'INFRASTRUCTURE', label: 'Infraestrutura' },
  { value: 'OTHER', label: 'Outro' }
]

const companyOptions = [
  { value: 'CDG Engenharia', label: 'CDG Engenharia' },
  { value: 'Urban Engenharia', label: 'Urban Engenharia' },
  { value: 'Consórcio Aquiraz PDD', label: 'Consórcio Aquiraz PDD' },
  { value: 'Consórcio BCL', label: 'Consórcio BCL' },
  { value: 'Consórcio BME', label: 'Consórcio BME' },
  { value: 'Consórcio BBJ', label: 'Consórcio BBJ' }
]

export function ProjectForm() {
  // Estado inicial do projeto com regras de hora extra vazias
  const [isLoading, setIsLoading] = useState(false)
  const [project, setProject] = useState<Project>({
    name: '',
    description: '',
    location: '',
    company: '',
    status: 'ACTIVE',
    category: 'CONSTRUCTION',
    start_date: new Date().toISOString().split('T')[0],
    estimated_end_date: '',
    overtimeRules: [], // Inicializado como array vazio
    active: true
  })

  const navigate = useNavigate()
  const { id } = useParams()

  // Carregar projeto existente se estiver editando
  useEffect(() => {
    if (id) {
      loadProject(id)
    }
  }, [id])

  // Função para carregar um projeto existente
  async function loadProject(projectId: string) {
    try {
      setIsLoading(true)
      const response = await api.get(`/projects/${projectId}`)
      
      // Garantir que as regras de hora extra estejam no formato correto
      // Converte os multiplicadores para número e mantém a estrutura esperada
      const formattedRules = response.data.overtimeRules?.map((rule: OvertimeRule) => ({
        type: rule.type,
        multiplier: Number(rule.multiplier),
        description: rule.description
      })) || []

      setProject({
        ...response.data,
        start_date: response.data.start_date?.split('T')[0] || new Date().toISOString().split('T')[0],
        estimated_end_date: response.data.estimated_end_date?.split('T')[0] || '',
        overtimeRules: formattedRules
      })
    } catch (error) {
      console.error('Erro ao carregar projeto:', error)
      toast.error('Erro ao carregar projeto')
    } finally {
      setIsLoading(false)
    }
  }

  // Função para lidar com o envio do formulário
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    
    try {
      setIsLoading(true)

      // Validações dos campos obrigatórios
      if (!project.name.trim()) {
        toast.error('Nome da obra é obrigatório')
        return
      }

      if (!project.location.trim()) {
        toast.error('Localização é obrigatória')
        return
      }

      if (!project.company) {
        toast.error('Empresa é obrigatória')
        return
      }

      // Validação específica para regras de hora extra
      if (project.overtimeRules.length === 0) {
        toast.error('É necessário definir pelo menos uma regra de hora extra')
        return
      }

      // Prepara os dados para envio, garantindo que os multiplicadores sejam números
      const projectData = {
        ...project,
        overtimeRules: project.overtimeRules.map(rule => ({
          ...rule,
          multiplier: Number(rule.multiplier)
        }))
      }

      // Envia os dados para a API
      if (id) {
        await api.put(`/projects/${id}`, projectData)
        toast.success('Obra atualizada com sucesso')
      } else {
        await api.post('/projects', projectData)
        toast.success('Obra cadastrada com sucesso')
      }

      navigate('/projects')
    } catch (error: any) {
      console.error('Erro ao salvar projeto:', error)
      toast.error(error.response?.data?.error || 'Erro ao salvar projeto')
    } finally {
      setIsLoading(false)
    }
  }

  // Função chamada quando as regras de hora extra são alteradas
  function handleOvertimeRulesChange(rules: OvertimeRule[]) {
    setProject(prev => ({
      ...prev,
      overtimeRules: rules
    }))
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <AdminHeader />
      
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[--text]">
            {id ? 'Editar Obra' : 'Nova Obra'}
          </h1>
          <p className="text-[--text-secondary]">
            {id ? 'Atualize as informações da obra' : 'Preencha as informações da nova obra'}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seção: Informações Básicas */}
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[--text-secondary]">
                    Nome da Obra
                  </label>
                  <Input
                    value={project.name}
                    onChange={e => setProject(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Digite o nome da obra"
                    className="h-11 bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[--text-secondary]">
                    Empresa
                  </label>
                  <select
                    value={project.company}
                    onChange={e => setProject(prev => ({ ...prev, company: e.target.value }))}
                    className="h-11 w-full rounded-lg border border-[--border] bg-white px-3 text-base text-[--text] shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-25"
                    required
                  >
                    <option value="">Selecione uma empresa</option>
                    {companyOptions.map(company => (
                      <option key={company.value} value={company.value}>
                        {company.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[--text-secondary]">
                  Localização
                </label>
                <Input
                  value={project.location}
                  onChange={e => setProject(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Digite a localização da obra"
                  className="h-11 bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[--text-secondary]">
                  Descrição
                </label>
                <textarea
                  value={project.description}
                  onChange={e => setProject(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Digite uma descrição para a obra"
                  className="w-full rounded-lg border border-[--border] bg-white px-3 py-2 text-base text-[--text] shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-25"
                  rows={4}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[--text-secondary]">
                    Status
                  </label>
                  <select
                    value={project.status}
                    onChange={e => setProject(prev => ({ ...prev, status: e.target.value as Project['status'] }))}
                    className="h-11 w-full rounded-lg border border-[--border] bg-white px-3 text-base text-[--text] shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-25"
                    required
                  >
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[--text-secondary]">
                    Categoria
                  </label>
                  <select
                    value={project.category}
                    onChange={e => setProject(prev => ({ ...prev, category: e.target.value as Project['category'] }))}
                    className="h-11 w-full rounded-lg border border-[--border] bg-white px-3 text-base text-[--text] shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-25"
                    required
                  >
                    {categoryOptions.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[--text-secondary]">
                    Data de Início
                  </label>
                  <Input
                    type="date"
                    value={project.start_date}
                    onChange={e => setProject(prev => ({ ...prev, start_date: e.target.value }))}
                    className="h-11 bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[--text-secondary]">
                    Previsão de Término
                  </label>
                  <Input
                    type="date"
                    value={project.estimated_end_date}
                    onChange={e => setProject(prev => ({ ...prev, estimated_end_date: e.target.value }))}
                    className="h-11 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={project.active}
                    onChange={e => setProject(prev => ({ ...prev, active: e.target.checked }))}
                    className="h-4 w-4 rounded border-[--border] text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-[--text-secondary]">
                    Obra Ativa
                  </span>
                </label>
              </div>
            </div>

            {/* Seção: Regras de Hora Extra */}
            <div className="border-t border-[--border] pt-6">
              <OvertimeRulesForm
                initialRules={project.overtimeRules}
                onChange={handleOvertimeRulesChange}
              />
            </div>

            {/* Botões de Ação */}
            <div className="flex items-center justify-end space-x-4 border-t border-gray-200 pt-6">
              <Button
                type="button"
                onClick={() => navigate('/projects')}
                className="h-11 bg-gray-500 hover:bg-gray-600 focus:ring-gray-500"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="h-11 bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
                disabled={isLoading}
              >
                {isLoading ? 'Salvando...' : id ? 'Atualizar Obra' : 'Criar Obra'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 