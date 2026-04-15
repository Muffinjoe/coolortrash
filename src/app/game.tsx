"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { generateRecapVideo, type ProductResult } from "@/lib/render-video";

function trackBuyClick() {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event: "buy_click" }),
  }).catch(() => {});
  if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).fbq) {
    (window as unknown as Record<string, (...args: unknown[]) => void>).fbq(
      "track", "Purchase", { value: 0.20, currency: "GBP" }
    );
  }
}

interface Product {
  id: number;
  title: string;
  image_url: string;
  affiliate_url: string;
  price: string;
}

interface VoteResult {
  coolPct: number;
}

interface Choice {
  title: string;
  imageUrl: string;
  affiliateUrl: string;
  isCool: boolean;
  coolEmoji: string;
  trashEmoji: string;
}

type Phase = "voting" | "result" | "done" | "loading" | "generating";

const BATCH_SIZE = 5;
const FIRST_ROUND_SIZE = 5;

const EMOJI_PAIRS: [string, string][] = [
  ["\uD83D\uDE0E", "\uD83D\uDDD1\uFE0F"], // 😎 🗑️
  ["\uD83D\uDE0E", "\uD83D\uDC4E"],         // 😎 👎
  ["\uD83D\uDE0E", "\uD83D\uDCA9"],         // 😎 💩
];

function pickEmojiPair(productId: number): [string, string] {
  return EMOJI_PAIRS[productId % EMOJI_PAIRS.length];
}

