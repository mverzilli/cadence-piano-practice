import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const migrations = [
  "0000_fat_slipstream.sql",
  "0001_colossal_cable.sql",
  "0002_luxuriant_franklin_storm.sql",
];

async function apply(db, filename) {
  const sql = await readFile(new URL(`../drizzle/${filename}`, import.meta.url), "utf8");
  db.exec(sql);
}

test("Session meter migrations backfill value and inferred provenance", async () => {
  const db = new DatabaseSync(":memory:");
  try {
    for (const migration of migrations) await apply(db, migration);
    db.exec(`
      INSERT INTO pieces (name, composer, time_signature) VALUES ('Etude', 'Composer', '6/8');
      INSERT INTO sessions (piece_id, from_measure, from_beat, to_measure, to_beat)
      VALUES (1, 1, 1, 1, 6);
    `);

    await apply(db, "0003_vengeful_ikaris.sql");
    await apply(db, "0004_regular_zuras.sql");

    const migrated = db.prepare(`
      SELECT time_signature AS timeSignature, time_signature_inferred AS timeSignatureInferred
      FROM sessions WHERE id = 1
    `).get();
    assert.equal(migrated.timeSignature, "6/8");
    assert.equal(migrated.timeSignatureInferred, 1);
  } finally {
    db.close();
  }
});
