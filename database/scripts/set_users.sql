-- Users
DO $$
DECLARE
BEGIN
	-- Delete User
	DELETE FROM "user" WHERE username = 'platform';

	-- Set User
	INSERT INTO "user" (username, password, email, emailVerified)
	VALUES ('platform', '$2a$10$l6S4ufQyi8emmKCQRHULiOByvGKG5Zbfud1DQv4eJJR6HEV6tlcsW', 'admin@platform.com', true);

	-- Delete Role
	DELETE FROM "role" WHERE name = 'admin';

	-- Set Role
	INSERT INTO "role" (name)
	VALUES ('admin');

	-- Delete Role Mapping
	DELETE FROM "rolemapping" WHERE principalid = 1;

	-- Map Role
	INSERT INTO "rolemapping" (principaltype, principalid, roleid)
	VALUES ('USER', 1, 1);
END $$;
