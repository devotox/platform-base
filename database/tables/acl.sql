CREATE TABLE acl (
	id serial NOT NULL,
	model varchar,
	property varchar,
	accesstype varchar,
	permission varchar,
	principaltype varchar,
	principalid varchar,
	CONSTRAINT acl_pk PRIMARY KEY (id)
);
