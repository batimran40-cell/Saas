import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' })
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// No platform fee by default — the shop owner keeps 100% minus Stripe's own
// processing fees. To take a cut, add `application_fee_amount` (in cents)
// to the payment_intent_data below.
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { shopSlug, items, successUrl, cancelUrl } = await req.json()
    if (!shopSlug || !Array.isArray(items) || items.length === 0) {
      throw new Error('Missing shopSlug or items')
    }

    const { data: shop, error: shopError } = await supabase
      .from('shops')
      .select('id, stripe_account_id, stripe_onboarded')
      .eq('slug', shopSlug)
      .single()
    if (shopError || !shop) throw new Error('Shop not found')
    if (!shop.stripe_onboarded || !shop.stripe_account_id) {
      throw new Error('This shop is not set up to accept payments yet')
    }

    const line_items = items.map((item: { name: string; priceCents: number; quantity: number; image?: string }) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name, images: item.image ? [item.image] : [] },
        unit_amount: Math.max(0, Math.round(item.priceCents)),
      },
      quantity: item.quantity,
    }))

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: successUrl,
      cancel_url: cancelUrl,
      payment_intent_data: {
        transfer_data: { destination: shop.stripe_account_id },
      },
      metadata: { shop_id: shop.id },
    })

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
