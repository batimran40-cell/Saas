export default function Header({ brand, nav }) {
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
        <a href="#products" className="btn btn-outline header-cta">
          Shop now
        </a>
      </div>
    </header>
  )
}
