-- SHOW ALL CONNECTIONS
CREATE OR REPLACE FUNCTION admin_show_all_connections(
	OUT datname VARCHAR,
	OUT usename VARCHAR,
	OUT pid INTEGER,
	OUT client_addr VARCHAR,
	OUT waiting BOOLEAN,
	OUT query_start TIMESTAMPTZ,
	OUT query VARCHAR
)
RETURNS SETOF RECORD AS $$

BEGIN
	RETURN QUERY
		SELECT 	p.datname::VARCHAR,
				p.usename::VARCHAR,
				p.pid::INTEGER,
				p.client_addr::VARCHAR,
				p.waiting::BOOLEAN,
				p.query_start::TIMESTAMPTZ,
				p.query::VARCHAR
		FROM 	pg_stat_activity p;
END;
$$ LANGUAGE PLPGSQL SECURITY DEFINER;

-- SHOW ALL STORED PROCEDURES
CREATE OR REPLACE FUNCTION admin_show_all_stored_procedures(
	OUT procedure_name VARCHAR
)
RETURNS SETOF VARCHAR AS $$

BEGIN
	RETURN QUERY 	SELECT  proname::VARCHAR
					FROM    pg_catalog.pg_namespace n
					JOIN    pg_catalog.pg_proc p
					ON      pronamespace = n.oid
					WHERE   nspname = 'public'
					ORDER BY proname;
END;
$$ LANGUAGE PLPGSQL SECURITY DEFINER;


-- DISCONNECT ALL LOGGED IN USERS EXCEPT YOURSELF
CREATE OR REPLACE FUNCTION admin_disconnect_all_users(
	OUT usename VARCHAR,
	OUT database VARCHAR,
	OUT app_name VARCHAR,
	OUT query 	VARCHAR,
	OUT terminated BOOLEAN
)
RETURNS SETOF RECORD AS $$

BEGIN
	RETURN QUERY 	SELECT 	sa.usename::VARCHAR,
							sa.datname::VARCHAR,
							sa.application_name::VARCHAR,
							sa.query::VARCHAR,
							pg_terminate_backend(sa.pid)
					FROM 	pg_stat_activity sa
					WHERE 	sa.datname = current_database()
							AND sa.pid <> pg_backend_pid();

END;
$$ LANGUAGE PLPGSQL SECURITY DEFINER;


-- DROP ANY FUNCTION BY NAME
CREATE OR REPLACE FUNCTION admin_drop_all_functions_by_name(
	IN functionname TEXT
)
RETURNS TEXT AS $$

DECLARE
	funcrow RECORD;
	numfunctions SMALLINT := 0;
	numparameters INT;
	i INT;
	paramtext TEXT;
BEGIN
	FOR funcrow IN SELECT proargtypes FROM pg_proc WHERE proname = functionname LOOP

		--for some reason array_upper is off by one for the oidvector type, hence the +1
		numparameters = array_upper(funcrow.proargtypes, 1) + 1;

		i = 0;
		paramtext = '';

		LOOP
			IF i < numparameters THEN
				IF i > 0 THEN
					paramtext = paramtext || ', ';
				END IF;
				paramtext = paramtext || (SELECT typname FROM pg_type WHERE oid = funcrow.proargtypes[i]);
				i = i + 1;
			ELSE
				EXIT;
			END IF;
		END LOOP;

		EXECUTE 'DROP FUNCTION IF EXISTS ' || functionname || '(' || paramtext || ');';
		numfunctions = numfunctions + 1;

	END LOOP;

RETURN 'Dropped ' || numfunctions || ' functions for ' || functionname;
END;
$$ LANGUAGE PLPGSQL SECURITY DEFINER;


-- LIST DROP COMMANDS
CREATE OR REPLACE FUNCTION admin_create_drop_commands(
	OUT command TEXT
)
RETURNS SETOF TEXT AS $$

BEGIN
	RETURN QUERY 	SELECT 'DROP FUNCTION IF EXISTS ' || proname || '(' || oidvectortypes(proargtypes) || ') CASCADE;'
					FROM    pg_catalog.pg_namespace n
					JOIN    pg_catalog.pg_proc p
					ON      pronamespace = n.oid
					WHERE   nspname = 'public'
					ORDER BY proname;
END;
$$ LANGUAGE PLPGSQL SECURITY DEFINER;


-- EXECUTE DROP COMMANDS
CREATE OR REPLACE FUNCTION admin_execute_drop_commands()
RETURNS VOID AS $$

DECLARE
	row RECORD;
BEGIN
	FOR row IN SELECT * FROM create_drop_commands() LOOP
		 EXECUTE row.command;
	END LOOP;
END;
$$ LANGUAGE PLPGSQL SECURITY DEFINER;
