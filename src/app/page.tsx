import { getRandomBatch, initDb } from "@/lib/db";
import Game from "./game";

export const dynamic = "force-dynamic";

export default async function Home() {
  await initDb();
  const products = await getRandomBatch([], 5);

  return <Game initialProducts={products} />;
}
