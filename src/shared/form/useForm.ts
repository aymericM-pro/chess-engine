import { useState, useCallback } from 'react'
import type { ZodObject, ZodRawShape, z } from 'zod'

export type FormContextValue = {
  values: Record<string, unknown>
  errors: Record<string, string | undefined>
  touched: Record<string, boolean | undefined>
  submitted: boolean
  change: (name: string, value: unknown) => void
  blur: (name: string) => void
}

export function useForm<S extends ZodObject<ZodRawShape>>(
  schema: S,
  initial: z.infer<S>,
) {
  type T = z.infer<S>

  const [values, setValues] = useState<T>(initial)
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [touched, setTouched] = useState<Record<string, boolean | undefined>>({})
  const [submitted, setSubmitted] = useState(false)

  const syncErrors = useCallback(
    (vals: T) => {
      const result = schema.safeParse(vals)
      if (result.success) {
        setErrors({})
        return
      }
      const flat = result.error.flatten().fieldErrors as Record<string, string[] | undefined>
      setErrors(Object.fromEntries(Object.keys(schema.shape).map(k => [k, flat[k]?.[0]])))
    },
    [schema],
  )

  const change = useCallback(
    (name: string, value: unknown) => {
      const next = { ...values, [name]: value } as T
      setValues(next)
      if (touched[name] || submitted) syncErrors(next)
    },
    [values, touched, submitted, syncErrors],
  )

  const blur = useCallback(
    (name: string) => {
      setTouched(prev => ({ ...prev, [name]: true }))
      syncErrors(values)
    },
    [values, syncErrors],
  )

  // Imperative submit — used when there's no <form> element (ex: sidebar footer button)
  const submit = useCallback((): T | null => {
    setSubmitted(true)
    const result = schema.safeParse(values)
    if (!result.success) {
      const flat = result.error.flatten().fieldErrors as Record<string, string[] | undefined>
      setErrors(Object.fromEntries(Object.keys(schema.shape).map(k => [k, flat[k]?.[0]])))
      const firstKey = Object.keys(result.error.flatten().fieldErrors)[0]
      if (firstKey) setTimeout(() => document.getElementById(firstKey)?.focus(), 0)
      return null
    }
    setErrors({})
    return result.data as T
  }, [schema, values])

  // Form event handler — used with <Form onSubmit={handleSubmit(cb)}>
  const handleSubmit = useCallback(
    (cb: (data: T) => void | Promise<void>) =>
      (e: React.FormEvent) => {
        e.preventDefault()
        const data = submit()
        if (data) cb(data)
      },
    [submit],
  )

  const ctx: FormContextValue = { values, errors, touched, submitted, change, blur }

  return { ctx, values, errors, submitted, set: change, blur, submit, handleSubmit }
}
