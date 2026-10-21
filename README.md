# Go4Visa — website

Marketing site for **Go4Visa**, an education consultancy that helps Algerian students find scholarships and study abroad.
*More than a visa, a world of opportunities.*

Built with **Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Framer Motion**.

## Getting started

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

Lint: `npm run lint`

## Where things live

| What | Where |
| --- | --- |
| Brand tokens (colours, fonts, radii, type scale) | `src/app/globals.css` (`:root` + `@theme`) |
| All site copy, in English and French | `src/lib/content.ts` |
| Scholarship data for the 11 destinations (EN + FR) | `src/lib/destinations.ts` |
| Languages, language detection | `src/lib/i18n.ts`, `src/proxy.ts` |
| Page sections | `src/components/` (Navbar, Hero, Stats, About, Destinations, Services, Steps, Gallery, FAQ, Contact, Footer) |
| Logo symbol (vector, all colour variants) | `src/components/brand/Logo.tsx` |
| Original logo artwork | `public/assets/go4visa-logo.jpg` |
| Brand patterns (flight paths, icon field, G-rings) | `public/patterns/*.svg` |
| Pages (one copy per language) | `src/app/[lang]/` |
| Destination detail pages | `src/app/[lang]/destinations/[slug]/page.tsx` |
| Contact API | `src/app/api/contact/route.ts` |
| SEO | metadata in `src/app/[lang]/layout.tsx`, `sitemap.ts`, `robots.ts`, `icon.svg`, JSON-LD in `[lang]/page.tsx` |

### Brand palette

Defined once in `globals.css` and exposed as Tailwind utilities (`bg-midnight`, `text-gold`, `ring-teal`, …):

| Token | Hex | Role |
| --- | --- | --- |
| `midnight` | `#0B2D5B` | Primary — trust, credibility |
| `teal` | `#00A8CB` | Energy, growth |
| `gold` | `#F5B301` | **Accents and CTAs only** — never large surfaces |
| `cloud` | `#F8FAFC` | Backgrounds, breathing space |
| `navy` / `ocean` / `sky` / `amber` | `#012149` / `#0176B1` / `#03B3E2` / `#E39C2A` | Supporting tones from the symbol |

Typography is Montserrat (400/500/600/700) via `next/font/google`. Use the `.label-caps` class for the spaced-capitals label style (“DREAM · STUDY · GO FURTHER”).

## Content still to supply

Anything not given in the brief or the brand book is a visible `[placeholder]` and marked `TODO(content)` in the code. Search for `TODO(content)` to find them all:

- WhatsApp number (`site.whatsapp`, international format, e.g. `213XXXXXXXXX`), phone number and social profile URLs. Each one stays hidden on the site until it is set.
- FAQ answer on language requirements
- Optional longer mission paragraph for the About section

## Languages (English / French)

Every page exists in both languages: `/en/…` and `/fr/…`. The EN | FR switch in the navbar swaps the language of the current page and remembers the choice in a cookie.

A visitor arriving on a URL without a language (for example `/`) is redirected by `src/proxy.ts`: to their saved choice first, otherwise to French if their browser prefers French, otherwise to English.

To edit text, change both the `en` and `fr` blocks in `src/lib/content.ts` (and in `src/lib/destinations.ts` for scholarships). TypeScript reports an error if the French dictionary is missing a key.

## Experiences gallery

Photos of students' experiences live in `public/experiences/` (WebP, max 1600px, metadata stripped) and are listed, with their EN/FR descriptions and category, in `src/lib/gallery.ts`. To add a photo: export it to that folder, then add an entry with its width and height. Only publish photos the people shown have agreed to share.

## Services and pricing

The Services section (`#services`) lists Go4Visa's document services. Each one is offered as **Writing assistance** or **Expert review**. No prices are shown: visitors request a personalized quote through the contact form. A service's "Request a quote" button opens the form with that service pre-selected (`?service=<id>`). Service ids are defined in `SERVICE_OPTIONS` (`src/lib/contact.ts`) and must match the `id`s in `src/lib/content.ts`.

## Contact form

The form validates on the client and again on the server (`src/lib/contact.ts`), and includes a honeypot field against spam bots.

- **Default:** submissions are appended to `data/contact-submissions.jsonl` (git-ignored). This works locally and on a self-hosted Node server.
- **Formspree:** set `FORMSPREE_ENDPOINT=https://formspree.io/f/<your-id>` in `.env.local` (or your host's env settings) and submissions are forwarded there instead. Use this, or a database, on serverless hosts such as Vercel, where the filesystem is read-only.

## Accessibility and RTL

- Skip link, landmarks, `aria-expanded`/`aria-controls` on the accordion, the destination cards and the mobile menu, labelled form fields with announced errors, and a visible gold focus ring.
- All animations respect `prefers-reduced-motion`.
- Layouts use logical properties (`ms-/me-`, `ps-/pe-`, `start/end`, `text-start`). To add Arabic, add `"ar"` to `src/lib/i18n.ts`, add an `ar` dictionary, and set `dir="rtl"` for it in `src/app/[lang]/layout.tsx`; directional icons mirror automatically.

## Updating scholarship info

Calls change every year. Edit `src/lib/destinations.ts` and bump `LAST_UPDATED` in `src/app/sitemap.ts`. Always confirm dates on the official site.

## Credits

Flag SVGs are from [flag-icons](https://github.com/lipis/flag-icons) (MIT).
