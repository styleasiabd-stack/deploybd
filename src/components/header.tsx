export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2.5">
          <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-700 shadow-lg shadow-rose-500/20">
            <span className="text-lg font-black text-white">D</span>
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 pulse-ring" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-tight">DeployBD</span>
            <span className="text-[10px] uppercase tracking-wider text-rose-300/70">
              Bangladeshi Stack
            </span>
          </div>
        </a>

        <nav className="hidden items-center gap-7 text-sm text-slate-300 md:flex">
          <a href="#checklist" className="transition hover:text-white">
            Checklist
          </a>
          <a href="#guide" className="transition hover:text-white">
            গাইড
          </a>
          <a href="#payment" className="transition hover:text-white">
            bKash Demo
          </a>
          <a href="#newsletter" className="transition hover:text-white">
            Newsletter
          </a>
        </nav>

        <a
          href="#checklist"
          className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900 transition hover:bg-rose-100"
        >
          শুরু করুন →
        </a>
      </div>
    </header>
  );
}
