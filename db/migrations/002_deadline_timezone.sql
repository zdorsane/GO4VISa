-- Official time zone of the deadline (IANA name, e.g. Europe/London).
-- Null means the official source does not state one: the site then shows the date only.
alter table scholarships add column deadline_tz text check (deadline_tz is null or deadline_tz ~ '^[A-Za-z_]+(/[A-Za-z_+-]+)*$');
