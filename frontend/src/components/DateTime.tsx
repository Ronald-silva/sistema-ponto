import { useEffect, useState } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

export function DateTime() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const formattedTime = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="flex justify-end">
      <div className="inline-flex items-center space-x-2 text-sm text-gray-600">
        <ClockIcon className="h-4 w-4 text-gray-500" />
        <span className="font-medium">{formattedTime}</span>
        <span className="mx-1 text-gray-400">•</span>
        <span>{formattedDate}</span>
      </div>
    </div>
  );
}
