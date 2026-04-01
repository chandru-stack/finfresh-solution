# Frontend Reference

## Stack
React (Vite) + Axios + React Router DOM

## Setup
```bash
npm install
cp .env.example .env
npm run dev
```

## Environment Variables
```
VITE_API_URL=http://localhost:5000
```

## Project Structure
```
src/
├── components/    ← Reusable UI components
├── pages/         ← Login, Dashboard, Transactions
├── services/      ← api.js (all API calls)
└── utils/         ← formatCurrency, parseNumber
```

## Screens

### Login / Register
- Toggle between login and register
- Client side email validation
- Inline error messages
- Button disabled while request in flight
- Redirects to dashboard on success

### Dashboard
- Monthly summary cards
- Financial health score with breakdown
- Category breakdown
- Loading, error, empty states handled
- Zero income shows 0% savings rate

### Transactions
- Paginated list
- Filter by type
- Loading, error, empty states handled

## Components
- SummaryCard — income, expense, savings, rate
- HealthScoreCard — score, category, suggestions, breakdown
- CategoryBreakdown — spending by category
- TransactionList — paginated transaction rows
- AddTransactionForm — create new transaction
- LoadingState, ErrorState, EmptyState — UI states