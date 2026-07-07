import './App.css'

/* Qoshqar-müyiz (ram's horn) — the steppe ornament, our national signature. */
function OrnamentTile() {
  return (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M60 20 C46 20 44 9 33 12 C24 14 27 27 37 23" />
      <path d="M60 20 C74 20 76 9 87 12 C96 14 93 27 83 23" />
      <path d="M60 4 l7 9 -7 9 -7 -9 z" />
      <path d="M0 20 h14 M106 20 h14" />
    </g>
  )
}

function SteppeBand() {
  return (
    <div className="band" aria-hidden="true">
      <div className="wrap">
        <svg width="100%" height="24" role="presentation">
          <defs>
            <pattern
              id="steppe"
              width="120"
              height="24"
              patternUnits="userSpaceOnUse"
              patternTransform="translate(0 -8)"
            >
              <OrnamentTile />
            </pattern>
          </defs>
          <rect width="100%" height="24" fill="url(#steppe)" />
        </svg>
      </div>
    </div>
  )
}

function Mark() {
  return (
    <svg className="brand__mark" viewBox="0 0 120 40" role="presentation" aria-hidden="true">
      <OrnamentTile />
    </svg>
  )
}

const arrow = <span className="arrow" aria-hidden="true">→</span>

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

function App() {
  return (
    <>
      <header className="nav">
        <div className="wrap nav__row">
          <a className="brand" href="#top" aria-label="Ұлы Дала — главная">
            <Mark />
            Ұлы&nbsp;Дала
          </a>
          <nav aria-label="Основная навигация">
            <ul className="nav__links">
              <li><a href="#how">Как это устроено</a></li>
              <li><a href="#foot">Контакты</a></li>
            </ul>
          </nav>
          <div className="nav__right">
            <div className="lang" aria-label="Язык">
              <b>RU</b>KZ<span>·</span>EN
            </div>
            <a className="btn btn--dark" href="#top">Войти</a>
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
                а вы проходите их шаг за шагом и всегда можете спросить, если что-то
                непонятно.
              </p>
              <div className="hero__cta">
                <a className="btn btn--dark" href="#top">Войти</a>
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
                <div className="tutor__ava" aria-hidden="true">А</div>
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
            <span className="brand"><Mark /> Ұлы&nbsp;Дала</span>
            <ul className="foot__links">
              <li><a href="#how">Как это устроено</a></li>
              <li><a href="#top">Войти</a></li>
              <li><a href="mailto:hello@ulydala.kz">hello@ulydala.kz</a></li>
            </ul>
          </div>
          <div className="foot__base">© 2026 Ұлы Дала. Сделано в Казахстане.</div>
        </div>
      </footer>
    </>
  )
}

export default App
