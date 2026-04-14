import { saveEmail, initDb } from "@/lib/db";

export async function POST(req: Request) {
  await initDb();
  const { email, list } = await req.json();
  if (typeof email !== "string" || !email.includes("@")) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }
  const validList = list === "trash" ? "trash" : "cool";
  const ok = await saveEmail(email.trim().toLowerCase(), validList);
  return Response.json({ ok });
}
