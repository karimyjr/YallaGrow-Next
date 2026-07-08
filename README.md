# YallaGrow — Next.js Website

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=https://hsalmqrrrtaccjufkslg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
NEXT_PUBLIC_BOOKING_URL=https://calendar.app.google/3WibM5kWvizhnHJt8
```

3. Run locally:
```bash
npm run dev
```

4. Deploy to Vercel:
```bash
npx vercel
```

## Routes
- `/` — Homepage
- `/services` — All services
- `/packages` — Packages & pricing
- `/quiz` — Find My Growth Plan quiz
- `/about` — About YallaGrow
- `/blog` — Blog
- `/careers` — Open positions
- `/contact` — Contact form
- `/affiliate` — Affiliate program
- `/affiliate/dashboard` — Affiliate dashboard
- `/privacy` — Privacy policy
