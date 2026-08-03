import { NextResponse } from "next/server";
import { db } from "@/db";
import { deploymentTasks } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET() {
  const tasks = await db.query.deploymentTasks.findMany({
    orderBy: (t, { asc }) => [asc(t.orderIndex)],
  });

  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);

  return NextResponse.json({ tasks, total, done, progress });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as { id?: string; done?: boolean };
  if (!body?.id || typeof body.done !== "boolean") {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }
  await db
    .update(deploymentTasks)
    .set({ done: body.done })
    .where(eq(deploymentTasks.id, body.id));
  return NextResponse.json({ ok: true });
}
