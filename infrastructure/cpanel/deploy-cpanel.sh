#!/usr/bin/env bash
set -e

# =============================================================
# HELLO Production Deployment Script for cPanel / Phusion Passenger
# =============================================================

echo "--- [1/5] Checking Environment & Node.js version ---"
node -v
pnpm -v

echo "--- [2/5] Installing Workspace Dependencies ---"
pnpm install --frozen-lockfile

echo "--- [3/5] Compiling Shared Packages & Applications ---"
pnpm turbo run build

echo "--- [4/5] Executing MariaDB Database Migrations ---"
pnpm --filter @hello/database prisma:deploy

echo "--- [5/5] Zero-Downtime Phusion Passenger Restart ---"
mkdir -p apps/api/tmp && touch apps/api/tmp/restart.txt
mkdir -p apps/website/tmp && touch apps/website/tmp/restart.txt
mkdir -p apps/admin/tmp && touch apps/admin/tmp/restart.txt

echo ">>> HELLO Platform deployed and restarted successfully!"

