ALTER TABLE `agent_or_broker` ADD `display_name` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `agent_or_broker_display_name_unique` ON `agent_or_broker` (`display_name`);