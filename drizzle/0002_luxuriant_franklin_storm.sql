DROP INDEX `pieces_name_unique`;--> statement-breakpoint
ALTER TABLE `pieces` ADD `composer` text DEFAULT '' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_pieces_name_composer` ON `pieces` (`name`,`composer`);--> statement-breakpoint
PRAGMA optimize;
