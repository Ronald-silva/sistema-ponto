import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';
import {
  CalendarIcon,
  ClockIcon,
  DocumentChartBarIcon,
} from '@heroicons/react/24/outline';

//faca teste

interface TimeRecord {
  id: string;
  date: string;
  entryTime: string;
  exitTime: string | null;
  extraHours: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export function EmployeeDashboard() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const { data: timeRecords, isLoading } = useQuery<TimeRecord[]>({
    queryKey: ['timeRecords', selectedMonth],
    queryFn: async () => {
      const response = await api.get('/time-records', {
        params: {
          month: selectedMonth.getMonth() + 1,
          year: selectedMonth.getFullYear(),
        },
      });
      return response.data;
    },
  });

  const totalExtraHours = timeRecords?.reduce((total, record) => {
    return total + (record.extraHours || 0);
  }, 0) || 0;

  const approvedExtraHours = timeRecords?.reduce((total, record) => {
    return total + (record.status === 'APPROVED' ? record.extraHours : 0);
  }, 0) || 0;

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Acompanhe seus registros de ponto e horas extras
        </p>
      </header>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total de Horas Extras
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {totalExtraHours}h
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentChartBarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Horas Extras Aprovadas
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {approvedExtraHours}h
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Registros no Mês
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {timeRecords?.length || 0}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Registros */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h2 className="text-base font-semibold leading-6 text-gray-900">
                Registros de Ponto
              </h2>
              <p className="mt-2 text-sm text-gray-700">
                Lista de todos os seus registros de ponto e horas extras do mês
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <input
                type="month"
                className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                value={`${selectedMonth.getFullYear()}-${String(
                  selectedMonth.getMonth() + 1
                ).padStart(2, '0')}`}
                onChange={(e) => setSelectedMonth(new Date(e.target.value))}
              />
            </div>
          </div>

          <div className="mt-6 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                        Data
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Entrada
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Saída
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Horas Extras
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-sm text-gray-500">
                          Carregando registros...
                        </td>
                      </tr>
                    ) : timeRecords?.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-sm text-gray-500">
                          Nenhum registro encontrado para este mês
                        </td>
                      </tr>
                    ) : (
                      timeRecords?.map((record) => (
                        <tr key={record.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            {new Date(record.date).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {record.entryTime}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {record.exitTime || '-'}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {record.extraHours}h
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span
                              className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                record.status === 'APPROVED'
                                  ? 'bg-green-100 text-green-800'
                                  : record.status === 'REJECTED'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {record.status === 'APPROVED'
                                ? 'Aprovado'
                                : record.status === 'REJECTED'
                                ? 'Rejeitado'
                                : 'Pendente'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
