import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'
import StorefrontPage from '../components/StorefrontPage.jsx'
import CartDrawer from '../components/CartDrawer.jsx'
import { CartProvider, useCart } from '../context/CartContext.jsx'

function setMeta(property, content, attr = 'property') {
  if (!content) return
  let tag = document.querySelector(`meta[${attr}="${property}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, property)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function CheckoutBanner() {
  const [params, setParams] = useSearchParams()
  const cart = useCart()
  const checkout = params.get('checkout')

  useEffect(() => {
    if (checkout === 'success' && cart) {
      cart.clear()
    }
  }, [checkout, cart])

  if (!checkout) return null

  return (
    <div className={`checkout-banner ${checkout === 'success' ? 'is-success' : ''}`}>
      {checkout === 'success' ? 'Thank you — your order went through!' : 'Checkout was cancelled — your cart is still here.'}
      <button onClick={() => setParams({})}>×</button>
    </div>
  )
}

export default function PublicSite() {
  const { slug } = useParams()
  const [shop, setShop] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | not-found | error

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data, error } = await supabase
        .from('shops')
        .select('id, config')
        .eq('slug', slug)
        .maybeSingle()
      if (cancelled) return
      if (error) {
        setStatus('error')
        return
      }
      if (!data) {
        setStatus('not-found')
        return
      }
      setShop(data.config)
      setStatus('ready')

      document.title = data.config.brand?.name || 'Shop'
      setMeta('og:title', data.config.brand?.name)
      setMeta('og:description', data.config.hero?.subhead)
      setMeta('og:image', data.config.hero?.image)
      setMeta('theme-color', data.config.theme?.accent, 'name')

      supabase.from('page_views').insert({
        shop_id: data.id,
        path: `/site/${slug}`,
        referrer: document.referrer || null,
      })
    }
    load()
    return () => {
      cancelled = true
    }
  }, [slug])

  if (status === 'loading') return <div className="page-message">Loading…</div>
  if (status === 'not-found') return <div className="page-message">No shop found at this address.</div>
  if (status === 'error') return <div className="page-message">Something went wrong loading this shop.</div>

  return (
    <CartProvider shopKey={slug}>
      <CheckoutBanner />
      <StorefrontPage config={shop} />
      <CartDrawer shopSlug={slug} />
    </CartProvider>
  )
}
