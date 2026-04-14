import { trackEvent, initDb } from "@/lib/db";

export async function POST(req: Request) {
  await initDb();
  const { event } = await req.json();
  if (typeof event !== "string") {
    return Response.json({ error: "Invalid" }, { status: 400 });
  }
  await trackEvent(event);
  return Response.json({ ok: true });
}
