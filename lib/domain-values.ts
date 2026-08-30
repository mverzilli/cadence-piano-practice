export const METERS = [
  "4/4", "3/4", "2/4", "6/8", "9/8", "12/8", "2/2", "3/8", "5/4", "7/8",
] as const;

export const OBSERVATIONS = [
  "Hesitation", "Lost my place", "Fingering uncertainty", "Coordination break", "Restarted", "Memory gap",
] as const;

export const PRACTICE_FOCUSES = [
  "Pitch", "Fingering", "Rhythm", "Movement", "Structure", "Harmony", "Inflection",
  "Articulation / touch", "Balance / voicing", "Dynamics", "Pedaling", "Learning / memory",
] as const;

export const SPOT_PRIORITIES = [1, 2] as const;
export const PRESSURE_RESULTS = ["weaker", "same", "better"] as const;

function includes(values: readonly unknown[], value: unknown) {
  return values.includes(value);
}

export function validatePieceEnums(body: Record<string, unknown>, legacyMeter?: unknown): string | null {
  const meter = body.timeSignature ?? "4/4";
  return includes(METERS, meter) || meter === legacyMeter ? null : "Invalid time signature";
}

type LegacySessionEnums = { primaryFocus?: unknown; pressureResult?: unknown };

export function validateSessionEnums(
  body: Record<string, unknown>,
  legacy: LegacySessionEnums = {},
): string | null {
  const focus = body.primaryFocus ?? "";
  if (focus !== "" && !includes(PRACTICE_FOCUSES, focus) && focus !== legacy.primaryFocus) {
    return "Invalid primary focus";
  }

  const result = body.pressureResult ?? "";
  if (result !== "" && !includes(PRESSURE_RESULTS, result) && result !== legacy.pressureResult) {
    return "Invalid pressure result";
  }

  if (body.spots === undefined) return null;
  if (!Array.isArray(body.spots)) return "Spots must be an array";

  for (const spot of body.spots) {
    if (!spot || typeof spot !== "object" || Array.isArray(spot)) return "Invalid spot";
    const candidate = spot as Record<string, unknown>;
    if (!includes(OBSERVATIONS, candidate.notice)) return "Invalid spot observation";
    if (!includes(SPOT_PRIORITIES, candidate.severity)) return "Invalid spot priority";
  }

  return null;
}

type CoordinateFields = {
  fromMeasure?: unknown;
  fromBeat?: unknown;
  toMeasure?: unknown;
  toBeat?: unknown;
};

function meterBeatCount(meter: string): number | null {
  const match = /^(\d+)\/(\d+)$/.exec(meter);
  if (!match) return null;
  const beats = Number(match[1]);
  return Number.isInteger(beats) && beats > 0 ? beats : null;
}

function validateRange(range: CoordinateFields, maxBeat: number | null, label: string): string | null {
  const values = [range.fromMeasure, range.fromBeat, range.toMeasure, range.toBeat].map(Number);
  if (values.some(value => !Number.isInteger(value) || value < 1)) {
    return `${label} coordinates must be positive integers`;
  }

  const [fromMeasure, fromBeat, toMeasure, toBeat] = values;
  if (maxBeat !== null && (fromBeat > maxBeat || toBeat > maxBeat)) {
    return `${label} beats must be within the piece meter`;
  }
  if (fromMeasure > toMeasure || (fromMeasure === toMeasure && fromBeat > toBeat)) {
    return `${label} end must not precede its start`;
  }
  return null;
}

export function validateSessionCoordinates(body: Record<string, unknown>, meter: string): string | null {
  const maxBeat = meterBeatCount(meter);
  const passageError = validateRange(body, maxBeat, "Passage");
  if (passageError) return passageError;

  if (!Array.isArray(body.spots)) return null;
  for (const spot of body.spots) {
    if (!spot || typeof spot !== "object" || Array.isArray(spot)) continue;
    const spotError = validateRange(spot as CoordinateFields, maxBeat, "Spot");
    if (spotError) return spotError;
  }
  return null;
}
