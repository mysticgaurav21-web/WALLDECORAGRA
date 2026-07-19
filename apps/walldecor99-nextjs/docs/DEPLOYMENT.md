# Deployment Guide

## 1. Local verification

```bash
npm install
cp .env.example .env.local
npm run lint
npm run build
npm run dev
```

## 2. Supabase

1. Create a Supabase project.
2. Run `supabase/migrations/202607190001_initial_schema.sql`.
3. Review and run `supabase/seed.sql`.
4. Create storage buckets:
   - `product-images` — public read, admin write
   - `template-assets` — public read, designer/admin write
   - `customer-uploads` — private
   - `generated-previews` — private
   - `documents` — private
5. Add the project URL and publishable key to Vercel.
6. Add the secret key only to server-side Vercel environment variables.

## 3. Vercel

1. Push the source folder to a GitHub repository.
2. Import the repository into Vercel.
3. Framework preset: Next.js.
4. Build command: `npm run build`.
5. Add all `.env.example` values under project environment settings.
6. Set `NEXT_PUBLIC_SITE_URL` to the production domain.

## 4. Payments

1. Complete Razorpay account/KYC setup.
2. Create orders only in a server route using the server-calculated amount.
3. Open Standard Checkout from the client with the returned Razorpay order ID.
4. Verify payment signatures server-side.
5. Configure a webhook and update the internal order only after verified provider events.
6. Keep COD eligibility and custom-order advance rules on the server.

## 5. WhatsApp

Replace the placeholder `NEXT_PUBLIC_WHATSAPP_NUMBER` with the international-format business number without `+`, spaces or dashes.

## 6. Production launch gate

- Confirm GST and invoice configuration with the business accountant.
- Publish legal policies and custom-product approval terms.
- Test payment webhooks in test and live modes.
- Test private upload RLS and signed URLs.
- Add rate limiting and abuse protection.
- Run mobile E2E tests on common Android screen sizes.
