CREATE TABLE `pieces` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`musical_key` text DEFAULT '' NOT NULL,
	`time_signature` text DEFAULT '4/4' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pieces_name_unique` ON `pieces` (`name`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`piece_id` integer NOT NULL,
	`from_measure` integer NOT NULL,
	`from_beat` integer NOT NULL,
	`to_measure` integer NOT NULL,
	`to_beat` integer NOT NULL,
	`goal` text DEFAULT '' NOT NULL,
	`repetitions` integer DEFAULT 0 NOT NULL,
	`primary_focus` text DEFAULT '' NOT NULL,
	`pressure_result` text DEFAULT '' NOT NULL,
	`reflection` text DEFAULT '' NOT NULL,
	`review` integer DEFAULT true NOT NULL,
	`spots_json` text DEFAULT '[]' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`piece_id`) REFERENCES `pieces`(`id`) ON UPDATE no action ON DELETE no action
);
