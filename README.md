# FRAMIO Full-Stack Website

Production-ready Next.js, TypeScript, Prisma and Supabase rebuild of the FRAMIO website. The existing visual design, colours, animations, section order, responsive behaviour and interaction patterns are preserved, while all editable content is separated from component logic.

## What this project includes

- Next.js 16 App Router with TypeScript and React 19
- One content/config file per website area
- Reusable, array-driven sections and cards
- Organized image and video folders under `public/assets`
- Five-step project brief with client and server validation
- Supabase Postgres storage through Prisma
- Secure admin login, lead dashboard, notes, statuses and CSV export
- Submission and admin-login rate limiting
- Honeypot spam protection and HMAC-hashed IP identifiers
- Server-only environment variables and signed, HTTP-only admin sessions
- Responsive desktop/mobile layouts with reduced-motion support

No deployment, email, WhatsApp or other external action is triggered automatically. Project briefs are stored in the database for manual review in the admin dashboard.

## Requirements

- Node.js 20.9 or newer
- npm
- A Supabase project with a Postgres database

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create the local environment file:

   ```bash
   cp .env.example .env
   ```

3. Create a Supabase project and copy the public client values:

   - In Supabase, open Project settings → API
   - Copy the project `URL` to `NEXT_PUBLIC_SUPABASE_URL`
   - Copy the `anon` key to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - For Prisma, also copy the pooled connection string to `DATABASE_URL` and the direct connection string to `DIRECT_URL` from Project settings → Database
   - Replace the placeholder values in `.env`

4. Generate a secure admin password hash:

   ```bash
   npm run admin:hash -- "choose-a-strong-admin-password"
   ```

   Copy the complete `scrypt$...` output into `ADMIN_PASSWORD_HASH` in `.env`. The plain password must never be placed in source code.

5. Generate two independent secrets:

   ```bash
   openssl rand -hex 32
   openssl rand -hex 32
   ```

   Put one value in `ADMIN_SESSION_SECRET` and the other in `SUBMISSION_HASH_SECRET`.

6. Apply the database migration:

   ```bash
   npm run db:migrate
   ```

7. Start the website:

   ```bash
   npm run dev
   ```

Open `http://localhost:3000`. The project form is at `/start-project` and the private lead dashboard is at `/admin/login`.

## Content editing map

All website copy, links and media references live in `src/content`. Edit these files in VS Code; do not edit components for ordinary content changes.

| What to edit | File |
| --- | --- |
| Browser title, SEO description, brand name, main logo and internal routes | `src/content/site.ts` |
| Desktop/mobile navigation labels, menu text and header CTA | `src/content/navigation.ts` |
| Hero badge, headline, paragraph, CTAs, service tags and hero images | `src/content/hero.ts` |
| Process heading, description and all five process steps | `src/content/process.ts` |
| Services heading, tools, deliverables, service cards and artwork | `src/content/services.ts` |
| Statistics, suffixes, descriptions, captions and card artwork | `src/content/stats.ts` |
| Portfolio/design-style cards, captions and images | `src/content/portfolio.ts` |
| Founder heading, names, titles, portraits and reveal labels | `src/content/founders.ts` |
| Brand showcase heading, logo names and logo images | `src/content/brands.ts` |
| Footer headline, CTAs, contact details, social links and copyright | `src/content/footer.ts` |
| Project-form text, fields, choices, validation messages and success state | `src/content/project-form.ts` |
| Admin login/dashboard labels, lead statuses and messages | `src/content/admin.ts` |
| Future approved testimonial entries | `src/content/testimonials.ts` |

The current design has no testimonial section, so `testimonials.ts` is intentionally empty. This avoids adding UI that was not present in the supplied website.

### Change text

Open the matching content file and edit the quoted value. For example, changing `heroContent.title` in `src/content/hero.ts` updates the homepage automatically. No component change is required.

### Change a link

- Header and section links: `src/content/navigation.ts`
- Main internal routes: `src/content/site.ts`
- Footer social and contact links: `src/content/footer.ts`
- Project-form WhatsApp link: `src/content/project-form.ts`

External links support an `external: true` flag. Components then add the appropriate new-tab and security attributes.

### Add, remove or reorder repeated content

Services, process steps, statistics, portfolio cards, founders, brands and form choices are arrays. Add, remove or reorder array objects in their content file and the reusable component will render the change automatically.

Keep each object’s existing shape. TypeScript reports missing or invalid properties during `npm run typecheck`.

## Images and videos

### Asset folders

```text
public/assets/images/
├── brands/
├── footer/
├── form/
├── founders/
├── global/
├── hero/
├── portfolio/
├── services/
└── stats/

public/assets/videos/
```

The current website uses images but has no active video element. The video directory is ready for approved future video assets without mixing them into image folders.

### Replace an image without changing its path

Replace the file in the same asset folder using the same filename. The website will use it automatically. Restart the development server or clear `.next` if a cached development image remains visible.

### Replace an image and change its path

1. Copy the new file into the appropriate `public/assets/images/<section>` folder.
2. Open the matching file in `src/content`.
3. Change `src` to a public path such as `/assets/images/hero/new-hero.webp`.
4. Update `width` and `height` to the source image’s real pixel dimensions.
5. Add useful `alt` text when the image communicates content. Keep `alt: ""` for decorative images.

