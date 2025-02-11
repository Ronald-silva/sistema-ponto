import { useState, useEffect } from 'react'
import { EmployeeLayout } from './EmployeeLayout'
import { useAuth } from '../../contexts/AuthContext'
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

interface TimeEntry {
  date: string
  overtime: number
  checkIn: string
  checkOut: string
}

export function TimeRecord() {
  const { user } = useAuth()
  const [lastRecord, setLastRecord] = useState<{ type: 'IN' | 'OUT'; time: string } | null>(null)
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    // Dados de exemplo para o histórico
    {
      date: '2025-02-09',
      overtime: 120,
      checkIn: '08:00',
      checkOut: '18:00'
    },
    {
      date: '2025-02-08',
      overtime: 60,
      checkIn: '08:00',
      checkOut: '17:00'
    }
  ])

  // Simula o registro de ponto
  async function handleRecordTime(type: 'IN' | 'OUT') {
    const now = new Date()
    const timeString = now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })

    setLastRecord({ type, time: timeString })

    // Atualiza o histórico se for saída
    if (type === 'OUT') {
      const today = now.toISOString().split('T')[0]
      setTimeEntries(prev => {
        const todayEntry = prev.find(entry => entry.date === today)
        if (todayEntry) {
          return prev.map(entry =>
            entry.date === today
              ? { ...entry, checkOut: timeString }
              : entry
          )
        } else {
          return [
            {
              date: today,
              overtime: 0,
              checkIn: lastRecord?.time || timeString,
              checkOut: timeString
            },
            ...prev
          ]
        }
      })
    }
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
    <EmployeeLayout>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Registro de Ponto
          </h1>
          <p className="text-gray-500 mt-2">
            Olá, {user?.name}. Registre sua entrada ou saída abaixo.
          </p>
          {user?.projectName && (
            <p className="text-sm text-primary font-medium mt-1">
              Obra: {user.projectName}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Área de Registro */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Registrar Ponto
            </h2>

            {/* Status do último registro */}
            {lastRecord && (
              <div className="text-gray-500 mb-6">
                Último registro: {lastRecord.type === 'IN' ? 'Entrada' : 'Saída'} às{' '}
                {lastRecord.time}
              </div>
            )}

            {/* Botões de Registro */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleRecordTime('IN')}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-gray-200 hover:border-[var(--success)] hover:bg-[var(--success-light)] transition-colors group"
              >
                <ArrowRightIcon className="h-8 w-8 text-[var(--success)] mb-3" />
                <span className="text-[var(--success)] font-medium">Entrada</span>
              </button>

              <button
                onClick={() => handleRecordTime('OUT')}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-gray-200 hover:border-[var(--danger)] hover:bg-[var(--danger-light)] transition-colors group"
              >
                <ArrowLeftIcon className="h-8 w-8 text-[var(--danger)] mb-3" />
                <span className="text-[var(--danger)] font-medium">Saída</span>
              </button>
            </div>
          </div>

          {/* Histórico de Horas Extras */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Histórico de Horas Extras
            </h2>

            <div className="overflow-x-auto">
              <table className="table min-w-full">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Entrada</th>
                    <th>Saída</th>
                    <th>Horas Extras</th>
                  </tr>
                </thead>
                <tbody>
                  {timeEntries.length > 0 ? (
                    timeEntries.map((entry, index) => (
                      <tr key={index}>
                        <td>{formatDate(entry.date)}</td>
                        <td>{entry.checkIn}</td>
                        <td>{entry.checkOut}</td>
                        <td>{formatDuration(entry.overtime)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center text-gray-500 py-4">
                        Nenhuma hora extra registrada nos últimos 30 dias
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  )
}
