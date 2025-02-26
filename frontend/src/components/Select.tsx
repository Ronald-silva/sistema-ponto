import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'

interface Option {
  id: string
  label: string
}

interface SelectProps {
  value: Option | null
  onChange: (value: Option) => void
  options: Option[]
  placeholder: string
  label?: string
  error?: string
}

export function Select({ value, onChange, options, placeholder, label, error }: SelectProps) {
  return (
    <div className="w-full">
      {/* Label com tamanho responsivo */}
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-zinc-700 sm:text-xs">
          {label}
        </label>
      )}

      {/* Container do Listbox com largura máxima responsiva */}
      <div className="relative w-full max-w-[600px]">
        <Listbox value={value} onChange={onChange}>
          {/* Botão do Listbox com altura e padding responsivos */}
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg border border-zinc-300 bg-white py-2.5 pl-4 pr-10 text-left shadow-sm transition-colors hover:bg-zinc-50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 sm:py-2 sm:pl-3 sm:text-sm">
            <span className={`block truncate ${!value ? 'text-zinc-500' : 'text-zinc-900'}`}>
              {value?.label || placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-zinc-400" aria-hidden="true" />
            </span>
          </Listbox.Button>

          {/* Dropdown com altura máxima e scroll */}
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-[300px] w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {options.map((option) => (
                <Listbox.Option
                  key={option.id}
                  value={option}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2.5 pl-4 pr-10 sm:py-2 sm:pl-3 ${
                      active ? 'bg-primary/5 text-primary' : 'text-zinc-900'
                    }`
                  }
                >
                  {({ selected }) => (
                    <span className={`block truncate ${selected ? 'font-medium text-primary' : 'font-normal'}`}>
                      {option.label}
                    </span>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </Listbox>
      </div>

      {/* Mensagem de erro com tamanho responsivo */}
      {error && (
        <p className="mt-1.5 text-sm text-red-500 sm:text-xs">
          {error}
        </p>
      )}
    </div>
  )
} 