CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`google_id` text,
	`facebook_id` text,
	`email` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_data` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text
);
--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_google_id_unique` ON `user` (`google_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_facebook_id_unique` ON `user` (`facebook_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);