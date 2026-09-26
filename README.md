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
