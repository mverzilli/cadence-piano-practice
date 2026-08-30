ALTER TABLE `sessions` ADD `time_signature` text DEFAULT '4/4' NOT NULL;--> statement-breakpoint
-- The original meter was not stored; the referenced Piece meter is the best available backfill.
UPDATE `sessions`
SET `time_signature` = COALESCE(
	(SELECT `pieces`.`time_signature` FROM `pieces` WHERE `pieces`.`id` = `sessions`.`piece_id`),
	'4/4'
);
