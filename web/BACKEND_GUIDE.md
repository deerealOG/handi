# HANDI Backend Integration Guide

> This guide documents the steps needed to replace the current frontend mock data with a real backend. It covers auth, database schema, Paystack integration, and deployment.

---

## 1. Authentication (NextAuth / Custom JWT)

### Recommended Stack

- **NextAuth.js v5** with credentials + Google/Facebook providers
- **JWT** for stateless sessions; **refresh tokens** for long-lived auth

### Key Endpoints

| Method | Path                        | Purpose                            |
| ------ | --------------------------- | ---------------------------------- |
| POST   | `/api/auth/register`        | Email + password signup, sends OTP |
| POST   | `/api/auth/verify-otp`      | Verify OTP, activate account       |
| POST   | `/api/auth/login`           | Returns JWT + refresh token        |
| POST   | `/api/auth/forgot-password` | Sends reset link                   |
| POST   | `/api/auth/reset-password`  | Reset password with token          |

### Roles

```ts
enum UserRole {
  CLIENT,
  PROVIDER,
  ADMIN,
}
enum AdminRole {
  SUPER_ADMIN,
  MODERATOR,
  SUPPORT_AGENT,
  DATA_ANALYST,
  FINANCE_MANAGER,
  CONTENT_MANAGER,
}
```

---

## 2. Database Schema (PostgreSQL + Prisma)

### Core Models

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  phone     String?
  password  String
  firstName String
  lastName  String
  avatar    String?
  role      UserRole @default(CLIENT)
  adminRole AdminRole?
  verified  Boolean  @default(false)
  createdAt DateTime @default(now())
}

model Provider {
  id        String  @id @default(cuid())
  userId    String  @unique
  user      User    @relation(fields: [userId], references: [id])
  business  String
  category  String
  bio       String?
  rating    Float   @default(0)
  jobs      Int     @default(0)
  status    ProviderStatus @default(PENDING)
  bankCode  String?
  accountNo String?
}

model Service {
  id         String  @id @default(cuid())
  providerId String
  provider   Provider @relation(fields: [providerId], references: [id])
  name       String
  category   String
  price      Int
  status     ServiceStatus @default(ACTIVE)
}

model Booking {
  id         String  @id @default(cuid())
  clientId   String
  providerId String
  serviceId  String
  date       DateTime
  status     BookingStatus @default(PENDING)
  amount     Int
  note       String?
}

model Transaction {
  id         String  @id @default(cuid())
  bookingId  String?
  fromUserId String?
  toUserId   String?
  amount     Int
  type       TxnType
  status     TxnStatus @default(PENDING)
  ref        String  @unique
  gateway    String  @default("paystack")
  channel    String?
  createdAt  DateTime @default(now())
}

model AdminLog {
  id        String   @id @default(cuid())
  adminId   String
  action    String
  target    String
  details   String?
  createdAt DateTime @default(now())
}
```

---

## 3. Paystack Integration

### Environment Variables

```env
PAYSTACK_SECRET_KEY=sk_live_xxxx
PAYSTACK_PUBLIC_KEY=pk_live_xxxx
PAYSTACK_WEBHOOK_SECRET=whsec_xxxx
```

### Payment Flow

1. Client books service → frontend calls `/api/payments/initialize`
2. Backend calls Paystack `POST /transaction/initialize` with amount + callback URL
3. Client is redirected to Paystack checkout
4. On success, Paystack redirects to callback → backend verifies via `GET /transaction/verify/:reference`
5. Backend creates Transaction record, updates Booking status

### Webhook Handler (`/api/webhooks/paystack`)

- Validate signature using `PAYSTACK_WEBHOOK_SECRET`
- Handle events: `charge.success`, `transfer.success`, `transfer.failed`, `refund.processed`
- Idempotency: check `reference` before processing

### Refunds & Chargebacks

```ts
// POST /api/admin/refund
// Body: { transactionId, reason }
// → Calls Paystack POST /refund with transaction reference
// → Creates AdminLog entry

// POST /api/admin/chargeback
// Body: { transactionId, reason }
// → Updates Transaction status to CHARGEBACK
// → Creates AdminLog entry
// → Notifies affected parties
```

### Provider Payouts

- Use Paystack **Transfers** API
- Provider adds bank via `/api/provider/bank` → calls Paystack `POST /transferrecipient`
- Withdrawal via `/api/provider/withdraw` → calls Paystack `POST /transfer`

---

## 4. API Structure

```
/api
├── auth/
│   ├── register.ts
│   ├── login.ts
│   ├── verify-otp.ts
│   └── forgot-password.ts
├── users/
│   ├── [id].ts
│   └── me.ts
├── providers/
│   ├── index.ts (list)
│   ├── [id].ts (detail)
│   └── [id]/services.ts
├── services/
│   └── index.ts
├── bookings/
│   ├── index.ts
│   └── [id].ts
├── payments/
│   ├── initialize.ts
│   └── verify.ts
├── admin/
│   ├── users.ts
│   ├── providers.ts
│   ├── transactions.ts
│   ├── refund.ts
│   ├── analytics.ts
│   └── logs.ts
└── webhooks/
    └── paystack.ts
```

---

## 5. Deployment

### Recommended Stack

| Layer        | Option                        |
| ------------ | ----------------------------- |
| Frontend     | Vercel (Next.js native)       |
| Database     | Railway PostgreSQL / Supabase |
| ORM          | Prisma                        |
| File Storage | Cloudinary / AWS S3           |
| Email        | Resend / SendGrid             |
| Monitoring   | Sentry                        |

### Steps

1. `npx prisma migrate deploy` to set up schema
2. Set all env vars in Vercel dashboard
3. Enable Paystack webhook URL: `https://yourdomain.com/api/webhooks/paystack`
4. Set up Sentry for error tracking
5. Configure CORS and rate limiting

---

## 6. Migration Checklist

- [ ] Replace all `MOCK_*` constants with API calls
- [ ] Add loading/error states to all tabs
- [ ] Implement real-time notifications (WebSocket or Pusher)
- [ ] Add input validation (Zod schemas)
- [ ] Implement RBAC middleware for admin routes
- [ ] Add rate limiting to auth endpoints
- [ ] Set up automated backups for database
- [ ] Add comprehensive API tests
