type HeroProps = {
  total: number;
  done: number;
  progress: number;
};

export default function Hero({ total, done, progress }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-12 md:pt-24">
        <div className="animate-fade-up max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/5 px-3 py-1 text-xs font-medium text-rose-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-500" />
            </span>
            Production-ready Bangladeshi stack
          </div>

          <h1 className="text-balance text-4xl font-black leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            আপনার app কে{" "}
            <span className="bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 bg-clip-text text-transparent">
              production-এ
            </span>{" "}
            নিয়ে যান।
          </h1>

          <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-slate-300 md:text-xl">
            GitHub থেকে শুরু করে bKash payment পর্যন্ত — একটা সম্পূর্ণ
            deployment checklist যেটা বকদেশ-ভিত্তিক ডেভেলপারদের জন্য বানানো।
            প্রতিটা step interactive, সব state PostgreSQL-এ persist হয়।
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#checklist"
              className="group inline-flex items-center gap-2 rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-600/30 transition hover:bg-rose-500"
            >
              Checklist শুরু করুন
              <span className="transition group-hover:translate-x-0.5">→</span>
            </a>
            <a
              href="#guide"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              গাইড দেখুন
            </a>
          </div>
        </div>

        {/* Progress card */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <StatCard
            label="মোট task"
            value={total.toString()}
            accent="rose"
          />
          <StatCard
            label="সম্পন্ন"
            value={done.toString()}
            accent="emerald"
          />
          <StatCard
            label="Progress"
            value={`${progress}%`}
            accent="sky"
          />
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "rose" | "emerald" | "sky";
}) {
  const accents = {
    rose: "from-rose-500/20 to-pink-500/5 text-rose-300 border-rose-500/20",
    emerald:
      "from-emerald-500/20 to-teal-500/5 text-emerald-300 border-emerald-500/20",
    sky: "from-sky-500/20 to-blue-500/5 text-sky-300 border-sky-500/20",
  }[accent];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${accents} p-6 backdrop-blur`}
    >
      <div className="text-xs font-medium uppercase tracking-widest opacity-80">
        {label}
      </div>
      <div className="mt-2 text-4xl font-black tracking-tight">{value}</div>
    </div>
  );
}
