CREATE TABLE `features` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `location` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`address` text NOT NULL,
	`city` text NOT NULL,
	`state` text NOT NULL,
	`district` text NOT NULL,
	`country` text NOT NULL,
	`map_url` text,
	`longitude` real,
	`latitude` real
);
--> statement-breakpoint
CREATE TABLE `photo` (
	`photo_id` text PRIMARY KEY NOT NULL,
	`property_id` integer NOT NULL,
	`order` integer NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `property`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `properties_with_construction` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`property_id` integer NOT NULL,
	`num_bedrooms` integer,
	`num_bathrooms` integer,
	`construction_size` real,
	`year_built` integer,
	`garage_space` integer,
	FOREIGN KEY (`property_id`) REFERENCES `property`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `property` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`listing_status` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`property_type` text,
	`price` real NOT NULL,
	`currency` text NOT NULL,
	`lot_size` real NOT NULL,
	`water_availability` integer DEFAULT true,
	`electricity_availability` integer DEFAULT true,
	`post_owner_id` text NOT NULL,
	`location_id` integer,
	`meta_data` integer NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text,
	`deleted_at` text,
	FOREIGN KEY (`post_owner_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`location_id`) REFERENCES `location`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`meta_data`) REFERENCES `property_meta_data`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `property_features` (
	`property_id` integer NOT NULL,
	`feature_id` integer NOT NULL,
	PRIMARY KEY(`feature_id`, `property_id`),
	FOREIGN KEY (`property_id`) REFERENCES `property`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`feature_id`) REFERENCES `features`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `property_meta_data` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`views` integer DEFAULT 0,
	`shared` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `sale_type` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`property_id` integer NOT NULL,
	`type` text,
	FOREIGN KEY (`property_id`) REFERENCES `property`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `seller_information` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`property_id` integer NOT NULL,
	`email` text,
	`phone_number` text,
	`name` text,
	`last_name` text,
	FOREIGN KEY (`property_id`) REFERENCES `property`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
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
	`email` text NOT NULL,
	`user_data_id` text,
	FOREIGN KEY (`user_data_id`) REFERENCES `user_data`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `user_data` (
	`id` text PRIMARY KEY NOT NULL,
	`phone_number` text,
	`name` text,
	`last_name` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `features_name_unique` ON `features` (`name`);--> statement-breakpoint
CREATE INDEX `idx_location_district` ON `location` (`district`);--> statement-breakpoint
CREATE INDEX `idx_location_city` ON `location` (`city`);--> statement-breakpoint
CREATE INDEX `idx_location_state` ON `location` (`state`);--> statement-breakpoint
CREATE INDEX `idx_photos_property_id` ON `photo` (`property_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `properties_with_construction_property_id_unique` ON `properties_with_construction` (`property_id`);--> statement-breakpoint
CREATE INDEX `idx_property_feature_property_id` ON `property_features` (`property_id`);--> statement-breakpoint
CREATE INDEX `idx_saletype_property_id` ON `sale_type` (`property_id`);--> statement-breakpoint
CREATE INDEX `idx_saletype_type` ON `sale_type` (`type`);--> statement-breakpoint
CREATE INDEX `idx_sellerinformation_property_id` ON `seller_information` (`property_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_google_id_unique` ON `user` (`google_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_facebook_id_unique` ON `user` (`facebook_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_user_data_id_unique` ON `user` (`user_data_id`);