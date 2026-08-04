#!/usr/bin/env bash
# ============================================
# DeployBD — Quick Local Setup Script
# ============================================
# এই script টা চালালে local development environment
# automatic setup হয়ে যাবে।
#
# Usage: bash scripts/setup.sh

set -e

echo "🚀 DeployBD setup শুরু হচ্ছে..."

# Check node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js 18+ দরকার। আপনার version: $(node -v)"
  exit 1
fi
echo "✅ Node.js $(node -v)"

# Install dependencies
echo "📦 Dependencies install হচ্ছে..."
npm install

# Check .env file
if [ ! -f .env ]; then
  echo "📝 .env ফাইল তৈরি করা হচ্ছে..."
  cp .env.example .env
  echo "⚠️  মনে রাখবেন .env ফাইলে আপনার DATABASE_URL দিতে হবে!"
else
  echo "✅ .env ফাইল আগে থেকেই আছে"
fi

# Load .env for setup
set -a
source .env
set +a

if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  DATABASE_URL set করা হয়নি।"
  echo "   .env ফাইল open করে আপনার database URL দিন।"
  echo "   তারপর আবার এই script চালান।"
  exit 1
fi

# Push schema
echo "🗄️  Database schema push হচ্ছে..."
npx drizzle-kit push

# Run seed
echo "🌱 Seed data insert হচ্ছে..."
npx tsx src/db/seed.ts

echo ""
echo "=========================================="
echo "✅ Setup সম্পন্ন!"
echo ""
echo "এবার চালান: npm run dev"
echo "তারপর দেখুন: http://localhost:3000"
echo "=========================================="
