# HELLO — System Architecture & Monorepo Design

## 1. Executive Summary
**HELLO** is a production-grade hyperlocal business discovery and enquiry platform specifically engineered for Tier-2 and Tier-3 urban clusters in Andhra Pradesh, India (pilot cities: Vijayawada and Guntur) with pan-India scalability.

## 2. Monorepo Topology
```
hello-platform/
├── apps/
│   ├── website/         # Next.js 14 App Router (Public SEO Directory, hello-hi.in)
│   ├── admin/           # Next.js 14 Back-Office (admin.hello-hi.in)
│   ├── api/             # NestJS 10 REST Gateway (api.hello-hi.in)
│   └── mobile/          # React Native + Expo SDK 52 (Android & iOS Dual-Mode)
├── packages/
│   ├── contracts/       # Shared TypeScript DTOs & API Contracts
│   ├── validation/      # Indian phone, OTP, PIN, coordinate validation
│   ├── design-tokens/   # HELLO color tokens, typography, radii, spacing
│   ├── config/          # Environment schemas, pilot cities, app limits
│   └── utils/           # Haversine distance, INR currency, slug generators
├── database/            # MariaDB / MySQL Relational Schema (Prisma ORM)
├── infrastructure/      # cPanel Passenger, NGINX reverse proxy, CI/CD
└── docs/                # Architectural, database, security & testing docs
```

## 3. Hosting Architecture & Process Model
* **OS**: Ubuntu 24.04 VPS
* **Web Server**: Apache with Phusion Passenger
* **Reverse Proxy**: NGINX SSL Termination (HTTP/2)
* **Runtime**: Node.js 22 LTS
* **Database**: MariaDB 10.11+ / 11.4 LTS
* **Storage**: S3-compatible private object storage for KYC documents & public business photos

