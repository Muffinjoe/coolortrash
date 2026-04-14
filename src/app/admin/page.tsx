"use client";

import { useState } from "react";
import Link from "next/link";

interface AdminData {
  emails: { id: number; email: string; list: string; created_at: string }[];
  totalVotes: number;
  totalProducts: number;
  todayHits: number;
  totalHits: number;
  todayBuyClicks: number;
  totalBuyClicks: number;
  totalVideos: number;
  todayVideos: number;
  dailyHits: { day: string; count: number }[];
  dailyBuyClicks: { day: string; count: number }[];
  topCool: { title: string; cool_votes: number; trash_votes: number; cool_pct: number }[];
  topTrash: { title: string; cool_votes: number; trash_votes: number; cool_pct: number }[];
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authed, setAuthed] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin?password=${encodeURIComponent(password)}`);
      if (!res.ok) {
        setError("Wrong password");
        setLoading(false);
        return;
      }
      const d = await res.json();
      setData(d);
      setAuthed(true);
    } catch {
      setError("Failed to load");
    }
    setLoading(false);
  };

  const refresh = async () => {
    const res = await fetch(`/api/admin?password=${encodeURIComponent(password)}`);
    if (res.ok) setData(await res.json());
  };

  if (!authed) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="w-full max-w-xs">
          <h1 className="text-2xl font-black text-center mb-6">Admin</h1>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-base outline-none focus:border-violet-400 transition-colors mb-3"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-neutral-900 text-white font-bold cursor-pointer disabled:opacity-50"
          >
            {loading ? "..." : "Login"}
          </button>
        </form>
      </main>
    );
  }

  if (!data) return null;

  return (
    <main className="min-h-screen bg-white text-neutral-900 px-5 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Cool<span data-color-cycle="">Or</span>Trash?
        </Link>
        <button
          onClick={refresh}
          className="text-sm text-violet-500 font-medium cursor-pointer"
        >
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
          <p className="text-2xl font-black">{data.todayHits}</p>
          <p className="text-xs text-neutral-400">Visits today</p>
        </div>
        <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
          <p className="text-2xl font-black">{data.totalHits}</p>
          <p className="text-xs text-neutral-400">Total visits</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <p className="text-2xl font-black text-green-700">{data.todayBuyClicks}</p>
          <p className="text-xs text-green-600">Buy clicks today</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <p className="text-2xl font-black text-green-700">{data.totalBuyClicks}</p>
          <p className="text-xs text-green-600">Total buy clicks</p>
        </div>
        <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
          <p className="text-2xl font-black">{data.totalVotes}</p>
          <p className="text-xs text-neutral-400">Total votes</p>
        </div>
        <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
          <p className="text-2xl font-black">{data.totalProducts}</p>
          <p className="text-xs text-neutral-400">Products</p>
        </div>
        <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
          <p className="text-2xl font-black">{data.todayVideos}</p>
          <p className="text-xs text-neutral-400">Videos today</p>
        </div>
        <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
          <p className="text-2xl font-black">{data.totalVideos}</p>
          <p className="text-xs text-neutral-400">Total videos</p>
        </div>
      </div>

      {/* Conversion Rate */}
      {data.totalHits > 0 && (
        <div className="bg-violet-50 rounded-xl p-4 border border-violet-200 mb-8">
          <p className="text-2xl font-black text-violet-700">
            {((data.totalBuyClicks / data.totalHits) * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-violet-600">Visit-to-click rate</p>
        </div>
      )}

      {/* Top Cool */}
      {data.topCool.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold mb-2 text-neutral-500">Coolest Products</h2>
          <div className="space-y-1">
            {data.topCool.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 px-3 bg-blue-50 rounded-lg text-sm">
                <span className="truncate mr-2">{p.title}</span>
                <span className="font-bold text-blue-600 shrink-0">{p.cool_pct}% cool</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Trash */}
      {data.topTrash.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold mb-2 text-neutral-500">Trashiest Products</h2>
          <div className="space-y-1">
            {data.topTrash.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 px-3 bg-red-50 rounded-lg text-sm">
                <span className="truncate mr-2">{p.title}</span>
                <span className="font-bold text-red-600 shrink-0">{100 - Number(p.cool_pct)}% trash</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Visits */}
      {data.dailyHits.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold mb-2 text-neutral-500">Daily Visits (30 days)</h2>
          <div className="space-y-1">
            {data.dailyHits.map((d) => {
              const max = Math.max(...data.dailyHits.map((x) => Number(x.count)));
              const pct = max > 0 ? (Number(d.count) / max) * 100 : 0;
              return (
                <div key={d.day} className="flex items-center gap-3">
                  <span className="text-xs text-neutral-400 w-16 shrink-0">
                    {new Date(d.day).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                  <div className="flex-1 bg-neutral-100 rounded-full h-4 overflow-hidden">
                    <div className="bg-violet-400 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-medium w-8 text-right">{d.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Daily Buy Clicks */}
      {data.dailyBuyClicks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold mb-2 text-neutral-500">Daily Buy Clicks (30 days)</h2>
          <div className="space-y-1">
            {data.dailyBuyClicks.map((d) => {
              const max = Math.max(...data.dailyBuyClicks.map((x) => Number(x.count)));
              const pct = max > 0 ? (Number(d.count) / max) * 100 : 0;
              return (
                <div key={d.day} className="flex items-center gap-3">
                  <span className="text-xs text-neutral-400 w-16 shrink-0">
                    {new Date(d.day).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                  <div className="flex-1 bg-neutral-100 rounded-full h-4 overflow-hidden">
                    <div className="bg-green-400 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-medium w-8 text-right">{d.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cool List Emails */}
      <div className="mb-8">
        <h2 className="text-sm font-bold mb-2 text-blue-500">
          Cool Stuff List ({data.emails.filter((e) => e.list === "cool").length})
        </h2>
        {data.emails.filter((e) => e.list === "cool").length === 0 ? (
          <p className="text-sm text-neutral-400">No signups yet</p>
        ) : (
          <div className="space-y-1">
            {data.emails.filter((e) => e.list === "cool").map((e) => (
              <div key={e.id} className="flex items-center justify-between py-2 px-3 bg-blue-50 rounded-lg border border-blue-100">
                <span className="text-sm font-medium">{e.email}</span>
                <span className="text-xs text-neutral-400">
                  {new Date(e.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trash List Emails */}
      <div>
        <h2 className="text-sm font-bold mb-2 text-red-500">
          Trash Stuff List ({data.emails.filter((e) => e.list === "trash").length})
        </h2>
        {data.emails.filter((e) => e.list === "trash").length === 0 ? (
          <p className="text-sm text-neutral-400">No signups yet</p>
        ) : (
          <div className="space-y-1">
            {data.emails.filter((e) => e.list === "trash").map((e) => (
              <div key={e.id} className="flex items-center justify-between py-2 px-3 bg-red-50 rounded-lg border border-red-100">
                <span className="text-sm font-medium">{e.email}</span>
                <span className="text-xs text-neutral-400">
                  {new Date(e.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
