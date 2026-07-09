// Client for the curriculum endpoints. Only courses are needed so far — the
// group-creation form picks one — but the shape leaves room to grow.
import { authFetch, throwFromResponse } from './auth'

export type Course = {
  id: number
  subject: number
  title: string
  order: number
}

export async function listCourses(): Promise<Course[]> {
  const res = await authFetch('/curriculum/courses/')
  if (!res.ok) await throwFromResponse(res)
  return (await res.json()) as Course[]
}
