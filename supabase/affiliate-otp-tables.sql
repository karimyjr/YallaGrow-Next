-- Run this once in Supabase SQL Editor.
-- Creates the two tables needed for OTP-based affiliate login.

-- ───── OTP codes table ─────
-- One row per code sent. Rows expire + get cleaned up.
create table if not exists public.affiliate_otp_codes (
  id            uuid primary key default gen_random_uuid(),
  email         text not null,              -- lowercased
  code_hash     text not null,              -- sha256 of the 4-digit code (never store plaintext)
  attempts      int  not null default 0,    -- wrong-code attempts, invalidate at 5
  used          boolean not null default false,
  expires_at    timestamptz not null,       -- now() + 10 minutes when created
  created_at    timestamptz not null default now()
);

create index if not exists affiliate_otp_codes_email_idx
  on public.affiliate_otp_codes (email, created_at desc);

create index if not exists affiliate_otp_codes_expires_idx
  on public.affiliate_otp_codes (expires_at);

-- ───── Sessions table ─────
-- One row per active login. 7-day TTL.
create table if not exists public.affiliate_sessions (
  token         text primary key,            -- long random string, set as cookie value
  affiliate_id  uuid not null references public.affiliates(id) on delete cascade,
  email         text not null,               -- cached for quick lookup
  expires_at    timestamptz not null,        -- now() + 7 days when created
  created_at    timestamptz not null default now(),
  last_seen_at  timestamptz not null default now()
);

create index if not exists affiliate_sessions_affiliate_idx
  on public.affiliate_sessions (affiliate_id);

create index if not exists affiliate_sessions_expires_idx
  on public.affiliate_sessions (expires_at);
