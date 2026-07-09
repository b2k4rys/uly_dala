import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { ApiError, type User } from '../api/auth'
import { listCourses, type Course } from '../api/curriculum'
import {
  enrollStudent,
  getGroup,
  unenrollStudent,
  type Group,
} from '../api/enrollment'
import { listStudents } from '../api/users'
import { Mark } from '../components/brand'
import './Auth.css'
import './Groups.css'

const canManage = (role?: string) => role === 'teacher' || role === 'admin'

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>()
  const groupId = Number(id)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [group, setGroup] = useState<Group | null>(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [students, setStudents] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [studentId, setStudentId] = useState('')
  const [busy, setBusy] = useState(false)

  const manage = canManage(user?.role)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        // The student roster only loads for managers, who alone can enroll.
        const [g, courses, roster] = await Promise.all([
          getGroup(groupId),
          listCourses(),
          canManage(user?.role) ? listStudents() : Promise.resolve([]),
        ])
        if (!active) return
        setGroup(g)
        setCourse(courses.find((c) => c.id === g.course) ?? null)
        setStudents(roster)
      } catch (e) {
        if (active) setError(e instanceof ApiError ? e.message : 'Ошибка загрузки')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [groupId, user?.role])

  // Students not already in the group — the only sensible enroll candidates.
  const enrolledIds = new Set(group?.students ?? [])
  const candidates = students.filter((s) => !enrolledIds.has(s.id))

  const onEnroll = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      setGroup(await enrollStudent(groupId, Number(studentId)))
      setStudentId('')
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Не удалось записать ученика')
    } finally {
      setBusy(false)
    }
  }

  const onRemove = async (sid: number) => {
    setError('')
    setBusy(true)
    try {
      setGroup(await unenrollStudent(groupId, sid))
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Не удалось удалить ученика')
    } finally {
      setBusy(false)
    }
  }

  const onLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="dash">
      <header className="dash__bar">
        <div className="wrap dash__bar-row">
          <Link to="/app" className="brand">
            <Mark />
            Ұлы&nbsp;Дала
          </Link>
          <button className="btn btn--dark" type="button" onClick={onLogout}>
            Выйти
          </button>
        </div>
      </header>

      <main className="wrap dash__main">
        <Link to="/app/groups" className="auth-back">
          ← Все группы
        </Link>

        {loading ? (
          <p className="grp-empty">Загрузка…</p>
        ) : !group ? (
          <p className="grp-empty">{error || 'Группа не найдена.'}</p>
        ) : (
          <>
            <h1 className="dash__hi">{group.name}</h1>
            <p className="dash__lead">
              Курс: {course?.title ?? `#${group.course}`}
            </p>

            {error && <div className="auth-error">{error}</div>}

            {manage && (
              <form className="grp-form grp-form--inline" onSubmit={onEnroll}>
                <div className="field">
                  <label htmlFor="sid">Записать ученика</label>
                  <select
                    id="sid"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      {candidates.length
                        ? 'Выберите ученика…'
                        : 'Все ученики уже записаны'}
                    </option>
                    {candidates.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.username}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className="btn btn--dark grp-form__submit"
                  type="submit"
                  disabled={busy || !studentId}
                >
                  Записать
                </button>
              </form>
            )}

            <h2 className="grp-roster__title">
              Ученики ({group.students.length})
            </h2>
            {group.students.length === 0 ? (
              <p className="grp-empty">В группе пока нет учеников.</p>
            ) : (
              <ul className="grp-roster">
                {group.students_detail.map((s) => (
                  <li key={s.id} className="grp-roster__row">
                    <span>{s.username}</span>
                    {manage && (
                      <button
                        className="btn btn--text grp-roster__remove"
                        type="button"
                        onClick={() => onRemove(s.id)}
                        disabled={busy}
                      >
                        Удалить
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  )
}
