import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'

function lastNDays(n) {
  const days = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

export default function Analytics({ shopId }) {
  const [status, setStatus] = useState('loading')
  const [total, setTotal] = useState(0)
  const [byDay, setByDay] = useState({})

  useEffect(() => {
    let cancelled = false
    async function load() {
      const since = new Date()
      since.setDate(since.getDate() - 29)

      const { data, error, count } = await supabase
        .from('page_views')
        .select('created_at', { count: 'exact' })
        .eq('shop_id', shopId)
        .gte('created_at', since.toISOString())

      if (cancelled) return
      if (error) {
        setStatus('error')
        return
      }

      const counts = {}
      for (const row of data) {
        const day = row.created_at.slice(0, 10)
        counts[day] = (counts[day] || 0) + 1
      }
      setByDay(counts)
      setTotal(count ?? data.length)
      setStatus('ready')
    }
    load()
    return () => {
      cancelled = true
    }
  }, [shopId])

  if (status === 'loading') return <p className="page-message">Loading analytics…</p>
  if (status === 'error') return <p className="page-message">Couldn't load analytics.</p>

  const days = lastNDays(14)
  const max = Math.max(1, ...days.map((d) => byDay[d] || 0))

  return (
    <div className="analytics">
      <div className="analytics-total">
        <span className="analytics-total-number">{total}</span>
        <span className="analytics-total-label">views in the last 30 days</span>
      </div>
      <div className="analytics-chart">
        {days.map((day) => {
          const count = byDay[day] || 0
          const height = Math.round((count / max) * 100)
          return (
            <div className="analytics-bar-col" key={day} title={`${day}: ${count} views`}>
              <div className="analytics-bar" style={{ height: `${Math.max(height, 3)}%` }} />
              <span className="analytics-bar-label">{day.slice(5)}</span>
            </div>
          )
        })}
      </div>
      <p className="analytics-note">Last 14 days shown. Views count every visit to your public page.</p>
    </div>
  )
}
