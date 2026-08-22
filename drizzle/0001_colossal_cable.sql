CREATE INDEX `idx_sessions_created_at` ON `sessions` (`created_at`);
--> statement-breakpoint
PRAGMA optimize;
