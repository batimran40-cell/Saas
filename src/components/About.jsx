export default function About({ about }) {
  return (
    <section id="about" className="section about">
      <div className="container about-grid">
        <img src={about.image} alt="" className="about-img" />
        <div className="about-copy">
          <h2 className="section-heading">{about.heading}</h2>
          <p>{about.body}</p>
        </div>
      </div>
    </section>
  )
}
