export default function Products({ products }) {
  return (
    <section id="products" className="section section-alt">
      <div className="container">
        <h2 className="section-heading">New this season</h2>
        <div className="product-grid">
          {products.map((p) => (
            <div key={p.name} className="product-card">
              <div className="product-media">
                <img src={p.image} alt="" />
                {p.tag && <span className="product-tag">{p.tag}</span>}
              </div>
              <div className="product-info">
                <span className="product-name">{p.name}</span>
                <span className="product-price">{p.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
