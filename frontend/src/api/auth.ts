// Thin client for the Django JWT auth API.
// Same-origin `/api` — nginx (prod) or the Vite dev proxy routes it to Django.

const API = '/api'
const ACCESS_KEY = 'uly_access'
const REFRESH_KEY = 'uly_refresh'

export type User = { id: number; username: string; email: string }

export const tokens = {
  get access() {
    return localStorage.getItem(ACCESS_KEY)
  },
  get refresh() {
    return localStorage.getItem(REFRESH_KEY)
  },
  set(access: string, refresh?: string) {
    localStorage.setItem(ACCESS_KEY, access)
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },
}

// Carries a human message plus per-field errors from DRF, e.g.
// { username: ["A user with that username already exists."] }.
export class ApiError extends Error {
  fields: Record<string, string>
  constructor(message: string, fields: Record<string, string> = {}) {
    super(message)
    this.name = 'ApiError'
    this.fields = fields
  }
}

// DRF / SimpleJWT emit English messages; translate the ones users can hit.
const RU: Record<string, string> = {
  'No active account found with the given credentials':
    'Неверное имя пользователя или пароль.',
  'A user with that username already exists.':
    'Пользователь с таким именем уже существует.',
  'user with this email already exists.':
    'Пользователь с такой почтой уже существует.',
  'This field may not be blank.': 'Поле не может быть пустым.',
  'This field is required.': 'Обязательное поле.',
  'Enter a valid email address.': 'Введите корректный адрес эл. почты.',
  'This password is too common.': 'Пароль слишком простой.',
  'This password is entirely numeric.':
    'Пароль не может состоять только из цифр.',
  'This password is too short. It must contain at least 8 characters.':
    'Пароль слишком короткий — минимум 8 символов.',
}
const tr = (m: string) => RU[m] ?? m

async function throwFromResponse(res: Response): Promise<never> {
  let data: unknown = null
  try {
    data = await res.json()
  } catch {
    // non-JSON body
  }
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>
    if (typeof obj.detail === 'string') throw new ApiError(tr(obj.detail))
    const fields: Record<string, string> = {}
    let first = ''
    for (const [key, val] of Object.entries(obj)) {
      const msg = Array.isArray(val)
        ? val.map((v) => tr(String(v))).join(' ')
        : tr(String(val))
      fields[key] = msg
      if (!first) first = msg
    }
    throw new ApiError(first || 'Что-то пошло не так', fields)
  }
  throw new ApiError('Что-то пошло не так. Попробуйте позже.')
}

function postJson(path: string, body: unknown) {
  return fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export async function obtainToken(username: string, password: string) {
  const res = await postJson('/auth/token/', { username, password })
  if (!res.ok) await throwFromResponse(res)
  const data = (await res.json()) as { access: string; refresh: string }
  tokens.set(data.access, data.refresh)
  return data
}

export async function registerUser(
  username: string,
  email: string,
  password: string,
) {
  const res = await postJson('/auth/register/', { username, email, password })
  if (!res.ok) await throwFromResponse(res)
  return (await res.json()) as User
}

async function refreshAccess(): Promise<boolean> {
  const refresh = tokens.refresh
  if (!refresh) return false
  const res = await postJson('/auth/token/refresh/', { refresh })
  if (!res.ok) return false
  // ROTATE_REFRESH_TOKENS is on, so a new refresh comes back too.
  const data = (await res.json()) as { access: string; refresh?: string }
  tokens.set(data.access, data.refresh)
  return true
}

// fetch() with the Bearer token attached, retrying once after a refresh on 401.
export async function authFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers)
  if (tokens.access) headers.set('Authorization', `Bearer ${tokens.access}`)

  let res = await fetch(`${API}${path}`, { ...init, headers })
  if (res.status === 401 && tokens.refresh) {
    if (await refreshAccess()) {
      headers.set('Authorization', `Bearer ${tokens.access}`)
      res = await fetch(`${API}${path}`, { ...init, headers })
    }
  }
  return res
}

export async function getMe(): Promise<User> {
  const res = await authFetch('/auth/me/')
  if (!res.ok) await throwFromResponse(res)
  return (await res.json()) as User
}
