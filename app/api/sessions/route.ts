import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { pieces, sessions } from "../../../db/schema";

export async function GET() {
  try {
    const rows = await getDb().select({ session: sessions, piece: pieces }).from(sessions).innerJoin(pieces, eq(sessions.pieceId, pieces.id)).orderBy(desc(sessions.createdAt)).limit(50);
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
    const [session] = await getDb().insert(sessions).values({
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
    const fromMeasure = Math.max(1, Number(body.fromMeasure) || 1);
    const toMeasure = Math.max(fromMeasure, Number(body.toMeasure) || fromMeasure);
    const [session] = await getDb().update(sessions).set({
      fromMeasure,
      fromBeat: Math.max(1, Number(body.fromBeat) || 1),
      toMeasure,
      toBeat: Math.max(1, Number(body.toBeat) || 1),
      goal: String(body.goal ?? ""),
      repetitions: Math.max(0, Number(body.repetitions) || 0),
      primaryFocus: String(body.primaryFocus ?? ""),
      pressureResult: String(body.pressureResult ?? ""),
      reflection: String(body.reflection ?? ""),
      review: body.review !== false,
    }).where(eq(sessions.id, id)).returning();
    if (!session) return Response.json({ error: "Session not found" }, { status: 404 });
    return Response.json({ session });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to update session" }, { status: 500 });
  }
}
