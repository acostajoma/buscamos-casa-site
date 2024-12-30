ALTER TABLE `user` ADD `facebook_id` text;--> statement-breakpoint
CREATE UNIQUE INDEX `user_facebook_id_unique` ON `user` (`facebook_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);