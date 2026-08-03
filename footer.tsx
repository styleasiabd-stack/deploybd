export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#07070b]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-rose-500 to-pink-700">
                <span className="text-sm font-black text-white">D</span>
              </div>
              <span className="font-bold">DeployBD</span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
              বকদেশ-ভিত্তিক ডেভেলপারদের জন্য বানানো একটা production-ready
              starter। Next.js 16, Drizzle ORM, PostgreSQL — সব integrated।
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Stack
            </div>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-400">
              <li>Next.js 16 (App Router)</li>
              <li>Drizzle ORM</li>
              <li>PostgreSQL</li>
              <li>Tailwind CSS v4</li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Integrations
            </div>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-400">
              <li>bKash Tokenized Checkout</li>
              <li>Resend (email)</li>
              <li>Vercel / Netlify</li>
              <li>Custom domains</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-6 md:flex-row md:items-center">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} DeployBD — Built with ❤️ in Dhaka
          </p>
          <p className="text-xs text-slate-500">
            Demo project · Real credentials লাগলে environment variables set করুন
          </p>
        </div>
      </div>
    </footer>
  );
}