Large raster assets should normally use WebP or AVIF. Logos with transparency can use PNG or SVG. Next.js generates responsive optimized image sizes at runtime.

### Add a video later

Place the file in `public/assets/videos`, add its path and accessibility text to the relevant section content file, and render it through a reusable media component. Do not place video URLs directly inside a page or section component.

## Project brief and database

The public form sends JSON to `POST /api/submissions`. The server:

1. requires `application/json`;
2. rejects unexpected fields;
3. validates every value with Zod;
4. checks form choices against `src/content/project-form.ts`;
5. applies honeypot and database-backed rate limiting;
6. hashes the client IP with a server-only secret;
7. stores the validated brief in Supabase Postgres.

Changing a service, goal, timeline or budget choice in `src/content/project-form.ts` also changes the server’s allowed-value list automatically.

Database models and indexes are defined in `prisma/schema.prisma`. The initial production migration is in `prisma/migrations/0001_init`.

Useful database commands:

```bash
npm run db:generate   # Regenerate the Prisma client
npm run db:dev        # Create/apply a development migration
npm run db:migrate    # Apply committed migrations in production
npm run db:studio     # Open Prisma Studio locally
```

After changing `prisma/schema.prisma`, create and review a migration before deploying. Do not use schema push as a substitute for reviewed production migrations.

## Admin lead dashboard

Visit `/admin/login` and use the password whose hash is stored in `ADMIN_PASSWORD_HASH`.

Authenticated admins can:

- view and search project briefs;
- filter by lead status;
- change status to New, Contacted, Qualified or Closed;
- save private internal notes;
- email a lead using the local mail client;
- export submissions to CSV;
- delete a lead after confirmation.

Admin sessions expire after eight hours and are stored in a signed, HTTP-only, SameSite=Strict cookie. Production cookies also require HTTPS.

## API routes

| Method and route | Purpose | Authentication |
| --- | --- | --- |
| `POST /api/submissions` | Validate and store a public project brief | Public, rate-limited |
| `POST /api/admin/login` | Verify password and create an admin session | Public, rate-limited |
| `POST /api/admin/logout` | Clear the admin session | Admin session |
| `GET /api/admin/submissions` | List recent submissions | Admin session |
| `PATCH /api/admin/submissions/:id` | Update status and private note | Admin session |
| `DELETE /api/admin/submissions/:id` | Delete a submission | Admin session |
| `GET /api/admin/submissions/export` | Download all submissions as safe CSV | Admin session |

## Environment variables

All secrets are server-only. Never prefix them with `NEXT_PUBLIC_`, paste them into client components or commit `.env`.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public Supabase project URL used by browser/client code |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key used by browser/client code |
| `DATABASE_URL` | Pooled Supabase Postgres connection string used by Prisma |
| `DIRECT_URL` | Direct Supabase Postgres connection string for Prisma migrations |
| `ADMIN_PASSWORD_HASH` | Scrypt hash generated by `npm run admin:hash` |
| `ADMIN_SESSION_SECRET` | Signs admin session tokens; minimum 32 characters |
| `SUBMISSION_HASH_SECRET` | HMAC key used to hash private rate-limit identifiers; minimum 32 characters |

Use different values for the two secrets. Configure them only in the hosting provider’s encrypted server environment.

## Source structure

```text
src/
├── app/
│   ├── (marketing)/        # Public homepage
│   ├── (brief)/            # Standalone project form
│   ├── (admin)/            # Authenticated lead dashboard
│   └── api/                # Server API routes
├── components/
│   ├── sections/           # Reusable visual sections
│   ├── layout/             # Header, menu and footer
│   ├── experience/         # Animation and interaction controllers
│   ├── brief/              # Project-form UI
│   └── admin/              # Lead-management UI
├── content/                # All editable website content
├── lib/
│   ├── auth/               # Password/session utilities
│   ├── db/                 # Prisma client
│   ├── http/               # Request/privacy utilities
│   └── validation/         # Zod schemas
├── styles/                 # Preserved visual system and responsive CSS
└── types/                  # Shared content and API types
```

Visual-only geometry, SVG paths, animation timing and interaction thresholds remain inside components or experience controllers because they are implementation details, not website content.

## Quality checks

Run these before every release:

```bash
npm run lint
npm run typecheck
npm run build
```

The production build runs `prisma generate` first. A successful build validates the route structure, server/client boundaries and TypeScript compilation.

## Production deployment

1. Create and configure a Supabase project.
2. Set all five environment variables in the host’s encrypted project settings.
3. Run `npm ci`.
4. Run `npm run db:migrate` as a controlled release step.
5. Run `npm run build`.
6. Start with `npm run start`, or use the platform’s Next.js runtime.
7. Confirm HTTPS is enabled before using the admin dashboard.
8. Submit one test brief, verify it in `/admin`, update its status, export CSV and delete the test record.

Back up the production Supabase database and test migrations on a staging database before applying schema changes.

## Design preservation

Editable content belongs in `src/content`; layout and behaviour belong in components and styles. Avoid editing `src/styles` or `src/components/experience` unless a deliberate design or animation change is requested. This separation keeps routine updates safe while preserving the supplied FRAMIO experience.
