# Nuta E-Commerce - Environment Setup Guide

**Status:** ✅ Complete  
**Last Updated:** December 8, 2025

---

## 📋 Overview

This guide explains how to set up environment variables for Nuta E-commerce platform. Three environment files are provided:

1. **`.env.local`** - Local development
2. **`.env.production`** - Production deployment
3. **`.env.complete`** - Full reference with all options

---

## 🚀 Quick Start

### Step 1: Copy Environment File

**For Local Development:**
```bash
cp .env.local .env
```

**For Production:**
```bash
cp .env.production .env
```

### Step 2: Update Placeholder Values

Replace these placeholders with your actual credentials:

```env
# Replace these:
your_password                    → Your actual database password
your_lipana_publishable_key      → Your Lipana API key
your_lipana_secret_key           → Your Lipana secret
your_telegram_chat_id            → Your Telegram chat ID
your_owner_open_id               → Your owner ID
your_forge_api_key               → Your Manus API key
your_analytics_website_id        → Your analytics ID
```

### Step 3: Verify Setup

```bash
# Test that environment variables are loaded
node -e "console.log(process.env.DATABASE_URL)"
```

---

## 📝 Environment Variables Explained

### Database Configuration

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | Primary e-commerce database | `postgresql://user:pass@localhost:5432/nuta` |
| `VITE_SUPABASE_URL` | E-commerce Supabase URL | `https://sqqvqtqnslbhfjezbzzq.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | JWT token |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role | JWT token |

### CMS Database (Supabase)

| Variable | Purpose | Value |
|----------|---------|-------|
| `VITE_SUPABASE_CMS_URL` | CMS Supabase URL | `https://twmpnqbzrntjwammtxbw.supabase.co` |
| `VITE_SUPABASE_CMS_ANON_KEY` | CMS anonymous key | Pre-filled ✅ |
| `SUPABASE_CMS_SERVICE_ROLE_KEY` | CMS service role | Pre-filled ✅ |
| `SUPABASE_CMS_JWT_SECRET` | CMS JWT secret | Pre-filled ✅ |

### Authentication

| Variable | Purpose | Value |
|----------|---------|-------|
| `JWT_SECRET` | Session signing secret | Pre-filled ✅ |
| `VITE_APP_ID` | Manus OAuth app ID | `787b9744-801b-41ab-8df5-ab9ea5fb573b` |
| `OAUTH_SERVER_URL` | OAuth server | `https://api.manus.im` |
| `VITE_OAUTH_PORTAL_URL` | OAuth portal | `https://portal.manus.im` |

### Payment Gateway (M-Pesa)

