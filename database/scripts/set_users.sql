-- Users
DO $$
DECLARE
BEGIN
	-- Delete User
	DELETE FROM "user" WHERE username = 'platform';

	-- Set User
	INSERT INTO "user" (username, password, email, emailVerified)
	VALUES ('platform', '$2a$10$Dxe.fNvS5w2Aj1ZJX4OKmelK0dR7iGQW6LPVs1YSVcx1RyibqkSQy', 'admin@platform.com', true);

	-- Delete Profile
	DELETE FROM "profile" WHERE user_id = 1;

	INSERT INTO "profile" (user_id, firstname, lastname, gender, email, image)
	VALUES (1, 'Devonte', 'Emokpae', 'M', 'admin@platform.com', '//lh3.googleusercontent.com/-apO1C4bT-60/AAAAAAAAAAI/AAAAAAAAIJs/wzxeOUNIELE/s120-c/photo.jpg');

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
