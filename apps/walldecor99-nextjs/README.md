# WallDecor99 Web Application

A premium, mobile-first Next.js starter for ready-roll wallpaper sales, custom wallpaper pricing, image-quality checking, room visualization, cart, checkout, quotations and an admin dashboard.

## Included working screens

- Premium responsive homepage
- Searchable/filterable wallpaper catalogue
- Dynamic product detail routes
- Pattern-repeat-aware roll calculator
- Guided custom wallpaper flow
- Browser image dimension and effective-DPI check
- Material-based price estimate
- Manual-mask room visualizer demo
- Persistent local cart
- Multi-step checkout interface
- Printable quotation demo
- Admin dashboard starter
- Calculator and quotation API route handlers
- Supabase PostgreSQL migration with RLS starter policies

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Validate production build

```bash
npm run lint
npm run build
npm start
```

## Environment variables

See `.env.example`. Never expose `SUPABASE_SECRET_KEY`, Razorpay secrets or Cloudinary secrets in browser code.

## Technology

- Next.js 16 App Router
- React 19
- TypeScript strict mode
- Tailwind CSS 4 plus project design tokens
- Supabase/PostgreSQL-ready data model
- Razorpay-ready checkout boundary

## Important integration notes

The project intentionally does not fake live payment, authentication or database connectivity. The interfaces and database design are present; live integrations require your Supabase project, storage buckets, payment account, WhatsApp number and deployment environment values.

Apply `supabase/migrations/202607190001_initial_schema.sql` only after reviewing your GST, legal, order-status and data-retention requirements.

See `docs/ARCHITECTURE.md` for the system design and hardening checklist.
