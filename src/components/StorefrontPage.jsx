import { useEffect } from 'react'
import Header from './Header.jsx'
import Hero from './Hero.jsx'
import Categories from './Categories.jsx'
import Products from './Products.jsx'
import About from './About.jsx'
import Testimonial from './Testimonial.jsx'
import Newsletter from './Newsletter.jsx'
import Footer from './Footer.jsx'
import themePresets from '../config/themePresets.js'

function cssVars(config) {
  const preset = themePresets[config.theme.preset] || themePresets.editorial
  return {
    '--accent': config.theme.accent,
    '--accent-soft': config.theme.accentSoft,
    '--bg': preset.bg,
    '--bg-alt': preset.bgAlt,
    '--ink': preset.ink,
    '--ink-soft': preset.inkSoft,
    '--line': preset.line,
  }
}

export default function StorefrontPage({ config, scoped = false }) {
  useEffect(() => {
    if (scoped) return
    const root = document.documentElement
    const vars = cssVars(config)
    Object.entries(vars).forEach(([key, value]) => root.style.setProperty(key, value))
  }, [config, scoped])

  const style = scoped ? cssVars(config) : undefined

  return (
    <div style={style} className={scoped ? 'storefront-scoped' : undefined}>
      <Header brand={config.brand} nav={config.nav} />
      <Hero hero={config.hero} layout={config.theme.layout || 'split'} />
      <Categories categories={config.categories} />
      <Products products={config.products} />
      <About about={config.about} />
      <Testimonial testimonial={config.testimonial} />
      <Newsletter newsletter={config.newsletter} />
      <Footer brand={config.brand} footer={config.footer} />
    </div>
  )
}
