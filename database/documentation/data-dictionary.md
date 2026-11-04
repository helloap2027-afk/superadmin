# HELLO — MariaDB Database Data Dictionary

This document specifies the storage requirements, indexing strategies, data retention policies, and relational constraints for the **HELLO** MariaDB database.

## 1. Storage & Collation Standards
* **Database Engine**: `InnoDB` (ACID transactional support, row-level locking)
* **Character Set**: `utf8mb4`
* **Collation**: `utf8mb4_unicode_ci` (Supports English, Telugu script, and Unicode emojis)
* **Timestamps**: All timestamps stored in UTC (`DATETIME(3)`)

## 2. Retention Policies
* `otp_challenges`: Hard-deleted 7 days after creation or 24 hours after verification.
* `user_sessions`: Revoked sessions hard-deleted 90 days after revocation.
* `enquiry_events`: Retained indefinitely for dispute resolution and lead audit history.
* `audit_logs`: Retained for a minimum of 2 years in compliance with DPDP Act 2023.
* Soft-deleted `users` and `businesses`: Retained in `DELETED` / `SUSPENDED` state for 30 days before statutory anonymization.

## 3. Backup & Disaster Recovery Standards
* **Point-in-Time Recovery (PITR)**: Binary logging (`binlog`) enabled with continuous archive shipping.
* **Daily Full Dump**: Executed daily via `mariadb-dump` / `mysqldump` with `--single-transaction --quick`.
* **RPO**: < 5 minutes.
* **RTO**: < 15 minutes.

