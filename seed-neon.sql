-- ============================================
-- DeployBD Seed Script — Neon SQL Editor-এ চালান
-- ============================================
-- এই পুরো SQL টা copy করে Neon-এর SQL Editor-এ paste করুন,
-- তারপর Run বাটন চাপুন।

-- Tasks insert করা (already থাকলে update হবে)
INSERT INTO deployment_tasks (id, title, description, category, order_index, done)
VALUES
  ('task-github-push',
   'GitHub-এ repo push',
   'Source code কে version control এ রাখার জন্য GitHub-এ push করা। Collaboration, CI/CD এবং backup-এর জন্য এটা অপরিহার্য।',
   'core', 1, false),
  ('task-vercel-import',
   'Vercel/Netlify-এ import + DATABASE_URL set',
   'Hosting platform-এ project import করে production environment variables (বিশেষ করে DATABASE_URL) সেট করা।',
   'core', 2, false),
  ('task-drizzle-push',
   'Drizzle schema push + seed',
   'npx drizzle-kit push দিয়ে database schema apply করা, তারপর seed script রান করে প্রয়োজনীয় initial data insert করা।',
   'core', 3, false),
  ('task-custom-domain',
   'Custom domain connect',
   'নিজস্ব domain (যেমন example.com) hosting platform-এ connect করা এবং DNS record (CNAME/A) ঠিকমতো configure করা।',
   'core', 4, false),
  ('task-email-service',
   'Email service wire up (বোনাস)',
   'Resend / SendGrid / Mailgun-এর মতো email provider connect করে transactional email পাঠানোর ব্যবস্থা করা।',
   'bonus', 5, false),
  ('task-bkash-gateway',
   'Real bKash gateway (বোনাস)',
   'bKash Tokenized Checkout API integrate করা। sandbox environment-এ test করে production-এ নিয়ে যাওয়া।',
   'bonus', 6, false)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  order_index = EXCLUDED.order_index;

-- Demo subscribers
INSERT INTO subscribers (id, email, name)
VALUES
  ('sub-demo-1', 'rafi@deploybd.dev', 'Rafi'),
  ('sub-demo-2', 'nusrat@deploybd.dev', 'Nusrat'),
  ('sub-demo-3', 'tanvir@deploybd.dev', 'Tanvir')
ON CONFLICT (email) DO NOTHING;

-- Demo payment
INSERT INTO payments (id, invoice_id, amount, payer_name, payer_msisdn, status, trx_id)
VALUES ('pay-demo-1', 'INV-DEPLOYBD-0001', 250, 'Demo User', '01700000000', 'success', 'DEMO8X2A9K')
ON CONFLICT (invoice_id) DO NOTHING;
