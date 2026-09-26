import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'
import { useAuth } from '../context/AuthContext.jsx'
import defaultConfig from '../config/defaultConfig.js'

function randomSlug() {
  return `shop-${Math.random().toString(36).slice(2, 8)}`
}

export default function ShopsList() {
  const { user, signOut } = useAuth()
  const [shops, setShops] = useState(null)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState(null)

  async function loadShops() {
    const { data, error } = await supabase
      .from('shops')
      .select('id, slug, config')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: true })
    if (error) {
      setError(error.message)
      return
    }
    setShops(data)
  }

  useEffect(() => {
    loadShops()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function handleCreate() {
    setCreating(true)
    const { error } = await supabase.from('shops').insert({
      owner_id: user.id,
      slug: randomSlug(),
      config: defaultConfig(),
    })
    setCreating(false)
    if (error) {
      setError(error.message)
      return
    }
    loadShops()
  }

  if (!shops) return <div className="page-message">Loading your shops…</div>

  return (
    <div className="shops-list">
      <div className="dashboard-topbar">
        <span className="header-brand">Your shops</span>
        <button className="btn btn-outline" onClick={signOut}>
          Log out
        </button>
      </div>

      <div className="container shops-list-body">
        {error && <p className="auth-error">{error}</p>}

        <div className="shops-grid">
          {shops.map((shop) => (
            <Link to={`/dashboard/${shop.id}`} className="shop-card" key={shop.id}>
              <span
                className="shop-card-swatch"
                style={{ background: shop.config.theme?.accent || '#999' }}
              />
              <span className="shop-card-name">{shop.config.brand?.name || 'Untitled shop'}</span>
              <span className="shop-card-slug">/site/{shop.slug}</span>
            </Link>
          ))}

          <button className="shop-card shop-card-new" onClick={handleCreate} disabled={creating}>
            {creating ? 'Creating…' : '+ Create new shop'}
          </button>
        </div>
      </div>
    </div>
  )
}
