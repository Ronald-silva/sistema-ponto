import { useState, useEffect } from 'react'
import { Input } from './Input'
import { toast } from 'sonner'

interface OvertimeRule {
  type: string
  multiplier: number
  description: string
}

interface OvertimeRulesFormProps {
  initialRules?: OvertimeRule[]
  onChange: (rules: OvertimeRule[]) => void
}

const defaultRules: OvertimeRule[] = [
  { type: 'WEEKDAY', multiplier: 50, description: 'Hora Extra Normal (Dias Úteis)' },
  { type: 'NIGHT_SHIFT', multiplier: 70, description: 'Hora Extra Noturna' },
  { type: 'SATURDAY', multiplier: 67, description: 'Hora Extra Sábado' },
  { type: 'SUNDAY', multiplier: 100, description: 'Hora Extra Domingo' },
  { type: 'HOLIDAY', multiplier: 100, description: 'Hora Extra Feriado' }
]

export function OvertimeRulesForm({ initialRules, onChange }: OvertimeRulesFormProps) {
  const [rules, setRules] = useState<OvertimeRule[]>(initialRules || defaultRules)

  useEffect(() => {
    if (initialRules && initialRules.length > 0) {
      // Garantir que as regras iniciais estejam no formato correto
      const formattedRules = initialRules.map(rule => ({
        ...rule,
        multiplier: Number(rule.multiplier)
      }))
      setRules(formattedRules)
    }
  }, [initialRules])

  const handleRuleChange = (index: number, value: string) => {
    const numericValue = Number(value)
    
    if (isNaN(numericValue)) {
      toast.error('Por favor, insira apenas números')
      return
    }

    if (numericValue < 0 || numericValue > 100) {
      toast.error('O valor deve estar entre 0 e 100')
      return
    }

    const updatedRules = rules.map((rule, i) => {
      if (i === index) {
        return { ...rule, multiplier: numericValue }
      }
      return rule
    })

    setRules(updatedRules)
    onChange(updatedRules)
  }

  const handleResetDefaults = () => {
    setRules(defaultRules)
    onChange(defaultRules)
    toast.success('Regras restauradas para os valores padrão')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-[--text]">Regras de Hora Extra</h3>
        <button
          type="button"
          onClick={handleResetDefaults}
          className="text-sm text-blue-500 hover:text-blue-600"
        >
          Restaurar Padrões
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {rules.map((rule, index) => (
          <div key={rule.type} className="space-y-2">
            <label 
              htmlFor={`rule-${rule.type}`}
              className="text-sm font-medium text-[--text-secondary]"
              title={`Porcentagem adicional para ${rule.description.toLowerCase()}`}
            >
              {rule.description}
            </label>
            <div className="relative">
              <Input
                id={`rule-${rule.type}`}
                type="number"
                min="0"
                max="100"
                value={rule.multiplier}
                onChange={(e) => handleRuleChange(index, e.target.value)}
                className="h-11 pr-8 bg-white"
                placeholder="Digite a porcentagem"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[--text-secondary]">
                %
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-sm text-[--text-secondary]">
          * Os valores representam a porcentagem adicional sobre o valor da hora normal
        </p>
        <p className="text-sm text-[--text-secondary]">
          * Exemplo: 50% significa que a hora extra será paga com acréscimo de 50% sobre o valor da hora normal
        </p>
      </div>
    </div>
  )
} 