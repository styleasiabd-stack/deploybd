const guides = [
  {
    step: "01",
    title: "GitHub-এ repo push",
    body: "প্রথমে project-টা GitHub-এ push করুন।",
    code: "git init\ngit add .\ngit commit -m \"initial\"\ngit branch -M main\ngit remote add origin <url>\ngit push -u origin main",
    accent: "rose",
  },
  {
    step: "02",
    title: "Vercel-এ import + DATABASE_URL",
    body: "Vercel dashboard থেকে repo import করে Environment Variables-এ DATABASE_URL সেট করুন।",
    code: "# vercel.json (optional)\n{\n  \"framework\": \"nextjs\"\n}\n\n# Environment Variables →\nDATABASE_URL=postgresql://...",
    accent: "sky",
  },
  {
    step: "03",
    title: "Drizzle schema push + seed",
    body: "Build pipeline-এ schema apply এবং seed data insert করুন।",
    code: "npx drizzle-kit push\nnpm run seed",
    accent: "emerald",
  },
  {
    step: "04",
    title: "Custom domain connect",
    body: "Vercel-এ Domain সেকশনে গিয়ে yourdomain.com যোগ করুন।",
    code: "# DNS records —\nA     @      76.76.21.21\nCNAME www    cname.vercel-dns.com",
    accent: "violet",
  },
  {
    step: "05",
    title: "Email service wire up",
    body: "Resend / SendGrid API key পেলে transactional email automatically চালু হয়।",
    code: "RESEND_API_KEY=re_xxxxx\nEMAIL_FROM=\"Me <hi@yoursite.com>\"",
    accent: "amber",
  },
  {
    step: "06",
    title: "Real bKash gateway",
    body: "bKash merchant account থেকে credential পেলে একই code production-এ কাজ করবে।",
    code: "BKASH_APP_KEY=...\nBKASH_APP_SECRET=...\nBKASH_USERNAME=...\nBKASH_PASSWORD=...\nBKASH_BASE_URL=https://checkout.pay.bka.sh/...",
    accent: "pink",
  },
] as const;

const accents: Record<
  string,
  { border: string; dot: string; glow: string; label: string }
> = {
  rose: {
    border: "border-rose-500/30",
    dot: "bg-rose-400",
    glow: "from-rose-500/20",
    label: "text-rose-300",
  },
  sky: {
    border: "border-sky-500/30",
    dot: "bg-sky-400",
    glow: "from-sky-500/20",
    label: "text-sky-300",
  },
  emerald: {
    border: "border-emerald-500/30",
    dot: "bg-emerald-400",
    glow: "from-emerald-500/20",
    label: "text-emerald-300",
  },
  violet: {
    border: "border-violet-500/30",
    dot: "bg-violet-400",
    glow: "from-violet-500/20",
    label: "text-violet-300",
  },
  amber: {
    border: "border-amber-500/30",
    dot: "bg-amber-400",
    glow: "from-amber-500/20",
    label: "text-amber-300",
  },
  pink: {
    border: "border-pink-500/30",
    dot: "bg-pink-400",
    glow: "from-pink-500/20",
    label: "text-pink-300",
  },
};

export default function DeployGuide() {
  return (
    <section id="guide" className="scroll-mt-20 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-rose-400">
            Step 02
          </div>
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">
            Deployment Guide
          </h2>
          <p className="mt-3 text-slate-400">
            প্রতিটা step-এর জন্য কমান্ড, config, আর DNS record — সব এক জায়গায়।
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {guides.map((g) => {
            const a = accents[g.accent];
            return (
              <div
                key={g.step}
                className={`group relative overflow-hidden rounded-2xl border ${a.border} bg-gradient-to-br ${a.glow} to-transparent p-6 transition hover:-translate-y-0.5`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-widest ${a.label}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} />
                    Step {g.step}
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">{g.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {g.body}
                </p>
                <pre className="mt-4 overflow-x-auto rounded-lg border border-white/5 bg-black/50 p-4 text-xs leading-relaxed text-slate-300">
                  <code>{g.code}</code>
                </pre>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
