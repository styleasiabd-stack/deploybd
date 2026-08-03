# 🚀 DeployBD — Deployment Guide

বাংলাদেশী ডেভেলপারদের জন্য production-ready Next.js starter। এই guide follow করলে **5 মিনিটেই** আপনার app live হয়ে যাবে — সম্পূর্ণ **ফ্রি**।

---

## 📋 Prerequisites (আগে যা লাগবে)

- [ ] একটা **GitHub account** ([github.com/signup](https://github.com/signup))
- [ ] একটা **Vercel account** — GitHub দিয়ে sign in করুন ([vercel.com/signup](https://vercel.com/signup))
- [ ] **Neon account** — ফ্রি PostgreSQL database এর জন্য ([neon.tech](https://neon.tech))
- [ ] আপনার PC-তে **Git** install করা

---

## 🎯 Option A — Vercel-এ deploy (সবচেয়ে সহজ, RECOMMENDED)

### Step 1: GitHub-এ code push করুন

```bash
# এই folder-এ terminal open করুন
git init
git add .
git commit -m "Initial commit: DeployBD"

# GitHub-এ নতুন repo বানান (github.com/new), তারপর:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/deploybd.git
git push -u origin main
```

### Step 2: Vercel-এ import করুন

1. [vercel.com/new](https://vercel.com/new) যান
2. "Import Git Repository" click করুন
3. আপনার `deploybd` repo select করুন
4. Framework preset automatically **Next.js** detect হবে
5. **Environment Variables** section-এ নিচেরটা add করুন:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Neon থেকে পাওয়া connection string (নিচে দেখুন) |

6. **Deploy** button click করুন — **~2 মিনিট** পর আপনার live URL পাবেন!

### Step 3: Neon থেকে DATABASE_URL নিন

1. [neon.tech](https://neon.tech) sign up করুন (GitHub দিয়ে login)
2. "New Project" → name দিন → region `Southeast Asia (Singapore)` select করুন
3. **Connection Details** tab থেকে `postgresql://...` URL টা copy করুন
4. Vercel-এর Environment Variables-এ paste করুন
5. **Redeploy** করুন

### Step 4: Database schema push + seed

Vercel deploy হয়ে গেলে, আপনার local terminal-এ:

```bash
# Schema database-এ apply করা
npx drizzle-kit push

# Demo data insert করা
npx tsx src/db/seed.ts
```

**অথবা** এক কমান্ডে সব (recommended):

```bash
npm run db:setup
```

### ✅ ব্যাস! আপনার app এখন live: `https://deploybd.vercel.app`

---

## 🎯 Option B — Netlify-এ deploy (বিকল্প)

যদি Vercel-এর বদলে Netlify ব্যবহার করতে চান:

```bash
# Netlify CLI install
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --build --prod
```

Netlify dashboard-এ গিয়ে Environment Variables-এ `DATABASE_URL` set করুন।

---

## 🌐 Custom Domain Connect করা

### Vercel-এ:
1. Project Settings → **Domains**
2. আপনার domain (যেমন `deploybd.com`) add করুন
3. Vercel আপনাকে DNS records দেবে, domain provider-এ add করুন:
   ```
   A     @      76.76.21.21
   CNAME www    cname.vercel-dns.com
   ```
4. 5-10 মিনিট পর SSL automatically enable হবে

### Netlify-এ:
1. Domain management → Add custom domain
2. DNS records Netlify dashboard থেকে copy করুন

---

## 🔐 Environment Variables (সবগুলো)

Production-এ গেলে এই variables গুলো set করতে হবে:

### Core (অবশ্যই লাগবে)
```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

### Optional — bKash Payment (Bonus feature চালু করতে)
```env
BKASH_APP_KEY=your_app_key
BKASH_APP_SECRET=your_app_secret
BKASH_USERNAME=your_username
BKASH_PASSWORD=your_password
BKASH_BASE_URL=https://checkout.pay.bka.sh/v1.2.0-beta   # production
# Sandbox-এর জন্য:
# BKASH_BASE_URL=https://tokenized.sandbox.bka.sh/v1.2.0-beta
```

### Optional — Email Service (Newsletter চালু করতে)
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM="DeployBD <hello@yourdomain.com>"
```

### Optional — App URL
```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## 🔄 পরবর্তীতে Website Update/Edit করার নিয়ম

কোনো code change করলে শুধু এই কমান্ডগুলো চালান:

```bash
# Code change করার পর
git add .
git commit -m "update: description"
git push

# Vercel/Netlify AUTOMATICALLY নতুন version deploy করবে (30-60 seconds)
```

**Database schema change করলে:**
```bash
npx drizzle-kit push
```

**নতুন seed data add করলে:**
```bash
npx tsx src/db/seed.ts
```

---

## 📚 Local Development

```bash
# Dependencies install
npm install

# .env ফাইল বানান (একবারই)
cp .env.example .env
# তারপর .env এ আপনার DATABASE_URL দিন

# Development server চালু
npm run dev
# → http://localhost:3000

# Database setup
npm run db:setup
```

---

## 💡 ফ্রি Database বিকল্প

| Provider | Free Tier | Notes |
|----------|-----------|-------|
| **Neon** ⭐ | 0.5 GB, 1 project | Vercel-এর সাথে best integration |
| **Supabase** | 500 MB | Extra features (auth, storage) |
| **Railway** | $5/month credit | সহজ UI |
| **Vercel Postgres** | 256 MB | Direct Vercel integration |

**আমার recommendation: Neon** — সবচেয়ে বেশি free storage, Vercel-এর সাথে seamless।

---

## 🆘 সমস্যা হলে

- **Database connection error?** → `DATABASE_URL` ঠিকমতো set হয়েছে কিনা check করুন
- **Build fail?** → `npm run build` locally চালিয়ে দেখুন
- **Seed fail?** → আগে `npx drizzle-kit push` চালিয়েছেন কিনা check করুন

---

## 🎉 Ready!

এবার উপরের **Option A** follow করে deploy করে ফেলুন। কোনো step-এ আটকালে জানাবেন।

Made with ❤️ in Dhaka
