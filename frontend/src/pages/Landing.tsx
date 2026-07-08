import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Mark, SteppeBand } from '../components/brand'
import '../App.css'

const arrow = (
  <span className="arrow" aria-hidden="true">
    →
  </span>
)

const steps = [
  {
    n: '01',
    t: 'Наставник назначает',
    p: 'Ваш наставник подбирает курс и разделы под ваш уровень и цели и открывает их вам.',
  },
  {
    n: '02',
    t: 'Вы проходите материал',
    p: 'Открываете назначенные темы и разбираетесь в них — по плану наставника, с поддержкой на каждом шаге.',
  },
  {
    n: '03',
    t: 'Задания и проверка',
    p: 'Выполняете домашние работы и тесты по разделу. Наставник проверяет их и помогает разобрать ошибки.',
  },
]

export default function Landing() {
  const { user } = useAuth()
  const enter = user
    ? { to: '/app', label: 'Кабинет' }
    : { to: '/login', label: 'Войти' }

  return (
    <>
      <header className="nav">
        <div className="wrap nav__row">
          <Link className="brand" to="/" aria-label="Ұлы Дала — главная">
            <Mark />
            Ұлы&nbsp;Дала
          </Link>
          <nav aria-label="Основная навигация">
            <ul className="nav__links">
              <li>
                <a href="#how">Как это устроено</a>
              </li>
              <li>
                <a href="#foot">Контакты</a>
              </li>
            </ul>
          </nav>
          <div className="nav__right">
            <div className="lang" aria-label="Язык">
              <b>RU</b>KZ<span>·</span>EN
            </div>
            <Link className="btn btn--dark" to={enter.to}>
              {enter.label}
            </Link>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="wrap hero__grid">
            <div className="hero__copy rise">
              <span className="pill">Обучение с наставником</span>
              <h1 className="hero__title">
                Личный наставник ведёт вас <em>по программе</em>
              </h1>
              <p className="hero__lead">
                Ұлы Дала — помощник в учёбе. Наставник назначает курсы и задания,
                а вы проходите их шаг за шагом и всегда можете спросить, если
                что-то непонятно.
              </p>
              <div className="hero__cta">
                <Link className="btn btn--dark" to={enter.to}>
                  {enter.label}
                </Link>
                <a className="btn btn--text" href="#how">
                  Как это устроено {arrow}
                </a>
              </div>
            </div>

            <div className="assign rise rise-2" aria-label="Задание от наставника">
              <div className="assign__head">
                <span>От наставника</span>
                <span className="assign__day">Сегодня</span>
              </div>
              <div className="tutor">
                <div className="tutor__ava" aria-hidden="true">
                  А
                </div>
                <div>
                  <div className="tutor__name">Айгерім А.</div>
                  <div className="tutor__role">Наставник по математике</div>
                </div>
              </div>
              <div className="rows">
                <div className="row">
                  <span className="row__k">Курс</span>
                  <span className="row__v">Тригонометрия</span>
                </div>
                <div className="row">
                  <span className="row__k">Раздел</span>
                  <span className="row__v">Прямоугольный треугольник</span>
                </div>
                <div className="row">
                  <span className="row__k">Задание</span>
                  <span className="row__v">Теорема Пифагора</span>
                </div>
              </div>
              <div className="chips">
                <span className="chip">Назначено</span>
                <span className="chip chip--soft">Срок: 12 апреля</span>
              </div>
            </div>
          </div>
        </section>

        <SteppeBand />

        <section className="how" id="how">
          <div className="wrap">
            <div className="how__head">
              <h2>Как это устроено</h2>
              <p>
                Это не самостоятельный курс, а работа с наставником: он ведёт вас
                по программе, а платформа помогает не потерять нить.
              </p>
            </div>
            <div className="steps">
              {steps.map((st) => (
                <div className="step" key={st.n}>
                  <div className="step__n">{st.n}</div>
                  <div className="step__t">{st.t}</div>
                  <p>{st.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="foot" id="foot">
        <div className="wrap">
          <div className="foot__row">
            <span className="brand">
              <Mark />
              Ұлы&nbsp;Дала
            </span>
            <ul className="foot__links">
              <li>
                <a href="#how">Как это устроено</a>
              </li>
              <li>
                <Link to={enter.to}>{enter.label}</Link>
              </li>
              <li>
                <a href="mailto:hello@ulydala.kz">hello@ulydala.kz</a>
              </li>
            </ul>
          </div>
          <div className="foot__base">© 2026 Ұлы Дала. Сделано в Казахстане.</div>
        </div>
      </footer>
    </>
  )
}
