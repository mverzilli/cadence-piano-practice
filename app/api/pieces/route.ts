import { asc, eq, sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { pieces } from "../../../db/schema";

export async function GET() {
  try {
    return Response.json({ pieces: await getDb().select().from(pieces).orderBy(asc(pieces.name)) });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to load pieces" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { name?: string; musicalKey?: string; timeSignature?: string };
    const name = body.name?.trim();
    if (!name) return Response.json({ error: "Piece name is required" }, { status: 400 });
    const db = getDb();
    await db.insert(pieces).values({ name, musicalKey: body.musicalKey?.trim() ?? "", timeSignature: body.timeSignature ?? "4/4" })
      .onConflictDoUpdate({ target: pieces.name, set: { musicalKey: body.musicalKey?.trim() ?? "", timeSignature: body.timeSignature ?? "4/4", updatedAt: sql`CURRENT_TIMESTAMP` } });
    const [piece] = await db.select().from(pieces).where(eq(pieces.name, name)).limit(1);
    return Response.json({ piece }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to save piece" }, { status: 500 });
  }
}
