# Shop SaaS — dashboard + editable homepage per user

Every signed-up user gets their own shop, editable from a dashboard, and
published at `/site/<their-slug>`. Built with React + Vite on the frontend
and Supabase for auth, the database, and access control.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. Open the **SQL Editor**, paste the contents of `supabase/schema.sql`,
   and run it. This creates the `shops` table and the row-level security
   policies that keep each user's data private except for their public page.
3. Go to **Project Settings -> API** and copy the **Project URL** and the
   **anon public** key.
4. Optional, for faster local testing: go to **Authentication -> Providers
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

- `supabase/schema.sql` — the one `shops` table: `owner_id`, a unique
  `slug`, and a `config` JSON column holding all page content.
- `src/context/AuthContext.jsx` — tracks the logged-in user everywhere.
- `src/pages/Dashboard.jsx` — loads (or creates) the user's shop row,
  gives them a form to edit it, and saves back to Supabase. Includes a
  live scaled-down preview using the same components as the real page.
- `src/pages/PublicSite.jsx` — the public route (`/site/:slug`), fetched
  with no login required — this is the page a shop's customers see.
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
- **Image uploads**: the dashboard takes image URLs; wiring in Supabase
  Storage would let users upload photos directly instead of pasting links.
- **Billing**: there's no payment/plan gating yet — every account has full
  access. Stripe + a `plan` column on the user or shop row is the usual path.
- **More editable sections**: newsletter and footer copy are stored in
  `config` and rendered already, but the dashboard form doesn't expose
  every field yet (e.g. footer link text) — follow the pattern already
  used for hero/about/products to add more fields.
