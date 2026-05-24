import { ApiError } from './client'

export function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) return error.body?.message ?? fallback
  if (error instanceof Error && error.message) return error.message
  return fallback
}
