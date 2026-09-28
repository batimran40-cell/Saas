import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { formatCents } from '../lib/money.js'

export default function Orders({ shopId }) {
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data, error } = await supabase
        .from('orders')
        .select('id, customer_email, amount_total, currency, status, created_at')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false })
      if (cancelled) return
      if (error) {
        setError(error.message)
        return
      }
      setOrders(data)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [shopId])

  if (error) return <p className="page-message">Couldn't load orders: {error}</p>
  if (!orders) return <p className="page-message">Loading orders…</p>
  if (orders.length === 0) return <p className="page-message">No orders yet.</p>

  return (
    <div className="orders-list">
      {orders.map((o) => (
        <div className="orders-row" key={o.id}>
          <span>{new Date(o.created_at).toLocaleDateString()}</span>
          <span>{o.customer_email || '—'}</span>
          <span>{formatCents(o.amount_total)}</span>
          <span className="orders-status">{o.status}</span>
        </div>
      ))}
    </div>
  )
}
