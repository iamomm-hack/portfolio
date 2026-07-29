# Om Kumar | Full-Stack Developer • Web3 Builder

A dark editorial portfolio built as an engineering laboratory rather than a traditional résumé. The experience combines a resilient static content layer with a progressively loaded Spline keyboard, focused motion, accessible navigation, case-study foundations, and a compact seven-project gallery.

[View the live portfolio](https://iamom.tech)

## Experience

The homepage follows one continuous product narrative:

1. Hero — identity, practice statement, primary action, résumé, and social links.
2. Skills — an editorial capability index paired with an accessible interactive keyboard.
3. Experience — a semantic timeline centered on outcomes and ecosystem impact.
4. Projects — seven projects in one responsive editorial gallery.
5. Contact — direct channels and a validated project inquiry form.

The visual foundation uses a dark carbon field, authored grid, static grain, restrained lighting, and self-hosted typography. Motion is intentionally limited to transforms and opacity, with complete reduced-motion fallbacks.

## Featured projects

- [StellarID](https://stellarid.vercel.app) — privacy-first decentralized identity on Stellar with zero-knowledge credential verification.
- [ChatMint AI](https://chatmint-ai.vercel.app) — AI-assisted intellectual property registration and on-chain protection.
- [StellarTipJar](https://stellartipjar.vercel.app) — wallet-native creator tipping with instant Stellar payments and analytics.
- [MatchMesh](https://matchmesh-app.vercel.app) — AI infrastructure for football agents using MCP, x402, and Injective settlement.
- [Veriscope](https://veriscope-web.vercel.app) — identity, governance, permissions, and reputation for autonomous agents on Soroban.
- [Injective Intelligence](https://inj-dna.vercel.app) — behavioral intelligence for Injective wallets and trader psychology.
- [Miiso](https://miiso-ai.vercel.app) — autonomous contract-risk detection and approval revocation.

Every project includes a real product screenshot plus direct Live Demo and GitHub actions. The first three projects also have statically generated case-study routes.

## Technical architecture

- Next.js 14 App Router and React 18
- TypeScript with explicit type checking
- SCSS modules and a shared CSS token foundation
- GSAP for the frozen Hero choreography
- Framer Motion for lightweight Projects interactions
- Spline as the single managed 3D scene
- Resend and Zod for the contact flow
- MDX-backed technical writing

`LabScene` is the sole owner of expensive media. The Spline scene loads only after user intent, pauses when its sections leave the viewport or the tab becomes hidden, and is omitted when reduced motion is requested. The page remains usable before the scene loads.

## Accessibility and performance

- Semantic landmarks and heading hierarchy
- Keyboard-accessible navigation, project cards, and external actions
- Visible focus states and minimum 44px interactive targets
- Reduced-motion behavior across scene and interface choreography
- Real image dimensions reserved through fixed aspect ratios to prevent layout shift
- Static decorative environment with no particles or additional canvases
- Route-level code splitting and lazy scene loading
- Automated quality gates for architectural, accessibility, and performance contracts

## Local development

### Prerequisites

- Node.js 20–22
- npm 10

This repository uses npm as its only supported package manager.

```bash
git clone https://github.com/iamomm-hack/portfolio.git
cd portfolio
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

On Windows PowerShell, copy the environment template with:

```powershell
Copy-Item .env.example .env.local
```

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | For contact submissions | Authorizes the contact form email API. |
| `UMAMI_DOMAIN` | No | Loads privacy-conscious analytics when paired with `UMAMI_SITE_ID`. |
| `UMAMI_SITE_ID` | No | Identifies the site in Umami when paired with `UMAMI_DOMAIN`. |

Do not commit `.env.local` or production credentials.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Turbopack development server. |
| `npm run build` | Create the optimized production build. |
| `npm run start` | Serve the production build locally. |
| `npm run lint` | Run the Next.js ESLint checks. |
| `npm run typecheck` | Run TypeScript without emitting files. |
| `npm test` | Run the repository quality gates. |
| `npm run check` | Run lint, typecheck, tests, and build in sequence. |

## Project structure

```text
src/
  app/                    Routes, metadata, API, sitemap, and robots
  components/
    case-study/           Shared case-study reading architecture
    header/               Laboratory control rail and expanded navigation
    lab-scene/            Scene ownership and environmental shell
    sections/             Hero, Skills, Experience, Projects, and Contact
  content/blogs/          MDX articles
  data/                   Portfolio, project, and site records
public/assets/
  projects-screenshots/   Real project imagery
  seo/                    Social preview assets
tests/
  quality-gates.test.mjs  Frozen architectural and quality contracts
```

## Deployment

The production target is Vercel. Configure the environment variables in the deployment project, then use the standard Next.js build command:

```bash
npm run build
```

All public routes, metadata, Open Graph data, canonical URLs, the sitemap, and `robots.txt` are generated by the application.
