import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useProjects } from '../hooks/useProjects'
import { Modal } from './Modal'
import { toast } from 'sonner'

const projectFormSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  location: z.string().min(1, 'O local é obrigatório'),
  start_date: z.string().min(1, 'A data de início é obrigatória'),
  estimated_end_date: z.string().optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'SUSPENDED', 'CANCELLED']).default('ACTIVE'),
  category: z.enum(['CONSTRUCTION', 'RENOVATION', 'MAINTENANCE', 'INFRASTRUCTURE', 'OTHER']).default('CONSTRUCTION'),
  company: z.string().min(1, 'A empresa é obrigatória'),
  active: z.boolean().default(true)
})

type ProjectFormData = z.infer<typeof projectFormSchema>

interface ProjectFormProps {
  isOpen: boolean
  onClose: () => void
  defaultValues?: ProjectFormData & { id: string }
}

export function ProjectForm({ isOpen, onClose, defaultValues }: ProjectFormProps) {
  const { createProject, updateProject } = useProjects()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: defaultValues ? {
      ...defaultValues,
      start_date: defaultValues.start_date.split('T')[0],
      estimated_end_date: defaultValues.estimated_end_date?.split('T')[0]
    } : {
      active: true,
      status: 'ACTIVE',
      category: 'CONSTRUCTION'
    }
  })

  async function handleCreateProject(data: ProjectFormData) {
    try {
      const formattedData = {
        ...data,
        start_date: data.start_date,
        estimated_end_date: data.estimated_end_date || null
      }

      console.log('Enviando dados do formulário:', formattedData)
      
      if (defaultValues?.id) {
        await updateProject.mutateAsync({
          id: defaultValues.id,
          ...formattedData
        })
        toast.success('Obra atualizada com sucesso!')
      } else {
        await createProject.mutateAsync(formattedData)
        toast.success('Obra criada com sucesso!')
      }

      onClose()
    } catch (error) {
      console.error('Erro ao salvar obra:', error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Erro ao salvar obra')
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={defaultValues ? 'Editar Obra' : 'Nova Obra'}
    >
      <form onSubmit={handleSubmit(handleCreateProject)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nome
          </label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            {...register('name')}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            Empresa
          </label>
          <input
            type="text"
            id="company"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            {...register('company')}
          />
          {errors.company && (
            <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Local
          </label>
          <input
            type="text"
            id="location"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            {...register('location')}
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Categoria
            </label>
            <select
              id="category"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              {...register('category')}
            >
              <option value="CONSTRUCTION">Construção</option>
              <option value="RENOVATION">Reforma</option>
              <option value="MAINTENANCE">Manutenção</option>
              <option value="INFRASTRUCTURE">Infraestrutura</option>
              <option value="OTHER">Outro</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              {...register('status')}
            >
              <option value="ACTIVE">Ativa</option>
              <option value="COMPLETED">Concluída</option>
              <option value="SUSPENDED">Suspensa</option>
              <option value="CANCELLED">Cancelada</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
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
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              {...register('start_date')}
            />
            {errors.start_date && (
              <p className="mt-1 text-sm text-red-600">{errors.start_date.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="estimated_end_date" className="block text-sm font-medium text-gray-700">
              Data de Término Prevista
            </label>
            <input
              type="date"
              id="estimated_end_date"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              {...register('estimated_end_date')}
            />
            {errors.estimated_end_date && (
              <p className="mt-1 text-sm text-red-600">{errors.estimated_end_date.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="active"
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            {...register('active')}
          />
          <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
            Obra ativa
          </label>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-lg border border-zinc-300 px-4 font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-9 rounded-lg bg-primary px-4 font-medium text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
