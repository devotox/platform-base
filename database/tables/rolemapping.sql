CREATE TABLE rolemapping (
	id SERIAL NOT NULL,
	principaltype varchar,
	principalid integer,
	roleid integer,
	CONSTRAINT rolemapping_pk PRIMARY KEY (id)
);
