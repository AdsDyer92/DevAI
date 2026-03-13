create extension if not exists postgis;

create table users (
  id uuid primary key,
  email text unique not null,
  created_at timestamptz default now()
);

create table projects (
  id uuid primary key,
  user_id uuid references users(id),
  site_address text not null,
  borough text,
  site_geom geometry(Point, 4326),
  created_at timestamptz default now()
);

create table saved_reports (
  id uuid primary key,
  project_id uuid references projects(id),
  payload jsonb not null,
  created_at timestamptz default now()
);

create table planning_applications (
  id uuid primary key,
  reference text not null,
  decision text,
  committee_name text,
  vote_split text,
  site_geom geometry(Point, 4326),
  metadata jsonb default '{}'::jsonb
);

create table councillor_votes (
  id uuid primary key,
  planning_application_id uuid references planning_applications(id),
  councillor_name text not null,
  vote text not null check (vote in ('for', 'against', 'abstain'))
);
