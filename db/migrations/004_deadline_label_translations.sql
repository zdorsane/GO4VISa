-- Short deadline text shown instead of the date when it is approximate or course-dependent
-- ("Early January 2027", "8 Dec 2026 or 6 Jan 2027"), and the English/Arabic versions of the
-- texts written in French (filled by the translation step, keyed by language).
alter table scholarships
  add column deadline_label text,
  add column translations jsonb not null default '{}'::jsonb;
