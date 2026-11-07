-- Cover photo shown on cards and detail pages, with its credit (author and licence).
alter table scholarships
  add column cover_url text check (cover_url is null or cover_url ~ '^(https?://|/)'),
  add column cover_credit text,
  add column cover_credit_url text check (cover_credit_url is null or cover_credit_url ~ '^https?://');
