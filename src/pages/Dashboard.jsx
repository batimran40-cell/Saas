import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'
import { useAuth } from '../context/AuthContext.jsx'
import StorefrontPage from '../components/StorefrontPage.jsx'
import ImageUploadField from '../components/ImageUploadField.jsx'
import Analytics from '../components/Analytics.jsx'

export default function Dashboard() {
  const { shopId } = useParams()
  const { signOut } = useAuth()
  const [slug, setSlug] = useState('')
  const [config, setConfig] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | saving | saved | error
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('edit') // edit | analytics

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data, error } = await supabase
        .from('shops')
        .select('slug, config')
        .eq('id', shopId)
        .single()
      if (cancelled) return
      if (error) {
        setError(error.message)
        setStatus('error')
        return
      }
      setSlug(data.slug)
      setConfig(data.config)
      setStatus('ready')
    }
    load()
    return () => {
      cancelled = true
    }
  }, [shopId])

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

  function updateFooterColumn(index, field, value) {
    setConfig((prev) => {
      const columns = [...prev.footer.columns]
      columns[index] = { ...columns[index], [field]: value }
      return { ...prev, footer: { ...prev.footer, columns } }
    })
  }

  function updateFooterLinks(index, rawText) {
    updateFooterColumn(
      index,
      'links',
      rawText.split(',').map((s) => s.trim()).filter(Boolean),
    )
  }

  function addFooterColumn() {
    setConfig((prev) => ({
      ...prev,
      footer: { ...prev.footer, columns: [...prev.footer.columns, { heading: 'New column', links: [] }] },
    }))
  }

  function removeFooterColumn(index) {
    setConfig((prev) => {
      const columns = [...prev.footer.columns]
      columns.splice(index, 1)
      return { ...prev, footer: { ...prev.footer, columns } }
    })
  }

  async function handleSave(e) {
    e.preventDefault()
    setStatus('saving')
    const { error: updateError } = await supabase.from('shops').update({ slug, config }).eq('id', shopId)
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
        <div className="dashboard-topbar-left">
          <Link to="/dashboard" className="dashboard-back">
            ← All shops
          </Link>
          <span className="header-brand">{config.brand.name}</span>
        </div>
        <div className="dashboard-topbar-actions">
          <a href={`/site/${slug}`} target="_blank" rel="noreferrer" className="btn btn-outline">
            View live site
          </a>
          <button className="btn btn-outline" onClick={signOut}>
            Log out
          </button>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button className={tab === 'edit' ? 'is-active' : ''} onClick={() => setTab('edit')}>
          Edit
        </button>
        <button className={tab === 'analytics' ? 'is-active' : ''} onClick={() => setTab('analytics')}>
          Analytics
        </button>
      </div>

      {tab === 'analytics' ? (
        <div className="container">
          <Analytics shopId={shopId} />
        </div>
      ) : (
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
              <h2>Brand & design</h2>
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
              <label>Hero layout</label>
              <div className="layout-toggle">
                <button
                  type="button"
                  className={(config.theme.layout || 'split') === 'split' ? 'is-active' : ''}
                  onClick={() => updateField('theme', 'layout', 'split')}
                >
                  Split
                </button>
                <button
                  type="button"
                  className={config.theme.layout === 'centered' ? 'is-active' : ''}
                  onClick={() => updateField('theme', 'layout', 'centered')}
                >
                  Centered
                </button>
              </div>
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
                <input value={config.hero.ctaLabel} onChange={(e) => updateField('hero', 'ctaLabel', e.target.value)} />
              </label>
              <ImageUploadField
                label="Hero image"
                value={config.hero.image}
                onChange={(url) => updateField('hero', 'image', url)}
                pathHint={`${shopId}/hero`}
              />
            </section>

            <section className="dash-section">
              <h2>Categories</h2>
              {config.categories.map((cat, i) => (
                <div className="array-block" key={i}>
                  <input
                    placeholder="Name"
                    value={cat.name}
                    onChange={(e) => updateArrayItem('categories', i, 'name', e.target.value)}
                  />
                  <ImageUploadField
                    value={cat.image}
                    onChange={(url) => updateArrayItem('categories', i, 'image', url)}
                    pathHint={`${shopId}/category-${i}`}
                  />
                  <button type="button" className="array-remove" onClick={() => removeArrayItem('categories', i)}>
                    Remove category
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
                <div className="array-block" key={i}>
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
                  <ImageUploadField
                    value={p.image}
                    onChange={(url) => updateArrayItem('products', i, 'image', url)}
                    pathHint={`${shopId}/product-${i}`}
                  />
                  <button type="button" className="array-remove" onClick={() => removeArrayItem('products', i)}>
                    Remove product
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
              <ImageUploadField
                label="About image"
                value={config.about.image}
                onChange={(url) => updateField('about', 'image', url)}
                pathHint={`${shopId}/about`}
              />
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
              <label>
                Customer role
                <input
                  value={config.testimonial.role}
                  onChange={(e) => updateField('testimonial', 'role', e.target.value)}
                />
              </label>
            </section>

            <section className="dash-section">
              <h2>Newsletter banner</h2>
              <label>
                Heading
                <input
                  value={config.newsletter.heading}
                  onChange={(e) => updateField('newsletter', 'heading', e.target.value)}
                />
              </label>
              <label>
                Subheading
                <input
                  value={config.newsletter.subhead}
                  onChange={(e) => updateField('newsletter', 'subhead', e.target.value)}
                />
              </label>
              <label>
                Button text
                <input
                  value={config.newsletter.ctaLabel}
                  onChange={(e) => updateField('newsletter', 'ctaLabel', e.target.value)}
                />
              </label>
            </section>

            <section className="dash-section">
              <h2>Footer</h2>
              {config.footer.columns.map((col, i) => (
                <div className="array-block" key={i}>
                  <input
                    placeholder="Column heading"
                    value={col.heading}
                    onChange={(e) => updateFooterColumn(i, 'heading', e.target.value)}
                  />
                  <input
                    placeholder="Links, comma separated"
                    value={col.links.join(', ')}
                    onChange={(e) => updateFooterLinks(i, e.target.value)}
                  />
                  <button type="button" className="array-remove" onClick={() => removeFooterColumn(i)}>
                    Remove column
                  </button>
                </div>
              ))}
              <button type="button" className="btn btn-outline" onClick={addFooterColumn}>
                Add footer column
              </button>
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
      )}
    </div>
  )
}
