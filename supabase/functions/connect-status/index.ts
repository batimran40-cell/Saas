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

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization') ?? ''
    const jwt = authHeader.replace('Bearer ', '')
    const { data: userData, error: userError } = await supabase.auth.getUser(jwt)
    if (userError || !userData.user) throw new Error('Not logged in')

    const { shopId } = await req.json()

    const { data: shop, error: shopError } = await supabase
      .from('shops')
      .select('owner_id, stripe_account_id')
      .eq('id', shopId)
      .single()
    if (shopError || !shop) throw new Error('Shop not found')
    if (shop.owner_id !== userData.user.id) throw new Error('This is not your shop')

    if (!shop.stripe_account_id) {
      return new Response(JSON.stringify({ onboarded: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const account = await stripe.accounts.retrieve(shop.stripe_account_id)
    const onboarded = Boolean(account.charges_enabled && account.details_submitted)

    await supabase.from('shops').update({ stripe_onboarded: onboarded }).eq('id', shopId)

    return new Response(JSON.stringify({ onboarded }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
