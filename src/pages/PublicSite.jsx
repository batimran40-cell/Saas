import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'
import StorefrontPage from '../components/StorefrontPage.jsx'

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

      // Fire-and-forget view tracking — never blocks or breaks the page.
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

  return <StorefrontPage config={shop} />
}
