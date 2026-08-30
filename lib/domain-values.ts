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
