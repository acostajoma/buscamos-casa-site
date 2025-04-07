CREATE TABLE `exclusive_vendor` (
	`seller_information_id` integer PRIMARY KEY NOT NULL,
	FOREIGN KEY (`seller_information_id`) REFERENCES `seller_information`(`id`) ON UPDATE no action ON DELETE cascade
);
