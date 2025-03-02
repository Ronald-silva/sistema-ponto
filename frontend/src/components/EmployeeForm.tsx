import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEmployees } from '../hooks/useEmployees'
import { Modal } from './Modal'
import { toast } from 'sonner'
import { formatCPF } from '../utils/formatCPF'
import { formatCurrency } from '../utils/formatCurrency'
import { useEffect } from 'react'

const roleOptions = {
  'ALMOXARIFE_A': 'ALMOXARIFE A',
  'ANALISTA_ADMINISTRATIVO_II': 'ANALISTA ADMINISTRATIVO II',
  'ANALISTA_AMBIENTAL_JUNIOR': 'Analista Ambiental Junior',
  'ANALISTA_COMPRAS_JUNIOR_A': 'Analista de Compras Junior A',
  'ANALISTA_CONTROLADORIA_JUNIOR_A': 'Analista de Controladoria Junior A',
  'ANALISTA_ORCAMENTO_JUNIOR_A': 'Analista de Orçamento Junior A',
  'ANALISTA_PLANEJAMENTO_JUNIOR_A': 'Analista de Planejamento Junior A',
  'ASSISTENTE_ADM_V': 'ASSISTENTE ADM V',
  'ASSISTENTE_COMPRAS': 'Assistente de Compras',
  'ASSISTENTE_CONTROLADORIA_C': 'Assistente de Controladoria C',
  'ASSISTENTE_DP_C': 'Assistente de Departamento Pessoal C',
  'ASSISTENTE_OBRA_A': 'Assistente de Obra A',
  'ASSISTENTE_TI_A': 'Assistente de TI A',
  'ASSISTENTE_FINANCEIRO': 'Assistente Financeiro',
  'ASSISTENTE_TECNICO_III': 'ASSISTENTE TECNICO III',
  'AUX_ADMINISTRATIVO_I': 'AUX ADMINISTRATIVO I',
  'AUX_BOMBEIRO_HIDRAULICO': 'AUX DE BOMBEIRO HIDRAULICO',
  'AUXILIAR_ADMINISTRATIVO_B': 'Auxiliar Administrativo B',
  'AUXILIAR_ALMOXARIFADO': 'Auxiliar de Almoxarifado',
  'AUXILIAR_BOMBEIRO': 'AUXILIAR DE BOMBEIRO',
  'AUXILIAR_MUNK': 'AUXILIAR DE MUNK',
  'AUXILIAR_OBRA_A': 'Auxiliar de Obra A',
  'BOMBEIRO_HIDRAULICO': 'BOMBEIRO HIDRAULICO',
  'COORDENADOR_ADM_FINANCEIRO': 'Coordenador Administrativo-Financeiro',
  'ENCARREGADO_OBRAS': 'ENCARREGADO DE OBRAS',
  'ENCARREGADO_OBRAS_I': 'ENCARREGADO DE OBRAS I',
  'ENGENHEIRO_CIVIL': 'ENGENHEIRO CIVIL',
  'ESTAGIARIO': 'ESTAGIARIO',
  'ESTAGIARIO_ENDOMARKETING': 'ESTAGIARIO DE ENDOMARKETING',
  'ESTAGIARIO_PROCESSOS': 'ESTAGIARIO DE PROCESSOS',
  'GERENTE_OBRAS': 'GERENTE DE OBRAS',
  'JOVEM_APRENDIZ': 'JOVEM APRENDIZ',
  'LIDER_EQUIPE': 'LIDER DE EQUIPE',
  'MESTRE_OBRAS': 'MESTRE DE OBRAS',
  'MOTORISTA': 'MOTORISTA',
  'MOTORISTA_I': 'MOTORISTA I',
  'MOTORISTA_GUINCHO': 'MOTORISTA OPERACIONAL DE GUINCHO',
  'OPERADOR_MAQUINA_TERRAPLANAGEM': 'Operador de Máquina de Terraplanagem',
  'PEDREIRO': 'PEDREIRO',
  'RECEPCIONISTA': 'RECEPCIONISTA',
  'SERVENTE': 'SERVENTE',
  'SERVICOS_GERAIS_I': 'SERVICOS GERAIS I',
  'SERVICOS_GERAIS_II': 'SERVICOS GERAIS II',
  'SUPERVISOR_ADM_II': 'SUPERVISOR ADM II',
  'SUPERVISOR_COMPRAS': 'Supervisor de Compras',
  'SUPERVISOR_DP_A': 'Supervisor de Departamento Pessoal A',
  'SUPERVISOR_DH': 'Supervisor de Desenvolvimento Humano',
  'SUPERVISOR_OBRA': 'Supervisor de Obra',
  'SUPERVISOR_SEGURANCA_TRABALHO': 'SUPERVISOR DE SEGURANCA DO TRABALHO',
  'SUPERVISOR_FINANCEIRO': 'Supervisor Financeiro',
  'TECNICO_SEGURANCA_TRABALHO_II': 'TECNICO DE SEGURANCA DO TRABALHO II',
  'TOPOGRAFO': 'TOPOGRAFO',
  'VIGIA': 'VIGIA'
}

const employeeFormSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  cpf: z.string()
    .min(11, 'CPF inválido')
    .max(14, 'CPF inválido')
    .transform(val => val.replace(/\D/g, ''))
    .refine(val => val.length === 11, 'CPF deve ter 11 dígitos'),
  role: z.string()
    .min(1, 'O cargo é obrigatório'),
  salary: z.string()
    .min(1, 'O salário é obrigatório')
    .transform(val => val.replace(/\D/g, '')),
  birth_date: z.string()
    .min(1, 'A data de nascimento é obrigatória')
    .refine(val => {
      const date = new Date(val)
      return !isNaN(date.getTime())
    }, 'Data de nascimento inválida'),
  admission_date: z.string()
    .min(1, 'A data de admissão é obrigatória')
    .refine(val => {
      const date = new Date(val)
      return !isNaN(date.getTime())
    }, 'Data de admissão inválida'),
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
    watch,
    reset
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: defaultValues ? {
      ...defaultValues,
      birth_date: defaultValues.birth_date ? defaultValues.birth_date.split('T')[0] : new Date().toISOString().split('T')[0],
      admission_date: defaultValues.admission_date ? defaultValues.admission_date.split('T')[0] : new Date().toISOString().split('T')[0],
      salary: defaultValues.salary ? formatCurrency(Number(defaultValues.salary)) : 'R$ 0,00'
    } : {
      name: '',
      cpf: '',
      role: '',
      salary: 'R$ 0,00',
      birth_date: new Date().toISOString().split('T')[0],
      admission_date: new Date().toISOString().split('T')[0],
      active: true
    }
  })

  // Resetar o formulário quando os defaultValues mudarem ou quando o modal fechar
  useEffect(() => {
    if (defaultValues) {
      reset({
        ...defaultValues,
        birth_date: defaultValues.birth_date ? defaultValues.birth_date.split('T')[0] : new Date().toISOString().split('T')[0],
        admission_date: defaultValues.admission_date ? defaultValues.admission_date.split('T')[0] : new Date().toISOString().split('T')[0],
        salary: defaultValues.salary ? formatCurrency(Number(defaultValues.salary)) : 'R$ 0,00'
      })
    } else {
      reset({
        name: '',
        cpf: '',
        role: '',
        salary: 'R$ 0,00',
        birth_date: new Date().toISOString().split('T')[0],
        admission_date: new Date().toISOString().split('T')[0],
        active: true
      })
    }
  }, [defaultValues, reset, isOpen])

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
      // Formata os dados antes de enviar
      const formattedData = {
        ...data,
        cpf: data.cpf.replace(/\D/g, ''), // Remove caracteres não numéricos do CPF
        salary: Number(data.salary.replace(/[^\d,]/g, '').replace(',', '.')), // Converte salário para número
        birth_date: new Date(data.birth_date).toISOString().split('T')[0], // Formata data de nascimento
        admission_date: new Date(data.admission_date).toISOString().split('T')[0], // Formata data de admissão
        active: data.active ?? true // Garante que active tenha um valor padrão
      }

      if (defaultValues?.id) {
        // Atualização de funcionário existente
        await updateEmployee.mutateAsync({
          id: defaultValues.id,
          ...formattedData
        })
        toast.success('Funcionário atualizado com sucesso!')
      } else {
        // Criação de novo funcionário
        await createEmployee.mutateAsync(formattedData)
        toast.success('Funcionário cadastrado com sucesso!')
      }

      // Fecha o modal apenas se a operação foi bem sucedida
      onClose()
      
    } catch (error: any) {
      console.error('Erro ao salvar funcionário:', error)
      
      // Tratamento específico para erro de CPF duplicado
      if (error?.message?.includes('CPF')) {
        toast.error('Já existe um funcionário cadastrado com este CPF')
      } else {
        toast.error('Erro ao salvar funcionário. Por favor, tente novamente.')
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

