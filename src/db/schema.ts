import { pgTable, text, boolean, timestamp, integer, real } from "drizzle-orm/pg-core";

// ---------------------------------------------------------------
// Deployment checklist – the main feature of the app
// ---------------------------------------------------------------
export const deploymentTasks = pgTable("deployment_tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // "core" | "bonus"
  done: boolean("done").notNull().default(false),
  orderIndex: integer("order_index").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------------------------------------------------------------
// (Bonus) Email service – newsletter subscribers
// ---------------------------------------------------------------
export const subscribers = pgTable("subscribers", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  subscribedAt: timestamp("subscribed_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------------------------------------------------------------
// (Bonus) bKash payment records (sandbox / mock)
// ---------------------------------------------------------------
export const payments = pgTable("payments", {
  id: text("id").primaryKey(),
  invoiceId: text("invoice_id").notNull().unique(),
  amount: real("amount").notNull(), // BDT
  payerName: text("payer_name"),
  payerMsisdn: text("payer_msisdn"),
  status: text("status").notNull().default("pending"), // pending | success | failed
  trxId: text("trx_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type DeploymentTask = typeof deploymentTasks.$inferSelect;
export type Subscriber = typeof subscribers.$inferSelect;
export type Payment = typeof payments.$inferSelect;
