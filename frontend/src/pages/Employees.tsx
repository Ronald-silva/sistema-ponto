import { useState } from 'react'
import { useEmployees } from '../hooks/useEmployees'
import { EmployeeForm } from '../components/EmployeeForm'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { AdminHeader } from '../components/AdminHeader'
import { formatCPF } from '../utils/formatCPF'
import { formatCurrency } from '../utils/formatCurrency'

interface Employee {
  id: string
  name: string
  cpf: string
  role: string
  active: boolean
  salary?: number
  birth_date?: string
  admission_date?: string
}

export function Employees() {
  const { employees, isLoading, deleteEmployee } = useEmployees()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  function handleOpenForm(employee?: Employee) {
    if (employee) {
      setSelectedEmployee(employee)
    } else {
      setSelectedEmployee(null)
    }
    setIsFormOpen(true)
  }

  function handleCloseForm() {
    setSelectedEmployee(null)
    setIsFormOpen(false)
  }

  async function handleDeleteEmployee(id: string) {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
      try {
        await deleteEmployee.mutateAsync(id)
      } catch (error) {
        console.error('Erro ao excluir funcionário:', error)
      }
    }
  }

  const filteredEmployees = employees?.filter(employee =>
    employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.cpf?.includes(searchTerm) ||
    employee.role?.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? []

  return (
    <div className="min-h-screen bg-zinc-50">
      <AdminHeader />

      <main className="mx-auto w-full max-w-[1200px] p-4 pb-8 lg:p-6">
        <div className="relative">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Cadastro de Funcionários</h1>

            <button
              onClick={() => handleOpenForm()}
              className="btn btn-primary w-full sm:w-auto"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Novo Funcionário</span>
            </button>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Buscar por nome, CPF ou cargo..."
              className="input w-full"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="px-4 py-3 font-medium text-zinc-700">Nome</th>
                  <th className="px-4 py-3 font-medium text-zinc-700">CPF</th>
                  <th className="px-4 py-3 font-medium text-zinc-700">Cargo</th>
                  <th className="px-4 py-3 font-medium text-zinc-700">Salário</th>
                  <th className="px-4 py-3 font-medium text-zinc-700">Data de Nascimento</th>
                  <th className="px-4 py-3 font-medium text-zinc-700">Data de Admissão</th>
                  <th className="px-4 py-3 font-medium text-zinc-700">Status</th>
                  <th className="px-4 py-3 font-medium text-zinc-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-3 text-center text-zinc-500">
                      Carregando...
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-3 text-center text-zinc-500">
                      Nenhum funcionário encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map(employee => (
                    <tr
                      key={employee.id}
                      className="border-b border-zinc-200 last:border-none hover:bg-zinc-50"
                    >
                      <td className="px-4 py-3">{employee.name}</td>
                      <td className="px-4 py-3">{formatCPF(employee.cpf)}</td>
                      <td className="px-4 py-3">{employee.role}</td>
                      <td className="px-4 py-3">
                        {employee.salary ? formatCurrency(employee.salary.toString()) : '-'}
                      </td>
                      <td className="px-4 py-3">
                        {employee.birth_date
                          ? new Date(employee.birth_date).toLocaleDateString('pt-BR')
                          : '-'}
                      </td>
                      <td className="px-4 py-3">
                        {employee.admission_date
                          ? new Date(employee.admission_date).toLocaleDateString('pt-BR')
                          : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                            employee.active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {employee.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenForm(employee)}
                            className="rounded p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="rounded p-1 text-zinc-500 hover:bg-zinc-100 hover:text-red-600"
                          >
                            <TrashIcon className="h-4 w-4" />
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

        <EmployeeForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          defaultValues={selectedEmployee ?? undefined}
        />
      </main>
    </div>
  )
}
