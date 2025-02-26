import { useState } from 'react'
import { useEmployees } from '../hooks/useEmployees'
import { EmployeeForm } from '../components/EmployeeForm'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { AdminHeader } from '../components/AdminHeader'
import { useDateTime } from '../hooks/useDateTime'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface Employee {
  id: string
  name: string
  cpf: string
  role: string
  salary: number
  birth_date: string
  admission_date: string
  active: boolean
}

export function Employees() {
  const { employees, isLoading, deleteEmployee } = useEmployees()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const { time, date } = useDateTime()
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')

  function handleOpenForm(employee?: Employee) {
    if (employee) {
      // Garantir que as datas estejam no formato correto para o formulário
      setSelectedEmployee({
        ...employee,
        birth_date: employee.birth_date.split('T')[0],
        admission_date: employee.admission_date.split('T')[0],
      })
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

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  // Só filtra se tiver dados e termo de busca
  const filteredEmployees = employees && searchTerm
    ? employees.filter(employee =>
        employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.cpf?.includes(searchTerm)
      )
    : employees

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <AdminHeader />

      <main className="flex-1 p-4 lg:p-6">
        <div className="mx-auto w-full max-w-[1200px]">
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
              placeholder="Buscar por nome, email, cargo ou CPF..."
              className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200">
                    <th className="px-4 py-3 font-medium text-gray-900">Nome</th>
                    <th className="px-4 py-3 font-medium text-gray-900">CPF</th>
                    <th className="px-4 py-3 font-medium text-gray-900">E-mail</th>
                    <th className="px-4 py-3 font-medium text-gray-900">Cargo</th>
                    <th className="px-4 py-3 font-medium text-gray-900">Salário</th>
                    <th className="px-4 py-3 font-medium text-gray-900">Data Nasc.</th>
                    <th className="px-4 py-3 font-medium text-gray-900">Data Adm.</th>
                    <th className="px-4 py-3 font-medium text-gray-900">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-3 text-center text-gray-500">
                        Carregando...
                      </td>
                    </tr>
                  ) : !filteredEmployees?.length ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-3 text-center text-gray-500">
                        Nenhum funcionário encontrado
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees?.map((employee) => (
                      <tr key={employee.id}>
                        <td className="whitespace-nowrap px-4 py-3">{employee.name}</td>
                        <td className="whitespace-nowrap px-4 py-3">{employee.cpf}</td>
                        <td className="whitespace-nowrap px-4 py-3">{employee.email}</td>
                        <td className="whitespace-nowrap px-4 py-3">
                          {employee.role === 'ADMIN' ? 'Administrador' : 'Funcionário'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          {employee.salary
                            ? new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              }).format(employee.salary)
                            : '-'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          {employee.birth_date
                            ? new Date(employee.birth_date).toLocaleDateString('pt-BR')
                            : '-'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          {employee.admission_date
                            ? new Date(employee.admission_date).toLocaleDateString('pt-BR')
                            : '-'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenForm(employee)}
                              className="rounded p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-500"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteEmployee(employee.id)}
                              className="rounded p-1 text-gray-400 hover:bg-gray-50 hover:text-red-500"
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
        </div>
      </main>

      <EmployeeForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        defaultValues={selectedEmployee}
      />
    </div>
  )
}
