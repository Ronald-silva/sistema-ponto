import { ButtonHTMLAttributes } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

const button = tv({
  base: 'h-9 rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  variants: {
    variant: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02] focus:ring-blue-600',
      ghost: 'bg-zinc-50 text-zinc-900 hover:bg-zinc-100 focus:ring-zinc-400'
    }
  },
  defaultVariants: {
    variant: 'primary'
  }
})

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export function Button({ variant, className, ...props }: ButtonProps) {
  return <button {...props} className={button({ variant, className })} />
}
