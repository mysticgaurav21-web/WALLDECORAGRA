# WallDecor99 Architecture

## Product boundary

This repository is a functional sales-focused starter, not a claim that payment, authentication or AI image processing are already connected. The customer-facing flows work locally with deterministic sample data and local cart persistence. Supabase, storage, Razorpay and production PDF generation are represented by schema, environment contracts and integration boundaries.

## Application layers

1. **Presentation** — Next.js App Router pages and reusable React components.
2. **Client interaction** — Cart context, guided custom studio, browser image inspection and visualizer controls.
3. **Domain logic** — Pure roll-calculation, custom pricing and image-quality functions under `src/lib`.
4. **Server boundary** — Route handlers validate calculator and quotation requests. Production routes should use authenticated server clients and database transactions.
5. **Persistence** — PostgreSQL/Supabase migration under `supabase/migrations` with UUIDs, status enums, pricing snapshots, RLS and audit logs.
6. **Storage** — Separate public catalogue assets from private customer originals and generated previews.
7. **External services** — Razorpay, WhatsApp deep links, Cloudinary/S3 and transactional notifications.

## Main journeys

- `/wallpapers` → `/product/[slug]` → calculator → cart/WhatsApp.
- `/customize` → dimensions → image inspection → material → estimate → cart.
- `/visualizer` → room upload → manual mask preview → enquiry.
- `/cart` → `/checkout` or quotation/WhatsApp.
- `/admin` demonstrates the operational information architecture.

## Production hardening checklist

- Replace sample data with Supabase repository functions and cached server queries.
- Add `@supabase/ssr` browser/server clients using publishable and secret keys.
- Create private storage policies and signed URL helpers.
- Add Zod schemas to all server mutations.
- Create Razorpay orders on the server and mark orders paid only after signature/webhook verification.
- Queue large image transformations and PDF generation outside request-response paths.
- Add file scanning, EXIF removal, size limits and retention jobs.
- Add role/permission helper functions for admin routes and audit sensitive actions.
- Add Playwright E2E, unit tests for calculations and integration tests for payment webhooks.
- Replace demo room mask with a point-based polygon/perspective editor using Konva.js or Fabric.js.

## Roll calculation

The calculator works using vertical drops:

- Pattern-adjusted drop length = ceiling(wall height / repeat) × repeat.
- Drops needed = ceiling(wall width / roll width) × number of walls.
- Drops per roll = floor(roll length / adjusted drop length).
- Minimum rolls = ceiling(total drops / drops per roll).
- Recommended rolls apply the configured safety margin.

This is more reliable than dividing net square footage by nominal roll coverage, but final installer verification remains necessary.

## Image quality

Effective DPI is the minimum of:

- image width pixels / target width inches
- image height pixels / target height inches

The current UI uses practical bands: 150+ excellent, 100–149 good, 72–99 acceptable, 45–71 low and below 45 not recommended. Production policy should be configurable per material and viewing distance.
