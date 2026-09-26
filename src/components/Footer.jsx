export default function Footer({ brand, footer }) {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <span className="header-brand footer-brand">
            <span className="header-mark">{brand.logoInitial}</span>
            {brand.name}
          </span>
        </div>
        {footer.columns.map((col) => (
          <div key={col.heading}>
            <span className="footer-col-heading">{col.heading}</span>
            <ul className="footer-links">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {brand.name}</span>
      </div>
    </footer>
  )
}
