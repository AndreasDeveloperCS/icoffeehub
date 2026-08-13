# iCoffeeHub.com

A global coffee marketplace, encyclopedia and AI assistant — built from the `iCoffeeHub_Documentation_Package/`
business and product docs.

**Stack:** Next.js 14 (App Router, TypeScript, Tailwind) · NestJS 10 (TypeScript) · MongoDB (Mongoose) · JWT auth.

This started as an end-to-end pass across every module in the spec and has since been deepened with real workflows
for commerce, fulfillment and trust/support — see **What's implemented** below for the full feature list and
**Scope & simplifications** for what's intentionally thin.

## Project layout

```
backend/    NestJS API (MongoDB via Mongoose)
frontend/   Next.js app (customer site, seller portal, admin portal)
iCoffeeHub_Documentation_Package/   Source business/product docs (unchanged)
```

## Prerequisites

- Node.js 18+
- A MongoDB connection string (Atlas or local). The backend `.env` is already pointed at the Atlas cluster provided
  during setup — **if the seed script or API can't connect, check that your current IP is allowed in Atlas
  Network Access** (Atlas → Network Access → Add IP Address). Outbound access to MongoDB's port (27017) must also
  be permitted by your network/firewall.

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # already pre-filled with the Atlas URI for this project — edit if needed
npm run seed            # populates countries, an admin user, sample sellers/products/articles
npm run start:dev       # http://localhost:4000/api
```

Seeded accounts (see `src/database/seed.ts`):

- Admin: `admin@icoffeehub.com` / `Admin123!`
- Sellers: `seller1@icoffeehub.com` / `seller2@icoffeehub.com`, password `Seller123!`

The seed also creates two coupons (`WELCOME10`, `FREESHIP`), three shipping carriers (DHL/FedEx/UPS), and sets a
12% commission rate on the sample sellers for payout generation.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL, defaults to http://localhost:4000/api
npm run dev              # http://localhost:3000
```

Run backend and frontend in separate terminals; the frontend expects the API at `NEXT_PUBLIC_API_URL`.

## Golden path to verify manually

1. Visit `/register`, create a customer account.
2. Browse `/marketplace`, filter by origin/roast/process, open a product. Save it to your wishlist and to a
   collection, and leave a tasting journal note.
3. Add to cart, go to `/checkout`, apply coupon `WELCOME10`, fill in a shipping address using a country the seeded
   sellers deliver to (US, GB, DE, or ET), place the order (payment is simulated).
4. Sign in as `seller1@icoffeehub.com`, visit `/seller`: add a product, set delivery zones, mark the new order
   shipped under **Orders** (pick a carrier and tracking number), check **Payouts**.
5. Back as the customer, open the order under `/account/orders`, confirm the tracking timeline shows the shipment,
   request a return on an item, and file a dispute.
6. Sign in as `admin@icoffeehub.com`, visit `/admin`: approve/reject pending sellers and products, moderate reviews,
   publish an article under **Articles (CMS)**, resolve the dispute, reply to a support ticket, generate a seller
   payout under **Seller Payouts**, and check the **Audit Log** for the actions taken.
7. Take the taste quiz at `/ai-assistant` (signed in), check recommendations, then switch to **Ask a Question** and
   try "why is my coffee bitter?".
8. Check `/sitemap.xml` and `/robots.txt`, and view page source on a product/article/country page to confirm the
   `<title>`/meta description reflect that item's SEO fields.

## What's implemented

- **Identity & roles** — JWT auth, customer/seller/admin roles, profile/address management.
- **Catalog** — origin/farm/roast/process/flavor-note product data, seller-scoped CRUD with moderation, Mongo
  text search + filters, SEO title/description per product.
- **Sellers** — self-service onboarding, admin approval queue, company profile, delivery zones.
- **Orders & payments** — cart, multi-seller checkout, coupon codes, mock payment provider, invoices.
- **Fulfillment** — carriers, per-seller shipments, tracking event timeline, customer-facing order tracking.
- **Returns & disputes** — customer return requests with seller approval/refund workflow, order disputes with
  admin resolution.
- **Support** — customer support tickets with threaded replies, admin queue.
- **Payouts** — commission-based seller payout generation and admin mark-as-paid.
- **Reviews** — ratings tied to products, admin moderation, aggregate rating recompute.
- **Content/CMS** — admin-authored articles (encyclopedia/country/brew guide/news/course/etc.), country pages.
- **AI assistant** — taste-quiz-driven product recommendations plus a rule-based conversational chat
  (brewing troubleshooting, equipment advice, origin guidance).
- **Collections & wishlist** — curated, optionally-public product lists; per-user wishlist.
- **Subscriptions** — plans and subscribe/cancel flow.
- **Notifications** — in-app notifications on order/seller/shipping/return events.
- **Admin** — dashboard stats, moderation queues, audit log of admin/seller actions.
- **SEO** — per-page metadata, `sitemap.xml`, `robots.txt`.

## Scope & simplifications

The source docs describe a 150+ entity schema (many of them unnamed `AttributeLookupNN` placeholders with no
real fields defined — skipped as busywork), 600 user stories, and a full microservices/OpenSearch/Stripe
architecture. This build intentionally simplifies infrastructure choices while keeping business logic real:

- **Database:** MongoDB/Mongoose throughout (per explicit instruction), not the Postgres+OpenSearch split doc 04
  suggests. Search is Mongo text index + filters, not OpenSearch.
- **Lookup data** (flavor notes, roast levels, processing methods) are TypeScript enums/constants, not separate
  DB collections.
- **Payments** use a mock provider (`backend/src/modules/orders/payments/mock-payment.provider.ts`) that marks
  orders paid immediately, behind an interface so Stripe/PayPal can be swapped in later.
- **Content types** (bean/farm/roaster/coffee shop/course/news/brew guide) are unified into one `Article` model
  with a `type` field rather than a dozen near-duplicate schemas.
- **AI recommendations and chat** are rule-based (`backend/src/modules/ai/ai.service.ts`), not embeddings/LLM —
  doc 15's smarter scorer/model can replace `score()`/`buildReply()` without touching callers or persistence.
- **Shipping rates** are flat per seller/country (`DeliveryZone`), not live carrier-rate APIs; carriers and
  tracking events are recorded but not polled from a real carrier API.
- Subscriptions have no recurring billing engine (no cron-driven renewal charge), and notifications are in-app
  only — no real email/SMS delivery.
- No i18n/content-translation layer, no OpenSearch faceting, no developer/webhook platform (`ApiClient`,
  `WebhookEvent`) — out of scope for this pass.

## What's not yet verified

The backend could not be seeded or connected to MongoDB Atlas from this build environment
(`MongooseServerSelectionError` — Atlas reports the IP is not on the Network Access allowlist, or outbound
port 27017 is blocked by the local network). Both `backend` and `frontend` build cleanly, but the full
browser golden path above has not been run end-to-end here — please run `npm run seed` and `npm run start:dev`
locally to confirm Atlas connectivity, then work through the golden path.
