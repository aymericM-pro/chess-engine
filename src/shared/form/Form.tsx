import { FormContext } from './FormContext'
import type { FormContextValue } from './useForm'

interface FormProps {
  ctx: FormContextValue
  onSubmit?: (e: React.FormEvent) => void
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
}

// <Form> — wraps a <form> element and provides form context to all <Field> children
export function Form({ ctx, onSubmit, children, style, className }: FormProps) {
  return (
    <FormContext.Provider value={ctx}>
      <form noValidate onSubmit={onSubmit} style={style} className={className}>
        {children}
      </form>
    </FormContext.Provider>
  )
}

// <FormProvider> — provides context without a <form> element (ex: sidebar with external submit button)
export function FormProvider({ ctx, children }: { ctx: FormContextValue; children: React.ReactNode }) {
  return <FormContext.Provider value={ctx}>{children}</FormContext.Provider>
}
