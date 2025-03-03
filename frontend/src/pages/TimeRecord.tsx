import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../lib/api'
import { toast } from 'sonner'
import { useDateTime } from '../hooks/useDateTime'
import { useNavigate } from 'react-router-dom'

interface TimeEntry {
  date: string
  overtime: number
  checkIn: string
  checkOut: string
}

export function TimeRecord() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const { date, time } = useDateTime()

  // Buscar histórico de registros
  useEffect(() => {
    async function fetchTimeRecords() {
      try {
        const response = await api.get('/time-records')
        setTimeEntries(response.data)
      } catch (error) {
        console.error('Erro ao buscar registros:', error)
      }
    }

    fetchTimeRecords()
  }, [])

  async function handleRegisterTime(type: 'ENTRY' | 'EXIT') {
    try {
      setLoading(true)

      await api.post('/time-records', {
        type,
        userId: user?.id,
        timestamp: new Date().toISOString()
      })

      toast.success('Registro realizado com sucesso!')
    } catch (error: any) {
      console.error('Erro ao registrar ponto:', error)
      toast.error('Erro ao registrar ponto. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  // Formata a duração em minutos para horas e minutos
  function formatDuration(minutes: number) {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`
  }

  // Formata a data para o formato brasileiro
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto w-full max-w-[1200px] p-4 pb-8 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-lg font-medium text-gray-900">
                Registro de Ponto
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium">{time}</span>
                <span className="mx-1.5 text-gray-400">•</span>
                <span>{date}</span>
              </div>

              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center justify-center gap-8 p-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Olá, {user?.name || 'Funcionário'}
          </h1>
          <p className="mt-2 text-gray-600">
            Registre sua entrada ou saída abaixo
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => handleRegisterTime('ENTRY')}
            disabled={loading}
            className="flex h-36 w-36 flex-col items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white text-green-600 transition-colors hover:border-green-600 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            <span className="font-medium">Entrada</span>
          </button>

          <button
            onClick={() => handleRegisterTime('EXIT')}
            disabled={loading}
            className="flex h-36 w-36 flex-col items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white text-red-600 transition-colors hover:border-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="font-medium">Saída</span>
          </button>
        </div>

        {/* Histórico de Registros */}
        <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Histórico - Últimos 30 dias
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Data</th>
                  <th className="text-left py-3 px-4">Entrada</th>
                  <th className="text-left py-3 px-4">Saída</th>
                  <th className="text-left py-3 px-4">Horas Extras</th>
                </tr>
              </thead>
              <tbody>
                {timeEntries.length > 0 ? (
                  timeEntries.map((entry, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4">{formatDate(entry.date)}</td>
                      <td className="py-3 px-4">{entry.checkIn}</td>
                      <td className="py-3 px-4">{entry.checkOut}</td>
                      <td className="py-3 px-4">{formatDuration(entry.overtime)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      Nenhuma hora extra registrada nos últimos 30 dias
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
