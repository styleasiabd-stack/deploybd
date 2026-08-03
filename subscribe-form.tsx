"use client";

import { useState } from "react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState<
    "idle" | "loading" | "success" | "error" | "exists"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [count, setCount] = useState<number | null>(null);

  useState(() => {
    fetch("/api/subscribe")
      .then((r) => r.json())
      .then((d) => setCount(d.count))
      .catch(() => {});
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || undefined }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        if (res.status === 409) {
          setState("exists");
          setErrorMsg(data.error ?? "already subscribed");
        } else {
          setState("error");
          setErrorMsg(data.error ?? "something went wrong");
        }
        return;
      }
      setState("success");
      setEmail("");
      setName("");
      setCount((c) => (c ?? 0) + 1);
    } catch {
      setState("error");
      setErrorMsg("Network error");
    }
  }

  return (
    <section id="newsletter" className="scroll-mt-20 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-rose-950/40 via-[#0f0714] to-sky-950/30 p-8 md:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-rose-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-300">
                ✉️ Newsletter
              </div>
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                Weekly Bangladeshi dev digest
              </h2>
              <p className="mt-3 max-w-md text-slate-300">
                প্রতি সপ্তাহে deployment tips, bKash integration update আর
                Next.js pattern — directly আপনার inbox-এ।
              </p>

              <div className="mt-6 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["R", "N", "T", "S"].map((i, idx) => (
                    <div
                      key={i}
                      className={`grid h-9 w-9 place-items-center rounded-full border-2 border-[#0f0714] text-xs font-bold text-white ${
                        ["bg-rose-500", "bg-sky-500", "bg-emerald-500", "bg-violet-500"][idx]
                      }`}
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-bold text-white">
                    {(count ?? 0).toLocaleString()}
                  </span>
                  <span className="text-slate-400">
                    {" "}
                    developer ইতিমধ্যে subscribe করেছে
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={submit} className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম (optional)"
                disabled={state === "loading"}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-sm text-white placeholder:text-slate-500 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/20"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={state === "loading"}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-sm text-white placeholder:text-slate-500 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/20"
              />
              <button
                type="submit"
                disabled={state === "loading"}
                className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-600/30 transition hover:brightness-110 disabled:opacity-50"
              >
                {state === "loading"
                  ? "Sending..."
                  : state === "success"
                    ? "✓ Subscribed!"
                    : "Subscribe করুন →"}
              </button>

              {state === "success" && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  🎉 ধন্যবাদ! confirmation email পাঠানো হয়েছে (check your
                  inbox, or the server log in local mode)।
                </div>
              )}
              {state === "exists" && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                  {errorMsg}
                </div>
              )}
              {state === "error" && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {errorMsg}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
