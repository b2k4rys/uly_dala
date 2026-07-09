import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { ApiError } from '../api/auth'
import { listCourses, type Course } from '../api/curriculum'
import { createGroup, listGroups, type Group } from '../api/enrollment'
import { Mark } from '../components/brand'
import './Auth.css'
import './Groups.css'

// Teachers and admins may create groups and manage rosters; everyone else
// (students, parents) gets a read-only view.
const canManage = (role?: string) => role === 'teacher' || role === 'admin'

export default function Groups() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [groups, setGroups] = useState<Group[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [courseId, setCourseId] = useState('')
  const [creating, setCreating] = useState(false)

  const manage = canManage(user?.role)
  const courseTitle = (id: number) =>
    courses.find((c) => c.id === id)?.title ?? `Курс #${id}`

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const [g, c] = await Promise.all([listGroups(), listCourses()])
        if (!active) return
        setGroups(g)
        setCourses(c)
      } catch (e) {
        if (active) setError(e instanceof ApiError ? e.message : 'Ошибка загрузки')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setCreating(true)
    try {
      const group = await createGroup({ name, course: Number(courseId) })
      setGroups((prev) => [...prev, group])
      setName('')
      setCourseId('')
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Не удалось создать группу')
    } finally {
      setCreating(false)
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
        <h1 className="dash__hi">Группы</h1>
        <p className="dash__lead">
          {manage
            ? 'Создавайте учебные группы и записывайте в них учеников.'
            : 'Группы, к которым вы относитесь.'}
        </p>

        {error && <div className="auth-error">{error}</div>}

        {manage && (
          <form className="grp-form" onSubmit={onCreate}>
            <div className="field">
              <label htmlFor="grp-name">Название группы</label>
              <input
                id="grp-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="10-А Тригонометрия"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="grp-course">Курс</label>
              <select
                id="grp-course"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                required
              >
                <option value="" disabled>
                  Выберите курс…
                </option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn btn--dark grp-form__submit"
              type="submit"
              disabled={creating}
            >
              {creating ? 'Создание…' : 'Создать группу'}
            </button>
          </form>
        )}

        {loading ? (
          <p className="grp-empty">Загрузка…</p>
        ) : groups.length === 0 ? (
          <p className="grp-empty">Пока нет ни одной группы.</p>
        ) : (
          <ul className="grp-list">
            {groups.map((g) => (
              <li key={g.id}>
                <Link to={`/app/groups/${g.id}`} className="grp-card">
                  <span className="grp-card__name">{g.name}</span>
                  <span className="grp-card__meta">{courseTitle(g.course)}</span>
                  <span className="grp-card__count">
                    {g.students.length}{' '}
                    {g.students.length === 1 ? 'ученик' : 'учеников'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
