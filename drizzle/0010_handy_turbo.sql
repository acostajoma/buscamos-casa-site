-- Rename userId to user_id in agent_or_broker table
ALTER TABLE `agent_or_broker` RENAME COLUMN `userId` TO `user_id`;
-- Rename userId to user_id in exclusive_vendor table
ALTER TABLE `exclusive_vendor` RENAME COLUMN `userId` TO `user_id`;
