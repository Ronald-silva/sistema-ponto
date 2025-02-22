import { AdminHeader } from '../components/AdminHeader'
import { ClockIcon, UserGroupIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'

export function Dashboard() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <AdminHeader />

      <main className="mx-auto w-full max-w-[1200px] p-4 pb-8 lg:p-6">
        <h1 className="mb-6 text-2xl font-semibold text-gray-900">Dashboard</h1>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {/* Card de Registros de Hoje */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                <ClockIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-zinc-600">Registros de Hoje</p>
                <p className="text-2xl font-semibold text-zinc-900">0</p>
              </div>
            </div>
          </div>

          {/* Card de Funcionários */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-100 p-2 text-green-600">
                <UserGroupIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-zinc-600">Funcionários Ativos</p>
                <p className="text-2xl font-semibold text-zinc-900">1</p>
              </div>
            </div>
          </div>

          {/* Card de Obras */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
                <BuildingOfficeIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-zinc-600">Obras Ativas</p>
                <p className="text-2xl font-semibold text-zinc-900">1</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de Últimos Registros */}
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-200 px-4 py-3">
            <h2 className="font-medium text-zinc-900">Registros de Hoje</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600">Funcionário</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600">Obra</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600">Entrada</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600">Saída</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                <tr>
                  <td colSpan={5} className="text-center text-zinc-600">
                    Nenhum registro encontrado
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
