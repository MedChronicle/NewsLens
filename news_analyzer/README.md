# NewsLens — AI-Powered News Aggregator & Sentiment Dashboard

NewsLens pulls live headlines from 80,000+ sources via NewsAPI and pairs them with sentiment scoring, category filters, trending topics, bookmarks, reading history, and an analytics dashboard. Built with React, TypeScript, and Tailwind, deployable to Vercel with a secure serverless proxy — no API keys ever reach the browser.

## What changed for deployment

- **No API keys in the app.** The hardcoded NewsAPI key and the client-side "paste your key" flow have been removed entirely.
- **A serverless proxy holds the secret.** `api/news.ts` runs on Vercel, reads `NEWS_API_KEY` from an environment variable, and calls NewsAPI server-side. The browser only ever talks to `/api/news`.
- **No third-party CORS proxy.** The previous `allorigins.win` workaround is gone — the serverless function replaces it, and responses are cached briefly at the edge to save your API quota.
- **Graceful fallback.** If no key is configured, the app automatically shows the built-in curated article set instead of erroring out; Settings shows the live-data status.

## Deploy to Vercel

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo. Vercel auto-detects the Vite framework and the `api/` folder — no extra config needed.
3. Before (or right after) the first deploy, add an environment variable:
   - **Project Settings → Environment Variables**
   - Name: `NEWS_API_KEY`
   - Value: a free key from [newsapi.org](https://newsapi.org)
4. Deploy (or redeploy once the variable is set). Live headlines will start flowing through `/api/news`.

No key set up yet? The app still works — it just runs on the curated sample dataset until you add one.

## Local development

```bash
pnpm install
cp .env.example .env   # then fill in NEWS_API_KEY
pnpm dev                # UI only, via Vite
```

To exercise the `/api/news` function locally the same way Vercel runs it, use the Vercel CLI:

```bash
npm i -g vercel
vercel dev
```

## Scripts

- `pnpm dev` — start the Vite dev server
- `pnpm build` — production build to `dist/`
- `pnpm preview` — preview the production build locally
