export default function Testimonial({ testimonial }) {
  return (
    <section className="section section-alt testimonial">
      <div className="container testimonial-inner">
        <p className="testimonial-quote">&ldquo;{testimonial.quote}&rdquo;</p>
        <p className="testimonial-attribution">
          {testimonial.author} — {testimonial.role}
        </p>
      </div>
    </section>
  )
}
