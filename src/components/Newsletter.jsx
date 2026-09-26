export default function Newsletter({ newsletter }) {
  return (
    <section className="section newsletter">
      <div className="container newsletter-inner">
        <div>
          <h2 className="section-heading">{newsletter.heading}</h2>
          <p>{newsletter.subhead}</p>
        </div>
        <form
          className="newsletter-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <input type="email" placeholder="Email address" required />
          <button type="submit" className="btn">
            {newsletter.ctaLabel}
          </button>
        </form>
      </div>
    </section>
  )
}