export default function Game({ initialProducts }: { initialProducts?: Product[] }) {
  const [queue, setQueue] = useState<Product[]>(initialProducts || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>(initialProducts?.length ? "voting" : "loading");
  const [result, setResult] = useState<VoteResult | null>(null);
  const [userVotedCool, setUserVotedCool] = useState(false);
  const [votedIds, setVotedIds] = useState<number[]>([]);
  const [roundChoices, setRoundChoices] = useState<Choice[]>([]);
  const [roundResults, setRoundResults] = useState<ProductResult[]>([]);
  const [roundNumber, setRoundNumber] = useState(0);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoPct, setVideoPct] = useState(0);
  const [pastFirstRound, setPastFirstRound] = useState(false);
  const [email, setEmail] = useState("");
  const [emailList, setEmailList] = useState<"cool" | "trash">("cool");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "done">("idle");
  const imgRef = useRef<HTMLImageElement>(null);

  const fetchBatch = useCallback(async (excludeIds: number[]) => {
    setPhase("loading");
    try {
      const exclude = excludeIds.join(",");
      const res = await fetch(`/api/products/random?exclude=${exclude}`);
      const data = await res.json();
      if (data.done || data.products.length === 0) {
        const freshRes = await fetch("/api/products/random?exclude=");
        const freshData = await freshRes.json();
        if (freshData.done || freshData.products.length === 0) return;
        setQueue(freshData.products);
        setCurrentIndex(0);
        setPhase("voting");
      } else {
        setQueue(data.products);
        setCurrentIndex(0);
        setPhase("voting");
      }
    } catch {
      setTimeout(() => fetchBatch(excludeIds), 500);
    }
  }, []);

  useEffect(() => {
    const storedIds = localStorage.getItem("cot_voted");
    const ids: number[] = storedIds ? JSON.parse(storedIds) : [];
    setVotedIds(ids);
    const storedRound = localStorage.getItem("cot_round");
    if (storedRound) setRoundNumber(parseInt(storedRound));
    // Skip fetch if we have server-provided initial products and user hasn't voted on them
    if (initialProducts?.length && ids.length === 0) {
      // Already set in state init
    } else {
      fetchBatch(ids);
    }
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "page_view" }),
    }).catch(() => {});
  }, [fetchBatch]);

  const product = queue[currentIndex] || null;

  const handleVote = async (isCool: boolean) => {
    if (!product || phase !== "voting") return;

    setUserVotedCool(isCool);
    setCurrentProduct(product);

    try {
      const res = await fetch("/api/products/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, isCool }),
      });
      const data = await res.json();
      setResult({ coolPct: data.coolPct });

      const newIds = [...votedIds, product.id];
      setVotedIds(newIds);
      localStorage.setItem("cot_voted", JSON.stringify(newIds));

      const [coolEmoji, trashEmoji] = pickEmojiPair(product.id);
      const newChoices = [
        ...roundChoices,
        {
          title: product.title,
          imageUrl: product.image_url,
          affiliateUrl: product.affiliate_url,
          isCool,
          coolEmoji,
          trashEmoji,
        },
      ];
      setRoundChoices(newChoices);

      const newResults = [
        ...roundResults,
        {
          title: product.title,
          imageUrl: product.image_url,
          isCool,
          coolPct: data.coolPct,
          coolEmoji,
          trashEmoji,
        },
      ];
      setRoundResults(newResults);

      setPhase("result");

      // Preload next image while user views results
      const nextProduct = queue[currentIndex + 1];
      if (nextProduct) {
        const preload = new Image();
        preload.src = nextProduct.image_url;
      }

      setTimeout(() => {
        // First round: stop at 5 to show share card
        if (!pastFirstRound && newChoices.length >= FIRST_ROUND_SIZE) {
          setPhase("done");
          return;
        }

        if (currentIndex + 1 < queue.length) {
          setCurrentIndex(currentIndex + 1);
          setPhase("voting");
        } else {
          // Fetch more and keep going
          fetchBatch(newIds);
        }
      }, 2500);
    } catch {
      // user can try again
    }
  };

  const handleKeepGoing = () => {
    setPastFirstRound(true);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(null);
    setVideoBlob(null);
    if (queue.length > 0 && currentIndex + 1 < queue.length) {
      setCurrentIndex(currentIndex + 1);
      setPhase("voting");
    } else {
      fetchBatch(votedIds);
    }
  };

  const handleStartFresh = () => {
    const newRound = roundNumber + 1;
    setRoundNumber(newRound);
    localStorage.setItem("cot_round", String(newRound));
    setRoundChoices([]);
    setRoundResults([]);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(null);
    setVideoBlob(null);
    fetchBatch(votedIds);
  };

  const majority = result
    ? userVotedCool
      ? result.coolPct >= 50
      : result.coolPct < 50
    : false;

  const last8 = roundChoices.slice(-5);
  const coolCount = last8.filter((c) => c.isCool).length;
  const trashCount = last8.filter((c) => !c.isCool).length;
  const total = coolCount + trashCount;
  const coolPctRound = total > 0 ? Math.round((coolCount / total) * 100) : 0;
  const progress = queue.length > 0 ? currentIndex + 1 : 0;

  const scoreLine =
    coolPctRound >= 80
      ? `${coolPctRound}% cool. You love everything`
      : coolPctRound >= 60
        ? `${coolPctRound}% cool. Pretty chill vibes`
        : coolPctRound >= 40
          ? "Balanced taste. Fair enough."
          : coolPctRound >= 20
            ? `Mostly trash. You're picky`
            : `${coolPctRound}% cool. Nothing impresses you`;

  return (
    <main className="fixed inset-0 bg-white text-neutral-900 flex flex-col">
      {/* Header */}
      <header className="grid grid-cols-3 items-center px-5 pt-3 h-14 shrink-0">
        <span className="text-lg font-bold tracking-tight justify-self-start">
          Cool<span data-color-cycle="">Or</span>Trash?
        </span>
        <div className="justify-self-center">
          {(phase === "voting" || phase === "result") && pastFirstRound && roundChoices.length > 0 && (
            <button
              onClick={() => setPhase("done")}
              className="text-xs font-bold text-neutral-400 hover:text-violet-500 transition-colors bg-neutral-100 px-3 py-1.5 rounded-full cursor-pointer"
            >
              My Picks ({roundChoices.length})
            </button>
          )}
        </div>
        <div className="justify-self-end">
          <a
            href="/stuff"
            className="text-sm font-medium text-violet-500 hover:text-violet-600 transition-colors"
          >
            Stuff
          </a>
        </div>
      </header>

      {/* Content */}
      <div className={`flex-1 flex flex-col items-center px-6 overflow-y-auto ${phase === "done" || phase === "generating" ? "justify-start pt-4" : "justify-center"}`}>
        {phase === "loading" ? (
          <div className="text-center">
            <p className="text-4xl animate-pulse">...</p>
          </div>
        ) : phase === "generating" ? (
          <div className="text-center animate-[fadeIn_0.15s_ease-out]">
            <p className="text-4xl mb-4">&#x1F3AC;</p>
            <p className="text-xl font-bold mb-3">Creating your video...</p>
            <div className="w-48 h-2 bg-neutral-200 rounded-full mx-auto overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-[width] duration-200"
                style={{ width: `${videoPct}%` }}
              />
            </div>
          </div>
        ) : phase === "done" ? (
          <div className="w-full max-w-sm py-6 animate-[fadeIn_0.3s_ease-out]">
            {/* Video Preview */}
            {videoUrl && (
              <div className="mb-4 flex flex-col items-center">
                <video
                  src={videoUrl}
                  controls
                  playsInline
                  autoPlay
                  muted
                  loop
                  className="rounded-2xl bg-neutral-100 border border-neutral-200"
                  style={{ maxHeight: "55vh", aspectRatio: "9/16" }}
                />
              </div>
            )}

            {/* Share Card */}
            {!videoUrl && (
              <div className="bg-neutral-50 rounded-2xl border border-neutral-200 px-4 pt-4 pb-3 mb-4">
                <h2 className="text-lg font-black text-center leading-tight">
                  My Cool or Trash Picks
                </h2>
                <p className="text-[11px] text-neutral-400 text-center mb-2.5">
                  {scoreLine}
                </p>

                <div className="space-y-1.5">
                  {roundChoices.slice(-5).map((c, i) => (
                    <a
                      key={i}
                      href={c.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={trackBuyClick}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium ${
                        c.isCool
                          ? "bg-blue-50 border border-blue-100"
                          : "bg-red-50 border border-red-100"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={c.imageUrl}
                          alt={c.title}
                          className="w-8 h-8 object-contain rounded shrink-0"
                        />
                        {c.title && <span className="truncate">{c.title}</span>}
                      </div>
                      <span className="shrink-0 text-lg ml-2">
                        {c.isCool ? c.coolEmoji : c.trashEmoji}
                      </span>
                    </a>
                  ))}
                </div>

                <p className="text-sm font-semibold text-neutral-600 text-center mt-3">
                  CoolOrTrash.com
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {videoUrl ? (
                <>
                  <button
                    onClick={async () => {
                      if (!videoBlob) return;
                      const ext = videoBlob.type.includes("mp4")
                        ? "mp4"
                        : "webm";
                      const file = new File(
                        [videoBlob],
                        `coolortrash-picks.${ext}`,
                        { type: videoBlob.type }
                      );
                      if (
                        navigator.share &&
                        navigator.canShare?.({ files: [file] })
                      ) {
                        try {
                          await navigator.share({ files: [file] });
                          return;
                        } catch {}
                      }
                      const a = document.createElement("a");
                      a.href = videoUrl;
                      a.download = `coolortrash-picks.${ext}`;
                      a.click();
                    }}
                    className="w-full py-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 active:scale-95 transition-all text-white font-bold text-lg cursor-pointer"
                  >
                    Share Video &#x1F4F2;
                  </button>
                  <button
                    onClick={() => {
                      if (!videoBlob || !videoUrl) return;
                      const ext = videoBlob.type.includes("mp4")
                        ? "mp4"
                        : "webm";
                      const a = document.createElement("a");
                      a.href = videoUrl;
                      a.download = `coolortrash-picks.${ext}`;
                      a.click();
                    }}
                    className="hidden md:block w-full py-4 rounded-2xl bg-neutral-100 hover:bg-neutral-200 active:scale-95 transition-all text-neutral-700 font-bold text-lg cursor-pointer border border-neutral-200"
                  >
                    Download Video &#x2B07;&#xFE0F;
                  </button>
                </>
              ) : (
                <button
                  onClick={async () => {
                    if (roundResults.length === 0) return;
                    setPhase("generating");
                    setVideoPct(0);
                    try {
                      const videoResults = roundResults.slice(-5);
                      const blob = await generateRecapVideo(
                        videoResults,
                        setVideoPct
                      );
                      if (videoUrl) URL.revokeObjectURL(videoUrl);
                      setVideoBlob(blob);
                      setVideoUrl(URL.createObjectURL(blob));
                      fetch("/api/track", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ event: "video_made" }),
                      }).catch(() => {});
                    } catch {}
                    setPhase("done");
                  }}
                  className="w-full py-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 active:scale-95 transition-all text-white font-bold text-lg cursor-pointer"
                >
                  Export Video &#x1F3AC;
                </button>
              )}
              <button
                onClick={handleKeepGoing}
                className="w-full py-4 rounded-2xl bg-violet-500 hover:bg-violet-400 active:scale-95 transition-all text-white font-bold text-lg cursor-pointer"
              >
                Keep Going
              </button>
            </div>

            {/* Email Signup */}
            {emailStatus === "done" ? (
              <div className="mt-5 text-center bg-green-50 rounded-2xl border border-green-200 px-4 py-4">
                <p className="text-lg font-bold text-green-700">You're in!</p>
                <p className="text-sm text-green-600 mt-1">
                  We'll send you the {emailList === "cool" ? "coolest" : "trashiest"} stuff.
                </p>
              </div>
            ) : (
              <form
                className="mt-5 bg-neutral-50 rounded-2xl border border-neutral-200 px-4 py-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!email.trim()) return;
                  setEmailStatus("sending");
                  try {
                    await fetch("/api/email", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: email.trim(), list: emailList }),
                    });
                    setEmailStatus("done");
                  } catch {
                    setEmailStatus("idle");
                  }
                }}
              >
                <p className="text-sm font-bold text-center mb-3">
                  Get the top rated stuff in your inbox
                </p>

                {/* Toggle */}
                <div className="flex rounded-xl overflow-hidden border border-neutral-200 mb-3">
                  <button
                    type="button"
                    onClick={() => setEmailList("cool")}
                    className={`flex-1 py-2 text-sm font-bold cursor-pointer transition-colors ${
                      emailList === "cool"
                        ? "bg-blue-500 text-white"
                        : "bg-white text-neutral-400"
                    }`}
                  >
                    Cool stuff &#x1F60E;
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmailList("trash")}
                    className={`flex-1 py-2 text-sm font-bold cursor-pointer transition-colors ${
                      emailList === "trash"
                        ? "bg-red-500 text-white"
                        : "bg-white text-neutral-400"
                    }`}
                  >
                    Trash stuff &#x1F5D1;&#xFE0F;
                  </button>
                </div>

                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:border-violet-400 transition-colors mb-2"
                />
                <button
                  type="submit"
                  disabled={emailStatus === "sending"}
                  className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:scale-95 transition-all text-white font-bold text-sm cursor-pointer disabled:opacity-50"
                >
                  {emailStatus === "sending" ? "..." : "Sign me up"}
                </button>
              </form>
            )}
          </div>
        ) : phase === "voting" && product ? (
          <div
            key={product.id}
            className="text-center w-full max-w-sm animate-[fadeIn_0.2s_ease-out]"
          >
            {/* Product Image */}
            <a
              href={product.affiliate_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackBuyClick}
              className="relative w-full max-w-[320px] mx-auto mb-6 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-center p-4 block"
            >
              <img
                ref={imgRef}
                src={product.image_url}
                alt={product.title || "Product"}
                className="w-full h-auto object-contain rounded-lg"
              />
              {product.price && (
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-sm font-bold text-neutral-700 border border-neutral-200">
                  {product.price}
                </span>
              )}
            </a>

            {/* Product Title */}
            {product.title && (
              <p className="text-2xl font-black leading-tight mb-8">
                {product.title}
              </p>
            )}
            {!product.title && <div className="mb-8" />}

            {/* Vote Buttons */}
            {(() => {
              const [coolE, trashE] = pickEmojiPair(product.id);
              return (
                <div className="flex gap-4">
                  <button
                    onClick={() => handleVote(true)}
                    className="flex-1 py-5 rounded-2xl bg-blue-50 hover:bg-blue-100 active:scale-95 transition-all text-3xl font-bold cursor-pointer border border-blue-200"
                  >
                    <span className="text-4xl leading-none">{coolE}</span>
                  </button>
                  <button
                    onClick={() => handleVote(false)}
                    className="flex-1 py-5 rounded-2xl bg-red-50 hover:bg-red-100 active:scale-95 transition-all text-3xl font-bold border border-red-200 cursor-pointer"
                  >
                    <span className="text-4xl leading-none">{trashE}</span>
                  </button>
                </div>
              );
            })()}
          </div>
        ) : phase === "result" && result && currentProduct ? (
          (() => {
            const coolPct = result.coolPct;
            const trashPct = 100 - coolPct;
            const userPct = userVotedCool ? coolPct : trashPct;
            const userOnLeft = userVotedCool;
            const [coolE, trashE] = pickEmojiPair(currentProduct.id);

            return (
              <div className="w-full max-w-sm animate-[fadeIn_0.15s_ease-out]">
                {/* Product thumbnail + title */}
                <a
                  href={currentProduct.affiliate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={trackBuyClick}
                  className="flex items-center gap-3 mb-4 justify-center"
                >
                  <img
                    src={currentProduct.image_url}
                    alt={currentProduct.title || "Product"}
                    className="w-14 h-14 object-contain rounded-xl border border-neutral-200 bg-neutral-50"
                  />
                  {currentProduct.title && <p className="text-lg font-bold">{currentProduct.title}</p>}
                </a>

                {/* Main percentage */}
                <p className="text-7xl font-black text-center mb-1">
                  {userPct}%
                </p>
                <p className="text-lg font-medium text-neutral-500 text-center mb-6">
                  said {userVotedCool ? "COOL" : "TRASH"}
                </p>

                {/* Split bar */}
                <div className="flex items-center gap-0 rounded-full overflow-hidden h-12 mb-3">
                  <div
                    className="h-full flex items-center justify-center font-bold text-sm bg-blue-400 text-blue-900"
                    style={{ width: `${Math.max(coolPct, 8)}%` }}
                  >
                    {coolE} {coolPct}%
                  </div>
                  <div
                    className="h-full flex items-center justify-center font-bold text-sm bg-red-200 text-red-700"
                    style={{ width: `${Math.max(trashPct, 8)}%` }}
                  >
                    {trashE} {trashPct}%
                  </div>
                </div>

                {/* You marker */}
                <div className="flex mb-4">
                  <div
                    className="flex flex-col items-center"
                    style={{
                      marginLeft: userOnLeft
                        ? `${Math.max(coolPct / 2 - 5, 2)}%`
                        : `${Math.max(coolPct + trashPct / 2 - 5, 2)}%`,
                    }}
                  >
                    <span className="text-xs font-black text-neutral-900 bg-neutral-200 px-2.5 py-1 rounded-full">
                      YOU
                    </span>
                  </div>
                </div>

                {/* Crowd text */}
                <p className="text-lg font-bold text-center text-neutral-800 mb-4">
                  {majority
                    ? "Most people agree with you \u2705"
                    : `Only ${userPct}% agree with you \uD83D\uDC40`}
                </p>

                {/* Buy link */}
                {currentProduct.title && <a
                  href={currentProduct.affiliate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={trackBuyClick}
                  className="block text-center text-violet-600 font-semibold text-sm hover:text-violet-700 transition-colors"
                >
                  {"Buy it \u2192"}
                </a>}

                {/* Countdown bar */}
                <div className="w-full h-1.5 bg-neutral-100 rounded-full mt-6 overflow-hidden">
                  <div
                    className="h-full bg-violet-400 rounded-full"
                    style={{
                      animation: "shrinkBar 2.5s linear forwards",
                    }}
                  />
                </div>
              </div>
            );
          })()
        ) : null}
      </div>

      {roundChoices.length === 0 && phase === "voting" && (
        <p className="text-[10px] text-neutral-300 text-center pb-2 shrink-0">
          Links may earn us a commission (Disclosure)
        </p>
      )}
      <div className="h-8 shrink-0" />
    </main>
  );
}
