# NextLevel Food (Foodies)

A modern, responsive food-sharing community web application built with **Next.js 16 (App Router with Turbopack)**, **React 19**, **Server Actions**, and **SQLite**.

Browse mouth-watering recipes shared by food lovers around the globe, view detailed cooking instructions, and share your own culinary creations with the community.

---

## 🍽 Features

- **Recipe Discovery**: Browse a collection of community-shared recipes rendered with streaming Server Components and `Suspense` fallbacks.
- **Detailed Recipe Pages**: Static site generation (`generateStaticParams`) with rich formatting, server-side data fetching, and dynamic metadata generation for SEO.
- **Recipe Submission Workflow**: Share your recipes via Next.js Server Actions with strict server-side validation (MIME type verification, 5MB file limits), XSS sanitization, and responsive form submission states (`useFormStatus`, `useActionState`).
- **Interactive Image Picker**: Client-side image upload and instant preview component powered by `URL.createObjectURL` with proper memory cleanup.
- **Hero Image Slideshow**: Smooth, auto-cycling hero slideshow showcasing delicious dishes with custom CSS transitions and LCP priority optimization.
- **Design System & CSS Modules**: Co-located CSS Modules powered by centralized CSS custom properties (design tokens) in `globals.css` with a sleek dark-mode aesthetic.
- **Secure Persistence**: Parameterized SQLite queries preventing SQL injection, combined with `xss` sanitization for safe user-submitted markup and transactional rollback on failure.

---

## 🛠 Tech Stack & Dependencies

### Core Framework & Runtime
| Package | Version | Description |
|---|---|---|
| [`next`](https://nextjs.org/) | `^16.3.5` | App Router framework with Turbopack bundler & Server Actions |
| [`react`](https://react.dev/) | `^19.3.0` | React 19 core library (`useActionState`, Server Components) |
| [`react-dom`](https://react.dev/) | `^19.3.0` | React DOM bindings and form hooks (`useFormStatus`) |

### Cloud Media & Image Management
| Package | Version | Description |
|---|---|---|
| [`cloudinary`](https://cloudinary.com/documentation/node_integration) | `^2.11.0` | Official Cloudinary Node.js SDK for secure server-side upload streams |
| [`next-cloudinary`](https://next-cloudinary.spacejelly.dev/) | `^6.19.0` | Cloudinary integration for Next.js with automatic optimization |

### Database & Security Utilities
| Package | Version | Description |
|---|---|---|
| [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3) | `^13.0.3` | High-performance synchronous SQLite database driver |
| [`slugify`](https://github.com/simov/slugify) | `^1.6.9` | URL slug generation for recipe dynamic routes |
| [`xss`](https://github.com/leizongmin/js-xss) | `^1.0.15` | Input sanitization to prevent Cross-Site Scripting |

### Development & Linting
| Package | Version | Description |
|---|---|---|
| [`eslint`](https://eslint.org/) | `^9.20.0` | Next-generation flat configuration linter (`eslint.config.mjs`) |
| [`eslint-config-next`](https://www.npmjs.com/package/eslint-config-next) | `^16.3.5` | Next.js Core Web Vitals ESLint ruleset |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.17 or higher (Node 20+ recommended for Next.js 16)
- **npm** / **yarn** / **pnpm**

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd foodies
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Copy the example environment file and set your Cloudinary credentials:
   ```bash
   cp .env.example .env.local
   ```
   > You can also provision an instant Claimable Cloud by running:
   > ```bash
   > npx @cloudinary/cloud
   > ```

4. **Initialize the database**:
   Seed the SQLite database with initial dummy recipes:
   ```bash
   npm run seed
   # or: node initdb.js
   ```
   > This creates a local `meals.db` file populated with initial community meals.

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📁 Project Structure

```text
foodies/
├── app/                             # Next.js App Router root
│   ├── community/                   # Community page route & CSS module
│   ├── meals/                       # Meals directory
│   │   ├── [mealSlug]/              # Dynamic route: individual meal details
│   │   │   ├── not-found.js         # 404 handler with Back to Meals CTA
│   │   │   ├── page.js              # SSG pre-rendered recipe detail page
│   │   │   └── page.module.css      # Meal detail styles (white-space: pre-line)
│   │   ├── share/                   # Share recipe page & server action UI
│   │   │   ├── error.js             # Error boundary with reset retry button
│   │   │   ├── page.js              # Share page Server Component with SEO metadata
│   │   │   └── page.module.css      # Share form styles
│   │   ├── error.js                 # Error boundary with reset retry button
│   │   ├── page.js                  # Meals listing page with Suspense streaming
│   │   └── page.module.css          # Meals page styles
│   ├── globals.css                  # Global design tokens & button styles
│   ├── layout.js                    # Root application layout, next/font, & title template
│   ├── not-found.js                 # Global 404 page with navigation CTA
│   ├── page.js                      # Landing / Home page with authentic copywriting
│   └── page.module.css              # Home page styles
├── components/                      # Reusable UI components
│   ├── image-slideshow/             # Hero slideshow with LCP priority optimization
│   ├── main-header/                 # Navigation header, logo, & accessible NavLink
│   └── meals/                       # MealItem, MealsGrid, ImagePicker, ShareMealForm
├── lib/                             # Application logic & database queries
│   ├── action.js                    # Server Actions with strict MIME/size validation
│   └── meals.js                     # SQLite queries with React cache() & rollback
├── public/                          # Static assets
│   ├── favicon.ico                  # Foodies brand multi-resolution favicon
│   ├── icons/                       # Vector illustrations & icon badges
│   └── images/                      # Community recipe photographs & logo
├── eslint.config.mjs                # ESLint 9 flat configuration
├── initdb.js                        # Database initialization & seeder script
├── jsconfig.json                    # Path alias configuration (@/*)
├── next.config.mjs                  # Next.js 16 configuration (Turbopack)
└── package.json                     # Project manifest and npm scripts
```

---

## 📜 Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Starts local Next.js development server with hot reload |
| `build` | `npm run build` | Builds optimized production bundle with SSG pre-rendering |
| `start` | `npm start` | Starts Next.js production server |
| `lint` | `npm run lint` | Runs ESLint 9 check across all files |
| `seed` | `npm run seed` | Initializes and seeds local SQLite database (`meals.db`) |
| `db:init` | `npm run db:init` | Alias for seeding the local SQLite database |

---

## 💡 Production Deployment Notes

- **Cloud Media Storage (Cloudinary)**: Uploaded recipe images are streamed directly to Cloudinary using the official Node SDK (`cloudinary.uploader.upload_stream`) and served with Next.js image optimization via `res.cloudinary.com` remote patterns. In offline/development environments without Cloudinary credentials, the app gracefully falls back to local storage in `public/images/`.
- **SQLite Database**: `better-sqlite3` creates a local file (`meals.db`). For distributed or serverless deployments, consider SQLite cloud alternatives like Turso/LibSQL or hosted PostgreSQL/MySQL.
