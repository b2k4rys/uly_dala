import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Mark } from '../components/brand'
import './Auth.css'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const onLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="dash">
      <header className="dash__bar">
        <div className="wrap dash__bar-row">
          <span className="brand">
            <Mark />
            Ұлы&nbsp;Дала
          </span>
          <button className="btn btn--dark" type="button" onClick={onLogout}>
            Выйти
          </button>
        </div>
      </header>

      <main className="wrap dash__main">
        <h1 className="dash__hi">Здравствуйте, {user?.username}!</h1>
        <p className="dash__lead">
          Вы вошли в кабинет. Здесь появятся курсы и задания, которые назначит
          ваш наставник.
        </p>

        <div className="dash__card">
          <div className="row">
            <span className="row__k">Имя пользователя</span>
            <span className="row__v">{user?.username}</span>
          </div>
          <div className="row">
            <span className="row__k">Эл. почта</span>
            <span className="row__v">{user?.email || '—'}</span>
          </div>
        </div>
      </main>
    </div>
  )
}
