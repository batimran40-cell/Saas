# Shop SaaS — dashboard + editable homepage per user

Every signed-up user gets their own shop, editable from a dashboard, and
published at `/site/<their-slug>`. Built with React + Vite on the frontend
and Supabase for auth, the database, and access control.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. Open the **SQL Editor**, paste the contents of `supabase/schema.sql`,
   and run it. This creates the `shops` table and the row-level security
   policies that keep each user's data private except for their public page.
3. Run `supabase/migrations/002_add_features.sql` the same way. This adds:
   analytics tracking (`page_views` table), and a public `shop-images`
   storage bucket with upload policies so each user can only write into
   their own folder.
4. Go to **Project Settings -> API** and copy the **Project URL** and the
   **anon public** key.
5. Optional, for faster local testing: go to **Authentication -> Providers
   -> Email** and turn off "Confirm email," so new accounts can log in
   immediately instead of waiting on a confirmation email.

## 2. Configure the app

```bash
cp .env.example .env.local
```

Paste your Project URL and anon key into `.env.local`.

## 3. Run it

```bash
npm install
npm run dev
```

Visit `/signup` to create an account. A shop is created for you
automatically with placeholder content — the dashboard opens straight
into editing it. Your public page is at `/site/<slug>`, where `<slug>` is
shown and editable at the top of the dashboard.

## 4. Set up real payments (Stripe Connect)

This part can't be done from inside this chat — it needs the Supabase CLI
running on your own computer, since deploying Edge Functions requires an
interactive login. Here's the full path:

1. **Create a Stripe account** at [stripe.com](https://stripe.com) if you
   don't have one. Stay in **test mode** while you're setting this up.
2. **Install the Supabase CLI** and log in:
   ```bash
   npm install -g supabase
   supabase login
   ```
3. **Link this project** to your Supabase project (find your project ref
   in the Supabase dashboard URL, `supabase.com/dashboard/project/<ref>`):
   ```bash
   supabase link --project-ref <your-project-ref>
   ```
4. **Run the new migration** (`003_stripe_connect.sql`) the same way as
   the earlier ones — paste it into the SQL Editor and run it.
5. **Set the secrets your Edge Functions need**. Get your Stripe secret
   key from the Stripe Dashboard -> Developers -> API keys (use the test
   key while testing):
   ```bash
   supabase secrets set STRIPE_SECRET_KEY=sk_test_...
   ```
   The `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` secrets are already
   available to every Edge Function automatically — you don't set those.
6. **Deploy the four functions**:
   ```bash
   supabase functions deploy create-connect-account
   supabase functions deploy connect-status
   supabase functions deploy create-checkout-session
   supabase functions deploy stripe-webhook --no-verify-jwt
   ```
   (`--no-verify-jwt` on the webhook because Stripe calls it directly, not
   through a logged-in user.)
7. **Point Stripe's webhook at your function**: in the Stripe Dashboard ->
   Developers -> Webhooks -> Add endpoint, use the URL Supabase printed
   after deploying `stripe-webhook` (looks like
   `https://<project-ref>.supabase.co/functions/v1/stripe-webhook`), and
   subscribe it to the `checkout.session.completed` event. Stripe will
   show you a signing secret (`whsec_...`) — set it too:
   ```bash
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
   ```

Once that's done: in the dashboard's **Payments** section, a shop owner
clicks **Connect Stripe**, finishes Stripe's short onboarding form, and
comes back marked as ready to sell. Give each product a price in the
**Products** section (a plain dollar amount now, not just display text),
and the storefront will show an **Add to cart** button and a working
checkout that pays that shop owner directly — Stripe's own fees aside,
the platform takes nothing unless you add an `application_fee_amount`
in `create-checkout-session/index.ts` yourself.

**Testing**: use Stripe's test card `4242 4242 4242 4242`, any future
expiry date, and any CVC. Real charges only happen once you switch your
Stripe account (and the `STRIPE_SECRET_KEY` secret) out of test mode.

## How it fits together

- `supabase/schema.sql` — the `shops` table: `owner_id` (not unique — one
  user can own several shops), a unique `slug`, and a `config` JSON column
  holding all page content.
- `supabase/migrations/002_add_features.sql` — `page_views` table for
  analytics, plus the `shop-images` storage bucket and its upload policies.
- `src/context/AuthContext.jsx` — tracks the logged-in user everywhere.
- `src/pages/ShopsList.jsx` — `/dashboard`. Lists every shop the logged-in
  user owns, with a button to create another one.
- `src/pages/Dashboard.jsx` — `/dashboard/:shopId`. The editor for one
  shop: form fields for every section, a live scaled-down preview, an
  Analytics tab, and a hero layout switcher (Split / Centered).
- `src/components/ImageUploadField.jsx` — uploads a file straight to
  Supabase Storage and fills in the resulting public URL; you can also
  just paste a URL directly in the same field.
- `src/components/Analytics.jsx` — reads `page_views` for one shop and
  renders a 14-day bar chart plus a 30-day total.
- `src/pages/PublicSite.jsx` — the public route (`/site/:slug`), fetched
  with no login required, and the one place that records a page view.
  Wraps the page in `CartProvider` and renders `CartDrawer` so visitors
  can actually buy something.
- `src/context/CartContext.jsx` — cart state per shop, kept in
  localStorage in the visitor's own browser (nothing server-side).
- `supabase/functions/` — four Deno Edge Functions: connecting a shop's
  Stripe account, checking its onboarding status, creating a Checkout
  Session that pays that shop directly, and a webhook that records
  completed orders. See "Set up real payments" above to deploy them.
- `src/components/StorefrontPage.jsx` — the actual homepage layout
  (header, hero, categories, products, about, testimonial, newsletter,
  footer), shared by both the dashboard preview and the public page.
- `src/config/defaultConfig.js` — what a brand-new shop starts with.
- `src/config/candles.config.js` / `sneakers.config.js` — the original
  static example configs from the template, kept as design references.

## Where to go next

- **Custom domains**: right now every shop lives at `/site/<slug>` on one
  domain. Real per-shop domains need DNS + a reverse proxy or platform
  support (e.g. Vercel's domain API) — a meaningfully bigger project on
  top of this.
- **Billing**: there's no payment/plan gating yet — every account has full
  access and can create unlimited shops. Stripe + a `plan` column on the
  user or shop row is the usual path, plus a check in `ShopsList.jsx`
  before letting someone create another shop past their plan's limit.
- **More layout variants**: the hero has two layouts (Split / Centered);
  the same `config.theme.layout` pattern can be extended to the
  categories or products sections if you want more visual variety.
- **Richer analytics**: `page_views` currently only counts visits. Adding
  columns like `country` or `device` (filled in from request headers via
  a Supabase Edge Function) would let the Analytics tab break those down.
- **Real social previews**: the meta tags in `PublicSite.jsx` update after
  the page loads in the browser, which works for browser tabs but not for
  crawlers that don't run JavaScript (some link-preview bots on WhatsApp,
  Slack, etc.). True social previews need server-side rendering or a
  pre-render step — a bigger change than this client-only app currently has.
- **Actual selling**: ✅ done — see "Set up real payments" above. Each
  shop owner connects their own Stripe account and receives payments
  directly; `orders` records what was paid. Still missing: refunds,
  shipping/tax calculation, and inventory tracking, all of which Stripe
  Checkout can partially help with (tax) but aren't wired up here.
