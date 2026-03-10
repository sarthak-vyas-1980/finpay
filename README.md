# 💳 FinPay — Full-Stack Digital Wallet with Bank Webhook Simulation

FinPay is a **full-stack digital wallet application** built using a **monorepo architecture with Turborepo**.

It supports **authentication, P2P transfers with transactional safety, simulated bank on-ramp payments, profile management, and advanced transaction tracking**.

This project demonstrates **real-world fintech backend architecture, database concurrency handling, secure transaction processing, and modern full-stack engineering practices.**

---

# 📷 Application Preview

<p align="center">
  <img src="./screenshots/landing.png" width="80%">
</p>

<p align="center">
  <img src="./screenshots/dashboard.png" width="45%">
  <img src="./screenshots/transactions.png" width="45%">
</p>

<p align="center">
  <img src="./screenshots/p2pTransfer.png" width="45%">
  <img src="./screenshots/addMoney.png" width="45%">
</p>

<p align="center">
  <img src="./screenshots/profile.png" width="45%">
  <img src="./screenshots/signin.png" width="45%">
</p>

---

# 🚀 Features

## 🔐 Authentication

- Google OAuth using **NextAuth**
- Credentials based login / signup
- Secure password hashing with **bcrypt**
- Session based authentication
- Protected routes using **server sessions**

---

## 💰 Wallet System

Each user has a persistent wallet stored in **PostgreSQL using Prisma ORM**.

### Balance Model

```
Total Balance = amount
Spendable Balance = amount - locked
```

### Capabilities

- Persistent wallet balances
- Locked vs unlocked balance management
- Prevent spending locked funds
- Real-time balance updates

---

## 🔁 P2P Transfers

Users can send money to another user using their **phone number**.

### Safety Features

- Row-level locking to prevent race conditions

```sql
SELECT * FROM "Balance"
WHERE "userId" = $1
FOR UPDATE
```

- Atomic database updates using **Prisma `$transaction`**
- Insufficient balance validation
- Self-transfer protection
- Automatic transaction history tracking

---

## 🏦 Bank On-Ramp Simulation

Simulates adding money through a **bank payment flow**.

### Flow

1. User clicks **Add Money**
2. `OnRampTransaction` created with **Processing** state
3. User redirected to **simulated bank page**
4. Bank confirms payment via **webhook**
5. Wallet balance updated
6. Transaction status → **Success**
7. User redirected back to dashboard

---

## 🔔 Webhook Architecture

A dedicated **bank simulation server built with Express**.

### Responsibilities

- Receive payment confirmations
- Validate transaction tokens
- Update wallet balances
- Mark transactions as successful

This replicates **real fintech webhook architecture**.

---

## 📊 Dashboard Analytics

Interactive dashboard showing:

- Wallet balance
- Monthly spending
- Total transactions
- Weekly spending chart
- Locked vs available funds

---

## 🔒 Balance Locking System

Users can lock part of their wallet balance.

Locked funds:

- Cannot be spent
- Remain reserved
- Can be unlocked anytime

Used for:

- Payment holds
- Security reserves
- Escrow-like behavior

---

## 📜 Transaction History

Unified transaction system combining:

### On-Ramp Transactions
Money added from bank.

### P2P Transfers
Money sent or received between users.

Features:

- Chronologically sorted
- Direction aware (**Sent / Received**)
- Provider and status tracking

---

## 🔎 Transaction Search & Filters

Users can explore transaction history using:

### Search

- Search by **name**
- Search by **phone number**

### Filters

- Transaction type
- Sent / Received
- On-ramp payments

---

## ⚠️ Transfer Safety Features

To prevent invalid operations:

- Insufficient balance validation
- Locked funds cannot be transferred
- Self-transfer protection
- Transaction locking for concurrency safety

---

## 👤 User Profile System

Users can manage their personal information.

Profile Features:

- Edit name
- Update phone number
- Change password
- Profile completion tracker

---

## 🖼 Avatar Upload

Users can upload a profile picture.

Implementation:

- Image uploaded to **Cloudinary**
- Avatar URL stored in database
- Displayed in the navbar
- Default avatar fallback

---

## 🪟 Transfer Confirmation Modal

Before sending money users see confirmation:

```
Send ₹500 to Rahul?
```

Prevents accidental transfers.

---

# 🏗 Monorepo Architecture

```
finpay/
│
├── apps/
│   ├── user-app        (Next.js frontend + server actions)
│   ├── bank-webhook    (Express webhook simulator)
│
├── packages/
│   ├── db              (Shared Prisma client)
│   ├── ui              (Reusable UI components)
│   ├── typescript-config
│
├── screenshots/
│
├── turbo.json
└── package.json
```

### Benefits

- Shared database client
- Reusable UI components
- Centralized TypeScript configuration
- Faster builds with **Turborepo caching**

---

# 🛠 Tech Stack

## Frontend

- Next.js (App Router)
- TypeScript
- TailwindCSS
- React Hooks
- Server Actions

## Backend

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- NextAuth

## Infrastructure

- Turborepo
- Docker (PostgreSQL)
- Prisma Studio
- Cloudinary (Avatar Storage)

---

# ⚙️ Database Schema Overview

### User

```
id
name
email
number
password
avatar
```

### Balance

```
userId
amount
locked
```

### P2PTransfer

```
fromUserId
toUserId
amount
timestamp
```

### OnRampTransaction

```
token
provider
status
startTime
userId
amount
```

---

# 🧪 Running Locally

## 1️⃣ Install Dependencies

```bash
npm install
```

---

## 2️⃣ Setup Environment

Create `.env` inside **packages/db**

```env
DATABASE_URL=postgresql://user:password@localhost:5432/finpay
NEXTAUTH_SECRET=your_secret

GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

---

## 3️⃣ Start PostgreSQL (Docker)

```bash
docker run --name finpay-db \
-e POSTGRES_PASSWORD=postgres \
-p 5432:5432 \
-d postgres
```

---

## 4️⃣ Run Prisma

```bash
cd packages/db

npx prisma migrate dev
npx prisma generate
```

---

## 5️⃣ Start User App

```bash
cd apps/user-app
npm run dev
```

Runs on:

```
http://localhost:3001
```

---

## 6️⃣ Start Bank Webhook Server

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

# 🎯 Why This Project Stands Out

This project demonstrates **real fintech engineering patterns**, not just CRUD.

Highlights:

- Transactional database safety
- Concurrency control with **row locking**
- Webhook-based payment architecture
- OAuth + credentials authentication
- Monorepo infrastructure
- Balance locking system
- Cloud-based media storage
- Modern **Next.js full-stack architecture**

---

# 📌 Future Improvements

Possible extensions:

- Email verification system
- Payment failure simulation
- Redis-based job queue
- Rate limiting for transfers
- Fraud detection rules
- Production deployment (Railway / Render / Vercel)

---

# 👨‍💻 Author

**Sarthak Vyas**

Computer Science Engineering Student  
Full-Stack & Systems Enthusiast