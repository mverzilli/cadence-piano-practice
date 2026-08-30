import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { pieces, sessions } from "../../../db/schema";
import { validateSessionCoordinates, validateSessionEnums } from "../../../lib/domain-values";

export async function GET(request: Request) {
  try {
    const pieceId = Number(new URL(request.url).searchParams.get("pieceId"));
    const query = getDb().select({ session: sessions, piece: pieces }).from(sessions).innerJoin(pieces, eq(sessions.pieceId, pieces.id));
    const rows = pieceId
      ? await query.where(eq(sessions.pieceId, pieceId)).orderBy(desc(sessions.createdAt)).limit(1)
      : await query.orderBy(desc(sessions.createdAt)).limit(50);
    return Response.json({ sessions: rows });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to load sessions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const pieceId = Number(body.pieceId);
    if (!pieceId) return Response.json({ error: "A saved piece is required" }, { status: 400 });
    const enumError = validateSessionEnums(body);
    if (enumError) return Response.json({ error: enumError }, { status: 400 });
    const db = getDb();
    const [piece] = await db.select().from(pieces).where(eq(pieces.id, pieceId)).limit(1);
    if (!piece) return Response.json({ error: "Piece not found" }, { status: 404 });
    const coordinateError = validateSessionCoordinates(body, piece.timeSignature);
    if (coordinateError) return Response.json({ error: coordinateError }, { status: 400 });
    const [session] = await db.insert(sessions).values({
      pieceId,
      fromMeasure: Number(body.fromMeasure) || 1,
      fromBeat: Number(body.fromBeat) || 1,
      toMeasure: Number(body.toMeasure) || 1,
      toBeat: Number(body.toBeat) || 1,
      goal: String(body.goal ?? ""),
      repetitions: Number(body.repetitions) || 0,
      primaryFocus: String(body.primaryFocus ?? ""),
      pressureResult: String(body.pressureResult ?? ""),
      reflection: String(body.reflection ?? ""),
      review: body.review !== false,
      spotsJson: JSON.stringify(body.spots ?? []),
    }).returning();
    return Response.json({ session }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to save session" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const id = Number(body.id);
    if (!id) return Response.json({ error: "A session id is required" }, { status: 400 });
    const db = getDb();
    const [existingSession] = await db.select().from(sessions).where(eq(sessions.id, id)).limit(1);
    if (!existingSession) return Response.json({ error: "Session not found" }, { status: 404 });
    const enumError = validateSessionEnums(body, existingSession);
    if (enumError) return Response.json({ error: enumError }, { status: 400 });
    const [piece] = await db.select().from(pieces).where(eq(pieces.id, existingSession.pieceId)).limit(1);
    if (!piece) return Response.json({ error: "Piece not found" }, { status: 404 });
    const coordinateError = validateSessionCoordinates(body, piece.timeSignature);
    if (coordinateError) return Response.json({ error: coordinateError }, { status: 400 });
    const fromMeasure = Number(body.fromMeasure);
    const toMeasure = Number(body.toMeasure);
    const [session] = await db.update(sessions).set({
      fromMeasure,
      fromBeat: Number(body.fromBeat),
      toMeasure,
      toBeat: Number(body.toBeat),
      goal: String(body.goal ?? ""),
      repetitions: Math.max(0, Number(body.repetitions) || 0),
      primaryFocus: String(body.primaryFocus ?? ""),
      pressureResult: String(body.pressureResult ?? ""),
      reflection: String(body.reflection ?? ""),
      review: body.review !== false,
    }).where(eq(sessions.id, id)).returning();
    return Response.json({ session });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to update session" }, { status: 500 });
  }
}
