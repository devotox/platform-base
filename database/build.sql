-- Ensure All connections are terminated
SELECT 	pg_terminate_backend(pg_stat_activity.pid)
	FROM 	pg_stat_activity
	WHERE 	datname = 'platform'
			AND pid <> pg_backend_pid();

DROP DATABASE IF EXISTS platform;

DO
$createusers$
BEGIN
	IF NOT EXISTS (
		SELECT *
		FROM   pg_catalog.pg_user
		WHERE  usename = 'platform_public')
	THEN
		CREATE USER platform_public WITH PASSWORD 'platform';
	END IF;

	IF NOT EXISTS (
		SELECT *
		FROM   pg_catalog.pg_user
		WHERE  usename = 'platform_secure')
	THEN
		CREATE USER platform_secure WITH PASSWORD 'platform';
	END IF;

	IF NOT EXISTS (
		SELECT *
		FROM   pg_catalog.pg_user
		WHERE  usename = 'platform_admin')
	THEN
		CREATE USER platform_admin WITH LOGIN PASSWORD 'platform' SUPERUSER;
	END IF;
END;
$createusers$;

SET ROLE 'platform_admin';

CREATE DATABASE platform;

-- ensure we are using the appropriate db
\c platform;

-- ensure the DB is using the same config settings as prod/testing servers
ALTER SYSTEM SET TIMEZONE TO 'UTC';

-- Set number of parallel workers
SET max_parallel_workers_per_gather = 4;

-- ensure platform only has access to execute the sprocs we create and expose
GRANT CONNECT ON DATABASE platform TO platform_public;
GRANT CONNECT ON DATABASE platform TO platform_secure;

GRANT USAGE ON SCHEMA public TO platform_public;
GRANT USAGE ON SCHEMA public TO platform_secure;

-- Enable Extensions
\echo
\echo Enable hstore support
CREATE EXTENSION "hstore";

\echo
\echo Enable uuid support
CREATE EXTENSION "uuid-ossp";

-- \echo
-- \echo Enable PostGIS geospatial support
-- CREATE EXTENSION "postgis";

\echo
\echo Enable unaccent() support
CREATE EXTENSION "unaccent";

-- create required domains
\i initialize/domains.sql;

-- database functions ( order-dependent )
\i helpers/utils.sql;
\i initialize/functions.sql;

-- database structure ( order-dependent )
\i initialize/types.sql;
\i initialize/tables.sql;
\i initialize/indexes.sql;
\i initialize/stored_procedures.sql;

-- populate with data
\i scripts/populate_sample_data.sql;

-- make sure we have minimum set of possible permissions
\echo
\echo Revoke Permissions on all tables from public
REVOKE ALL ON ALL TABLES IN SCHEMA information_schema FROM public;
