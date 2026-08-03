# ⚡ 5-Minute Deploy Guide (Quick Reference)

## 🎯 TL;DR — এক কথায়

```bash
# 1. GitHub repo বানান, code push করুন
git init && git add . && git commit -m "init"
git remote add origin https://github.com/YOU/deploybd.git
git push -u origin main

# 2. Neon.tech থেকে ফ্রি database নিন → DATABASE_URL copy করুন

# 3. Vercel-এ import করুন → Environment Variable এ DATABASE_URL দিন → Deploy!
```

## 🔗 সরাসরি Links

| কি | কোথায় |
|----|--------|
| GitHub-এ code push | `git push` |
| **Vercel-এ import (1-click)** | [vercel.com/new](https://vercel.com/new) |
| **Neon database (ফ্রি)** | [neon.tech](https://neon.tech) |
| **Resend email (ফ্রি)** | [resend.com](https://resend.com) |
| **bKash merchant** | [bka.sh](https://developer.bka.sh) |

## 📝 Environment Variables (Vercel-এ দিতে হবে)

### Required:
```
DATABASE_URL=postgresql://...
```

### Optional (bonus features):
```
BKASH_APP_KEY=...
BKASH_APP_SECRET=...
BKASH_USERNAME=...
BKASH_PASSWORD=...
BKASH_BASE_URL=https://tokenized.sandbox.bka.sh/v1.2.0-beta

RESEND_API_KEY=re_...
EMAIL_FROM="DeployBD <hello@yourdomain.com>"

NEXT_PUBLIC_APP_URL=https://yourdomain.vercel.app
```

## 🔄 পরে update করার নিয়ম

```bash
# code change করুন, তারপর:
git add .
git commit -m "update xyz"
git push
# Vercel automatically নতুন version deploy করবে
```

## 💾 Database schema change

```bash
npx drizzle-kit push
```

## 🌐 Custom domain

Vercel Settings → Domains → yourdomain.com add করুন → DNS records আপনার provider-এ বসান।

---

বিস্তারিত জানতে পড়ুন [README.md](./README.md)
