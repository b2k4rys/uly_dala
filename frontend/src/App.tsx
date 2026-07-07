import './App.css'

/* Qoshqar-müyiz (ram's horn) — the steppe ornament, our signature motif.
   One tile, repeated across a band or scaled up as a faint watermark. */
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

function SteppeBand({ id }: { id: string }) {
  return (
    <div className="band band--sep" aria-hidden="true">
      <div className="wrap">
        <svg width="100%" height="28" role="presentation">
          <defs>
            <pattern
              id={id}
              width="120"
              height="28"
              patternUnits="userSpaceOnUse"
              patternTransform="translate(0 -6)"
            >
              <OrnamentTile />
            </pattern>
          </defs>
          <rect width="100%" height="28" fill={`url(#${id})`} />
        </svg>
      </div>
    </div>
  )
}

function Ornament({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 40" role="presentation" aria-hidden="true">
      <OrnamentTile />
    </svg>
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

const subjects = [
  {
    title: 'Математика',
    status: 'live' as const,
    tag: 'Қолжетімді',
    desc: 'Алгебра мен геометриядан бастап тригонометрияға дейін — әр курс бөлімдерге, тақырыптарға және үй жұмыстарына бөлінген.',
  },
  {
    title: 'Физика',
    status: 'soon' as const,
    tag: 'Жақында',
    desc: 'Механика, электр және оптика. Теорияны есеп шығарумен бекітіп, әр бөлім соңында тест тапсырасың.',
  },
  {
    title: 'Информатика',
    status: 'soon' as const,
    tag: 'Жақында',
    desc: 'Алгоритмдер мен Python негіздері. Тапсырмаларды браузерде орындап, бірден кері байланыс аласың.',
  },
]

const steps = [
  {
    n: '01',
    t: 'Пәнді таңда',
    p: 'Математика сияқты пәнді ашып, өзіңе керек курсты таңдайсың. Барлығы қазақ тілінде.',
  },
  {
    n: '02',
    t: 'Бөлімдерден өт',
    p: 'Әр курс бөлімдер мен тақырыптарға бөлінген. Реті бойынша, өз қарқыныңмен оқисың.',
  },
  {
    n: '03',
    t: 'Тапсырып бекіт',
    p: 'Әр тақырыпта үй жұмысы, әр бөлім соңында тест. Осылай білімің нақты бекиді.',
  },
]

function App() {
  return (
    <>
      <header className="nav">
        <div className="wrap nav__row">
          <a className="brand" href="#top" aria-label="Ұлы Дала — басты бет">
            <Mark />
            Ұлы&nbsp;Дала
          </a>
          <nav aria-label="Негізгі">
            <ul className="nav__links">
              <li><a href="#subjects">Пәндер</a></li>
              <li><a href="#how">Қалай оқимыз</a></li>
              <li><a href="#subjects">Курстар</a></li>
              <li><a href="#foot">Байланыс</a></li>
            </ul>
          </nav>
          <div className="nav__right">
            <div className="lang" aria-label="Тіл">
              <b>KZ</b><span>·</span>RU<span>·</span>EN
            </div>
            <a className="btn btn--dark" href="#top">Тегін бастау</a>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="wrap hero__grid">
            <div className="hero__panel rise">
              <Ornament className="hero__watermark" />
              <span className="pill">Тіркеу ашық · 2026 көктем</span>
              <h1 className="hero__title">
                Ұлы Дала
                <em>білімнің кең даласы</em>
              </h1>
              <p className="hero__lead">
                Қазақша онлайн академия. Пәнді таңдап, курс бөлімдерін өз
                қарқыныңмен оқисың — тапсырмалар мен тесттер білімді нақты бекітеді.
              </p>
              <div className="hero__cta">
                <a className="btn btn--dark" href="#subjects">
                  Оқуды бастау {arrow}
                </a>
                <div className="hero__stats">
                  <div><b>6</b> пән</div>
                  <div><b>20+</b> курс</div>
                  <div><b>3&nbsp;200</b> оқушы</div>
                </div>
              </div>
            </div>

            <div className="map rise rise-2" aria-label="Курс құрылымының үлгісі">
              <div className="map__head">
                <span>Курс құрылымы</span>
                <span>Математика</span>
              </div>
              <div className="node">
                <div className="node__k">Курс</div>
                <div className="node__v">Тригонометрия</div>
              </div>
              <div className="branch" />
              <div className="node node--indent">
                <div className="node__k">Бөлім</div>
                <div className="node__v">Тік бұрышты үшбұрыш</div>
              </div>
              <div className="branch branch--deep" />
              <div className="node node--i2 node--leaf">
                <div className="node__k">Тақырыптар</div>
                <div className="node__v">Пифагор теоремасы</div>
                <div className="node__v">Синус · косинус · тангенс</div>
                <div className="chips">
                  <span className="chip">Үй жұмысы</span>
                  <span className="chip chip--soft">Бөлім тесті</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SteppeBand id="band-1" />

        <section className="section" id="subjects">
          <div className="wrap">
            <div className="section__head">
              <h2 className="section__title">Оқу пәндері</h2>
              <p className="section__note">
                Әр пән курстарға, курс бөлімдер мен тақырыптарға бөлінеді —
                қарапайымнан күрделіге қарай.
              </p>
            </div>
            <div className="cards">
              {subjects.map((s) => (
                <article className="card" key={s.title}>
                  <div className="card__top">
                    <h3 className="card__title">{s.title}</h3>
                    <span className={`tag tag--${s.status}`}>{s.tag}</span>
                  </div>
                  <p className="card__desc">{s.desc}</p>
                  <a className="card__link" href="#top">
                    Толығырақ {arrow}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--alt" id="how">
          <div className="wrap">
            <div className="section__head">
              <h2 className="section__title">Оқу қалай өтеді?</h2>
              <p className="section__note">
                Үш қадам — таңдаудан бастап білімді бекітуге дейін.
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

        <SteppeBand id="band-2" />

        <section className="cta">
          <div className="wrap">
            <div className="cta__box">
              <Ornament className="cta__watermark" />
              <h2>Бүгін оқуды бастаңыз</h2>
              <a className="btn btn--dark" href="#top">
                Тегін тіркелу {arrow}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="foot" id="foot">
        <div className="wrap">
          <div className="foot__grid">
            <div>
              <span className="brand"><Mark /> Ұлы&nbsp;Дала</span>
              <p className="foot__tag">
                Ұлы Даланың цифрлық академиясы — қазақ тіліндегі ашық білім алаңы.
              </p>
            </div>
            <div>
              <h4>Оқу</h4>
              <ul>
                <li><a href="#subjects">Математика</a></li>
                <li><a href="#subjects">Физика</a></li>
                <li><a href="#subjects">Информатика</a></li>
                <li><a href="#how">Қалай оқимыз</a></li>
              </ul>
            </div>
            <div>
              <h4>Академия</h4>
              <ul>
                <li><a href="#top">Біз туралы</a></li>
                <li><a href="#top">Ұстаздар</a></li>
                <li><a href="#top">Блог</a></li>
                <li><a href="#top">Байланыс</a></li>
              </ul>
            </div>
            <div>
              <h4>Байланыс</h4>
              <ul>
                <li><a href="mailto:hello@ulydala.kz">hello@ulydala.kz</a></li>
                <li><a href="#top">Instagram</a></li>
                <li><a href="#top">Telegram</a></li>
              </ul>
            </div>
          </div>
          <div className="foot__base">
            <span>© 2026 Ұлы Дала. Қазақстанда жасалды.</span>
            <span>Құпиялылық · Шарттар</span>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
