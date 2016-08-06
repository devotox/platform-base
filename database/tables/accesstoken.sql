CREATE TABLE accesstoken (
	id varchar NOT NULL,
	created timestamp with time zone,
	userid integer,
	ttl integer,
	CONSTRAINT accesstoken_pk PRIMARY KEY (id)
);
