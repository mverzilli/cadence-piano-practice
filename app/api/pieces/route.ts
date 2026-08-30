import { and, asc, eq, sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { pieces } from "../../../db/schema";
import { validatePieceEnums } from "../../../lib/domain-values";

export async function GET() {
  try {
    return Response.json({ pieces: await getDb().select().from(pieces).orderBy(asc(pieces.name)) });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to load pieces" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { name?: string; composer?: string; musicalKey?: string; timeSignature?: string };
    const name = body.name?.trim();
    const composer = body.composer?.trim() ?? "";
    if (!name) return Response.json({ error: "Piece name is required" }, { status: 400 });
    const enumError = validatePieceEnums(body as Record<string, unknown>);
    if (enumError) return Response.json({ error: enumError }, { status: 400 });
    const db = getDb();
    await db.insert(pieces).values({ name, composer, musicalKey: body.musicalKey?.trim() ?? "", timeSignature: body.timeSignature ?? "4/4" })
      .onConflictDoUpdate({ target: [pieces.name, pieces.composer], set: { musicalKey: body.musicalKey?.trim() ?? "", timeSignature: body.timeSignature ?? "4/4", updatedAt: sql`CURRENT_TIMESTAMP` } });
    const [piece] = await db.select().from(pieces).where(and(eq(pieces.name, name), eq(pieces.composer, composer))).limit(1);
    return Response.json({ piece }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to save piece" }, { status: 500 });
  }
}
