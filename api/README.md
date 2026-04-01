# API Reference

## Stack
Node.js + Express.js + MongoDB Atlas

## Setup
```bash
npm install
cp .env.example .env
npm run dev
```

## Environment Variables
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/finfresh
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
```

## Project Structure
```
src/
├── config/        ← MongoDB connection
├── middleware/    ← JWT auth guard
├── models/        ← User, Transaction schemas
├── routes/        ← Endpoint definitions
└── controllers/   ← Business logic
```

## Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /auth/register | No | Register user |
| POST | /auth/login | No | Login user |
| GET | /transactions | Yes | List transactions |
| POST | /transactions | Yes | Create transaction |
| GET | /summary | Yes | Monthly summary |
| GET | /financial-health | Yes | Health score |

## MongoDB Schema

### users
- _id, name, email (unique, indexed), passwordHash, createdAt

### transactions
- _id, userId (indexed), type, category, amount, date, description, createdAt
- Compound index: { userId: 1, date: -1 }

## Financial Health Score
Four components, 25 pts each = 100 max

| Component | Formula |
|---|---|
| Emergency Fund | totalSavings / avgMonthlyExpense |
| Savings Rate | monthlySavings / monthlyIncome × 100 |
| Debt Ratio | monthlyDebt / monthlyIncome × 100 |
| Investment Ratio | monthlyInvestment / monthlyIncome × 100 |

Edge cases: income=0 returns 0pts, expenses=0 returns max emergency fund pts