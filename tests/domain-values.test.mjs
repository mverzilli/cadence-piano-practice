import assert from "node:assert/strict";
import test from "node:test";

import {
  METERS,
  OBSERVATIONS,
  PRACTICE_FOCUSES,
  PRESSURE_RESULTS,
  SPOT_PRIORITIES,
  validatePieceEnums,
  validateSessionCoordinates,
  validateSessionEnums,
} from "../lib/domain-values.ts";

test("the UI vocabularies are accepted by server validation", () => {
  for (const timeSignature of METERS) assert.equal(validatePieceEnums({ timeSignature }), null);
  for (const primaryFocus of PRACTICE_FOCUSES) assert.equal(validateSessionEnums({ primaryFocus }), null);
  for (const pressureResult of PRESSURE_RESULTS) assert.equal(validateSessionEnums({ pressureResult }), null);
  for (const notice of OBSERVATIONS) {
    for (const severity of SPOT_PRIORITIES) {
      assert.equal(validateSessionEnums({ spots: [{ notice, severity }] }), null);
    }
  }
});

test("optional session enums may be empty", () => {
  assert.equal(validateSessionEnums({}), null);
  assert.equal(validateSessionEnums({ primaryFocus: "", pressureResult: "", spots: [] }), null);
});

test("unknown enum values are rejected", () => {
  assert.equal(validatePieceEnums({ timeSignature: "13/16" }), "Invalid time signature");
  assert.equal(validateSessionEnums({ primaryFocus: "Speed" }), "Invalid primary focus");
  assert.equal(validateSessionEnums({ pressureResult: "perfect" }), "Invalid pressure result");
  assert.equal(validateSessionEnums({ spots: [{ notice: "Wrong note", severity: 2 }] }), "Invalid spot observation");
  assert.equal(validateSessionEnums({ spots: [{ notice: "Hesitation", severity: 3 }] }), "Invalid spot priority");
});

test("unchanged legacy values remain usable without admitting new invalid values", () => {
  assert.equal(validatePieceEnums({ timeSignature: "13/16" }, "13/16"), null);
  assert.equal(validatePieceEnums({ timeSignature: "11/8" }, "13/16"), "Invalid time signature");

  const legacy = { primaryFocus: "Speed", pressureResult: "almost" };
  assert.equal(validateSessionEnums({ primaryFocus: "Speed", pressureResult: "almost" }, legacy), null);
  assert.equal(validateSessionEnums({ primaryFocus: "Velocity", pressureResult: "almost" }, legacy), "Invalid primary focus");
  assert.equal(validateSessionEnums({ primaryFocus: "Speed", pressureResult: "perfect" }, legacy), "Invalid pressure result");
});

test("malformed spot collections are rejected", () => {
  assert.equal(validateSessionEnums({ spots: "[]" }), "Spots must be an array");
  assert.equal(validateSessionEnums({ spots: [null] }), "Invalid spot");
});

test("passage and Spot coordinates obey positivity, meter bounds, and ordering", () => {
  const passage = { fromMeasure: 2, fromBeat: 1, toMeasure: 2, toBeat: 4 };
  assert.equal(validateSessionCoordinates(passage, "4/4"), null);
  assert.equal(validateSessionCoordinates({ ...passage, fromMeasure: 0 }, "4/4"), "Passage coordinates must be positive integers");
  assert.equal(validateSessionCoordinates({ ...passage, toBeat: 5 }, "4/4"), "Passage beats must be within the piece meter");
  assert.equal(validateSessionCoordinates({ ...passage, fromBeat: 4, toBeat: 3 }, "4/4"), "Passage end must not precede its start");
  assert.equal(validateSessionCoordinates({ ...passage, fromMeasure: 3 }, "4/4"), "Passage end must not precede its start");

  assert.equal(validateSessionCoordinates({ ...passage, spots: [{ ...passage, toBeat: 5 }] }, "4/4"), "Spot beats must be within the piece meter");
  assert.equal(validateSessionCoordinates({ ...passage, spots: [{ ...passage, fromBeat: 4, toBeat: 3 }] }, "4/4"), "Spot end must not precede its start");
});

test("numeric legacy meters provide bounds and opaque legacy meters preserve compatibility", () => {
  const passage = { fromMeasure: 1, fromBeat: 1, toMeasure: 1, toBeat: 13 };
  assert.equal(validateSessionCoordinates(passage, "13/16"), null);
  assert.equal(validateSessionCoordinates({ ...passage, toBeat: 14 }, "13/16"), "Passage beats must be within the piece meter");
  assert.equal(validateSessionCoordinates(passage, "common time"), null);
});

test("historical coordinates validate against the Session meter snapshot", () => {
  const historicalPassage = { fromMeasure: 1, fromBeat: 1, toMeasure: 1, toBeat: 6 };
  assert.equal(validateSessionCoordinates(historicalPassage, "6/8"), null);
  assert.equal(validateSessionCoordinates(historicalPassage, "4/4"), "Passage beats must be within the piece meter");
});
