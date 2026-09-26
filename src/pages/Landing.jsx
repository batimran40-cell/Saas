import { Link } from 'react-router-dom'
import StorefrontPage from '../components/StorefrontPage.jsx'
import defaultConfig from '../config/defaultConfig.js'

const mockConfig = defaultConfig()
mockConfig.brand.name = 'Aria & Co.'
mockConfig.theme.accent = '#B4791F'
mockConfig.theme.accentSoft = '#EFDCB8'
mockConfig.hero.headline = 'Handmade goods, made simple'
mockConfig.hero.subhead = 'A homepage built for a small shop, edited by its owner in minutes.'

const steps = [
  {
    n: '01',
    title: 'Create your account',
    body: 'Sign up and a homepage is generated for you instantly, ready to edit.',
  },
  {
    n: '02',
    title: 'Make it yours',
    body: 'Change the name, colors, photos, products and copy from a simple dashboard.',
  },
  {
    n: '03',
    title: 'Share your link',
    body: 'Your shop goes live at its own address the moment you hit save.',
  },
]

const features = [
  { title: 'Live preview', body: 'See every change reflected instantly before you publish it.' },
  { title: 'Photo uploads', body: 'Drop in your own product and hero photos, no external hosting needed.' },
  { title: 'Built-in analytics', body: 'Know how many people are actually visiting your page.' },
  { title: 'Multiple shops', body: 'Run more than one storefront from the same account.' },
]

export default function Landing() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="container landing-nav-inner">
          <span className="header-brand">
            <span className="header-mark">S</span>
            Shopfront
          </span>
          <div className="landing-nav-actions">
            <Link to="/login">Log in</Link>
            <Link to="/signup" className="btn">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="container landing-hero-grid">
          <div className="landing-hero-copy">
            <h1 className="hero-headline">Give every shop its own homepage, in minutes</h1>
            <p className="hero-subhead">
              Sign up, and you get a homepage you can edit yourself — your name, your photos, your
              products, your colors. No code, no designer needed.
            </p>
            <div className="landing-actions">
              <Link to="/signup" className="btn">
                Create your shop
              </Link>
              <Link to="/login" className="btn btn-outline">
                Log in
              </Link>
            </div>
          </div>
          <div className="landing-hero-mock">
            <div className="browser-chrome">
              <span className="browser-dot" />
              <span className="browser-dot" />
              <span className="browser-dot" />
              <span className="browser-url">yourshop.com</span>
            </div>
            <div className="browser-content">
              <div className="browser-scale">
                <StorefrontPage config={mockConfig} scoped />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section landing-steps">
        <div className="container">
          <h2 className="section-heading">How it works</h2>
          <div className="steps-grid">
            {steps.map((s) => (
              <div className="step-card" key={s.n}>
                <span className="step-number">{s.n}</span>
                <h3 className="step-title">{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt landing-features">
        <div className="container">
          <h2 className="section-heading">Everything a small shop needs</h2>
          <div className="feature-grid">
            {features.map((f) => (
              <div className="feature-card" key={f.title}>
                <h3 className="step-title">{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section landing-cta">
        <div className="container landing-cta-inner">
          <h2 className="section-heading">Your shop's homepage, ready today</h2>
          <Link to="/signup" className="btn">
            Create your shop
          </Link>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} Shopfront</span>
        </div>
      </footer>
    </div>
  )
}
