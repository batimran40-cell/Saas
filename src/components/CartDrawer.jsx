import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { supabase } from '../lib/supabaseClient.js'
import { formatCents } from '../lib/money.js'

export default function CartDrawer({ shopSlug }) {
  const cart = useCart()
  const [checkingOut, setCheckingOut] = useState(false)
  const [error, setError] = useState(null)

  if (!cart || !cart.isOpen) return null

  async function handleCheckout() {
    setError(null)
    setCheckingOut(true)
    const { data, error: fnError } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        shopSlug,
        items: cart.items.map((i) => ({
          name: i.name,
          priceCents: i.priceCents,
          quantity: i.quantity,
          image: i.image,
        })),
        successUrl: `${window.location.origin}/site/${shopSlug}?checkout=success`,
        cancelUrl: `${window.location.origin}/site/${shopSlug}?checkout=cancelled`,
      },
    })
    setCheckingOut(false)
    if (fnError || data?.error) {
      setError(data?.error || fnError.message)
      return
    }
    window.location.href = data.url
  }

  return (
    <div className="cart-backdrop" onClick={() => cart.setIsOpen(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <span>Your cart</span>
          <button onClick={() => cart.setIsOpen(false)} aria-label="Close">
            ×
          </button>
        </div>

        {cart.items.length === 0 ? (
          <p className="cart-empty">Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.items.map((item) => (
                <div className="cart-item" key={item.name}>
                  {item.image && <img src={item.image} alt="" />}
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.name}</span>
                    <span className="cart-item-price">{formatCents(item.priceCents)}</span>
                    <div className="cart-qty">
                      <button onClick={() => cart.updateQuantity(item.name, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => cart.updateQuantity(item.name, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <button className="cart-item-remove" onClick={() => cart.removeItem(item.name)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-total">
              <span>Total</span>
              <span>{formatCents(cart.totalCents)}</span>
            </div>
            {error && <p className="auth-error">{error}</p>}
            <button className="btn cart-checkout" onClick={handleCheckout} disabled={checkingOut}>
              {checkingOut ? 'Redirecting…' : 'Checkout'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
