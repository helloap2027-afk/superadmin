# 01-WALLET-EXISTING-SYSTEM-AUDIT.md
## Executive Summary & Existing Platform Wallet System Audit

**Audit Timestamp:** 2026-11-05T16:52:00+05:30  
**Project:** HELLO-Hi Hyperlocal Discovery Platform  
**Target Module:** Business Partner Account Center & Wallet Management System  
**Scope:** Website Only (`apps/website`), Super Admin Wallet Interoperability (`apps/admin`), Backend Financial Ledger (`apps/api`), and MySQL/SQLite Database (`apps/api/src/database`).

---

### 1. Existing Super Admin Wallet Audit Matrix

| Feature | Audit Status | Code / Architecture Findings |
|---|---|---|
| **Wallet Overview & Stats** | **PARTIAL** | Super Admin has `/payments/wallet-transactions`, displaying summary cards (Total Recharges, Credits Consumed, Total Transactions) and filters. However, the NestJS route was missing/shadowed by `@Get("payments/:id")` causing a 404 error when hitting `/api/v1/admin/payments/wallet-transactions`. |
| **Customer vs Business Partner Separation** | **IMPLEMENTED (Schema) / MISSING (Account UI)** | Table `wallet_transactions` contains `user_type` column (`CUSTOMER` vs `MERCHANT`). However, there was no customer-facing or partner-facing wallet page on the website. |
| **Authoritative Wallet Ledger** | **PARTIAL** | Table `wallet_transactions` records `wallet_id`, `user_name`, `user_type`, `type`, `amount`, `balance_after`, `reference`, `status`, `created_at`. No dedicated master `wallets` table exists yet—wallet balance is derived or computed. |
| **Credits & Debits** | **PARTIAL** | Types `CREDIT`, `DEBIT`, `REFUND` are present in seed rows and schema. Direct transactional balance mutation service needs formalization. |
| **Top-ups / Add Money** | **MISSING** | No user-facing top-up endpoint existed for merchants. Payments module handles subscriptions via Razorpay/manual (`payments` table). |
| **Settlement & Withdrawals** | **PARTIAL** | Table `withdrawals` exists in database (`id`, `merchant_id`, `merchant_name`, `amount`, `bank_account`, `ifsc_code`, `status`, `payout_ref`, `requested_at`). Admin UI exists at `/payments/withdrawals`. |
| **Server-Side Filters & Pagination** | **IMPLEMENTED** | Admin `/payments/wallet-transactions` page specifies `search`, `type`, `status`, `userType`, `page`, `pageSize`. |
| **Financial Atomicity & Reconciliation** | **BLOCKED (Requires Implementation)** | Dual-engine SQLite + MySQL architecture requires atomic transactions with idempotency keys and running balance calculation to prevent race conditions and double-spending. |

---

### 2. Database Schema Audit

#### 2.1 Existing Tables
1. **`wallet_transactions`**:
   - `id TEXT PRIMARY KEY`
   - `wallet_id TEXT NOT NULL`
   - `user_name TEXT NOT NULL`
   - `user_type TEXT NOT NULL` (`CUSTOMER` | `MERCHANT`)
   - `type TEXT NOT NULL` (`CREDIT` | `DEBIT` | `REFUND`)
   - `amount REAL NOT NULL`
   - `balance_after REAL NOT NULL`
   - `reference TEXT NOT NULL`
   - `status TEXT NOT NULL` (`SUCCESS` | `PENDING` | `FAILED`)
   - `created_at TEXT NOT NULL`
2. **`withdrawals`**:
   - `id TEXT PRIMARY KEY`, `merchant_id`, `merchant_name`, `amount`, `bank_account`, `ifsc_code`, `status`, `payout_ref`, `requested_at`, `processed_at`
3. **`payments`**:
   - Records subscription and gateway payments (`id`, `transaction_ref`, `payer_name`, `payer_email`, `payer_type`, `amount`, `currency`, `payment_method`, `status`, `gateway_ref`, `description`, `created_at`).

#### 2.2 Architectural Enhancement Plan
To satisfy the non-negotiable requirements without breaking changes:
- Create a dedicated `wallets` table:
  `id TEXT PRIMARY KEY`, `user_id TEXT NOT NULL`, `business_id TEXT`, `role TEXT NOT NULL` (`MERCHANT` | `CUSTOMER`), `currency TEXT NOT NULL DEFAULT 'INR'`, `balance REAL NOT NULL DEFAULT 0.00`, `status TEXT NOT NULL DEFAULT 'ACTIVE'`, `updated_at TEXT NOT NULL`, `UNIQUE(user_id, role)`.
- Link `wallet_transactions` with `user_id`, `business_id`, and `category` (`TOPUP`, `SUBSCRIPTION`, `LEAD_UNLOCK`, `REWARD`, `REFUND`, `WITHDRAWAL`, `ADJUSTMENT`).
- Reconcile `wallets.balance` with the sum of ledger entries.

---

### 3. Website Routing & Account Center Architecture

- **Canonical Route**: `/vendor/wallet`
- **Persistent Sidebar Navigation**:
  - `Dashboard`: `/vendor/dashboard`
  - `My Business`: `/vendor/manage-business`
  - `Wallet`: `/vendor/wallet` (Highlighted with soft orange background, active left bar)
  - `Subscription`: `/vendor/profile#kyc` or `/vendor/subscription`
  - `Everything`: Modal / Drawer or `/vendor/tools` listing existing authorized business tools (Profile & KYC, Leads, Performance, Operating Hours, Documents, Support)
  - `Logout`: Centralized session signout with confirmation dialog
- **Header Profile Avatar Activation**:
  Clicking the Business Partner profile/avatar in `BusinessPartnerHeader.tsx` directly opens `/vendor/wallet`.

