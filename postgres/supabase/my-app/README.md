This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

# Supabase Insert Setup
## Install postgres
`npm install postgres server-only`

## Create locked down table
```
create schema if not exists app_private;

create table app_private.insert_demo (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  created_at timestamptz not null default now()
);
alter table app_private.insert_demo enable row level security;

revoke all on table app_private.insert_demo
from public, anon, authenticated, service_role;

-- A database account for this test, not a website-user account.
create role nextjs_insert_demo
with login password 'REPLACE_WITH_A_LONG_RANDOM_PASSWORD' -- Ideal no special case.
nosuperuser nocreatedb nocreaterole noinherit nobypassrls;

-- If needed, alter password.
-- alter role nextjs_insert_demo
-- with password 'REPLACE_WITH_A_NEW_LONG_RANDOM_PASSWORD';

grant usage on schema app_private to nextjs_insert_demo;

grant insert (message), select (id)
on app_private.insert_demo to nextjs_insert_demo;


create policy "demo_role_insert"
on app_private.insert_demo for insert
to nextjs_insert_demo with check (true);

create policy "demo_role_return_id"
on app_private.insert_demo for select
to nextjs_insert_demo using (true);
```

If you want to also ensure select is available.
```
grant usage on schema app_private to nextjs_insert_demo;

grant select on table app_private.insert_demo
to nextjs_insert_demo;
```

## Get or Create Password for postgres

## Connection URL
Using `Direct Connection String Transaction Pooler`
```
DATABASE_URL="postgresql://postgres.[SUPABASE_PROJECT_ID]:[POSTGRESS_PASSWORD]@[POOL]:[PORT]/postgres"
```