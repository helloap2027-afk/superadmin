# HELLO — Security & India DPDP Act 2023 Compliance

## 1. Zero Trust & Defense-in-Depth
* **Authentication**: SMS OTP verification with Redis sliding-window rate limit (max 3 per 15 minutes per phone number; 45s cooldown).
* **Token Lifecycle**: Short-lived JWT access tokens (15 minutes) paired with rotating refresh tokens (30 days). Refresh token reuse triggers full session family invalidation.
* **Row-Level Tenancy Guard**: Business owners and staff are strictly restricted to leads, hours, and media belonging to their assigned `businessId`. No cross-tenant data leakage.
* **MariaDB Protection**: All database queries executed via parameterized prepared statements using Prisma ORM. Zero raw string concatenation.

## 2. India Digital Personal Data Protection (DPDP) Act 2023
* **Consent Architecture**: Explicit multilingual consent notice in English and Telugu collected prior to account creation.
* **Purpose Limitation**: Customer phone numbers are shared strictly with the business the customer explicitly contacts via direct call, WhatsApp, or instant lead form.
* **Right to Erasure**: Complete account anonymization and soft-delete workflow with a statutory 30-day grace period.

