# Devfolio

Devfolio is a multi-tenant Developer Portfolio Builder SaaS built with Next.js App Router, TypeScript, Tailwind CSS v4, Supabase, Framer Motion, and Groq AI.

## Features

- Auth (email/password + OAuth callback flow)
- Multi-step onboarding with AI helpers
- Three public portfolio templates (`minimal`, `dark`, `creative`)
- Dynamic public routes at `/u/[username]`
- Dashboard to edit profile, skills, projects, experience
- Template switcher with live selection
- Portfolio analytics chart from `portfolio_views`
- Marketing landing page

## Tech Stack

- Next.js `16.2.4`
- React `19`
- TypeScript `5`
- Tailwind CSS `v4`
- Supabase (Auth, Postgres, Storage)
- Framer Motion
- Recharts
- Groq SDK

## Environment Variables

Copy `.env.example` to `.env.local` and fill values.

## Local Development

```bash
npm install
npm run dev
```

## Quality Checks

```bash
npm run lint
```

## Deployment (Vercel)

1. Import repository in Vercel.
2. Add environment variables from `.env.example`.
3. Set Supabase redirect URLs (local + production callback).
4. Deploy with default Next.js settings.

## Production URL Pattern

- Public portfolios: `https://your-domain.com/u/<username>`
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
"# devfolio-portfolio-builder" 
