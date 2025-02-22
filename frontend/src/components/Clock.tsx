import { useEffect, useState } from 'react'

export function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <time className="text-sm text-gray-500">
      {time.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })}
    </time>
  )
}
