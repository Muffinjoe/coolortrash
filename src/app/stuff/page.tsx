"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
  id: number;
  title: string;
  image_url: string;
  affiliate_url: string;
  price: string;
  cool_votes: number;
  trash_votes: number;
  cool_pct: number;
}

export default function StuffPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products/stuff")
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products);
        setLoading(false);
      });
  }, []);

  const coolest = products.filter((p) => p.cool_pct >= 50);
  const trashiest = [...products].filter((p) => p.cool_pct < 50).reverse();

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <header className="flex items-center justify-between px-5 pt-3 h-14">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight"
        >
          Cool<span data-color-cycle="">Or</span>Trash?
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-violet-500 hover:text-violet-600 transition-colors"
        >
          Play
        </Link>
      </header>

      <div className="max-w-lg mx-auto px-5 pb-12">
        <h1 className="text-3xl font-black text-center mt-4 mb-1">The Stuff</h1>
        <p className="text-neutral-400 text-center text-sm mb-8">
          Ranked by the people
        </p>

        {loading ? (
          <p className="text-center text-neutral-400 mt-12">Loading...</p>
        ) : (
          <>
            {/* Coolest */}
            {coolest.length > 0 && (
              <section className="mb-10">
                <h2 className="text-lg font-black mb-3 flex items-center gap-2">
                  Coolest Stuff <span className="text-2xl">&#x1F60E;</span>
                </h2>
                <div className="space-y-2">
                  {coolest.map((p, i) => (
                    <a
                      key={p.id}
                      href={p.affiliate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors"
                    >
                      <span className="text-sm font-black text-blue-400 w-6 text-center shrink-0">
                        {i + 1}
                      </span>
                      <img
                        src={p.image_url}
                        alt={p.title}
                        className="w-10 h-10 object-contain rounded shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm truncate">{p.title}</p>
                        <p className="text-xs text-neutral-400">
                          {p.cool_votes + p.trash_votes} votes
                        </p>
                      </div>
                      <span className="text-sm font-black text-blue-500 shrink-0">
                        {p.cool_pct}% &#x1F60E;
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Trashiest */}
            {trashiest.length > 0 && (
              <section>
                <h2 className="text-lg font-black mb-3 flex items-center gap-2">
                  Trashiest Stuff <span className="text-2xl">&#x1F5D1;&#xFE0F;</span>
                </h2>
                <div className="space-y-2">
                  {trashiest.map((p, i) => (
                    <a
                      key={p.id}
                      href={p.affiliate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100 hover:bg-red-100 transition-colors"
                    >
                      <span className="text-sm font-black text-red-400 w-6 text-center shrink-0">
                        {i + 1}
                      </span>
                      <img
                        src={p.image_url}
                        alt={p.title}
                        className="w-10 h-10 object-contain rounded shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm truncate">{p.title}</p>
                        <p className="text-xs text-neutral-400">
                          {p.cool_votes + p.trash_votes} votes
                        </p>
                      </div>
                      <span className="text-sm font-black text-red-500 shrink-0">
                        {100 - p.cool_pct}% &#x1F5D1;&#xFE0F;
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {products.length === 0 && (
              <p className="text-center text-neutral-400 mt-12">
                No votes yet. <Link href="/" className="text-violet-500">Go rate some stuff!</Link>
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
