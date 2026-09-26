export default function Hero({ hero, layout = 'split' }) {
  if (layout === 'centered') {
    return (
      <section className="hero hero-centered">
        <div className="container hero-centered-inner">
          <h1 className="hero-headline">{hero.headline}</h1>
          <p className="hero-subhead">{hero.subhead}</p>
          <a href={hero.ctaHref} className="btn">
            {hero.ctaLabel}
          </a>
          <img src={hero.image} alt="" className="hero-centered-img" />
        </div>
      </section>
    )
  }

  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <h1 className="hero-headline">{hero.headline}</h1>
          <p className="hero-subhead">{hero.subhead}</p>
          <a href={hero.ctaHref} className="btn">
            {hero.ctaLabel}
          </a>
        </div>
        <div className="hero-media">
          <div className="hero-media-panel" aria-hidden="true" />
          <img src={hero.image} alt="" className="hero-media-img" />
        </div>
      </div>
    </section>
  )
}
