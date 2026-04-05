# Finance Dashboard

A comprehensive, role-based financial analytics dashboard built with **React 19**, **TypeScript**, **Vite**, **shadcn UI**, **Tailwind CSS**, and **Recharts**. This application provides multiple user roles with distinct access levels, advanced transaction management with export capabilities, and insightful financial analytics with dark mode support.

---

## 🎯 Project Overview

The Finance Dashboard is a sophisticated web application designed to manage and visualize financial data. It implements a **Role-Based Access Control (RBAC)** system with Admin and Viewer roles, providing customized dashboards and features based on user permissions. The application enables users to track income and expenses, analyze spending patterns, and export transaction data in multiple formats.

---

### **Live Link** 🔗  
[View the Dashboard](https://finance-dashboard-ruby-ten-70.vercel.app/admin/overview)

---

## ✨ Key Features

### 1. **Role-Based Dashboard Navigation**
- **Admin Mode**: Full access to all features including transaction management, analytics, and data insights
- **Viewer Mode**: Read-only access to dashboard, transactions, and insights (limited functionality)
- Seamless role-aware routing with `/admin` and `/viewer` base paths
- Persistent sidebar navigation reflecting user role

### 2. **Dashboard Pages**

#### Overview Page
- **Summary Cards**: Display key metrics including total income, total expenses, and current balance
- **Balance Trend Chart**: Interactive line chart showing income vs. expense trends over time
- **Spending Breakdown Chart**: Pie chart visualization of expenses by category
- **Quick Navigation**: Direct links to Transactions and Insights pages for enhanced UX

#### Transactions Page
- **Add/Edit/Remove Transactions**: Full CRUD operations for transaction management
- **Advanced Filtering & Search**:
  - Real-time search by category, date, or amount
  - Filter by transaction type (Income/Expense)
  - Filter by category with dynamic category list
  - Sort by date, amount, or category (ascending/descending)
- **Data Export**:
  - **CSV Export**: Download filtered transactions as CSV with proper escaping
  - **JSON Export**: Download transactions with formatted structure
  - Exports include today's date in filename: `transactions-YYYY-MM-DD.csv`
  - Exports respect all applied filters and sorting
- **Skeleton Loading States**: Polished loading indicators while data fetches
- **Responsive Data Table**: Optimized for desktop and mobile viewing

#### Insights Page
- **Advanced Analytics**: Comprehensive financial analysis and trends
- **Visual Charts**: Multiple chart types with interactive tooltips
- **Period Analysis**: Month-over-month comparison views
- **Category Breakdown**: Detailed analysis by transaction category

### 3. **User Experience (UX) Enhancements**
- **Sonner Toast Notifications**: Real-time feedback for all actions
  - Success messages for create/update operations
  - Warning messages for delete operations
  - Centered, non-intrusive toast positioning
- **Skeleton Loading**: Smooth loading states preventing layout shift
- **Theme Toggle**: Dark mode / light mode support with persistent preferences
- **Responsive Design**: Fully responsive layout optimized for desktop, tablet, and mobile

### 4. **Data Management**
- **LocalStorage Persistence**: All transactions stored locally for offline access
- **Real-time State Management**: Context API for global transaction state
- **Simulated API**: Mock API layer with artificial delays (500ms) for realistic UX
- **Immutable State Updates**: Safe, predictable state transitions

---

## 🏗️ Project Architecture

### Directory Structure Overview

```
src/
├── components/           # Reusable UI components
│   ├── layout/          # Layout components (DashboardLayout, ModeToggle)
│   ├── modules/         # Feature-specific modules
│   │   └── dashboard/   # Dashboard modules (Overview, Transactions, Insights)
│   ├── ui/              # shadcn UI components (button, card, dialog, table, etc.)
│   └── app-sidebar.tsx  # Main sidebar navigation
├── pages/               # Page-level components (role-based routing)
│   ├── dashboard/
│   │   ├── Overview.tsx
│   │   ├── Transactions.tsx
│   │   └── Insights.tsx
│   └── NotFound.tsx
├── context/             # React Context for global state
│   ├── TransactionsContext.tsx  # Transaction state & CRUD operations
│   └── theme.context.ts         # Theme context
├── hooks/               # Custom React hooks
│   ├── useTheme.ts      # Theme management hook
│   └── use-mobile.ts    # Mobile detection hook
├── lib/                 # Utilities & API
│   ├── transactionAPI.ts    # Mock API for transactions
│   └── utils.ts
├── utils/               # Helper functions
│   ├── calculateInsights.ts
│   ├── calculateTotals.ts
│   ├── generateRoutes.ts
│   ├── getDashboardPageTitle.ts
│   ├── getRoleFromPath.ts
│   ├── getSidebarItems.ts
│   ├── localStorageHelper.ts
│   ├── prepareChartData.ts
│   ├── prepareSpendingData.ts
│   └── validateDateFormat.ts
├── types/               # TypeScript interfaces & types
│   └── index.ts         # ITransaction, ISidebarItem, TRole, ChartDataPoint, etc.
├── constants/           # Application constants
│   ├── category.ts
│   ├── month.ts
│   └── role.ts
├── routes/              # Router configuration
│   ├── index.tsx        # Main router setup
│   └── adminSidebarItems.ts  # Role-based sidebar items
├── providers/           # Context providers
│   └── them.provider.tsx
├── App.tsx              # Root component
└── main.tsx             # Entry point
```

### Architectural Layers

#### 1. **Layout Layer** (`components/layout/`)
Provides the structural foundation for the application:
- **DashboardLayout**: Main layout component wrapping all dashboard pages with sidebar and header
- **ModeToggle**: Theme switcher component (dark/light mode)

#### 2. **Page Layer** (`pages/`)
High-level page components that represent different routes:
- Serve as containers for dashboard modules
- Handle page-level logic and role-based access
- Lazy-loaded for better performance

#### 3. **Module Layer** (`components/modules/dashboard/`)
Feature-specific component groupings:

**Overview Module** (`overview/`)
- `OverviewCards.tsx`: Summary statistics
- `BalanceTrendChart.tsx`: Line chart for balance trends
- `SpendingBreakdownChart.tsx`: Pie chart for spending distribution

**Transaction Module** (`transaction/`)
- `TransactionsTable.tsx`: Main transaction display with filtering, sorting, and export
- `AddTransactionDialog.tsx`: Modal for adding/editing transactions

**Insights Module** (`insights/`)
- `InsightsSection.tsx`: Analytics visualization

#### 4. **Component Layer** (`components/ui/`)
Reusable shadcn/ui components:
- Form elements: `input.tsx`, `select.tsx`, `label.tsx`
- Display elements: `card.tsx`, `badge.tsx`, `breadcrumb.tsx`
- Interactive: `button.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `table.tsx`, `tooltip.tsx`
- Layout: `sidebar.tsx`, `sheet.tsx`, `separator.tsx`
- Feedback: `skeleton.tsx`, `sonner.tsx`, `alert.tsx`

#### 5. **Context Layer** (`context/`)
Global state management:
- **TransactionsContext**: Manages transaction data, CRUD operations, and loading state
  - `data`: Array of transactions
  - `loading`: Loading state for async operations
  - `editing`: Currently edited transaction
  - Methods: `create()`, `update()`, `remove()`, `setEditing()`
- **ThemeContext**: Manages dark/light mode preferences

#### 6. **Business Logic Layer** (`utils/`)
Pure functions for data transformation:
- `calculateInsights.ts`: Generate financial insights from transaction data
- `calculateTotals.ts`: Sum income, expenses, and balance
- `prepareChartData.ts`: Format data for chart components
- `prepareSpendingData.ts`: Process spending by category
- `generateRoutes.ts`: Dynamic route generation from sidebar items
- `localStorageHelper.ts`: Persist and retrieve transaction data
- Other utility functions for role detection, page titles, and validation

#### 7. **API Layer** (`lib/transactionAPI.ts`)
Mock API with async operations:
- Simulates real API calls with 500ms delay
- Methods aligned with CRUD operations
- Integrates with localStorage for persistence
- Provides abstraction for easy backend migration

#### 8. **Type System** (`types/`)
TypeScript interfaces ensuring type safety:
```typescript
ITransaction: { id, date, category, type, amount }
ISidebarItem: { title, items }
TRole: "ADMIN" | "VIEWER"
ChartDataPoint: { month, income, expense, balance, year }
SpendingDataPoint: { name, value, formattedValue, percentage }
```

---

## 🔄 Data Flow Architecture

```
User Interaction (UI Components)
          ↓
  Context Actions (create, update, remove)
          ↓
  Transaction API (transactionAPI.ts)
          ↓
  LocalStorage (persistence)
          ↓
  State Update (setData, toast notification)
          ↓
  Component Re-render
```

### Example: Adding a Transaction
1. User fills form in `AddTransactionDialog`
2. Submit triggers `TransactionsContext.create()`
3. `transactionAPI.create()` is called with 500ms delay
4. Transaction saved to localStorage via `saveTransactions()`
5. `setData` updates React state
6. Sonner toast displays success message
7. Components re-render with new transaction

---

## 📊 Export Functionality

### CSV Export
- Escapes special characters and quotes properly
- Includes headers: Date, Category, Type, Amount
- Respects all active filters and sorting
- Filename format: `transactions-YYYY-MM-DD.csv`

### JSON Export
- Pretty-printed with 2-space indentation
- Same filtering and sorting as CSV
- Filename format: `transactions-YYYY-MM-DD.json`
- Ideal for data analysis tools and programming

### Export Features
✓ Filters applied before export (search, type, category)  
✓ Sorting reflected in output order  
✓ Automatic file download  
✓ Date-stamped filenames  
✓ Both Admin and Viewer can export  

---

## 🎨 Technology Stack

### Frontend Framework & Build
- **React 19**: Latest React with modern hooks and features
- **TypeScript**: Full type safety across the application
- **Vite**: Lightning-fast build tool and dev server
- **Tailwind CSS 4**: Utility-first CSS styling with performance optimization

### UI & Components
- **shadcn/ui**: High-quality, accessible React components
- **Radix UI**: Primitives for building accessible component systems
- **Lucide React**: Beautiful, consistent SVG icons
- **Class Variance Authority**: Type-safe component variant management

### Charts & Visualization
- **Recharts**: Composable charting library built on React components
- Interactive tooltips and animations

### State Management & Routing
- **React Context API**: Global state management
- **React Router v7**: Client-side routing with nested routes and lazy loading
- **next-themes**: Theme persistence and toggle

### UX & Notifications
- **Sonner**: Beautiful toast notifications with TypeScript support
- **clsx & tailwind-merge**: Conditional class name handling

### Form & Data
- **date-fns**: Date formatting and manipulation

### Development & Quality
- **ESLint**: Code quality and consistency
- **TypeScript ESLint**: Type-aware linting rules

---

## 🚀 Getting Started

### Installation

```bash
# Using Bun (recommended)
bun install

# Or using npm
npm install
```

### Development Server

```bash
# Start with hot module replacement
bun run dev
# or
npm run dev
```

Visit the URL shown in the terminal (typically `http://localhost:5173`)

### Production Build

```bash
# Build for production
bun run build
# or
npm run build

# Preview production build locally
bun run preview
# or
npm run preview
```

### Code Quality

```bash
# Run ESLint across the repository
bun run lint
# or
npm run lint
```

---

## 📦 Dependencies Overview

### Core Dependencies
- **react, react-dom** (v19): UI library
- **react-router** (v7): Client-side routing
- **typescript**: Type safety
- **@tailwindcss/vite**: Tailwind integration with Vite

### UI & Styling
- **tailwindcss** (v4): Utility CSS framework
- **tailwind-merge**: Class name merging
- **class-variance-authority**: Component variant management
- **clsx**: Conditional classnames

### Components & Icons
- **shadcn**: UI component CLI
- **radix-ui**: Accessibility primitives
- **lucide-react**: Icon library

### Charts & Data
- **recharts**: React charting library
- **date-fns**: Date utilities

### Theme & Notifications
- **next-themes**: Theme management
- **sonner**: Toast notifications

### Dev Dependencies
- **@eslint/js, eslint**: Linting
- **typescript-eslint**: Type-aware linting
- **@vitejs/plugin-react**: React support for Vite
- **@types/react, @types/react-dom, @types/node**: TypeScript definitions

---

## 🔐 Role-Based Access Control

### Admin Role (`/admin`)
- Full access to all features
- Can create, edit, and delete transactions
- Can view all analytics and insights
- Can export transaction data

### Viewer Role (`/viewer`)
- Read-only access to dashboard and analytics
- Cannot modify transactions
- Can view insights but with limited interactivity
- Can export data for analysis

---

## 💾 Data Persistence

All transaction data is stored in the browser's `localStorage` under the key `transactions`. The application automatically:
- Loads transactions on app startup
- Persists changes immediately after CRUD operations
- Maintains transaction history across browser sessions
- Supports data export for backup and analysis

---

## 🎬 Future Enhancements

- [ ] Backend API integration
- [ ] User authentication system
- [ ] Database persistence (MongoDB, PostgreSQL)
- [ ] Budget tracking and alerts
- [ ] Recurring transaction support
- [ ] Bill reminders
- [ ] Multi-currency support
- [ ] Advanced reporting (PDF export, charts)
- [ ] Data visualization enhancements
- [ ] API rate limiting and caching

---

## Project Structure

- `src/`
  - `components/` — shared UI and dashboard components
  - `pages/` — route pages for Overview, Transactions, Insights, and NotFound
  - `routes/` — sidebar route definitions and role-based routing
  - `context/` — theme and transaction state management
  - `utils/` — helper functions and chart preparation utilities
  - `providers/` — theme provider
  - `assets/` — icons and static assets

## Notes

- The current project is ready for production deployment after `bun run build`.
- The Overview page now acts as a central hub and includes direct navigation to the other dashboard sections.

---

If you want, I can also add a dedicated `Export` button to the Transactions page and wire CSV/JSON generation into the existing table flow.