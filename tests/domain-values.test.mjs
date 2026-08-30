import assert from "node:assert/strict";
import test from "node:test";

import {
  METERS,
  OBSERVATIONS,
  PRACTICE_FOCUSES,
  PRESSURE_RESULTS,
  SPOT_PRIORITIES,
  validatePieceEnums,
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
