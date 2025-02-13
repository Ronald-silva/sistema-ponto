import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { DateTime } from '../components/DateTime'
import { toast } from 'sonner'
import Webcam from 'react-webcam'
import { ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'

export function TimeEntry() {
  const { user, signOut } = useAuth()
  const webcamRef = useRef<Webcam>(null)
  const [lastEntry, setLastEntry] = useState<string | null>(null)

  async function handleTimeEntry(entryType: 'ENTRY' | 'EXIT') {
    try {
      // Simular registro de ponto
      const now = new Date()
      const timeStr = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
      setLastEntry(`${entryType === 'ENTRY' ? 'Entrada' : 'Saída'} registrada às ${timeStr}`)
      toast.success(`${entryType === 'ENTRY' ? 'Entrada' : 'Saída'} registrada com sucesso!`)
    } catch (error) {
      console.error('Erro ao registrar ponto:', error)
      toast.error('Erro ao registrar ponto')
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 h-[72px] border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Registro de Ponto
            </h1>
            <p className="mt-0.5 text-sm text-gray-600 truncate max-w-[240px] sm:max-w-none">
              {user.name} • {user.projectName} • {user.companyName}
            </p>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <DateTime />
            <button
              onClick={signOut}
              className="flex h-9 items-center gap-2 rounded-lg border border-zinc-300 px-3 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50"
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
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-[640px] items-start sm:items-center justify-center px-4 sm:px-8 pt-[72px] pb-8">
        <div className="flex w-full flex-col items-center space-y-6 py-6 sm:py-8">
          {/* Webcam Card */}
          <div className="w-full max-w-[420px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-4 sm:px-5 py-3">
              <h2 className="font-medium text-gray-900">
                Câmera para Registro
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Posicione seu rosto no centro da câmera para registrar o ponto
              </p>
            </div>
            <div className="relative aspect-[4/3] bg-zinc-900">
              {/* Camera Guidelines Overlay */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                {/* Corner Indicators */}
                <div className="absolute top-3 left-3 w-3 h-3 border-l-2 border-t-2 border-white/30" />
                <div className="absolute top-3 right-3 w-3 h-3 border-r-2 border-t-2 border-white/30" />
                <div className="absolute bottom-3 left-3 w-3 h-3 border-l-2 border-b-2 border-white/30" />
                <div className="absolute bottom-3 right-3 w-3 h-3 border-r-2 border-b-2 border-white/30" />
                
                {/* Center Guide */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-dashed border-white/20 rounded-full" />
                  <div className="absolute w-44 h-44 border border-white/10 rounded-full" />
                  <div className="absolute w-40 h-40 border border-white/10 rounded-full" />
                </div>

                {/* Scanning Line Animation */}
                <div className="absolute inset-x-0 h-0.5 bg-blue-400/30 animate-scan" />
              </div>

              {/* Camera Icon when no image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white/20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>

              {/* Webcam */}
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Focus Border Animation */}
              <div className="absolute inset-0 border-2 border-transparent animate-focus" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full max-w-[420px]">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleTimeEntry('ENTRY')}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 font-medium text-white transition-colors hover:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                <span className="text-sm">Registrar Entrada</span>
              </button>

              <button
                onClick={() => handleTimeEntry('EXIT')}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-3 font-medium text-white transition-colors hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <ArrowLeftOnRectangleIcon className="h-4 w-4" />
                <span className="text-sm">Registrar Saída</span>
              </button>
            </div>
          </div>

          {/* Last Entry */}
          {lastEntry && (
            <div className="w-full max-w-[420px] rounded-xl border border-gray-200 bg-white p-3 text-center shadow-sm">
              <p className="text-sm font-medium text-gray-900">{lastEntry}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
