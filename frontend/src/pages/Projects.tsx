import { useState } from 'react'
import { AdminHeader } from '../components/AdminHeader'
import { Modal } from '../components/Modal'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useProjects } from '../hooks/useProjects'
import { toast } from 'sonner'

interface OvertimeRule {
  type: string
  multiplier: number
  description: string
}

interface Project {
  id: string
  name: string
  description?: string
  location: string
  company: string
  status: 'ACTIVE' | 'COMPLETED' | 'SUSPENDED' | 'CANCELLED'
  category: string
  start_date: string
  estimated_end_date: string | null
  overtimeRules: OvertimeRule[]
  active: boolean
}

interface EditingProject extends Omit<Project, 'overtimeRules'> {
  overtimeRules: {
    normal: string
    noturna: string
    domingoFeriado: string
  }
}

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

export function Projects() {
  const { projects, isLoading, createProject, updateProject, deleteProject } = useProjects()
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<EditingProject | null>(null)

  // Só filtra se tiver dados e termo de busca
  const filteredProjects = projects && searchTerm
    ? projects.filter(project =>
        project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : projects

  function handleOpenModal(project?: Project) {
    if (project) {
      try {
        // Garantir que overtimeRules existe e tem os valores necessários
        const overtimeRules = project.overtimeRules || []
        
        const formattedProject: EditingProject = {
          id: project.id,
          name: project.name || '',
          description: project.description || '',
          location: project.location || '',
          company: project.company || '',
          start_date: project.start_date ? project.start_date.split('T')[0] : new Date().toISOString().split('T')[0],
          estimated_end_date: project.estimated_end_date ? project.estimated_end_date.split('T')[0] : '',
          status: project.status || 'ACTIVE',
          category: project.category || 'CONSTRUCTION',
          active: project.active,
          overtimeRules: {
            normal: overtimeRules.find(rule => rule.type === 'WEEKDAY')?.multiplier.toString() || '50',
            noturna: overtimeRules.find(rule => rule.type === 'NIGHT_SHIFT')?.multiplier.toString() || '70',
            domingoFeriado: overtimeRules.find(rule => rule.type === 'SUNDAY_HOLIDAY')?.multiplier.toString() || '100'
          }
        }

        console.log('Projeto formatado para edição:', formattedProject)
        setEditingProject(formattedProject)
        setIsModalOpen(true)
      } catch (error) {
        console.error('Erro ao carregar projeto para edição:', error)
        toast.error('Erro ao carregar projeto para edição')
      }
    } else {
      // Projeto novo
      const newProject: EditingProject = {
        id: '',
        name: '',
        description: '',
        location: '',
        company: '',
        start_date: new Date().toISOString().split('T')[0],
        estimated_end_date: '',
        status: 'ACTIVE',
        category: 'CONSTRUCTION',
        active: true,
        overtimeRules: {
          normal: '50',
          noturna: '70',
          domingoFeriado: '100'
        }
      }
      setEditingProject(newProject)
      setIsModalOpen(true)
    }
  }

  function handleCloseModal() {
    setEditingProject(null)
    setIsModalOpen(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!editingProject) return

    try {
      // Converte as regras de hora extra para o formato esperado pelo backend
      const projectData = {
        ...editingProject,
        overtimeRules: [
          {
            type: 'WEEKDAY',
            multiplier: Number(editingProject.overtimeRules.normal),
            description: 'Hora Extra Normal (Dias Úteis)'
          },
          {
            type: 'NIGHT_SHIFT',
            multiplier: Number(editingProject.overtimeRules.noturna),
            description: 'Hora Extra Noturna'
          },
          {
            type: 'SUNDAY_HOLIDAY',
            multiplier: Number(editingProject.overtimeRules.domingoFeriado),
            description: 'Hora Extra Domingo/Feriado'
          }
        ]
      }

      if (editingProject.id) {
        await updateProject.mutateAsync(projectData as any)
        toast.success('Obra atualizada com sucesso')
      } else {
        await createProject.mutateAsync(projectData as any)
        toast.success('Obra criada com sucesso')
      }
      handleCloseModal()
    } catch (error) {
      console.error('Erro ao salvar projeto:', error)
      toast.error('Erro ao salvar projeto')
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Tem certeza que deseja excluir esta obra?')) {
      try {
        console.log('Tentando excluir projeto:', id)
        await deleteProject.mutateAsync(id)
        console.log('Projeto excluído com sucesso')
      } catch (error) {
        console.error('Erro ao excluir obra:', error)
        toast.error('Erro ao excluir obra')
      }
    }
  }

  function formatDate(date: string | null) {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('pt-BR')
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <AdminHeader />

      <main className="mx-auto w-full max-w-[1200px] p-4 pb-8 lg:p-6">
        <div className="relative">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Cadastro de Obras</h1>

            <button
              onClick={() => handleOpenModal()}
              className="btn btn-primary w-full sm:w-auto"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Nova Obra</span>
            </button>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Buscar por nome ou descrição..."
              className="input w-full"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200">
                <thead className="bg-zinc-50">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-zinc-600">Nome</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-zinc-600">Categoria</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-zinc-600">Status</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-zinc-600">Início</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-zinc-600">Previsão</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-zinc-600">Empresa</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-zinc-600">Localização</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-zinc-600">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-3 text-center text-gray-500">
                        Carregando...
                      </td>
                    </tr>
                  ) : !filteredProjects?.length ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-3 text-center text-gray-500">
                        Nenhuma obra encontrada
                      </td>
                    </tr>
                  ) : (
                    filteredProjects?.map((project) => (
                      <tr key={project.id}>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-900">{project.name}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-900">
                          {categoryOptions.find(c => c.value === project.category)?.label}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            project.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-700'
                              : project.status === 'COMPLETED'
                              ? 'bg-blue-100 text-blue-700'
                              : project.status === 'SUSPENDED'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {statusOptions.find(s => s.value === project.status)?.label}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-900">
                          {formatDate(project.start_date)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-900">
                          {formatDate(project.estimated_end_date)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-900">{project.company}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-900">{project.location}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenModal(project)}
                              className="rounded p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-500"
                              title="Editar obra"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(project.id)}
                              className="rounded p-1 text-gray-400 hover:bg-gray-50 hover:text-red-500"
                              title="Excluir obra"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal de Edição */}
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title={editingProject?.id ? 'Editar Obra' : 'Nova Obra'}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nome da Obra
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="input mt-1 w-full"
                    value={editingProject?.name ?? ''}
                    onChange={e => setEditingProject(prev => prev ? { ...prev, name: e.target.value } : null)}
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                    Empresa
                  </label>
                  <select
                    id="company"
                    required
                    className="input mt-1 w-full"
                    value={editingProject?.company ?? ''}
                    onChange={e => setEditingProject(prev => prev ? { ...prev, company: e.target.value } : null)}
                  >
                    <option value="">Selecione uma empresa</option>
                    {companyOptions.map(company => (
                      <option key={company.value} value={company.value}>
                        {company.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Localização
                  </label>
                  <input
                    type="text"
                    id="location"
                    required
                    className="input mt-1 w-full"
                    value={editingProject?.location ?? ''}
                    onChange={e => setEditingProject(prev => prev ? { ...prev, location: e.target.value } : null)}
                  />
                </div>
              </div>

              {/* Status e Datas */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      id="status"
                      required
                      className="input mt-1 w-full"
                      value={editingProject?.status ?? ''}
                      onChange={e => setEditingProject(prev => prev ? { ...prev, status: e.target.value as Project['status'] } : null)}
                    >
                      <option value="">Selecione um status</option>
                      {statusOptions.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Categoria
                    </label>
                    <select
                      id="category"
                      required
                      className="input mt-1 w-full"
                      value={editingProject?.category ?? ''}
                      onChange={e => setEditingProject(prev => prev ? { ...prev, category: e.target.value } : null)}
                    >
                      <option value="">Selecione uma categoria</option>
                      {categoryOptions.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                      Data de Início
                    </label>
                    <input
                      type="date"
                      id="start_date"
                      required
                      className="input mt-1 w-full"
                      value={editingProject?.start_date ?? ''}
                      onChange={e => setEditingProject(prev => prev ? { ...prev, start_date: e.target.value } : null)}
                    />
                  </div>

                  <div>
                    <label htmlFor="estimated_end_date" className="block text-sm font-medium text-gray-700">
                      Previsão de Término
                    </label>
                    <input
                      type="date"
                      id="estimated_end_date"
                      className="input mt-1 w-full"
                      value={editingProject?.estimated_end_date ?? ''}
                      onChange={e => setEditingProject(prev => prev ? { ...prev, estimated_end_date: e.target.value } : null)}
                    />
                  </div>
                </div>
              </div>

              {/* Regras de Hora Extra */}
              <div className="border-t border-[--border] pt-6">
                <h3 className="mb-2 text-lg font-medium text-gray-700">Regras de Hora Extra</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Hora Extra Normal (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Ex: 50"
                      className="input w-full"
                      value={editingProject?.overtimeRules?.normal ?? ''}
                      onChange={e =>
                        setEditingProject(prev =>
                          prev ? { 
                            ...prev, 
                            overtimeRules: { 
                              ...prev.overtimeRules, 
                              normal: e.target.value 
                            } 
                          } : null
                        )
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Hora Extra Noturna (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Ex: 70"
                      className="input w-full"
                      value={editingProject?.overtimeRules?.noturna ?? ''}
                      onChange={e =>
                        setEditingProject(prev =>
                          prev ? { 
                            ...prev, 
                            overtimeRules: { 
                              ...prev.overtimeRules, 
                              noturna: e.target.value 
                            } 
                          } : null
                        )
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                      Hora Extra Domingo/Feriado (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Ex: 100"
                      className="input w-full"
                      value={editingProject?.overtimeRules?.domingoFeriado ?? ''}
                      onChange={e =>
                        setEditingProject(prev =>
                          prev ? { 
                            ...prev, 
                            overtimeRules: { 
                              ...prev.overtimeRules, 
                              domingoFeriado: e.target.value 
                            } 
                          } : null
                        )
                      }
                      required
                    />
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  * Os valores representam a porcentagem adicional sobre o valor da hora normal
                </p>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-secondary h-9"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary h-9"
                >
                  Salvar
                </button>
              </div>
            </form>
          </Modal>
        </div>
      </main>
    </div>
  )
}
