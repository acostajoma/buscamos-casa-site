-- SQLite does not support dropping foreign keys directly.
-- We need to recreate the table without the foreign key and then copy the data.

-- Create a temporary table for agent_or_broker without the foreign key
CREATE TABLE `agent_or_broker_temp` (
    `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    `image_id` text,
    `image_alt` text,
    `instagram_user_name` text
);

-- Copy data from the old table to the temporary table
INSERT INTO `agent_or_broker_temp` (`id`, `image_id`, `image_alt`, `instagram_user_name`)
SELECT `id`, `image_id`, `image_alt`, `instagram_user_name` FROM `agent_or_broker`;



-- Drop the old table
DROP TABLE `agent_or_broker`;

-- Rename the temporary table to the original table name
ALTER TABLE `agent_or_broker_temp` RENAME TO `agent_or_broker`;

-- Add the new column
ALTER TABLE `agent_or_broker` ADD `userId` text ;


-- Add the foreign key constraint to the new column
CREATE INDEX `agent_or_broker_userId_idx` ON `agent_or_broker` (`userId`);

-- Create a temporary table for exclusive_vendor without the foreign key
CREATE TABLE `exclusive_vendor_temp` (
    `userId` text PRIMARY KEY NOT NULL
);

-- Copy data from the old table to the temporary table, we change the name of the column
INSERT INTO `exclusive_vendor_temp` (`userId`)
SELECT `seller_information_id` FROM `exclusive_vendor`;

-- Drop the old table
DROP TABLE `exclusive_vendor`;

-- Rename the temporary table to the original table name
ALTER TABLE `exclusive_vendor_temp` RENAME TO `exclusive_vendor`;

-- Add the foreign key constraint to the new column
CREATE INDEX `exclusive_vendor_userId_idx` ON `exclusive_vendor` (`userId`);
