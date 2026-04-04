# Finance Dashboard

A responsive finance dashboard built with React, TypeScript, Vite, Tailwind CSS and Recharts.

This project provides a role-sensitive dashboard experience with overview analytics, transaction management, and insights. It supports both admin and viewer modes and is designed for production deployment.

## Key Features

- Role-aware dashboard navigation for `admin` and `viewer`
- Sidebar route structure with Overview, Transactions, and Insights
- Overview page with:
  - summary cards
  - balance trend chart
  - spending breakdown pie chart
  - direct links to Transactions and Insights from Overview
- Transactions management with add/edit/remove flow
- Exportable transaction data as CSV and JSON from the Transactions page
- Analytics insights and charts with tooltips
- Theme toggle / dark mode support
- Responsive layout optimized for desktop and mobile
- Global cursor pointer and skeleton loading states for polished UX

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- React Router v7
- shadcn/ui + Radix UI components
- lucide-react icons
- ESLint

## Installation

This repo can be installed using `bun` as the package manager.

```bash
bun install
```

If you prefer npm, the same commands are available via `npm install`.

## Development

Start the local development server:

```bash
bun run dev
```

Then open the local Vite URL shown in the terminal.

## Production Build

Build the application for production:

```bash
bun run build
```

Preview the production build locally:

```bash
bun run preview
```

## Linting

Run ESLint across the repository:

```bash
bun run lint
```

## Package Tools and Dependencies

This project uses the tools defined in `package.json`:

- `@tailwindcss/vite`
- `class-variance-authority`
- `clsx`
- `date-fns`
- `lucide-react`
- `radix-ui`
- `react`
- `react-dom`
- `react-router`
- `recharts`
- `shadcn`
- `tailwind-merge`
- `tailwindcss`
- `tw-animate-css`

Development tooling includes:

- `@eslint/js`
- `@types/node`
- `@types/react`
- `@types/react-dom`
- `@vitejs/plugin-react`
- `eslint`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`
- `globals`
- `typescript`
- `typescript-eslint`
- `vite`

## Project Structure

- `src/`
  - `components/` — shared UI and dashboard components
  - `pages/` — route pages for Overview, Transactions, Insights, and NotFound
  - `routes/` — sidebar route definitions and role-based routing
  - `context/` — theme and transaction state management
  - `utils/` — helper functions and chart preparation utilities
  - `providers/` — theme provider
  - `assets/` — icons and static assets

## Suggested Future Enhancement

A natural next feature is an export option on the Transactions page or Overview page:

- export transactions or summary data as `CSV`
- export reports as `JSON`

This would let users download ledger data directly from the dashboard and improve analytics workflows.

## Notes

- The current project is ready for production deployment after `bun run build`.
- The Overview page now acts as a central hub and includes direct navigation to the other dashboard sections.

---

If you want, I can also add a dedicated `Export` button to the Transactions page and wire CSV/JSON generation into the existing table flow.