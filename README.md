# 💳 FinPay — Full-Stack Digital Wallet with Bank Webhook Simulation

FinPay is a full-stack digital wallet application built using a monorepo architecture.  
It supports authentication, P2P transfers with transactional locking, simulated bank on-ramp payments, and real-time balance updates.

This project demonstrates real-world fintech backend architecture, concurrency handling, and webhook integration.

---

## 🚀 Features

### 🔐 Authentication
- Google OAuth (NextAuth)
- Credentials-based login/signup
- Secure password hashing using bcrypt
- Session-based authentication

### 💰 Wallet System
- User balance management
- Locked vs unlocked balance tracking
- Real-time balance updates
- Persistent storage using PostgreSQL + Prisma

### 🔁 P2P Transfers
- Send money between users using phone number
- Row-level locking (`SELECT ... FOR UPDATE`) to prevent race conditions
- Atomic updates using Prisma `$transaction`
- Automatic transaction history tracking

### 🏦 Bank On-Ramp Simulation
- Add money via simulated net banking flow
- Transaction created in `Processing` state
- Bank confirmation updates balance + transaction status
- Redirects back to dashboard after confirmation

### 🔔 Webhook Architecture
- Dedicated Express server (`bank-webhook`)
- Simulated bank confirmation endpoint
- Transaction validation before balance update
- Server-to-server payment confirmation flow

### 📜 Transaction History
- Combined:
  - On-ramp transactions
  - P2P transfers
- Sorted by timestamp
- Direction-aware rendering (Sent / Received)

---

## 🏗 Monorepo Architecture

```
finpay/
│
├── apps/
│   ├── user-app        (Next.js frontend + server actions)
│   ├── bank-webhook    (Express webhook simulator)
│
├── packages/
│   ├── db              (Shared Prisma client)
│   ├── ui              (Shared UI components)
│   ├── typescript-config
│
├── turbo.json
└── package.json
```

Shared Prisma client ensures:
- Single DB instance
- Type-safe access
- Clean separation of concerns

---

## 🛠 Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- TailwindCSS
- Server Actions

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- NextAuth

### Dev Tools
- Turborepo
- esbuild
- Docker (Postgres)
- Prisma Studio

---

## ⚙️ Database Schema Overview

### User
- id
- name
- number
- password
- balance relation

### Balance
- userId
- amount
- locked

### P2PTransfer
- fromUserId
- toUserId
- amount
- timestamp

### OnRampTransaction
- token
- provider
- status
- startTime
- userId
- amount

---

## 🔐 Concurrency Handling

To prevent double spending:

```sql
SELECT * FROM "Balance" WHERE "userId" = ? FOR UPDATE;
```

Combined with:

```ts
await prisma.$transaction(...)
```

This ensures:
- No race conditions
- Atomic updates
- Financial integrity

---

## 🏦 Payment Flow (Simulated)

1. User clicks **Add Money**
2. OnRampTransaction created (`Processing`)
3. User redirected to simulated bank page
4. Bank confirms payment via webhook
5. Balance updated
6. Transaction status → `Success`
7. User redirected to dashboard

---

## 🧪 Running Locally

### 1️⃣ Install Dependencies

```bash
npm install
```

---

### 2️⃣ Setup Environment

Create `.env` inside `packages/db`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/finpay
NEXTAUTH_SECRET=your_secret
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

---

### 3️⃣ Start PostgreSQL (Docker Example)

```bash
docker run --name finpay-db \
-e POSTGRES_PASSWORD=postgres \
-p 5432:5432 \
-d postgres
```

---

### 4️⃣ Run Prisma

```bash
cd packages/db
npx prisma migrate dev
npx prisma generate
```

---

### 5️⃣ Start User App

```bash
cd apps/user-app
npm run dev
```

Runs on:

```
http://localhost:3001
```

---

### 6️⃣ Start Bank Webhook Server

```bash
cd apps/bank-webhook
npm run build
node dist/index.js
```

Runs on:

```
http://localhost:3003
```

---

## 🎯 Why This Project Stands Out

This is not a CRUD demo.

It demonstrates:
- Real fintech transaction patterns
- Concurrency control
- Webhook integration
- OAuth + credential auth
- Monorepo architecture
- Shared infrastructure packages
- Transaction safety guarantees

---

## 📌 Future Improvements

- Webhook signature verification
- Payment failure simulation
- Redis-based job queue
- Real bank API integration
- Production deployment (Railway / Render / Vercel)

---

## 👨‍💻 Author

Sarthak Vyas  
Computer Science Engineering Student  
Full-Stack & Systems Enthusiast