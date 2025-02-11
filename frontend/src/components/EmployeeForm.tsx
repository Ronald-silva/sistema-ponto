import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEmployees } from '../hooks/useEmployees'
import { Modal } from './Modal'
import { toast } from 'sonner'
import { formatCPF } from '../utils/formatCPF'
import { formatCurrency } from '../utils/formatCurrency'

const employeeFormSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  cpf: z.string().min(11, 'CPF inválido').max(14, 'CPF inválido'),
  role: z.enum([
    '',
    'PEDREIRO',
    'SERVENTE',
    'MESTRE_DE_OBRAS',
    'CARPINTEIRO',
    'ARMADOR',
    'ELETRICISTA',
    'ENCANADOR',
    'PINTOR',
    'AZULEJISTA',
    'ENGENHEIRO',
    'ARQUITETO',
    'ALMOXARIFE',
    'ADMINISTRATIVO',
    'ADMIN'
  ]),
  salary: z.string(),
  birth_date: z.string().min(1, 'A data de nascimento é obrigatória'),
  admission_date: z.string().min(1, 'A data de admissão é obrigatória'),
  active: z.boolean().default(true)
})

type EmployeeFormData = z.infer<typeof employeeFormSchema>

interface EmployeeFormProps {
  isOpen: boolean
  onClose: () => void
  defaultValues?: EmployeeFormData & { id: string }
}

export function EmployeeForm({ isOpen, onClose, defaultValues }: EmployeeFormProps) {
  const { createEmployee, updateEmployee } = useEmployees()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: defaultValues ? {
      ...defaultValues,
      birth_date: defaultValues.birth_date.split('T')[0],
      admission_date: defaultValues.admission_date.split('T')[0],
      salary: formatCurrency(Number(defaultValues.salary))
    } : {
      active: true,
      role: '',
      salary: 'R$ 0,00'
    }
  })

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCPF = formatCPF(e.target.value)
    setValue('cpf', formattedCPF)
  }

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const numericValue = value.replace(/\D/g, '')
    const floatValue = parseInt(numericValue) / 100
    const formattedValue = formatCurrency(floatValue)
    setValue('salary', formattedValue)
  }

  const watchSalary = watch('salary')

  async function handleCreateEmployee(data: EmployeeFormData) {
    try {
      const numericSalary = Number(data.salary.replace(/\D/g, '')) / 100

      const formattedData = {
        ...data,
        cpf: data.cpf.replace(/\D/g, ''),
        salary: numericSalary,
      }

      if (defaultValues?.id) {
        await updateEmployee.mutateAsync({
          id: defaultValues.id,
          ...formattedData
        })
        toast.success('Funcionário atualizado com sucesso!')
      } else {
        await createEmployee.mutateAsync(formattedData)
        toast.success('Funcionário cadastrado com sucesso!')
      }

      onClose()
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Erro ao salvar funcionário')
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={defaultValues ? 'Editar Funcionário' : 'Novo Funcionário'}
    >
      <form onSubmit={handleSubmit(handleCreateEmployee)} className="space-y-4">
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
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
            CPF
          </label>
          <input
            type="text"
            id="cpf"
            maxLength={14}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            {...register('cpf')}
            onChange={handleCPFChange}
          />
          {errors.cpf && (
            <p className="mt-1 text-sm text-red-600">{errors.cpf.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Cargo
          </label>
          <select
            id="role"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            {...register('role')}
          >
            <option value="">Selecione um cargo</option>
            <option value="PEDREIRO">Pedreiro</option>
            <option value="SERVENTE">Servente</option>
            <option value="MESTRE_DE_OBRAS">Mestre de Obras</option>
            <option value="CARPINTEIRO">Carpinteiro</option>
            <option value="ARMADOR">Armador</option>
            <option value="ELETRICISTA">Eletricista</option>
            <option value="ENCANADOR">Encanador</option>
            <option value="PINTOR">Pintor</option>
            <option value="AZULEJISTA">Azulejista</option>
            <option value="ENGENHEIRO">Engenheiro</option>
            <option value="ARQUITETO">Arquiteto</option>
            <option value="ALMOXARIFE">Almoxarife</option>
            <option value="ADMINISTRATIVO">Administrativo</option>
            <option value="ADMIN">Administrador</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
            Salário
          </label>
          <input
            type="text"
            id="salary"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            value={watchSalary}
            onChange={handleSalaryChange}
          />
          {errors.salary && (
            <p className="mt-1 text-sm text-red-600">{errors.salary.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">
              Data de Nascimento
            </label>
            <input
              type="date"
              id="birth_date"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              {...register('birth_date')}
            />
            {errors.birth_date && (
              <p className="mt-1 text-sm text-red-600">{errors.birth_date.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="admission_date" className="block text-sm font-medium text-gray-700">
              Data de Admissão
            </label>
            <input
              type="date"
              id="admission_date"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              {...register('admission_date')}
            />
            {errors.admission_date && (
              <p className="mt-1 text-sm text-red-600">{errors.admission_date.message}</p>
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
            Funcionário ativo
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
