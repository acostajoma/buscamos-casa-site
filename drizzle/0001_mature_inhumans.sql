CREATE TABLE `property_contact_information` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`property_id` integer NOT NULL,
	`phone_number` text,
	`email` text,
	`name` text,
	FOREIGN KEY (`property_id`) REFERENCES `property`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `property_contact_information_property_id_unique` ON `property_contact_information` (`property_id`);--> statement-breakpoint
CREATE INDEX `idx_property_contact_information_property_id` ON `property_contact_information` (`property_id`);