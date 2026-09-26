export default function Categories({ categories }) {
  return (
    <section id="categories" className="section">
      <div className="container">
        <h2 className="section-heading">Shop by collection</h2>
        <div className="cat-grid">
          {categories.map((cat) => (
            <a
              key={cat.name}
              href={cat.href}
              className={`cat-card cat-card-${cat.size}`}
            >
              <img src={cat.image} alt="" />
              <span className="cat-label">{cat.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
