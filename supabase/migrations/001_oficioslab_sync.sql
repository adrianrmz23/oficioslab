-- OficiosLab cloud sync for an existing Supabase project.
-- Safe to run alongside FluentLab tables because every table/bucket is prefixed.

create table if not exists public.oficioslab_user_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.oficioslab_user_state enable row level security;

drop policy if exists "oficioslab state select own" on public.oficioslab_user_state;
create policy "oficioslab state select own"
on public.oficioslab_user_state for select
using (auth.uid() = user_id);

drop policy if exists "oficioslab state insert own" on public.oficioslab_user_state;
create policy "oficioslab state insert own"
on public.oficioslab_user_state for insert
with check (auth.uid() = user_id);

drop policy if exists "oficioslab state update own" on public.oficioslab_user_state;
create policy "oficioslab state update own"
on public.oficioslab_user_state for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "oficioslab state delete own" on public.oficioslab_user_state;
create policy "oficioslab state delete own"
on public.oficioslab_user_state for delete
using (auth.uid() = user_id);

create table if not exists public.oficioslab_evidence (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  route_id text not null,
  route_name text not null,
  stage_title text not null,
  practice_title text not null,
  notes text not null default '',
  materials text not null default '',
  errors text not null default '',
  corrections text not null default '',
  attempt integer not null default 1 check (attempt >= 1),
  result text not null default '',
  mastery integer not null default 0 check (mastery between 0 and 5),
  photo_path text
);

create index if not exists oficioslab_evidence_user_created_idx
  on public.oficioslab_evidence(user_id, created_at desc);

alter table public.oficioslab_evidence enable row level security;

drop policy if exists "oficioslab evidence select own" on public.oficioslab_evidence;
create policy "oficioslab evidence select own"
on public.oficioslab_evidence for select
using (auth.uid() = user_id);

drop policy if exists "oficioslab evidence insert own" on public.oficioslab_evidence;
create policy "oficioslab evidence insert own"
on public.oficioslab_evidence for insert
with check (auth.uid() = user_id);

drop policy if exists "oficioslab evidence update own" on public.oficioslab_evidence;
create policy "oficioslab evidence update own"
on public.oficioslab_evidence for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "oficioslab evidence delete own" on public.oficioslab_evidence;
create policy "oficioslab evidence delete own"
on public.oficioslab_evidence for delete
using (auth.uid() = user_id);

create table if not exists public.oficioslab_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  route_id text not null,
  stage_number integer not null,
  answers jsonb not null default '[]'::jsonb,
  feedback text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists oficioslab_assessments_user_created_idx
  on public.oficioslab_assessments(user_id, created_at desc);

alter table public.oficioslab_assessments enable row level security;

drop policy if exists "oficioslab assessments select own" on public.oficioslab_assessments;
create policy "oficioslab assessments select own"
on public.oficioslab_assessments for select
using (auth.uid() = user_id);

drop policy if exists "oficioslab assessments insert own" on public.oficioslab_assessments;
create policy "oficioslab assessments insert own"
on public.oficioslab_assessments for insert
with check (auth.uid() = user_id);

drop policy if exists "oficioslab assessments delete own" on public.oficioslab_assessments;
create policy "oficioslab assessments delete own"
on public.oficioslab_assessments for delete
using (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'oficioslab-evidence',
  'oficioslab-evidence',
  false,
  10485760,
  array['image/jpeg','image/png','image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "oficioslab evidence storage select own" on storage.objects;
create policy "oficioslab evidence storage select own"
on storage.objects for select
to authenticated
using (
  bucket_id = 'oficioslab-evidence'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "oficioslab evidence storage insert own" on storage.objects;
create policy "oficioslab evidence storage insert own"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'oficioslab-evidence'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "oficioslab evidence storage update own" on storage.objects;
create policy "oficioslab evidence storage update own"
on storage.objects for update
to authenticated
using (
  bucket_id = 'oficioslab-evidence'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'oficioslab-evidence'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "oficioslab evidence storage delete own" on storage.objects;
create policy "oficioslab evidence storage delete own"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'oficioslab-evidence'
  and (storage.foldername(name))[1] = auth.uid()::text
);
