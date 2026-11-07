-- Messages sent from the public site: the contact form and the student feedback box.
create table messages (
  id         uuid primary key default gen_random_uuid(),
  kind       text not null check (kind in ('contact', 'feedback')),
  name       text not null check (length(name) between 1 and 120),
  email      text check (email is null or position('@' in email) > 1),
  phone      text,
  subject    text,
  message    text not null check (length(message) between 1 and 4000),
  rating     smallint check (rating between 1 and 5),
  lang       text check (lang in ('fr', 'en', 'ar')),
  read_at    timestamptz,
  created_at timestamptz not null default now()
);
create index messages_created_idx on messages (created_at desc);
