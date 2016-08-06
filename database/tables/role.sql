CREATE TABLE role (
	id serial NOT NULL,
	name varchar NOT NULL UNIQUE,
	description varchar NOT NULL DEFAULT '',
	created  timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
	modified timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT role_pk PRIMARY KEY (id)
);
