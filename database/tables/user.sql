CREATE TABLE "user" (
	id SERIAL NOT NULL,
	status VARCHAR,
	realm VARCHAR,
	username VARCHAR,
	password VARCHAR NOT NULL,
	credentials VARCHAR,
	challenges VARCHAR,
	email VARCHAR NOT NULL,
	emailverified BOOLEAN,
	verificationtoken VARCHAR,
	created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	lastupdated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT user_pk PRIMARY KEY (id),
	CONSTRAINT username_uniq UNIQUE(username),
	CONSTRAINT email_uniq UNIQUE(email)
);
