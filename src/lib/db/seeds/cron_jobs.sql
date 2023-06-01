INSERT INTO pgboss.schedule
(name, cron, timezone, "data","options")
VALUES('daily-scheduler', '* * * * *', 'America/Chicago', '{"param": "teste"}'::jsonb, '{"tz": "America/Chicago"}'::jsonb);