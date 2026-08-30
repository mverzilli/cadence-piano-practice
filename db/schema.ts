import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const pieces = sqliteTable("pieces", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  composer: text("composer").notNull().default(""),
  musicalKey: text("musical_key").notNull().default(""),
  timeSignature: text("time_signature").notNull().default("4/4"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("idx_pieces_name_composer").on(table.name, table.composer)]);

export const sessions = sqliteTable("sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pieceId: integer("piece_id").notNull().references(() => pieces.id),
  timeSignature: text("time_signature").notNull().default("4/4"),
  fromMeasure: integer("from_measure").notNull(),
  fromBeat: integer("from_beat").notNull(),
  toMeasure: integer("to_measure").notNull(),
  toBeat: integer("to_beat").notNull(),
  goal: text("goal").notNull().default(""),
  repetitions: integer("repetitions").notNull().default(0),
  primaryFocus: text("primary_focus").notNull().default(""),
  pressureResult: text("pressure_result").notNull().default(""),
  reflection: text("reflection").notNull().default(""),
  review: integer("review", { mode: "boolean" }).notNull().default(true),
  spotsJson: text("spots_json").notNull().default("[]"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_sessions_created_at").on(table.createdAt)]);
