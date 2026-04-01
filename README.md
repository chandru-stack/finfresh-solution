# FinFresh Personal Finance Tracker

## Stack
- **Frontend**: React (Vite)
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas

## How to Run Locally

### Backend
```bash
cd api
npm install
cp .env.example .env
# Fill in your MongoDB URI and JWT secret in .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000
npm run dev
```

### Environment Variables

#### api/.env
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/finfresh
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

#### frontend/.env
```
VITE_API_URL=http://localhost:5000
```

## Architecture Decisions

### Why Express.js?
Lightweight and minimal boilerplate — ideal for a focused REST API. 
Faster to wire up than NestJS for a time-boxed challenge while 
still being structured and maintainable.

### Project Structure
Feature-based separation across models, controllers, routes and middleware.
Each layer has one clear responsibility:
- `models/` — MongoDB schemas
- `controllers/` — business logic
- `routes/` — endpoint definitions
- `middleware/` — JWT auth guard

## Authentication

JWT is signed with a secret stored in `.env`. The `userId` is always 
read from the token server-side — never trusted from request body or 
URL params. Tokens expire in 7 days.

The frontend stores the token in `localStorage`. An Axios interceptor 
attaches it to every request automatically. On a 401 response, the 
interceptor clears the token and redirects to `/login`.

## Financial Health Score

Computed on-demand at `GET /financial-health` — no caching needed at 
this scale. Four components, 25 points each, total 100:

| Component | Formula |
|---|---|
| Emergency Fund | totalSavings / avgMonthlyExpense (last 3 months) |
| Savings Rate | (monthlySavings / monthlyIncome) × 100 |
| Debt Ratio | (monthlyDebt / monthlyIncome) × 100 |
| Investment Ratio | (monthlyInvestment / monthlyIncome) × 100 |

### Edge Cases Handled
- `income = 0` → savings/debt/investment ratios return 0 pts (no division by zero)
- `monthlyExpenses = 0` → emergency fund returns max 25 pts
- Negative amounts → clamped to 0 before computing ratios
- No transactions of a type → minimum 5 pts for that component

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /auth/register | No | Register new user |
| POST | /auth/login | No | Login user |
| GET | /transactions | Yes | Get paginated transactions |
| POST | /transactions | Yes | Create transaction |
| GET | /summary | Yes | Monthly financial summary |
| GET | /financial-health | Yes | Financial health score |

## What I Would Improve With More Time

- Add refresh tokens and token rotation for better security
- Cache financial health score in Redis, invalidate on new transactions
- Add Jest unit tests for the health score algorithm
- Add rate limiting on auth endpoints to prevent brute force
- Add date range filter on transactions screen
- Add charts using Recharts for spending visualization