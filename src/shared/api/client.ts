import type { ApiErrorBody } from './types'

const BASE = 'http://localhost:3000'

let getToken: () => string | null = () => null
let onLogout: () => void = () => undefined

export function setTokenGetter(fn: () => string | null) { getToken = fn }
export function setLogoutCallback(fn: () => void) { onLogout = fn }

export class ApiError extends Error {
  constructor(public status: number, public body: ApiErrorBody) {
    super(`HTTP ${status}: ${body?.message ?? 'Unknown error'}`)
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (res.status === 204) {
    return undefined as T
  }

  const data = await res.json()

  if (res.status === 401) {
    onLogout()
    throw new ApiError(res.status, data)
  }

  if (!res.ok) throw new ApiError(res.status, data)

  return data as T
}

export const api = {
  get:    <T>(path: string)                 => request<T>('GET', path),
  post:   <T>(path: string, body: unknown)  => request<T>('POST', path, body),
  put:    <T>(path: string, body: unknown)  => request<T>('PUT', path, body),
  patch:  <T>(path: string, body: unknown)  => request<T>('PATCH', path, body),
  delete: <T>(path: string)                 => request<T>('DELETE', path),
}
