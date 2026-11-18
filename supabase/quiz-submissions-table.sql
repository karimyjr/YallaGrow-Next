-- Run this once in Supabase SQL Editor.
-- Creates the quiz_submissions table that captures every "Find My Plan"
-- completion when a visitor hits Book a Call.

create table if not exists public.quiz_submissions (
  id              uuid        primary key default gen_random_uuid(),

  -- contact (collected right before the booking link opens)
  name            text        not null,
  email           text        not null,
  whatsapp        text,

  -- raw quiz answers
  business_type   text,                  -- local | startup | ecommerce | service | personal
  goal            text,                  -- awareness | leads | sales | presence | scale
  current_state   text,                  -- none | inconsistent | active | scaling
  services        text[]      default '{}',
  involvement     text,                  -- handoff | collab | guided
  budget          text,                  -- low | mid | high | unsure

  -- derived
  recommended_plan text,                 -- launch | grow | dominate
  addons          text[]      default '{}',

  -- lifecycle
  status          text        default 'new',   -- new | contacted | reviewing | won | lost
  booked_call     boolean     default false,   -- flipped true if we know they actually booked

  created_at      timestamptz default now()
);

create index if not exists quiz_submissions_created_at_idx
  on public.quiz_submissions (created_at desc);

create index if not exists quiz_submissions_status_idx
  on public.quiz_submissions (status);

create index if not exists quiz_submissions_email_idx
  on public.quiz_submissions (email);
