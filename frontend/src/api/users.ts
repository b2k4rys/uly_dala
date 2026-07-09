// Client for account listings. Only the student roster is exposed so far —
// teachers/admins use it to build the enrollment picker.
import { authFetch, throwFromResponse, type User } from './auth'

export async function listStudents(): Promise<User[]> {
  const res = await authFetch('/auth/students/')
  if (!res.ok) await throwFromResponse(res)
  return (await res.json()) as User[]
}
