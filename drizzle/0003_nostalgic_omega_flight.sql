ALTER TABLE `user` RENAME COLUMN `google_name` TO `email`;

CREATE TABLE `user_new` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`google_id` text NOT NULL
);

DROP TABLE user;

ALTER TABLE user_new RENAME TO user;
