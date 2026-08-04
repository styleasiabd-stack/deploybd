import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeployBD — Bangladeshi Deployment Checklist",
  description:
    "বকদেশ-ভিত্তিক ডেভেলপারদের জন্য একটা পূর্ণ deployment checklist: GitHub, Vercel, Drizzle, custom domain, bKash payment এবং email service সহ।",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bn">
      <body
        className="min-h-screen bg-[#0a0a0f] text-slate-100 antialiased"
        style={{
          backgroundImage:
            "radial-gradient(1200px 600px at 10% -10%, rgba(225,29,72,0.18), transparent 60%), radial-gradient(1000px 500px at 90% 10%, rgba(59,130,246,0.14), transparent 60%)",
        }}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
