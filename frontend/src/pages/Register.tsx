import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { ApiError } from '../api/auth'
import { Mark } from '../components/brand'
import './Auth.css'

export default function Register() {
  const { user, register } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [fields, setFields] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to="/app" replace />

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setFields({})
    setBusy(true)
    try {
      await register(username.trim(), email.trim(), password)
      navigate('/app', { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        setFields(err.fields)
        // Only show the banner when the error isn't already on a field.
        if (Object.keys(err.fields).length === 0) setError(err.message)
      } else {
        setError('Не удалось зарегистрироваться. Проверьте соединение.')
      }
      setBusy(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-brand">
          <Mark />
          Ұлы&nbsp;Дала
        </Link>

        <h1>Регистрация</h1>
        <p className="auth-sub">Создайте аккаунт, чтобы начать заниматься.</p>

        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="username">Имя пользователя</label>
            <input
              id="username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-invalid={Boolean(fields.username)}
              required
              autoFocus
            />
            {fields.username && <span className="field__error">{fields.username}</span>}
          </div>

          <div className="field">
            <label htmlFor="email">Эл. почта</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(fields.email)}
              required
            />
            {fields.email && <span className="field__error">{fields.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(fields.password)}
              required
            />
            {fields.password && <span className="field__error">{fields.password}</span>}
          </div>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <button className="btn btn--dark auth-submit" type="submit" disabled={busy}>
            {busy ? 'Создаём…' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="auth-alt">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
        <Link to="/" className="auth-back">
          ← На главную
        </Link>
      </div>
    </main>
  )
}
