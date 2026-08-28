const services = [
  { n: '01', title: 'Web products', text: 'High-performing websites, business portals, and web applications shaped around real user needs.', tags: ['Product design', 'Frontend', 'CMS'] },
  { n: '02', title: 'Custom software', text: 'Purpose-built systems, APIs, dashboards, and automations that simplify how your business operates.', tags: ['Laravel', 'Django', 'Integrations'] },
  { n: '03', title: 'Mobile apps', text: 'Polished cross-platform experiences that feel natural, stay fast, and support your customers wherever they are.', tags: ['Flutter', 'Android', 'API-first'] },
  { n: '04', title: 'Technical partnership', text: 'A senior, practical extension of your team—from product decisions and architecture to launch and ongoing improvement.', tags: ['Strategy', 'QA', 'Support'] },
];

const projects = [
  { kind: 'PLATFORM · SOCIAL IMPACT', title: 'CBR Rehabilitation System', text: 'A focused web platform supporting community-based rehabilitation workflows for a local social welfare center.', tone: 'project-blue', glyph: 'cbr' },
  { kind: 'COMMERCE · HOSPITALITY', title: 'Behesht Restaurant', text: 'A custom restaurant website and online menu designed to make discovering and ordering food effortless.', tone: 'project-lime', glyph: 'menu' },
  { kind: 'PRODUCT · FINTECH', title: 'Bede Bestoon', text: 'A Persian-first personal finance app for tracking income, expenses, debts, receivables, and financial summaries.', tone: 'project-ink', glyph: 'chart' },
];

const process = [
  ['Discover', 'We learn your goals, users, constraints, and what success needs to look like.'],
  ['Define', 'We turn the idea into a clear scope, system plan, and practical delivery roadmap.'],
  ['Design & build', 'We work in focused iterations, sharing progress early and keeping decisions transparent.'],
  ['Launch & improve', 'We ship carefully, measure what matters, and stay available after release.'],
];

function Arrow() { return <span aria-hidden="true">↗</span>; }

