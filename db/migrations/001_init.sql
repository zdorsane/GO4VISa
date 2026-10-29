-- Go4Visa platform: admins, scholarships, news, media, newsletter, activity log.
-- Applied by `npm run db:migrate` (scripts/migrate.mjs), which records each file in schema_migrations.

create extension if not exists pgcrypto;

-- ── Admin accounts and sessions ─────────────────────────────────────────────
create table admin_users (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique check (email = lower(email) and position('@' in email) > 1),
  name          text not null check (length(name) between 1 and 120),
  password_hash text not null,
  role          text not null default 'editor' check (role in ('owner', 'admin', 'editor')),
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  last_login_at timestamptz
);

-- Server-side sessions: the cookie only holds a random token, the database stores its hash.
create table admin_sessions (
  token_hash text primary key,
  user_id    uuid not null references admin_users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  user_agent text
);
create index admin_sessions_user_idx on admin_sessions(user_id);

-- Failed logins, used to throttle brute-force attempts per e-mail and per IP.
create table login_attempts (
  id         bigserial primary key,
  email      text not null,
  ip         text,
  created_at timestamptz not null default now()
);
create index login_attempts_email_idx on login_attempts(email, created_at);
create index login_attempts_ip_idx on login_attempts(ip, created_at);

-- ── Scholarships ────────────────────────────────────────────────────────────
create table scholarships (
  id                    uuid primary key default gen_random_uuid(),
  slug                  text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  content_lang          text not null default 'en' check (content_lang in ('fr', 'en', 'ar')),

  title                 text not null check (length(title) between 3 and 200),
  institution           text not null check (length(institution) between 2 and 200),
  logo_url              text,
  country_code          text not null check (country_code ~ '^[A-Z]{2}$'),
  city                  text,

  levels                text[] not null default '{}',
  categories            text[] not null default '{}',
  fields                text[] not null default '{}',
  tags                  text[] not null default '{}',

  eligible_nationalities text,
  -- explicit answer for the core audience; 'unknown' until checked on the official source
  algeria_eligible      text not null default 'unknown' check (algeria_eligible in ('yes', 'no', 'unknown')),
  qualifications        text,
  age_limit             text,
  language_requirements text,

  funding_type          text not null default 'unknown' check (funding_type in ('full', 'partial', 'stipend', 'unpaid', 'unknown')),
  tuition               text,
  stipend               text,
  accommodation         text,
  travel                text,
  insurance             text,
  duration              text,

  opens_at              timestamptz,
  deadline_at           timestamptz,
  -- free text for nuances such as "course-dependent" or the official timezone
  deadline_note         text,

  application_url       text check (application_url is null or application_url ~ '^https?://'),
  source_url            text check (source_url is null or source_url ~ '^https?://'),
  verified_at           date,
  verification          text not null default 'needs_verification' check (verification in ('verified', 'needs_verification')),

  summary               text,
  description           text,
  documents             text,
  instructions          text,

  featured              boolean not null default false,
  status                text not null default 'draft' check (status in ('draft', 'review', 'approved', 'published', 'archived')),
  published_at          timestamptz,

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  created_by            uuid references admin_users(id) on delete set null,
  updated_by            uuid references admin_users(id) on delete set null,

  -- a published opportunity must cite where it was checked
  constraint scholarships_published_needs_source check (status <> 'published' or source_url is not null),
  constraint scholarships_dates_order check (opens_at is null or deadline_at is null or opens_at <= deadline_at)
);
create index scholarships_status_idx on scholarships(status);
create index scholarships_deadline_idx on scholarships(deadline_at);
create index scholarships_country_idx on scholarships(country_code);
create index scholarships_levels_idx on scholarships using gin(levels);
create index scholarships_categories_idx on scholarships using gin(categories);

-- Extra verification sources (the main one is scholarships.source_url).
create table scholarship_sources (
  id             uuid primary key default gen_random_uuid(),
  scholarship_id uuid not null references scholarships(id) on delete cascade,
  url            text not null check (url ~ '^https?://'),
  label          text,
  checked_at     date,
  notes          text,
  created_at     timestamptz not null default now()
);
create index scholarship_sources_sch_idx on scholarship_sources(scholarship_id);

-- ── News ────────────────────────────────────────────────────────────────────
create table news (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  content_lang    text not null default 'fr' check (content_lang in ('fr', 'en', 'ar')),
  title           text not null check (length(title) between 3 and 200),
  cover_url       text,
  summary         text,
  body            text not null default '',
  category        text not null default 'announcement',
  labels          text[] not null default '{}',
  country_code    text check (country_code is null or country_code ~ '^[A-Z]{2}$'),
  university      text,
  author          text,
  source_url      text check (source_url is null or source_url ~ '^https?://'),
  scholarship_id  uuid references scholarships(id) on delete set null,
  seo_title       text,
  seo_description text,
  status          text not null default 'draft' check (status in ('draft', 'published')),
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  created_by      uuid references admin_users(id) on delete set null,
  updated_by      uuid references admin_users(id) on delete set null
);
create index news_status_idx on news(status, published_at desc);

-- ── Media library (files live in Vercel Blob) ──────────────────────────────
create table media (
  id           uuid primary key default gen_random_uuid(),
  url          text not null unique,
  pathname     text not null,
  content_type text not null,
  size         integer not null check (size > 0),
  alt          text,
  uploaded_by  uuid references admin_users(id) on delete set null,
  created_at   timestamptz not null default now()
);

-- ── Newsletter ──────────────────────────────────────────────────────────────
create table newsletter_subscribers (
  id                uuid primary key default gen_random_uuid(),
  email             text not null unique check (email = lower(email) and position('@' in email) > 1),
  lang              text not null default 'fr' check (lang in ('fr', 'en', 'ar')),
  unsubscribe_token text not null unique default encode(gen_random_bytes(24), 'hex'),
  subscribed_at     timestamptz not null default now(),
  unsubscribed_at   timestamptz
);

-- ── Activity log ────────────────────────────────────────────────────────────
create table activity_logs (
  id         bigserial primary key,
  user_id    uuid references admin_users(id) on delete set null,
  action     text not null,
  entity     text not null,
  entity_id  text,
  detail     jsonb,
  created_at timestamptz not null default now()
);
create index activity_logs_created_idx on activity_logs(created_at desc);
