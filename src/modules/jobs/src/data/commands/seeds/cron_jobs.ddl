INSERT INTO pgboss.schedule
(name, cron, timezone, "data","options")
VALUES('some-queue', '* * * * *', 'America/Chicago', '{"param": "testando"}'::jsonb, '{"tz": "America/Chicago"}'::jsonb);