import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Webcam from 'react-webcam'

export function TimeEntry() {
  const { user } = useAuth()
  const webcamRef = useRef<Webcam>(null)
  const [lastEntry, setLastEntry] = useState<string | null>(null)

  async function handleTimeEntry(entryType: 'ENTRY' | 'EXIT') {
    try {
      // Simular registro de ponto
      const now = new Date()
      const timeStr = now.toLocaleTimeString()
      setLastEntry(`${entryType === 'ENTRY' ? 'Entrada' : 'Saída'} registrada às ${timeStr}`)
      alert(`${entryType === 'ENTRY' ? 'Entrada' : 'Saída'} registrada com sucesso!`)
    } catch (error) {
      console.error('Erro ao registrar ponto:', error)
      alert('Erro ao registrar ponto')
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col gap-6 p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Registro de Ponto
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {user.name} - {user.projectName}
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[640px] space-y-6">
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="relative aspect-video">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleTimeEntry('ENTRY')}
            className="flex h-9 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 font-medium text-white transition-colors hover:bg-emerald-700"
          >
            Registrar Entrada
          </button>

          <button
            onClick={() => handleTimeEntry('EXIT')}
            className="flex h-9 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 font-medium text-white transition-colors hover:bg-red-700"
          >
            Registrar Saída
          </button>
        </div>

        {lastEntry && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center text-sm text-zinc-700">
            {lastEntry}
          </div>
        )}
      </div>
    </div>
  )
}
