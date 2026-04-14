import { type NextRequest } from "next/server";
import { getAdminStats, initDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  await initDb();

  const password = req.nextUrl.searchParams.get("password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = await getAdminStats();
  return Response.json(stats);
}
