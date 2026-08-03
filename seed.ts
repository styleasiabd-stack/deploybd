import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema.js";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const pool = new Pool({ connectionString: databaseUrl });
const db = drizzle(pool, { schema });

const initialTasks = [
  {
    id: "task-github-push",
    title: "GitHub-এ repo push",
    description:
      "Source code কে version control এ রাখার জন্য GitHub-এ push করা। Collaboration, CI/CD এবং backup-এর জন্য এটা অপরিহার্য।",
    category: "core",
    orderIndex: 1,
  },
  {
    id: "task-vercel-import",
    title: "Vercel/Netlify-এ import + DATABASE_URL set",
    description:
      "Hosting platform-এ project import করে production environment variables (বিশেষ করে DATABASE_URL) সেট করা।",
    category: "core",
    orderIndex: 2,
  },
  {
    id: "task-drizzle-push",
    title: "Drizzle schema push + seed",
    description:
      "`npx drizzle-kit push` দিয়ে database schema apply করা, তারপর seed script রান করে প্রয়োজনীয় initial data insert করা।",
    category: "core",
    orderIndex: 3,
  },
  {
    id: "task-custom-domain",
    title: "Custom domain connect",
    description:
      "নিজস্ব domain (যেমন example.com) hosting platform-এ connect করা এবং DNS record (CNAME/A) ঠিকমতো configure করা।",
    category: "core",
    orderIndex: 4,
  },
  {
    id: "task-email-service",
    title: "Email service wire up (বোনাস)",
    description:
      "Resend / SendGrid / Mailgun-এর মতো email provider connect করে transactional email পাঠানোর ব্যবস্থা করা।",
    category: "bonus",
    orderIndex: 5,
  },
  {
    id: "task-bkash-gateway",
    title: "Real bKash gateway (বোনাস)",
    description:
      "bKash Tokenized Checkout API integrate করা। sandbox environment-এ test করে production-এ নিয়ে যাওয়া।",
    category: "bonus",
    orderIndex: 6,
  },
];

async function seed() {
  console.log("🌱 Seeding database...");

  // Upsert tasks – keep any user-modified state (done flag) intact
  for (const t of initialTasks) {
    await db
      .insert(schema.deploymentTasks)
      .values({ ...t, done: false })
      .onConflictDoUpdate({
        target: schema.deploymentTasks.id,
        set: {
          title: t.title,
          description: t.description,
          category: t.category,
          orderIndex: t.orderIndex,
        },
      });
  }

  const count = await db.$count(schema.deploymentTasks);
  console.log(`✅ Seeded ${count} deployment tasks`);

  // Seed a few demo subscribers
  const demoSubs = [
    { id: "sub-demo-1", email: "rafi@deploybd.dev", name: "Rafi" },
    { id: "sub-demo-2", email: "nusrat@deploybd.dev", name: "Nusrat" },
    { id: "sub-demo-3", email: "tanvir@deploybd.dev", name: "Tanvir" },
  ];
  for (const s of demoSubs) {
    await db
      .insert(schema.subscribers)
      .values(s)
      .onConflictDoNothing({ target: schema.subscribers.email });
  }

  // Seed one demo payment
  await db
    .insert(schema.payments)
    .values({
      id: "pay-demo-1",
      invoiceId: "INV-DEPLOYBD-0001",
      amount: 250,
      payerName: "Demo User",
      payerMsisdn: "01700000000",
      status: "success",
      trxId: "DEMO8X2A9K",
    })
    .onConflictDoNothing({ target: schema.payments.invoiceId });

  console.log("🎉 Seed complete");
  await pool.end();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  pool.end();
  process.exit(1);
});
