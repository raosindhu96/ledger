# Ledger — Setup Guide

A personal finance tracker with multi-account support, AI categorisation, and optional cloud sync.

---

## Quick deploy (5 minutes)

### 1. Create a Supabase project (free)

1. Go to [supabase.com](https://supabase.com) → New project
2. Give it a name (e.g. "ledger"), set a database password, pick a region close to you
3. Wait ~2 minutes for it to provision

### 2. Run the database schema

1. In your Supabase project → **SQL Editor** → **New query**
2. Paste the contents of `schema.sql`
3. Click **Run**

### 3. Set up Google OAuth (optional but recommended)

1. Go to [console.cloud.google.com](https://console.cloud.google.com) → New project
2. APIs & Services → OAuth consent screen → External → fill in app name + email
3. APIs & Services → Credentials → Create OAuth client → Web application
4. Add your Vercel URL to **Authorised redirect URIs** (e.g. `https://your-app.vercel.app`)  
   Also add: `https://YOUR_SUPABASE_REF.supabase.co/auth/v1/callback`
5. Copy the Client ID and Client Secret
6. In Supabase → **Authentication** → **Providers** → **Google** → enable it → paste the credentials
7. Add your Vercel URL to **Redirect URLs** in Supabase → Authentication → URL Configuration

### 4. Get your Supabase keys

In your Supabase project → **Settings** → **API**:
- **Project URL** — looks like `https://abcdefgh.supabase.co`
- **anon / public key** — starts with `eyJ...`

### 5. Add keys to index.html

Open `index.html`, find these two lines near the top of the `<script>` block and replace:

```javascript
const SUPABASE_URL      = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

**These keys are safe to put in client-side code** — Supabase's Row Level Security ensures users can only ever access their own data.

### 6. Add your Anthropic API key to Vercel

1. Deploy to Vercel (drag `ledger-vercel` folder onto vercel.com → New Project)
2. Go to your Vercel project → **Settings** → **Environment Variables**
3. Add: `ANTHROPIC_API_KEY` = your key from platform.anthropic.com
4. **Redeploy**: Deployments → the three dots menu → Redeploy

---

## File structure

```
ledger-vercel/
├── index.html      ← the entire app (HTML + CSS + JS)
├── api/
│   └── categorise.js  ← serverless function for AI categorisation
├── schema.sql      ← run this once in Supabase SQL editor
├── vercel.json     ← Vercel config
└── README.md       ← this file
```

---

## How data is stored

| Data | Where |
|---|---|
| Transactions | Supabase (primary) + localStorage (cache) |
| Merchant memory | Supabase (primary) + localStorage (cache) |
| API key | Vercel environment variable (never in browser) |

- **localStorage** means the app loads instantly on revisit even before the DB responds
- **Supabase** means data persists across devices and browser clears
- **Row Level Security** means users can never see each other's data

---

## Sharing with friends

Once deployed, just share your Vercel URL. Each person:
1. Signs up with email/password or Google
2. Imports their own bank files
3. Has completely isolated data — you can't see theirs, they can't see yours

The Anthropic API costs are shared (billed to your key), but AI categorisation is cheap — typically a few cents per user per month.

---

## Without Supabase (local mode)

If you leave the placeholder values in `index.html`, the app runs in guest mode:
- No login required
- Data persists in localStorage (survives refreshes, but not browser clears or other devices)
- AI categorisation still works if `ANTHROPIC_API_KEY` is set in Vercel

---

## Costs

| Service | Free tier |
|---|---|
| Vercel | 100GB bandwidth/month, unlimited deploys |
| Supabase | 500MB database, 50,000 monthly active users |
| Anthropic | Pay per use — ~$0.01–0.05 per Smart Categorise run |

For personal use and sharing with a few friends, everything runs within free tiers except Anthropic API usage.
