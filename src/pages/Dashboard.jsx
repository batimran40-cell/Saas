import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { useAuth } from '../context/AuthContext.jsx'
import defaultConfig from '../config/defaultConfig.js'
import StorefrontPage from '../components/StorefrontPage.jsx'

function slugFromUser(user) {
  const base = user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
  return `${base || 'shop'}-${user.id.slice(0, 6)}`
}

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [shopId, setShopId] = useState(null)
  const [slug, setSlug] = useState('')
  const [config, setConfig] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | saving | saved | error
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function loadOrCreateShop() {
      const { data: existing, error: fetchError } = await supabase
        .from('shops')
        .select('id, slug, config')
        .eq('owner_id', user.id)
        .maybeSingle()

      if (cancelled) return

      if (fetchError) {
        setError(fetchError.message)
        setStatus('error')
        return
      }

      if (existing) {
        setShopId(existing.id)
        setSlug(existing.slug)
        setConfig(existing.config)
        setStatus('ready')
        return
      }

      const newSlug = slugFromUser(user)
      const newConfig = defaultConfig()
      const { data: created, error: insertError } = await supabase
        .from('shops')
        .insert({ owner_id: user.id, slug: newSlug, config: newConfig })
        .select('id, slug, config')
        .single()

      if (cancelled) return

      if (insertError) {
        setError(insertError.message)
        setStatus('error')
        return
      }

      setShopId(created.id)
      setSlug(created.slug)
      setConfig(created.config)
      setStatus('ready')
    }
    loadOrCreateShop()
    return () => {
      cancelled = true
    }
  }, [user])

  function updateField(section, field, value) {
    setConfig((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }))
  }

  function updateArrayItem(section, index, field, value) {
    setConfig((prev) => {
      const list = [...prev[section]]
      list[index] = { ...list[index], [field]: value }
      return { ...prev, [section]: list }
    })
  }

  function addArrayItem(section, template) {
    setConfig((prev) => ({ ...prev, [section]: [...prev[section], template] }))
  }

  function removeArrayItem(section, index) {
    setConfig((prev) => {
      const list = [...prev[section]]
      list.splice(index, 1)
      return { ...prev, [section]: list }
    })
  }

  async function handleSave(e) {
    e.preventDefault()
    setStatus('saving')
    const { error: updateError } = await supabase
      .from('shops')
      .update({ slug, config })
      .eq('id', shopId)
    if (updateError) {
      setError(updateError.message)
      setStatus('error')
      return
    }
    setStatus('saved')
    setTimeout(() => setStatus('ready'), 1500)
  }

  if (status === 'loading') return <div className="page-message">Loading your shop…</div>
  if (status === 'error') return <div className="page-message">Something went wrong: {error}</div>

  return (
    <div className="dashboard">
      <div className="dashboard-topbar">
        <span className="header-brand">{config.brand.name}</span>
        <div className="dashboard-topbar-actions">
          <a href={`/site/${slug}`} target="_blank" rel="noreferrer" className="btn btn-outline">
            View live site
          </a>
          <button className="btn btn-outline" onClick={signOut}>
            Log out
          </button>
        </div>
      </div>

      <div className="dashboard-body">
        <form className="dashboard-form" onSubmit={handleSave}>
          <section className="dash-section">
            <h2>Site address</h2>
            <label>
              yourdomain.com/site/
              <input value={slug} onChange={(e) => setSlug(e.target.value.trim())} required />
            </label>
          </section>

          <section className="dash-section">
            <h2>Brand</h2>
            <label>
              Shop name
              <input value={config.brand.name} onChange={(e) => updateField('brand', 'name', e.target.value)} />
            </label>
            <label>
              Logo letter
              <input
                value={config.brand.logoInitial}
                maxLength={2}
                onChange={(e) => updateField('brand', 'logoInitial', e.target.value)}
              />
            </label>
            <label>
              Accent color
              <input
                type="color"
                value={config.theme.accent}
                onChange={(e) => updateField('theme', 'accent', e.target.value)}
              />
            </label>
          </section>

          <section className="dash-section">
            <h2>Hero</h2>
            <label>
              Headline
              <input value={config.hero.headline} onChange={(e) => updateField('hero', 'headline', e.target.value)} />
            </label>
            <label>
              Subheading
              <textarea
                value={config.hero.subhead}
                onChange={(e) => updateField('hero', 'subhead', e.target.value)}
              />
            </label>
            <label>
              Button text
              <input
                value={config.hero.ctaLabel}
                onChange={(e) => updateField('hero', 'ctaLabel', e.target.value)}
              />
            </label>
            <label>
              Image URL
              <input value={config.hero.image} onChange={(e) => updateField('hero', 'image', e.target.value)} />
            </label>
          </section>

          <section className="dash-section">
            <h2>Categories</h2>
            {config.categories.map((cat, i) => (
              <div className="array-row" key={i}>
                <input
                  placeholder="Name"
                  value={cat.name}
                  onChange={(e) => updateArrayItem('categories', i, 'name', e.target.value)}
                />
                <input
                  placeholder="Image URL"
                  value={cat.image}
                  onChange={(e) => updateArrayItem('categories', i, 'image', e.target.value)}
                />
                <button type="button" className="array-remove" onClick={() => removeArrayItem('categories', i)}>
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline"
              onClick={() =>
                addArrayItem('categories', { name: 'New category', image: '', href: '#', size: 'small' })
              }
            >
              Add category
            </button>
          </section>

          <section className="dash-section">
            <h2>Products</h2>
            {config.products.map((p, i) => (
              <div className="array-row array-row-product" key={i}>
                <input
                  placeholder="Name"
                  value={p.name}
                  onChange={(e) => updateArrayItem('products', i, 'name', e.target.value)}
                />
                <input
                  placeholder="Price"
                  value={p.price}
                  onChange={(e) => updateArrayItem('products', i, 'price', e.target.value)}
                />
                <input
                  placeholder="Image URL"
                  value={p.image}
                  onChange={(e) => updateArrayItem('products', i, 'image', e.target.value)}
                />
                <button type="button" className="array-remove" onClick={() => removeArrayItem('products', i)}>
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => addArrayItem('products', { name: 'New product', price: '$0', tag: null, image: '' })}
            >
              Add product
            </button>
          </section>

          <section className="dash-section">
            <h2>About</h2>
            <label>
              Heading
              <input value={config.about.heading} onChange={(e) => updateField('about', 'heading', e.target.value)} />
            </label>
            <label>
              Body text
              <textarea value={config.about.body} onChange={(e) => updateField('about', 'body', e.target.value)} />
            </label>
            <label>
              Image URL
              <input value={config.about.image} onChange={(e) => updateField('about', 'image', e.target.value)} />
            </label>
          </section>

          <section className="dash-section">
            <h2>Testimonial</h2>
            <label>
              Quote
              <textarea
                value={config.testimonial.quote}
                onChange={(e) => updateField('testimonial', 'quote', e.target.value)}
              />
            </label>
            <label>
              Customer name
              <input
                value={config.testimonial.author}
                onChange={(e) => updateField('testimonial', 'author', e.target.value)}
              />
            </label>
          </section>

          <button className="btn dashboard-save" type="submit" disabled={status === 'saving'}>
            {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved ✓' : 'Save changes'}
          </button>
        </form>

        <div className="dashboard-preview">
          <span className="dashboard-preview-label">Live preview</span>
          <div className="preview-frame">
            <div className="preview-scale">
              <StorefrontPage config={config} scoped />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
