# Streamline

> A modern field-service management platform for home service businesses. Built to be simpler, faster, and more focused than Jobber — core operations only, no bloat.

## Overview

Streamline is a full-stack SaaS application purpose-built for contractors, landscapers, hardscapers, and property managers. The hero feature is a **world-class quote builder** with real-time pricing, margin calculations, takeoff measurements, and service catalog integration.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS + shadcn/ui + Radix UI |
| Database | Supabase (Postgres + Auth + RLS + Realtime + Storage) |
| ORM | Drizzle ORM |
| Payments | Stripe |
| Email | Resend |
| PDF | @react-pdf/renderer |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| State | Zustand |
| Icons | Lucide React |
| Toasts | Sonner |
| Theming | next-themes (dark/light, default dark) |

## Features

### Core Operations
- **Dashboard** — Revenue charts, pipeline overview, upcoming jobs, recent activity
- **Quote Builder** (hero feature) — Service catalog picker, line items with takeoff measurements, real-time margin calculations, preview/edit tabs, client & property selector
- **Clients & Properties** — Full CRM with contact details, property management, service history
- **Jobs** — Job scheduling, assignment, status tracking, checklists
- **Invoices** — Invoice generation from quotes/jobs, payment tracking
- **Service Catalog** — Reusable service items with pricing, cost, and categories
- **Calendar** — Visual schedule view
- **Time Tracking** — Clock in/out for field techs
- **Reports** — Revenue, job, and client analytics with Recharts
- **Settings** — Organization profile, team management

### Architecture
- **Multi-tenant isolation** — Every data table has an `org_id` column
- **Row Level Security (RLS)** — 48 policies across 15 tables, enforced on every query
- **Defense in depth** — Server Actions validate `org_id`/`user_id` (never rely on RLS alone)
- **PWA-ready** — Installable progressive web app for techs in the field
- **Mobile-first responsive** — Designed for phones first, scales up beautifully

### UI/UX
- Linear.app + Vercel + Arc levels of polish
- Generous whitespace, subtle animations, perfect typography
- Dark/light mode (default dark)
- Green primary color for home services brand identity

## Database Schema

The migration at `supabase/migrations/0001_initial_schema.sql` includes:

- **15 tables**: organizations, profiles, clients, properties, service_catalog_items, quotes, quote_line_items, jobs, job_assignments, job_checklists, invoices, invoice_line_items, payments, time_entries, activity_log
- **48 RLS policies** with JWT-based auth hooks
- **27 indexes** for query performance
- **12 triggers** for automatic timestamps, activity logging, and status sync

## Getting Started

### Prerequisites
- Node.js 20+
- A Supabase project
- Stripe account (for payments)
- Resend account (for transactional email)

### Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/ddm2024/streamline.git
   cd streamline
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.local.example` to `.env.local` and fill in your keys:
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   STRIPE_SECRET_KEY=
   STRIPE_WEBHOOK_SECRET=
   RESEND_API_KEY=
   DATABASE_URL=
   ```

4. Run the Supabase migration:
   ```bash
   supabase db push
   ```

5. Start the dev server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
streamline/
├── public/
│   └── manifest.json          # PWA manifest
├── src/
│   ├── app/
│   │   ├── (auth)/            # Login, onboarding, callback
│   │   ├── (app)/             # Authenticated app shell
│   │   │   └── dashboard/     # All feature pages
│   │   │       ├── quotes/    # Quote builder (hero feature)
│   │   │       ├── clients/   # Client management
│   │   │       ├── jobs/      # Job tracking
│   │   │       ├── invoices/  # Invoicing
│   │   │       ├── services/  # Service catalog
│   │   │       ├── calendar/  # Schedule view
│   │   │       ├── time/      # Time tracking
│   │   │       ├── reports/   # Analytics
│   │   │       └── settings/  # Org settings
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── layout/            # Sidebar, top bar
│   │   └── providers/         # Theme provider
│   └── lib/
│       ├── db/                # Drizzle schema + client
│       ├── supabase/          # Supabase clients (browser, server, admin)
│       ├── auth/              # Auth helpers
│       ├── validations/       # Zod schemas
│       ├── store.ts           # Zustand store
│       └── utils.ts           # Utility functions
├── supabase/
│   └── migrations/            # SQL migrations with RLS
├── package.json
├── tailwind.config.ts
├── next.config.ts
├── drizzle.config.ts
└── tsconfig.json
```

## License

Private — All rights reserved.

---

Built for [Harvest Operations](https://harvestoperations.com) — DFW-area contracting, landscaping, hardscaping & property management.
