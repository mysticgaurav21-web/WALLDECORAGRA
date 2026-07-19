# WallDecor99 Next.js Application

The production-ready WallDecor99 starter is stored under:

`apps/walldecor99-nextjs/`

The repository's existing AI Studio application remains unchanged.

## Run locally

```bash
cd apps/walldecor99-nextjs
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Deploy with Vercel

Import this repository into Vercel and set the Root Directory to:

`apps/walldecor99-nextjs`

Add the variables from `.env.example` in Vercel Project Settings before enabling Supabase, Razorpay, Cloudinary, or WhatsApp production integrations.

See the app's `README.md` and `docs/DEPLOYMENT.md` for full setup instructions.