export default function Home() {
  return (
    <main>
      <nav className="nav-shell" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Itadbeer home"><span className="brand-mark">iT</span><span>itadbeer</span></a>
        <div className="nav-links"><a href="#services">Services</a><a href="#work">Work</a><a href="#about">About</a><a href="#process">Process</a></div>
        <a className="button button-small" href="#contact">Start a project</a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <h1>We build software that moves your business forward.</h1>
          <p className="hero-lede">Itadbeer is a close-knit team of developers and designers turning ambitious ideas into fast, reliable web products, mobile apps, and custom software.</p>
          <div className="hero-actions"><a className="button" href="#contact">Tell us about your project <Arrow /></a><a className="text-link" href="#work">Explore our work <span>↓</span></a></div>
        </div>
        <div className="hero-visual" aria-label="A business idea progressing from planning to launch and growth">
          <div className="business-window">
            <div className="business-bar"><span className="business-logo">iT</span><div><small>YOUR DIGITAL PRODUCT</small><b>From idea to impact</b></div><span className="live-pill"><i /> On track</span></div>
            <div className="journey">
              <div className="journey-step complete"><span>✓</span><div><small>STEP 1</small><b>Understand your goal</b></div></div>
              <i className="journey-line complete-line" />
              <div className="journey-step active"><span>02</span><div><small>STEP 2</small><b>Design the solution</b></div></div>
              <i className="journey-line" />
              <div className="journey-step"><span>03</span><div><small>STEP 3</small><b>Launch & grow</b></div></div>
            </div>
            <div className="business-outcome"><div><small>WHAT YOU GET</small><strong>A clear, useful product<br />built around your business.</strong></div><span className="outcome-arrow">↗</span></div>
          </div>
          <div className="signal-card"><span className="signal-dot" /><div><small>PARTNERSHIP</small><b>Clear at every step</b></div><strong>→</strong></div>
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
        </div>
      </section>

      <section className="trust-strip" aria-label="Core capabilities"><p>BUILT WITH MODERN, PROVEN TECHNOLOGY</p><div><span>Laravel</span><span>Vue.js</span><span>Python</span><span>Flutter</span><span>WordPress</span><span>REST APIs</span></div></section>

      <section className="section services" id="services">
        <div className="section-heading"><div><p className="kicker">WHAT WE DO</p><h2>From first idea to<br />working product.</h2></div><p>We combine product thinking, thoughtful design, and dependable engineering to create software that earns its place in your business.</p></div>
        <div className="services-grid">{services.map((s) => <article className="service-card" key={s.n}><span className="service-number">{s.n}</span><div className="service-icon" aria-hidden="true">{s.n === '01' ? '⌘' : s.n === '02' ? '{ }' : s.n === '03' ? '▯' : '◇'}</div><h3>{s.title}</h3><p>{s.text}</p><div className="tags">{s.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></article>)}</div>
      </section>

      <section className="section work" id="work">
        <div className="section-heading"><div><p className="kicker">SELECTED WORK</p><h2>Products made for<br />the real world.</h2></div><p>Our work spans operational platforms, customer-facing experiences, and useful digital products. Every project starts with a problem worth solving.</p></div>
        <div className="project-grid">{projects.map((p) => <article className={`project-card ${p.tone}`} key={p.title}><div className="project-art" aria-hidden="true"><span className={`project-glyph ${p.glyph}`}>{p.glyph === 'cbr' ? 'CBR' : p.glyph === 'menu' ? '01 / 06' : '↗'}</span><i /><b /></div><div className="project-copy"><small>{p.kind}</small><h3>{p.title}</h3><p>{p.text}</p><span className="project-arrow"><Arrow /></span></div></article>)}</div>
      </section>

      <section className="about" id="about">
        <div className="about-grid"><div><p className="kicker kicker-light">ABOUT ITADBEER</p><h2>Small team.<br />Serious craft.</h2></div><div className="about-copy"><p className="about-lede">Founded in 2023, Itadbeer is an independent software development team built around a simple belief: the best digital products come from close collaboration.</p><p>We stay intentionally focused. You work directly with the people designing and building your product—without layers of account management or vague handoffs. That means clearer decisions, faster feedback, and software with purpose.</p><div className="facts"><div><strong>2023</strong><span>Founded</span></div><div><strong>2–10</strong><span>Focused team</span></div><div><strong>End-to-end</strong><span>Product delivery</span></div></div></div></div>
        <div className="team-strip"><div><span className="avatar avatar-one">ER</span><span className="avatar avatar-two">AA</span></div><p><strong>Led by builders.</strong><br />Developers and designers who care about the details.</p><a href="#contact">Work with our team <Arrow /></a></div>
      </section>

      <section className="section process" id="process">
        <div className="section-heading"><div><p className="kicker">HOW WE WORK</p><h2>Clear from day one.</h2></div><p>No black boxes. No process theatre. Just an open, collaborative path from the first conversation to a product people can rely on.</p></div>
        <div className="process-list">{process.map((step, i) => <article key={step[0]}><span>0{i + 1}</span><h3>{step[0]}</h3><p>{step[1]}</p><i /></article>)}</div>
      </section>

      <section className="cta" id="contact">
        <div className="cta-orbit" aria-hidden="true"><span /><span /></div><p className="kicker kicker-light">HAVE A PROJECT IN MIND?</p><h2>Let&apos;s build something<br />that matters.</h2><p>Tell us what you&apos;re working on. We&apos;ll listen, ask useful questions, and come back with a clear next step.</p><a className="button button-light" href="mailto:edris.qeshm2@gmail.com">Start the conversation <Arrow /></a>
      </section>

      <footer><a className="brand brand-footer" href="#top"><span className="brand-mark">iT</span><span>itadbeer</span></a><p>Powering your business with technology.</p><div><a href="https://www.linkedin.com/company/itadbeer" target="_blank" rel="noreferrer">LinkedIn</a><a href="mailto:edris.qeshm2@gmail.com">Email</a><a href="#top">Back to top ↑</a></div><small>© 2026 Itadbeer. Built with care in Qeshm.</small></footer>
    </main>
  );
}
