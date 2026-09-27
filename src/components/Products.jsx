import { useState } from 'react'

export default function Products({ products }) {
  const [active, setActive] = useState(null)

  return (
    <section id="products" className="section section-alt">
      <div className="container">
        <h2 className="section-heading">New this season</h2>
        <div className="product-grid">
          {products.map((p) => (
            <button key={p.name} className="product-card" onClick={() => setActive(p)} type="button">
              <div className="product-media">
                <img src={p.image} alt="" />
                {p.tag && <span className="product-tag">{p.tag}</span>}
              </div>
              <div className="product-info">
                <span className="product-name">{p.name}</span>
                <span className="product-price">{p.price}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div className="product-modal-backdrop" onClick={() => setActive(null)}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <button className="product-modal-close" onClick={() => setActive(null)} aria-label="Close">
              ×
            </button>
            <img src={active.image} alt="" className="product-modal-img" />
            <div className="product-modal-info">
              {active.tag && <span className="product-tag">{active.tag}</span>}
              <h3 className="product-modal-name">{active.name}</h3>
              <span className="product-modal-price">{active.price}</span>
              {active.description && <p className="product-modal-desc">{active.description}</p>}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
