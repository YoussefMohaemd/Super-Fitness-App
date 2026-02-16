# SuperFitnessApp

**SuperFitnessApp** is an Nx-managed full-stack Angular monorepo that delivers a fitness-focused web application with Server-Side Rendering (SSR), modular architecture, authentication, health-tracking APIs, a chatbot feature, and a reusable `auth-api` library.  

📖 **Online Documentation**: [Super Fitness App Docs](https://super-fitness-app-docs.netlify.app/)  

---

## 🏋️ Project Description  

The **Super Fitness App** is your smart companion for a healthier lifestyle.  
It helps users of all levels – from beginners to professional athletes – stay motivated and organized.  
With easy-to-use features and a modern design, it combines workouts, nutrition, and progress tracking in one place.  

### ✨ Key Features for Users (Non-Technical)  
- **Personalized Workouts** – Custom routines for your goals and fitness level.  
- **Nutrition Guidance** – Simple diet tips that complement your training.  
- **Progress Tracking** – Visual stats to monitor your journey.  
- **Motivational Insights** – Achievements and reminders to keep you inspired.  
- **Chatbot Assistant** – Ask questions and get instant support from the in-app AI chatbot.  
- **Easy to Use** – Clean and intuitive interface for everyone.  

---
---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Repository Layout](#repository-layout)
- [Architecture Overview](#architecture-overview)
- [State Management & Chatbot Flow](#state-management--chatbot-flow)
- [Environment & Configuration](#environment--configuration)
- [Local Development](#local-development)
- [Building & Running (SSR)](#building--running-ssr)
- [Testing](#testing)
- [Linting & Formatting](#linting--formatting)
- [Packaging the ](#packaging-the-auth-api-library)[`auth-api`](#packaging-the-auth-api-library)[ library](#packaging-the-auth-api-library)
- [CI / CD](#ci--cd)
- [Contributing](#contributing)
- [License & Contact](#license--contact)

---

## Project Overview

This monorepo contains an Angular application (`SuperFitnessApp`) built with Nx. The app supports SSR (via `main.server.ts` and `server.ts`) to improve SEO and first-contentful-paint for public pages. It integrates several external REST APIs (authentication, exercise, muscles, healthy-nutri, chatbot), implements NgRx for state in the chatbot feature, and includes an isolated, reusable `auth-api` library that abstracts authentication endpoints.

## Key Features

- Angular + SSR (Node.js + Express)
- Nx monorepo tooling (serve, build, test, graph)
- Modular architecture: Core, Shared, Features, Store
- `auth-api` reusable library with adapters and typed interfaces
- NgRx store for chatbot (actions, effects, reducers, selectors)
- Chatbot UI (floating widget, input, window, message cards)
- Tailwind/PostCSS for styling
- Jest for unit tests and Playwright-style E2E tests
- GitHub Actions CI workflow

## Repository Layout (high level)

```
/ (root)
├─ apps/
│  ├─ SuperFitnessApp/              # Angular app (SPA + SSR)
│  │  ├─ src/app/core/              # authentication, adapters, interceptors, models, layout
│  │  ├─ src/app/features/          # chatbot module, page modules
│  │  ├─ src/app/shared/            # generic components, pipes, utils
│  │  ├─ src/app/store/             # NgRx store (chatbot)
│  │  ├─ main.ts
│  │  ├─ main.server.ts             # SSR bootstrap
│  │  ├─ server.ts                  # Node/Express server for SSR
│  │  └─ proxy.conf.json            # dev proxy
│  └─ SuperFitnessApp-e2e/          # end-to-end tests
├─ projects/
│  └─ auth-api/                     # reusable auth API library
├─ nx.json
├─ package.json
├─ tsconfig.base.json
└─ .github/workflows/ci.yml         # CI workflow
```

## Architecture Overview

Main components:

- **Client (Browser)** — Angular SPA, hydrated after SSR render.
- **SSR Server (Node + Express)** — pre-renders routes, serves static assets, and proxies API calls in some setups.
- **Core Module** — auth routes, guards, interceptors, adapters, and shared services.
- **Features** — Chatbot and page-level feature modules (home, about, classes, nutrition, user profile, etc.).
- **Shared** — UI components, pipes, utilities used across the app.
- **NgRx Store** — used for the chatbot to implement unidirectional data flow (Action → Effect → HTTP → Reducer → Selector → Component).
- **auth-api Library** — packaging of auth-related adapters, interfaces, base API layer and service.
- **External APIs** — authentication, exercise, muscles, healthy-nutri, and chatbot backends.
- **CI/CD** — GitHub Actions runs lint, tests, builds, and E2E suites.

> Use `npx nx graph` to generate an interactive project dependency graph.

## State Management & Chatbot Flow

The chatbot feature uses NgRx to keep the flow predictable and testable. Typical flow:

1. Component dispatches an **Action** (e.g., `sendMessage`).
2. **Effect** catches the action, performs the HTTP call to the chatbot backend (through the chatbot adapter/service).
3. API response is reduced into the **Store** via **Reducers**.
4. UI components read the state using **Selectors** and update the view.

Files of interest:

- `apps/SuperFitnessApp/src/app/store/chatbot/*` (actions, effects, reducers, selectors, state)
- `apps/SuperFitnessApp/src/app/features/chatbot/*` (components and `ChatbotManagerService`)

## Environment & Configuration

Environment-specific settings are kept in the standard Angular `environments/` setup and in `apps/SuperFitnessApp/` configuration files. The SSR server has its own server-side route/config files:

- `apps/SuperFitnessApp/src/app/app.config.server.ts`
- `apps/SuperFitnessApp/src/app/app.routes.server.ts`

Dev proxy is defined at `apps/SuperFitnessApp/proxy.conf.json` and forwards API calls to local or remote API targets when developing locally.

## Local Development

Prerequisites:

- Node.js (16+ recommended)
- pnpm / npm / yarn
- npx (installed with Node.js)

Install dependencies:

```bash
npm install
# or pnpm install
```

Run the app (development, with SSR support via Nx):

```bash
npx nx serve SuperFitnessApp
```

Serve the SSR Node server directly (after building server bundle):

```bash
npx nx build SuperFitnessApp
node dist/apps/SuperFitnessApp/server/main.js
```

To run the app with live SSR development (custom setups may use `@nguniversal/express-engine` integrations).

## Building & Running (SSR)

1. Build browser and server bundles:

```bash
npx nx build SuperFitnessApp --prod
npx nx build SuperFitnessApp:server --prod
```

2. Start Node SSR server:

```bash
node dist/apps/SuperFitnessApp/server/main.js
```

(If you have a start script in `package.json`, use `npm run start:ssr` if provided.)

## Testing

- **Unit tests**: `npx nx test SuperFitnessApp` (runs Jest config for the app or libs)
- **E2E tests**: `npx nx e2e SuperFitnessApp-e2e` (runs Playwright/Cypress-style scripts)

E2E tests expect a reachable instance of the SSR server or the dev server. The workspace `CI` config runs the server and then the E2E job in test pipelines.

## Linting & Formatting

- ESLint rules are configured at the workspace and project levels.
- Prettier is configured for consistent formatting.

Run linters and formatters:

```bash
npx nx lint SuperFitnessApp
npx nx format:write
```

## Packaging the `auth-api` library

The `auth-api` library lives under `projects/auth-api` and exposes typed adapters and services for authentication. It can be built and published independently (if desired):

```bash
npx nx build auth-api
# package artifacts will be under dist/libs/auth-api or dist/projects/auth-api (depending on your nx config)
```

Typical contents:

- `projects/auth-api/src/lib/adaptor/*` — login and register adapters
- `projects/auth-api/src/lib/base/AuthAPI.ts` — base API helpers
- `projects/auth-api/src/lib/enums/*` — endpoint enums
- `projects/auth-api/src/lib/interface/*` — typed request/response interfaces
- `projects/auth-api/src/lib/auth-api.service.ts` — facade service

You can publish this library to an internal npm registry or import it locally via the monorepo path.

## CI / CD

The repository includes a GitHub Actions workflow at `.github/workflows/ci.yml` that generally runs:

- Install dependencies
- Lint
- Unit tests
- Build (browser + server)
- Run E2E tests
- (Optional) publish artifacts

Adjust the workflow to match your target environments and secrets (API URLs, tokens).

## Contributing

- Use feature branches and open pull requests.
- Keep modules small and focused (Core, Shared, Features).
- Write unit tests for services, effects, and critical UI logic.
- Update `npx nx graph` when adding new projects or libs to reason about dependencies.

## Sample Mermaid Diagram (high-level)

You can paste this into a Mermaid renderer or VS Code plugin to visualize the architecture.

```mermaid
flowchart TD
  Browser -->|Initial SSR Render| SSRServer
  SSRServer -->|Serve App| Browser
  Browser --> Core
  Core -->|HTTP| AuthService[Auth Service (external)]
  Core -->|HTTP| ExerciseAPI[Exercise API (external)]
  Core -->|HTTP| ChatbotAPI[Chatbot Backend (external)]
  Component -->|dispatch| Action
  Action --> Effect
  Effect --> HTTPCall
  HTTPCall --> Reducer
  Reducer --> Selector
  Selector --> Component
```

## Troubleshooting & Tips

- If SSR pages render differently from client hydration, check shared providers and any code that relies on `window` or `document` — guard such usage behind platform checks.
- Use the dev proxy (`proxy.conf.json`) to avoid CORS issues during local development.
- When adapting external APIs, prefer creating an adapter layer (already present) so the rest of the app depends on stable interfaces.

## License & Contact

Specify your project license here (e.g., MIT) and add contact info for maintainers.

---

If you want, I can also:

- Provide a condensed Arabic README version.
- Generate a printable architecture diagram (SVG/PNG) from the Mermaid diagram.
- Create a `CONTRIBUTING.md` or `DEVELOPER_SETUP.md` with step-by-step onboarding instructions.
