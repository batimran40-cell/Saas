export default function Hero({ hero }) {
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
