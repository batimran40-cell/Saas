import { useCart } from '../context/CartContext.jsx'

export default function Header({ brand, nav }) {
  const cart = useCart()

  return (
    <header className="header">
      <div className="container header-inner">
        <a href="#" className="header-brand">
          <span className="header-mark">{brand.logoInitial}</span>
          {brand.name}
        </a>
        <nav className="header-nav">
          {nav.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        {cart ? (
          <button className="header-cart" onClick={() => cart.setIsOpen(true)} aria-label="Open cart">
            Cart
            {cart.count > 0 && <span className="header-cart-count">{cart.count}</span>}
          </button>
        ) : (
          <a href="#products" className="btn btn-outline header-cta">
            Shop now
          </a>
        )}
      </div>
    </header>
  )
}
