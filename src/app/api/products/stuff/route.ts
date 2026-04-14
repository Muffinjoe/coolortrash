import { getStuffList, initDb } from "@/lib/db";

export async function GET() {
  await initDb();
  const list = await getStuffList();
  return Response.json({ products: list }, {
    headers: { "Cache-Control": "no-store" },
  });
}
