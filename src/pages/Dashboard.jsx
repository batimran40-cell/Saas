import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'
import { useAuth } from '../context/AuthContext.jsx'
import StorefrontPage from '../components/StorefrontPage.jsx'
import ImageUploadField from '../components/ImageUploadField.jsx'
import Analytics from '../components/Analytics.jsx'
import Orders from '../components/Orders.jsx'
import themePresets from '../config/themePresets.js'

export default function Dashboard() {
  const { shopId } = useParams()
  const { signOut } = useAuth()
  const [slug, setSlug] = useState('')
  const [config, setConfig] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | saving | saved | error
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('edit') // edit | orders | analytics
  const [payments, setPayments] = useState({ accountId: null, onboarded: false, busy: false, error: null })

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data, error } = await supabase
        .from('shops')
        .select('slug, config, stripe_account_id, stripe_onboarded')
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
      setPayments((p) => ({ ...p, accountId: data.stripe_account_id, onboarded: data.stripe_onboarded }))
      setStatus('ready')
    }
    load()
    return () => {
      cancelled = true
    }
  }, [shopId])

  async function handleConnectStripe() {
    setPayments((p) => ({ ...p, busy: true, error: null }))
    const { data, error } = await supabase.functions.invoke('create-connect-account', {
      body: { shopId, returnUrl: window.location.href },
    })
    if (error || data?.error) {
      setPayments((p) => ({ ...p, busy: false, error: data?.error || error.message }))
      return
    }
    window.location.href = data.url
  }

  async function handleCheckStripeStatus() {
    setPayments((p) => ({ ...p, busy: true, error: null }))
    const { data, error } = await supabase.functions.invoke('connect-status', { body: { shopId } })
    if (error || data?.error) {
      setPayments((p) => ({ ...p, busy: false, error: data?.error || error.message }))
      return
    }
    setPayments((p) => ({ ...p, busy: false, onboarded: data.onboarded }))
  }

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
        <button className={tab === 'orders' ? 'is-active' : ''} onClick={() => setTab('orders')}>
          Orders
        </button>
        <button className={tab === 'analytics' ? 'is-active' : ''} onClick={() => setTab('analytics')}>
          Analytics
        </button>
      </div>

      {tab === 'analytics' ? (
        <div className="container">
          <Analytics shopId={shopId} />
        </div>
      ) : tab === 'orders' ? (
        <div className="container">
          <Orders shopId={shopId} />
        </div>
      ) : (
        <div className="dashboard-body dashboard-body-with-nav">
          <nav className="dashboard-nav">
            <a href="#sec-payments">Payments</a>
            <a href="#sec-address">Site address</a>
            <a href="#sec-brand">Brand & design</a>
            <a href="#sec-hero">Hero</a>
            <a href="#sec-categories">Categories</a>
            <a href="#sec-products">Products</a>
            <a href="#sec-about">About</a>
            <a href="#sec-testimonial">Testimonial</a>
            <a href="#sec-newsletter">Newsletter</a>
            <a href="#sec-footer">Footer</a>
          </nav>
          <form className="dashboard-form" onSubmit={handleSave}>
            <section className="dash-section" id="sec-payments">
              <h2>Payments</h2>
              {payments.onboarded ? (
                <p className="payments-status payments-status-ready">✓ Payments are set up — you can sell.</p>
              ) : payments.accountId ? (
                <>
                  <p className="payments-status">Stripe account started, but onboarding isn't finished yet.</p>
                  <div className="layout-toggle">
                    <button type="button" className="btn btn-outline" onClick={handleConnectStripe} disabled={payments.busy}>
                      Finish onboarding
                    </button>
                    <button type="button" className="btn btn-outline" onClick={handleCheckStripeStatus} disabled={payments.busy}>
                      I've finished — check status
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="payments-status">Connect Stripe to start accepting real payments on this shop.</p>
                  <button type="button" className="btn" onClick={handleConnectStripe} disabled={payments.busy}>
                    {payments.busy ? 'Redirecting…' : 'Connect Stripe'}
                  </button>
                </>
              )}
              {payments.error && <p className="auth-error">{payments.error}</p>}
            </section>

            <section className="dash-section" id="sec-address">
              <h2>Site address</h2>
              <label>
                yourdomain.com/site/
                <input value={slug} onChange={(e) => setSlug(e.target.value.trim())} required />
              </label>
            </section>

            <section className="dash-section" id="sec-brand">
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
              <label>Color theme</label>
              <div className="theme-swatches">
                {Object.entries(themePresets).map(([id, preset]) => (
                  <button
                    key={id}
                    type="button"
                    className={`theme-swatch ${
                      (config.theme.preset || 'editorial') === id ? 'is-active' : ''
                    }`}
                    style={{ background: preset.bg, color: preset.ink, borderColor: preset.line }}
                    onClick={() => updateField('theme', 'preset', id)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="dash-section" id="sec-hero">
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

            <section className="dash-section" id="sec-categories">
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

            <section className="dash-section" id="sec-products">
              <h2>Products</h2>
              {config.products.map((p, i) => (
                <div className="array-block" key={i}>
                  <input
                    placeholder="Name"
                    value={p.name}
                    onChange={(e) => updateArrayItem('products', i, 'name', e.target.value)}
                  />
                  <input
                    placeholder="Price in USD, e.g. 34.00"
                    type="number"
                    step="0.01"
                    min="0"
                    value={p.priceCents ? (p.priceCents / 100).toFixed(2) : ''}
                    onChange={(e) => {
                      const dollars = parseFloat(e.target.value) || 0
                      const cents = Math.round(dollars * 100)
                      updateArrayItem('products', i, 'priceCents', cents)
                      updateArrayItem('products', i, 'price', `$${dollars.toFixed(2)}`)
                    }}
                  />
                  <textarea
                    placeholder="Short description (shown in quick-view)"
                    value={p.description || ''}
                    onChange={(e) => updateArrayItem('products', i, 'description', e.target.value)}
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
                onClick={() => addArrayItem('products', { name: 'New product', price: '$0', priceCents: 0, tag: null, image: '', description: '' })}
              >
                Add product
              </button>
            </section>

            <section className="dash-section" id="sec-about">
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

            <section className="dash-section" id="sec-testimonial">
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

            <section className="dash-section" id="sec-newsletter">
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

            <section className="dash-section" id="sec-footer">
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
