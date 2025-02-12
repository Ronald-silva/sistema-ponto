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
    'ENGENHEIRO_CIVIL',
    'ESTAGIARIO',
    'ESTAGIARIO_DE_ENDOMARKETING',
    'ESTAGIARIO_DE_PROCESSOS',
    'GERENTE_DE_OBRAS',
    'JOVEM_APRENDIZ',
    'LIDER_DE_EQUIPE',
    'MESTRE_DE_OBRAS',
    'MOTORISTA',
    'MOTORISTA_I',
    'MOTORISTA_OPERACIONAL_DE_GUINCHO',
    'OPERADOR_DE_MAQUINA_DE_TERRAPLANAGEM',
    'PEDREIRO',
    'RECEPCIONISTA',
    'SERVENTE',
    'SERVICOS_GERAIS_I',
    'SERVICOS_GERAIS_II',
    'SUPERVISOR_ADM_II',
    'SUPERVISOR_DE_COMPRAS',
    'SUPERVISOR_DE_DEPARTAMENTO_PESSOAL_A',
    'SUPERVISOR_DE_DESENVOLVIMENTO_HUMANO',
    'SUPERVISOR_DE_OBRA',
    'SUPERVISOR_DE_SEGURANCA_DO_TRABALHO',
    'SUPERVISOR_FINANCEIRO',
    'TECNICO_EM_SEGURANCA_DO_TRABALHO_II',
    'TOPOGRAFO',
    'VIGIA'
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
      console.error(error)
      toast.error('Erro ao cadastrar funcionário')
    }
  }

  const roleOptions = {
    'ENGENHEIRO_CIVIL': 'Engenheiro Civil',
    'ESTAGIARIO': 'Estagiário',
    'ESTAGIARIO_DE_ENDOMARKETING': 'Estagiário de Endomarketing',
    'ESTAGIARIO_DE_PROCESSOS': 'Estagiário de Processos',
    'GERENTE_DE_OBRAS': 'Gerente de Obras',
    'JOVEM_APRENDIZ': 'Jovem Aprendiz',
    'LIDER_DE_EQUIPE': 'Líder de Equipe',
    'MESTRE_DE_OBRAS': 'Mestre de Obras',
    'MOTORISTA': 'Motorista',
    'MOTORISTA_I': 'Motorista I',
    'MOTORISTA_OPERACIONAL_DE_GUINCHO': 'Motorista Operacional de Guincho',
    'OPERADOR_DE_MAQUINA_DE_TERRAPLANAGEM': 'Operador de Máquina de Terraplenagem',
    'PEDREIRO': 'Pedreiro',
    'RECEPCIONISTA': 'Recepcionista',
    'SERVENTE': 'Servente',
    'SERVICOS_GERAIS_I': 'Serviços Gerais I',
    'SERVICOS_GERAIS_II': 'Serviços Gerais II',
    'SUPERVISOR_ADM_II': 'Supervisor ADM II',
    'SUPERVISOR_DE_COMPRAS': 'Supervisor de Compras',
    'SUPERVISOR_DE_DEPARTAMENTO_PESSOAL_A': 'Supervisor de Departamento Pessoal A',
    'SUPERVISOR_DE_DESENVOLVIMENTO_HUMANO': 'Supervisor de Desenvolvimento Humano',
    'SUPERVISOR_DE_OBRA': 'Supervisor de Obra',
    'SUPERVISOR_DE_SEGURANCA_DO_TRABALHO': 'Supervisor de Segurança do Trabalho',
    'SUPERVISOR_FINANCEIRO': 'Supervisor Financeiro',
    'TECNICO_EM_SEGURANCA_DO_TRABALHO_II': 'Técnico em Segurança do Trabalho II',
    'TOPOGRAFO': 'Topógrafo',
    'VIGIA': 'Vigia'
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={defaultValues ? 'Editar Funcionário' : 'Novo Funcionário'}
    >
      <form onSubmit={handleSubmit(handleCreateEmployee)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-700">
            Nome
          </label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm"
            {...register('name')}
          />
          {errors.name && (
            <span className="text-sm text-red-500">{errors.name.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-zinc-700">
            CPF
          </label>
          <input
            type="text"
            id="cpf"
            maxLength={14}
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm"
            {...register('cpf')}
            onChange={handleCPFChange}
          />
          {errors.cpf && (
            <span className="text-sm text-red-500">{errors.cpf.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-zinc-700">
            Cargo
          </label>
          <select
            id="role"
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm"
            {...register('role')}
          >
            <option value="">Selecione um cargo</option>
            {Object.entries(roleOptions).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.role && (
            <span className="text-sm text-red-500">{errors.role.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="salary" className="block text-sm font-medium text-zinc-700">
            Salário
          </label>
          <input
            type="text"
            id="salary"
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm"
            value={watchSalary}
            onChange={handleSalaryChange}
          />
          {errors.salary && (
            <span className="text-sm text-red-500">{errors.salary.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="birth_date" className="block text-sm font-medium text-zinc-700">
            Data de Nascimento
          </label>
          <input
            type="date"
            id="birth_date"
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm"
            {...register('birth_date')}
          />
          {errors.birth_date && (
            <span className="text-sm text-red-500">{errors.birth_date.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="admission_date" className="block text-sm font-medium text-zinc-700">
            Data de Admissão
          </label>
          <input
            type="date"
            id="admission_date"
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm"
            {...register('admission_date')}
          />
          {errors.admission_date && (
            <span className="text-sm text-red-500">{errors.admission_date.message}</span>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="active"
            className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
            {...register('active')}
          />
          <label htmlFor="active" className="ml-2 block text-sm text-zinc-900">
            Ativo
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Salvando...' : defaultValues ? 'Salvar' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
