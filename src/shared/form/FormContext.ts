import { createContext, useContext } from 'react'
import type { FormContextValue } from './useForm'

export const FormContext = createContext<FormContextValue | null>(null)

export function useFormContext(): FormContextValue {
  const ctx = useContext(FormContext)
  if (!ctx) throw new Error('<Field> doit être utilisé dans un <Form>')
  return ctx
}
