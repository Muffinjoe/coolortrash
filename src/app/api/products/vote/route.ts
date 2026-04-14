import { vote, initDb } from "@/lib/db";

export async function POST(req: Request) {
  await initDb();

  const { id, isCool } = await req.json();

  if (typeof id !== "number" || typeof isCool !== "boolean") {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  const product = await vote(id, isCool);

  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }

  const total = product.cool_votes + product.trash_votes;
  const coolPct = total > 0 ? Math.round((product.cool_votes / total) * 100) : 0;

  return Response.json({ ...product, coolPct });
}
