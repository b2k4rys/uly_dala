// Client for the enrollment endpoints (/api/enrollment/groups/).
// The API returns related users/courses as bare ids; pages join those against
// the courses list (and, for now, show student ids directly — see Groups.tsx).
import { authFetch, throwFromResponse } from './auth'

export type GroupUser = { id: number; username: string }

export type Group = {
  id: number
  name: string
  teacher: number
  teacher_detail: GroupUser
  course: number
  students: number[]
  students_detail: GroupUser[]
  created_at: string
}

export async function listGroups(): Promise<Group[]> {
  const res = await authFetch('/enrollment/groups/')
  if (!res.ok) await throwFromResponse(res)
  return (await res.json()) as Group[]
}

export async function getGroup(id: number): Promise<Group> {
  const res = await authFetch(`/enrollment/groups/${id}/`)
  if (!res.ok) await throwFromResponse(res)
  return (await res.json()) as Group
}

// A teacher creating a group owns it automatically (the API sets teacher from
// the request user), so only name + course are required here.
export async function createGroup(input: {
  name: string
  course: number
}): Promise<Group> {
  const res = await authFetch('/enrollment/groups/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) await throwFromResponse(res)
  return (await res.json()) as Group
}

function studentAction(groupId: number, verb: 'enroll' | 'unenroll') {
  return async (student: number): Promise<Group> => {
    const res = await authFetch(`/enrollment/groups/${groupId}/${verb}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student }),
    })
    if (!res.ok) await throwFromResponse(res)
    return (await res.json()) as Group
  }
}

export const enrollStudent = (groupId: number, student: number) =>
  studentAction(groupId, 'enroll')(student)

export const unenrollStudent = (groupId: number, student: number) =>
  studentAction(groupId, 'unenroll')(student)
