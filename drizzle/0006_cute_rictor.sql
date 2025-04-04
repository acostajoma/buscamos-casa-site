CREATE TABLE `agent_or_broker` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`seller_information_id` integer NOT NULL,
	`image_id` text,
	`image_alt` text,
	FOREIGN KEY (`seller_information_id`) REFERENCES `seller_information`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `seller_information` ADD `is_registered_agent_or_broker` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `seller_information` DROP COLUMN `is_agent`;--> statement-breakpoint
ALTER TABLE `seller_information` DROP COLUMN `is_broker`;--> statement-breakpoint
ALTER TABLE `seller_information` DROP COLUMN `broker_image`;