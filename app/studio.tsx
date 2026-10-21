import { content, type Locale } from './content';
import { siteUrl } from './site-metadata';

function Arrow() { return <span className="direction-arrow" aria-hidden="true">↗</span>; }

export default function Studio({ locale }: { locale: Locale }) {
  const t = content[locale];
  const number = (value: number) => new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en', { minimumIntegerDigits: 2 }).format(value);
  const projectStyles = [['project-blue', 'cbr', 'CBR'], ['project-lime', 'menu', locale === 'fa' ? '۰۱ / ۰۶' : '01 / 06'], ['project-ink', 'chart', '↗']];
  const structuredData = {
    '@context': 'https://schema.org', '@type': 'Organization', '@id': `${siteUrl}/#organization`,
    name: 'Itadbeer', alternateName: 'آی‌تدبیر', url: siteUrl,
    logo: `${siteUrl}/itadbeer-logo-dark.png`, foundingDate: '2023',
    description: t.description, email: 'edris.qeshm2@gmail.com',
    sameAs: ['https://t.me/edicodes_pv'], knowsLanguage: ['en', 'fa'],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <a className="skip-link" href="#main-content">{t.skip}</a>
      <header>
        <nav className="nav-shell" aria-label={t.navLabel}>
          <a className="logo-lockup" href="#top" aria-label={t.home}><img src="/itadbeer-wordmark-330.webp" srcSet="/itadbeer-wordmark-165.webp 165w, /itadbeer-wordmark-330.webp 330w" sizes="(max-width: 600px) 115px, 165px" alt={t.brand} width="330" height="85" fetchPriority="high" /></a>
          <div className="nav-links">{['services', 'work', 'about', 'process'].map((id, i) => <a href={`#${id}`} key={id}>{t.nav[i]}</a>)}</div>
          <div className="nav-actions"><a className="language-switch" href={locale === 'en' ? '/fa' : '/'} hrefLang={locale === 'en' ? 'fa' : 'en'} lang={locale === 'en' ? 'fa' : 'en'} dir={locale === 'en' ? 'rtl' : 'ltr'} aria-label={locale === 'en' ? 'مشاهده سایت به فارسی' : 'View website in English'}>{locale === 'en' ? 'فارسی' : 'English'}</a><a className="button button-small" href="#contact">{t.start}</a></div>
        </nav>
      </header>
      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">{t.title}</h1>
            <p className="hero-lede">{t.lede}</p>
            <div className="hero-actions"><a className="button" href="#contact">{t.tell} <Arrow /></a><a className="text-link" href="#work">{t.explore} <span aria-hidden="true">↓</span></a></div>
          </div>
          <div className="hero-visual" role="img" aria-label={t.visual}>
            <div className="business-window" aria-hidden="true">
              <div className="business-bar"><span className="business-logo" dir="ltr">iT</span><div><small>{t.digital}</small><b>{t.impact}</b></div><span className="live-pill"><i />{t.onTrack}</span></div>
              <div className="journey">{t.journey.map((step, i) => <div key={step}><div className={`journey-step ${i === 0 ? 'complete' : i === 1 ? 'active' : ''}`}><span>{i === 0 ? '✓' : number(i + 1)}</span><div><small>{t.steps[i]}</small><b>{step}</b></div></div>{i < 2 && <i className={`journey-line ${i === 0 ? 'complete-line' : ''}`} />}</div>)}</div>
              <div className="business-outcome"><div><small>{t.get}</small><strong>{t.outcome}</strong></div><span className="outcome-arrow"><Arrow /></span></div>
            </div>
            <div className="signal-card" aria-hidden="true"><span className="signal-dot" /><div><small>{t.partnership}</small><b>{t.clear}</b></div><strong className="direction-arrow">→</strong></div>
            <div className="orbit orbit-one" aria-hidden="true" /><div className="orbit orbit-two" aria-hidden="true" />
          </div>
        </section>
        <section className="section services" id="services" aria-labelledby="services-title">
          <div className="section-heading"><div><p className="kicker">{t.servicesKicker}</p><h2 id="services-title">{t.servicesTitle}</h2></div><p>{t.servicesIntro}</p></div>
          <div className="services-grid">{t.services.map(([title, text], i) => <article className="service-card" key={title}><span className="service-number">{number(i + 1)}</span><div className="service-icon" aria-hidden="true">{['⌘', '{ }', '▯', '◇'][i]}</div><h3>{title}</h3><p>{text}</p></article>)}</div>
        </section>
        <section className="section work" id="work" aria-labelledby="work-title">
          <div className="section-heading"><div><p className="kicker">{t.workKicker}</p><h2 id="work-title">{t.workTitle}</h2></div><p>{t.workIntro}</p></div>
          <div className="project-grid">{t.projects.map(([kind, title, text], i) => <article className={`project-card ${projectStyles[i][0]}`} key={title}><div className="project-art" aria-hidden="true"><span className={`project-glyph ${projectStyles[i][1]}`} dir="ltr">{projectStyles[i][2]}</span><i /><b /></div><div className="project-copy"><small>{kind}</small><h3>{title}</h3><p>{text}</p></div></article>)}</div>
        </section>
        <section className="about" id="about" aria-labelledby="about-title">
          <div className="about-grid"><div><p className="kicker kicker-light">{t.aboutKicker}</p><h2 id="about-title">{t.aboutTitle}</h2></div><div className="about-copy"><p className="about-lede">{t.aboutLede}</p><p>{t.aboutText}</p><div className="facts">{t.facts.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></div></div>
          <div className="team-members" aria-label={t.teamLabel}>{t.team.map(([role, name, text], i) => <article key={name}><span className={`avatar avatar-${i === 0 ? 'one' : 'two'}`} aria-hidden="true">{locale === 'en' ? ['ER', 'AA'][i] : ['ار', 'عا'][i]}</span><div><small>{role}</small><h3>{name}</h3><p>{text}</p></div></article>)}<a href="#contact">{t.directly} <Arrow /></a></div>
        </section>
        <section className="section process" id="process" aria-labelledby="process-title">
          <div className="section-heading"><div><p className="kicker">{t.processKicker}</p><h2 id="process-title">{t.processTitle}</h2></div><p>{t.processIntro}</p></div>
          <div className="process-list">{t.process.map(([title, text], i) => <article key={title}><span>{number(i + 1)}</span><h3>{title}</h3><p>{text}</p><i aria-hidden="true" /></article>)}</div>
        </section>
        <section className="cta" id="contact" aria-labelledby="contact-title">
          <div className="cta-orbit" aria-hidden="true"><span /><span /></div><p className="kicker kicker-light">{t.contactKicker}</p><h2 id="contact-title">{t.contactTitle}</h2><p>{t.contactText}</p><div className="contact-actions"><a className="button button-light" href="https://t.me/edicodes_pv" target="_blank" rel="noopener noreferrer">{t.telegram} <Arrow /></a><a className="contact-email" href="mailto:edris.qeshm2@gmail.com">{t.email} <span className="direction-arrow" aria-hidden="true">→</span></a></div>
        </section>
      </main>
      <footer><a className="logo-lockup logo-footer" href="#top" aria-label={t.home}><img src="/itadbeer-wordmark-330.webp" srcSet="/itadbeer-wordmark-165.webp 165w, /itadbeer-wordmark-330.webp 330w" sizes="(max-width: 600px) 115px, 165px" alt={t.brand} width="330" height="85" loading="lazy" decoding="async" /></a><p>{t.tagline}</p><div><a href="#top">{t.top} <span aria-hidden="true">↑</span></a></div><small>{t.copyright}</small></footer>
    </>
  );
}
