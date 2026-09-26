import { useEffect } from 'react'
import Header from './Header.jsx'
import Hero from './Hero.jsx'
import Categories from './Categories.jsx'
import Products from './Products.jsx'
import About from './About.jsx'
import Testimonial from './Testimonial.jsx'
import Newsletter from './Newsletter.jsx'
import Footer from './Footer.jsx'

export default function StorefrontPage({ config, scoped = false }) {
  const root = scoped ? null : document.documentElement

  useEffect(() => {
    if (!root) return
    root.style.setProperty('--accent', config.theme.accent)
    root.style.setProperty('--accent-soft', config.theme.accentSoft)
  }, [config, root])

  const style = scoped
    ? { '--accent': config.theme.accent, '--accent-soft': config.theme.accentSoft }
    : undefined

  return (
    <div style={style}>
      <Header brand={config.brand} nav={config.nav} />
      <Hero hero={config.hero} />
      <Categories categories={config.categories} />
      <Products products={config.products} />
      <About about={config.about} />
      <Testimonial testimonial={config.testimonial} />
      <Newsletter newsletter={config.newsletter} />
      <Footer brand={config.brand} footer={config.footer} />
    </div>
  )
}
