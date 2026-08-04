"use client";

import { useState } from "react";

type InitiateResponse = {
  paymentID: string;
  bkashURL: string;
  invoice: string;
  amount: number;
  mode: "live" | "sandbox";
  internalId: string;
};

type VerifyResponse = {
  status: "success" | "failed";
  trxID: string;
  amount: number;
  invoice: string;
};

const amounts = [100, 250, 500, 1000, 2500];

type Step = "form" | "pending" | "done";

export default function PaymentDemo() {
  const [step, setStep] = useState<Step>("form");
  const [amount, setAmount] = useState<number>(250);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [payerName, setPayerName] = useState<string>("");
  const [payerMsisdn, setPayerMsisdn] = useState<string>("");

  const [initiated, setInitiated] = useState<InitiateResponse | null>(null);
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const finalAmount = customAmount ? Number(customAmount) : amount;

  async function handleInitiate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (!Number.isFinite(finalAmount) || finalAmount <= 0) {
        throw new Error("সঠিক amount দিন");
      }
      const res = await fetch("/api/payment/bkash/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          payerName: payerName.trim() || null,
          payerMsisdn: payerMsisdn.trim() || null,
        }),
      });
      const data = (await res.json()) as InitiateResponse & { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "initiate failed");
      }
      setInitiated(data);
      setStep("pending");
    } catch (err) {
      setError(err instanceof Error ? err.message : "কিছু একটা সমস্যা হয়েছে");
    } finally {
      setBusy(false);
    }
  }

  async function handleSimulate() {
    if (!initiated) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/payment/bkash/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentID: initiated.paymentID }),
      });
      const data = (await res.json()) as VerifyResponse & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "verify failed");
      setResult(data);
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "verify failed");
      setStep("form");
    } finally {
      setBusy(false);
    }
  }

  function handleReset() {
    setStep("form");
    setInitiated(null);
    setResult(null);
    setError(null);
    setPayerName("");
    setPayerMsisdn("");
  }

  return (
    <section id="payment" className="scroll-mt-20 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-rose-400">
            Step 03 — Bonus
          </div>
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">
            bKash Payment Demo
          </h2>
          <p className="mt-3 text-slate-400">
            Real bKash Tokenized Checkout flow-এর একটা end-to-end simulation।
            API credentials set না থাকলে automatically sandbox mode-এ চলে।
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          {/* Left: form */}
          <div className="lg:col-span-3">
            <div className="overflow-hidden rounded-3xl border border-pink-500/20 bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-transparent">
              {/* bKash brand header */}
              <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#e2136e] to-[#b10d57] px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-white text-[#e2136e]">
                    <span className="text-sm font-black">bK</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">bKash</div>
                    <div className="text-[10px] font-medium uppercase tracking-wider text-white/70">
                      Tokenized Checkout
                    </div>
                  </div>
                </div>
                <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                  {initiated?.mode ?? "demo"}
                </span>
              </div>

              <form onSubmit={handleInitiate} className="space-y-5 p-6">
                {/* Amount */}
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
                    Amount (BDT)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {amounts.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => {
                          setAmount(a);
                          setCustomAmount("");
                        }}
                        className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                          amount === a && !customAmount
                            ? "border-pink-400 bg-pink-500 text-white shadow-lg shadow-pink-500/30"
                            : "border-white/15 bg-white/5 text-slate-300 hover:border-white/30"
                        }`}
                      >
                        ৳{a}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3">
                    <input
                      type="number"
                      min={1}
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="অথবা custom amount লিখুন"
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
                    />
                  </div>
                </div>

                {/* Payer info */}
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
                      আপনার নাম
                    </label>
                    <input
                      type="text"
                      value={payerName}
                      onChange={(e) => setPayerName(e.target.value)}
                      placeholder="Rahim Uddin"
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
                      bKash নম্বর
                    </label>
                    <input
                      type="tel"
                      value={payerMsisdn}
                      onChange={(e) => setPayerMsisdn(e.target.value)}
                      placeholder="01712345678"
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                )}

                {step === "form" && (
                  <button
                    type="submit"
                    disabled={busy || finalAmount <= 0}
                    className="w-full rounded-xl bg-gradient-to-r from-[#e2136e] to-[#b10d57] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-600/30 transition hover:brightness-110 disabled:opacity-50"
                  >
                    {busy ? "অপেক্ষা করুন..." : `Pay ৳${finalAmount} with bKash`}
                  </button>
                )}

                {step === "pending" && initiated && (
                  <div className="space-y-3">
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                      <div className="mb-1 font-semibold">
                        🔐 bKash PIN confirm করুন
                      </div>
                      <div className="font-mono text-[11px] text-amber-200/80">
                        Invoice: {initiated.invoice}
                        <br />
                        Payment ID: {initiated.paymentID}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSimulate}
                      disabled={busy}
                      className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition hover:brightness-110 disabled:opacity-50"
                    >
                      {busy ? "Verifying..." : "Confirm payment (simulate)"}
                    </button>
                  </div>
                )}

                {step === "done" && result && (
                  <div className="space-y-3">
                    {result.status === "success" ? (
                      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
                        <div className="mb-1 flex items-center gap-2 text-sm font-bold text-emerald-200">
                          <span className="text-lg">✅</span> Payment
                          successful!
                        </div>
                        <div className="font-mono text-[11px] text-emerald-200/80">
                          TrxID: {result.trxID}
                          <br />
                          Invoice: {result.invoice}
                          <br />
                          Amount: ৳{result.amount}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        Payment failed — TrxID: {result.trxID}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      Another payment
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right: info + receipts */}
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                How it works
              </div>
              <ol className="mt-3 space-y-2.5 text-sm text-slate-300">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-[10px] font-bold text-rose-300">
                    1
                  </span>
                  <span>
                    <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-rose-300">
                      POST /api/payment/bkash/initiate
                    </code>
                    <br />
                    <span className="text-slate-400">
                      Payment ID আর redirect URL পেতে
                    </span>
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-[10px] font-bold text-rose-300">
                    2
                  </span>
                  <span>
                    User bKash app-এ PIN confirm করে
                    <br />
                    <span className="text-slate-400">
                      (সandbox-এ skip করা যায়)
                    </span>
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-[10px] font-bold text-rose-300">
                    3
                  </span>
                  <span>
                    <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-rose-300">
                      POST /api/payment/bkash/verify
                    </code>
                    <br />
                    <span className="text-slate-400">
                      Execute করে TrxID নিয়ে status save করা
                    </span>
                  </span>
                </li>
              </ol>
            </div>

            <PaymentStatsCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function PaymentStatsCard() {
  const [data, setData] = useState<{
    successCount: number;
    totalBdt: number;
    recent: Array<{ id: string; invoiceId: string; amount: number; status: string; trxId: string | null }>;
  } | null>(null);

  useState(() => {
    fetch("/api/payment/bkash/verify")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {});
  });

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Demo payments
        </div>
        <button
          onClick={() =>
            fetch("/api/payment/bkash/verify")
              .then((r) => r.json())
              .then((d) => setData(d))
          }
          className="text-[10px] font-semibold uppercase tracking-wider text-rose-300 hover:text-rose-200"
        >
          Refresh
        </button>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-black/30 p-3">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">
            Success
          </div>
          <div className="text-2xl font-black text-emerald-300">
            {data?.successCount ?? 0}
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-3">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">
            Total BDT
          </div>
          <div className="text-2xl font-black text-rose-300">
            ৳{data?.totalBdt ?? 0}
          </div>
        </div>
      </div>
      {data?.recent && data.recent.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {data.recent.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between rounded-lg border border-white/5 bg-black/20 px-3 py-2 text-xs"
            >
              <span className="font-mono text-slate-400">{p.invoiceId}</span>
              <span className="tabular-nums text-white">৳{p.amount}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                  p.status === "success"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : p.status === "pending"
                      ? "bg-amber-500/20 text-amber-300"
                      : "bg-red-500/20 text-red-300"
                }`}
              >
                {p.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
