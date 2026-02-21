# TODO: Fix Database Error Saving New User

## Issue
Database error when creating a new user account - "create account not working"

## Root Cause
Schema mismatch between Prisma and Supabase:
- Supabase expects `profiles.id` to reference `auth.users(id)` (foreign key)
- Prisma has `@default(uuid())` which tries to auto-generate ID, violating the FK constraint

## Plan

### Step 1: Fix Prisma Schema
- [ ] Remove `@default(uuid())` from Profile.id field in prisma/schema.prisma
- [ ] Make id required but without auto-generation (Supabase handles this via trigger)

### Step 2: Add Direct Database URL
- [ ] Add DIRECT_DATABASE_URL to .env for migrations (bypassing pgbouncer)

### Step 3: Sync Database
- [ ] Run prisma generate
- [ ] Run prisma db push to sync schema

### Step 4: Test Registration
- [ ] Test creating a new account

