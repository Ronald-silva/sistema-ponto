import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEmployees, Role } from '../hooks/useEmployees'
import { Modal } from './Modal'
import { toast } from 'sonner'
import { formatCPF } from '../utils/formatCPF'
import { formatCurrency } from '../utils/formatCurrency'
import { useEffect } from 'react'

const roleOptions = {
  'ALMOXARIFE A': 'Almoxarife A',
  'ANALISTA ADMINISTRATIVO II': 'Analista Administrativo II',
  'Analista Ambiental Junior': 'Analista Ambiental Junior',
  'Analista de Compras Junior A': 'Analista de Compras Junior A',
  'Analista de Controladoria Junior A': 'Analista de Controladoria Junior A',
  'Analista de Orçamento Junior A': 'Analista de Orçamento Junior A',
  'Analista de Planejamento Junior A': 'Analista de Planejamento Junior A',
  'ASSISTENTE ADM V': 'Assistente Adm V',
  'Assistente de Compras': 'Assistente de Compras',
  'Assistente de Controladoria C': 'Assistente de Controladoria C',
  'Assistente de Departamento Pessoal C': 'Assistente de Departamento Pessoal C',
  'Assistente de Obra A': 'Assistente de Obra A',
  'Assistente de TI A': 'Assistente de TI A',
  'Assistente Financeiro': 'Assistente Financeiro',
  'ASSISTENTE TECNICO III': 'Assistente Técnico III',
  'AUX ADMINISTRATIVO I': 'Aux Administrativo I',
  'AUX DE BOMBEIRO HIDRAULICO': 'Aux de Bombeiro Hidráulico',
  'Auxiliar Administrativo B': 'Auxiliar Administrativo B',
  'Auxiliar de Almoxarifado': 'Auxiliar de Almoxarifado',
  'AUXILIAR DE BOMBEIRO': 'Auxiliar de Bombeiro',
  'AUXILIAR DE MUNK': 'Auxiliar de Munk',
  'Auxiliar de Obra A': 'Auxiliar de Obra A',
  'BOMBEIRO HIDRAULICO': 'Bombeiro Hidráulico',
  'Coordenador Administrativo-Financeiro': 'Coordenador Administrativo-Financeiro',
  'ENCARREGADO DE OBRAS': 'Encarregado de Obras',
  'ENCARREGADO DE OBRAS I': 'Encarregado de Obras I',
  'ENGENHEIRO CIVIL': 'Engenheiro Civil',
  'ESTAGIARIO': 'Estagiário',
  'ESTAGIARIO DE ENDOMARKETING': 'Estagiário de Endomarketing',
  'ESTAGIARIO DE PROCESSOS': 'Estagiário de Processos',
  'GERENTE DE OBRAS': 'Gerente de Obras',
  'JOVEM APRENDIZ': 'Jovem Aprendiz',
  'LIDER DE EQUIPE': 'Líder de Equipe',
  'MESTRE DE OBRAS': 'Mestre de Obras',
  'MOTORISTA': 'Motorista',
  'MOTORISTA I': 'Motorista I',
  'MOTORISTA OPERACIONAL DE GUINCHO': 'Motorista Operacional de Guincho',
  'Operador de Máquina de Terraplanagem': 'Operador de Máquina de Terraplanagem',
  'PEDREIRO': 'Pedreiro',
  'RECEPCIONISTA': 'Recepcionista',
  'SERVENTE': 'Servente',
  'SERVICOS GERAIS I': 'Serviços Gerais I',
  'SERVICOS GERAIS II': 'Serviços Gerais II',
  'SUPERVISOR ADM II': 'Supervisor Adm II',
  'Supervisor de Compras': 'Supervisor de Compras',
  'Supervisor de Departamento Pessoal A': 'Supervisor de Departamento Pessoal A',
  'Supervisor de Desenvolvimento Humano': 'Supervisor de Desenvolvimento Humano',
  'Supervisor de Obra': 'Supervisor de Obra',
  'SUPERVISOR DE SEGURANCA DO TRABALHO': 'Supervisor de Segurança do Trabalho',
  'Supervisor Financeiro': 'Supervisor Financeiro',
  'TECNICO DE SEGURANCA DO TRABALHO II': 'Técnico de Segurança do Trabalho II',
  'TOPOGRAFO': 'Topógrafo',
  'VIGIA': 'Vigia'
}

const employeeFormSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  cpf: z.string().min(11, 'CPF inválido').max(14, 'CPF inválido'),
  role: z.custom<Role>((val) => Object.keys(roleOptions).includes(val as string), 'Cargo inválido'),
  salary: z.string(),
  birth_date: z.string().min(1, 'A data de nascimento é obrigatória'),
  admission_date: z.string().min(1, 'A data de admissão é obrigatória'),
  active: z.boolean().default(true)
})

interface EmployeeFormData {
  name: string
  cpf: string
  role: Role
  salary: string
  birth_date: string
  admission_date: string
  active: boolean
}

interface EmployeeFormProps {
  isOpen: boolean
  onClose: () => void
  defaultValues?: {
    id: string
    name: string
    cpf: string
    role: Role
    salary?: number
    birth_date?: string
    admission_date?: string
    active: boolean
  }
}

export function EmployeeForm({ isOpen, onClose, defaultValues }: EmployeeFormProps) {
  const { createEmployee, updateEmployee } = useEmployees()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: defaultValues ? {
      ...defaultValues,
      birth_date: defaultValues.birth_date?.split('T')[0] || '',
      admission_date: defaultValues.admission_date?.split('T')[0] || '',
      salary: formatCurrency(Number(defaultValues.salary || 0)),
      cpf: formatCPF(defaultValues.cpf)
    } : {
      name: '',
      cpf: '',
      role: 'ADMIN' as Role,
      salary: 'R$ 0,00',
      birth_date: '',
      admission_date: '',
      active: true
    }
  })

  // Reseta o formulário quando os defaultValues mudam
  useEffect(() => {
    if (defaultValues) {
      reset({
        ...defaultValues,
        birth_date: defaultValues.birth_date?.split('T')[0] || '',
        admission_date: defaultValues.admission_date?.split('T')[0] || '',
        salary: formatCurrency(Number(defaultValues.salary || 0)),
        cpf: formatCPF(defaultValues.cpf)
      })
    } else {
      reset({
        name: '',
        cpf: '',
        role: 'ADMIN' as Role,
        salary: 'R$ 0,00',
        birth_date: '',
        admission_date: '',
        active: true
      })
    }
  }, [defaultValues, reset])

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
      toast.error('Erro ao salvar funcionário')
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
