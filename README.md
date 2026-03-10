# 💳 FinPay — Full-Stack Digital Wallet with Bank Webhook Simulation

FinPay is a **full-stack digital wallet application** built using a **monorepo architecture with Turborepo**.

It supports **authentication, P2P transfers with transactional safety, simulated bank on-ramp payments, profile management, and advanced transaction tracking**.

This project demonstrates **real-world fintech backend architecture, database concurrency handling, secure transaction processing, and modern full-stack engineering practices.**

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

This structure enables advanced features such as **fund reservation and transaction safety.**

---

## 🔁 P2P Transfers

Users can send money to another user using their **phone number**.

### Safety Features

- Row-level locking to prevent race conditions
- Atomic database updates using **Prisma `$transaction`**
- Insufficient balance validation
- Self-transfer protection
- Automatic transaction history tracking

This ensures **safe concurrent transactions similar to real fintech systems.**

---

## 🏦 Bank On-Ramp Simulation

FinPay simulates **adding money through a bank payment flow.**

### Payment Flow

1. User clicks **Add Money**
2. `OnRampTransaction` created with **Processing** state
3. User redirected to **simulated bank page**
4. Bank confirms payment via **webhook**
5. Wallet balance updated
6. Transaction status → **Success**
7. User redirected back to **dashboard**

---

## 🔔 Webhook Architecture

A dedicated **bank simulation server built with Express** handles payment confirmations.

### Responsibilities

- Receive payment confirmations
- Validate transaction tokens
- Update wallet balances
- Mark transactions as successful

This replicates **real fintech webhook-based payment architecture.**

---

## 📊 Dashboard Analytics

The dashboard provides real-time financial insights:

- Wallet balance
- Monthly spending
- Total transactions
- Weekly spending chart
- Locked vs available funds

Charts help users quickly understand their **financial activity trends.**

---

## 🔒 Balance Locking System

Users can **lock part of their wallet balance.**

Locked funds:

- Cannot be spent
- Remain reserved
- Can be unlocked anytime

### Real-world use cases

- Payment holds
- Security reserves
- Escrow-like behavior

---

## 📜 Transaction History

FinPay maintains a **unified transaction history** combining:

### On-Ramp Transactions
Money added via bank payments.

### P2P Transfers
Money sent or received between users.

### Features

- Chronologically sorted
- Direction aware (**Sent / Received**)
- Provider and status tracking

---

## 🔎 Transaction Search & Filters

Users can explore transactions using powerful filters.

### Search

- Search by **name**
- Search by **phone number**

### Filters

- Transaction type
- Sent / Received
- On-ramp payments

Results update instantly in the UI.

---

## ⚠️ Transfer Safety Mechanisms

To prevent invalid operations and fraud:

- Insufficient balance validation
- Locked funds cannot be transferred
- Self-transfer prevention
- Database locking for concurrency safety

---

## 👤 User Profile System

Users can manage personal information securely.

### Profile Features

- Edit name
- Update phone number
- Change password
- Profile completion tracker

All updates are handled through **secure server APIs.**

---

## 🖼 Avatar Upload

Users can upload profile pictures.

### Implementation

- Images uploaded to **Cloudinary**
- Avatar URL stored in database
- Displayed in the application navbar
- Default avatar fallback provided

Using Cloudinary removes the need for **manual file storage management during deployment.**

---

## 🪟 Transfer Confirmation Modal

Before sending money, users see a confirmation prompt.

```
Send ₹500 to Rahul?
```

This helps prevent **accidental transfers and improves UX.**

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

## 5️⃣ Start User Application

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

This project demonstrates **real fintech engineering patterns**, not just CRUD functionality.

### Highlights

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