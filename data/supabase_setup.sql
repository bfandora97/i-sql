-- Run once in the Supabase SQL Editor (Project → SQL Editor → New query).
-- Creates the table that stores which problems each signed-in user has
-- solved, with Row Level Security so a user can only ever see/change their
-- own rows (the publishable key shipped in the app is public by design;
-- this is what keeps it safe).

create table if not exists public.solved_problems (
  user_id    uuid references auth.users(id) on delete cascade not null,
  problem_id text not null,
  solved_at  timestamptz not null default now(),
  primary key (user_id, problem_id)
);

alter table public.solved_problems enable row level security;

create policy "select own solved_problems"
  on public.solved_problems for select
  using (auth.uid() = user_id);

create policy "insert own solved_problems"
  on public.solved_problems for insert
  with check (auth.uid() = user_id);

create policy "delete own solved_problems"
  on public.solved_problems for delete
  using (auth.uid() = user_id);
