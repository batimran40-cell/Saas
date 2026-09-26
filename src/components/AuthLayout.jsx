export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-split">
      <div className="auth-split-brand">
        <span className="header-brand auth-split-logo">
          <span className="header-mark">S</span>
          Shopfront
        </span>
        <h2 className="auth-split-tagline">{title}</h2>
        <p className="auth-split-sub">{subtitle}</p>
      </div>
      <div className="auth-split-form">
        <div className="auth-card">{children}</div>
      </div>
    </div>
  )
}
