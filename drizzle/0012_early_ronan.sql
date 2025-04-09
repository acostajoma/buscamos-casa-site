DROP TABLE `sale_type`;--> statement-breakpoint
ALTER TABLE `property` ADD `is_for_sale` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `property` ADD `is_for_rent` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `property` ADD `is_rent_to_buy` integer DEFAULT false NOT NULL;