| Variable | Purpose | Where to Get |
|----------|---------|--------------|
| `LIPANA_PUBLISHABLE_KEY` | Lipana API key | [Lipana Dashboard](https://lipana.co.ke) |
| `LIPANA_SECRET_KEY` | Lipana secret | [Lipana Dashboard](https://lipana.co.ke) |

**How to get Lipana credentials:**
1. Go to https://lipana.co.ke
2. Sign up for a merchant account
3. Go to Settings → API Keys
4. Copy Publishable Key and Secret Key
5. Paste into `.env`

### Telegram Bot

| Variable | Purpose | Value |
|----------|---------|-------|
| `TELEGRAM_BOT_TOKEN` | Bot authentication | `8416151324:AAHCpIMgZcvEebVjYfZRk6aA0tnSDr4Dpd8` |
| `TELEGRAM_CHAT_ID` | Chat to receive notifications | Your Telegram chat ID |

**How to get Telegram Chat ID:**
1. Start a chat with your bot
2. Send a message
3. Go to `https://api.telegram.org/bot8416151324:AAHCpIMgZcvEebVjYfZRk6aA0tnSDr4Dpd8/getUpdates`
4. Find your `chat_id` in the response
5. Paste into `.env`

### Manus APIs

| Variable | Purpose | Where to Get |
|----------|---------|--------------|
| `BUILT_IN_FORGE_API_URL` | Manus API endpoint | `https://api.manus.im` |
| `BUILT_IN_FORGE_API_KEY` | Manus API key | Manus Dashboard |
| `VITE_FRONTEND_FORGE_API_KEY` | Frontend API key | Manus Dashboard |

### Analytics

| Variable | Purpose | Where to Get |
|----------|---------|--------------|
| `VITE_ANALYTICS_ENDPOINT` | Analytics service | `https://analytics.manus.im` |
| `VITE_ANALYTICS_WEBSITE_ID` | Your website ID | Analytics Dashboard |

### Application Settings

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_APP_TITLE` | Website title | `Nuta - Pure Love in a Jar` |
| `VITE_APP_LOGO` | Logo URL | `https://nuta.com/logo.png` |
| `NODE_ENV` | Environment | `production` or `development` |
| `PORT` | Server port | `3000` |

---

## 🔐 Security Best Practices

### ✅ DO:
- ✅ Keep `.env` file in `.gitignore`
- ✅ Never commit `.env` to GitHub
- ✅ Use strong JWT secrets
- ✅ Rotate API keys regularly
- ✅ Use different keys for dev/prod
- ✅ Store secrets in environment variables
- ✅ Use HTTPS in production

### ❌ DON'T:
- ❌ Commit `.env` to version control
- ❌ Share `.env` file via email
- ❌ Use same keys for dev/prod
- ❌ Hardcode secrets in code
- ❌ Log sensitive data
- ❌ Use weak JWT secrets
- ❌ Expose API keys in frontend

---

## 📦 Environment Files Provided

### 1. `.env.local` (Development)
```bash
# For local development
# Use test/sandbox API credentials
# Local database connection
cp .env.local .env
pnpm dev
```

### 2. `.env.production` (Production)
```bash
# For production deployment
# Use production API credentials
# Production database connection
cp .env.production .env
pnpm build
pnpm start
```

### 3. `.env.complete` (Reference)
```bash
# Full reference with all possible variables
# Use as template for custom configurations
```

---

## 🚀 Deployment Setup

### For Render.com

1. Go to Render Dashboard
2. Select your service
3. Go to Settings → Environment
4. Add these variables:

```
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
VITE_SUPABASE_URL=https://sqqvqtqnslbhfjezbzzq.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
LIPANA_PUBLISHABLE_KEY=your_lipana_key
LIPANA_SECRET_KEY=your_lipana_secret
TELEGRAM_BOT_TOKEN=8416151324:AAHCpIMgZcvEebVjYfZRk6aA0tnSDr4Dpd8
TELEGRAM_CHAT_ID=your_chat_id
```

### For Vercel

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add all variables from `.env.production`

### For Railway

1. Go to Railway Dashboard
2. Select your project
3. Go to Variables
4. Add all variables from `.env.production`

---

## ✅ Verification Checklist

Before deploying, verify:

- [ ] `.env` file exists in project root
- [ ] All required variables are set
- [ ] No placeholder values remain
- [ ] Database connection works
- [ ] Supabase credentials are correct
- [ ] Payment gateway credentials are valid
- [ ] Telegram bot token is correct
- [ ] OAuth credentials are set
- [ ] `.env` is in `.gitignore`
- [ ] No secrets are committed to Git

---

## 🧪 Testing Environment Variables

### Test Database Connection
```bash
node -e "
const url = process.env.DATABASE_URL;
console.log('Database:', url ? '✅ Set' : '❌ Missing');
"
```

### Test Supabase Connection
```bash
node -e "
const { createClient } = require('@supabase/supabase-js');
const client = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);
console.log('Supabase:', client ? '✅ Connected' : '❌ Failed');
"
```

### Test All Variables
```bash
pnpm run test:env
```

---

## 🆘 Troubleshooting

### Issue: "Cannot find module 'dotenv'"
**Solution:**
```bash
pnpm add dotenv
```

### Issue: "DATABASE_URL is undefined"
**Solution:**
1. Check `.env` file exists
2. Verify variable name is correct
3. Restart dev server: `pnpm dev`

### Issue: "Supabase connection failed"
**Solution:**
1. Verify `VITE_SUPABASE_URL` is correct
2. Check `VITE_SUPABASE_ANON_KEY` is valid
3. Ensure Supabase project is active

### Issue: "Payment gateway error"
**Solution:**
1. Verify Lipana credentials are correct
2. Check if using test or production keys
3. Verify webhook URL is configured

---

## 📞 Support

For issues with environment setup:

1. Check this guide
2. Review `.env.complete` for reference
3. Check service documentation:
   - [Supabase Docs](https://supabase.com/docs)
   - [Lipana Docs](https://lipana.co.ke/docs)
   - [Telegram Bot API](https://core.telegram.org/bots/api)

---

## 📚 Additional Resources

| Resource | Purpose | Link |
|----------|---------|------|
| Supabase Setup | Database configuration | https://supabase.com/docs |
| Lipana Integration | Payment setup | https://lipana.co.ke |
| Telegram Bot | CMS management | https://core.telegram.org/bots |
| Manus API | Built-in services | https://manus.im/docs |

---

**Version:** 1.0  
**Last Updated:** December 8, 2025  
**Status:** ✅ Complete
