CREATE TABLE profile (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	firstname varchar NOT NULL,
	lastname varchar NOT NULL,
	birthdate TIMESTAMP NULL,
	gender gender NULL,
	attributes JSONB,
	created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	modified TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT profile_pk PRIMARY KEY (id)
);
