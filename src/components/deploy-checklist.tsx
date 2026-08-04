"use client";

import { useEffect, useState } from "react";
import type { DeploymentTask } from "@/db/schema";

type Task = DeploymentTask;

export default function DeployChecklist({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Recalculate progress
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);

  async function toggle(task: Task) {
    setLoadingId(task.id);
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t)),
    );
    try {
      await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: task.id, done: !task.done }),
      });
    } catch (err) {
      // revert
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, done: task.done } : t)),
      );
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  }

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  return (
    <section id="checklist" className="scroll-mt-20 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          kicker="Step 01"
          title="Deployment Checklist"
          subtitle="একটা একটা করে tick করুন — state PostgreSQL-এ persist হচ্ছে।"
        />

        {/* Progress bar */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-400">
            <span>
              <span className="text-white">{done}</span> / {total} সম্পন্ন
            </span>
            <span className="tabular-nums">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {progress === 100 && (
            <p className="mt-3 text-sm font-medium text-emerald-300">
              🎉 অভিনন্দন! আপনার app-টা production-ready।
            </p>
          )}
        </div>

        {/* Task list */}
        <ul className="mt-6 space-y-3">
          {tasks.map((task, idx) => (
            <li
              key={task.id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-5 transition hover:border-white/20 hover:from-white/[0.06]"
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggle(task)}
                  disabled={loadingId === task.id}
                  aria-label={task.done ? "Mark as incomplete" : "Mark as complete"}
                  className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border-2 transition ${
                    task.done
                      ? "border-rose-500 bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                      : "border-white/20 bg-transparent hover:border-rose-400"
                  }`}
                >
                  {task.done && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono text-slate-500">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className={`text-lg font-semibold transition ${
                        task.done ? "text-slate-400 line-through" : "text-white"
                      }`}
                    >
                      {task.title}
                    </h3>
                    <span
                      className={`ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        task.category === "bonus"
                          ? "border border-violet-400/30 bg-violet-400/10 text-violet-300"
                          : "border border-sky-400/30 bg-sky-400/10 text-sky-300"
                      }`}
                    >
                      {task.category === "bonus" ? "বোনাস" : "Core"}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {task.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function SectionHeader({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="max-w-2xl">
      <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-rose-400">
        {kicker}
      </div>
      <h2 className="text-3xl font-black tracking-tight md:text-4xl">{title}</h2>
      <p className="mt-3 text-slate-400">{subtitle}</p>
    </div>
  );
}
