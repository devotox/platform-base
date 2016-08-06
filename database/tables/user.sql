CREATE TABLE "user" (
	id SERIAL NOT NULL,
	status varchar,
	realm varchar,
	username varchar,
	password varchar NOT NULL,
	credentials varchar,
	challenges varchar,
	email varchar NOT NULL,
	emailverified boolean,
	verificationtoken varchar,
	created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	lastupdated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT user_pk PRIMARY KEY (id)
);
