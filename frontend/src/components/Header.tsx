import { ReactNode } from 'react'
import { Clock } from './Clock'

interface HeaderProps {
  title: string
  icon?: ReactNode
}

export function Header({ title, icon }: HeaderProps) {
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex min-h-[4rem] max-w-[1200px] flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-0">
        <div className="flex items-center gap-3">
          {icon}
          <h1 className="text-lg font-medium text-gray-900">{title}</h1>
        </div>

        <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-4">
          <div className="text-sm text-gray-500 capitalize">
            {currentDate}
          </div>
          <Clock />
        </div>
      </div>
    </header>
  )
}
