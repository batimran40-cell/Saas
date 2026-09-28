import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ shopKey, children }) {
  const storageKey = `cart:${shopKey}`
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items))
    } catch {
      // ignore storage failures (private browsing, quota, etc.)
    }
  }, [items, storageKey])

  function addItem(product) {
    setItems((prev) => {
      const existing = prev.find((i) => i.name === product.name)
      if (existing) {
        return prev.map((i) => (i.name === product.name ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    setIsOpen(true)
  }

  function updateQuantity(name, quantity) {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.name !== name)
        : prev.map((i) => (i.name === name ? { ...i, quantity } : i)),
    )
  }

  function removeItem(name) {
    setItems((prev) => prev.filter((i) => i.name !== name))
  }

  function clear() {
    setItems([])
  }

  const count = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalCents = items.reduce((sum, i) => sum + (i.priceCents || 0) * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clear, count, totalCents, isOpen, setIsOpen }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
