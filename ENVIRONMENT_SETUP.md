# Environment Variables Setup Guide

## Overview

This guide provides step-by-step instructions for configuring environment variables for the Nuta e-commerce platform across different deployment environments (Vercel for frontend, Render for backend).

## Table of Contents

1. [Quick Start](#quick-start)
2. [Vercel Configuration (Frontend)](#vercel-configuration-frontend)
3. [Render Configuration (Backend)](#render-configuration-backend)
4. [Local Development Setup](#local-development-setup)
5. [Environment Variables Reference](#environment-variables-reference)
6. [Security Best Practices](#security-best-practices)

---

## Quick Start

### For Local Development

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual credentials in the `.env` file

3. Never commit the `.env` file to Git (it's already in `.gitignore`)

---

## Vercel Configuration (Frontend)

### Access Environment Variables

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select the **Nuta** project
3. Navigate to **Settings** → **Environment Variables**

### Required Frontend Variables

Add the following environment variables in Vercel:

#### API & Backend Configuration
```
VITE_API_URL=https://nuta.onrender.com
VITE_FRONTEND_URL=https://nuta-nine.vercel.app
```

#### Supabase Configuration
```
VITE_SUPABASE_URL=https://eoaxnqmesecvvmypkbby.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvYXhucW1lc2VjdnZteXBrYmJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NDQ0NjcsImV4cCI6MjA3NjUyMDQ2N30.ccBLoHpAv1g8X4lzhcuoOIs2b2w20BvVCeNAVRi_g-s
```

#### Cloudinary Configuration
```
VITE_CLOUDINARY_CLOUD_NAME=da7oqe9it
```

#### PayPal Configuration
```
VITE_PAYPAL_CLIENT_ID=AavUXOaxu89b4enrMtlnYchRzHTYQsOp8UrhBiQHJbmjTeTgV0bXucpidE3nnMjEpHFeKhBLQd1yxslZ
```

#### Manus OAuth (Optional - if using)
```
VITE_APP_ID=your_manus_app_id
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
```

### Environment Selection

For each variable, select the appropriate environments:
- ✅ **Production** (for live site)
- ✅ **Preview** (for preview deployments)
- ✅ **Development** (for development builds)

### Redeploy

After adding variables, trigger a new deployment:
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Redeploy** button

---

## Render Configuration (Backend)

### Access Environment Variables

1. Go to your Render dashboard: https://dashboard.render.com
2. Select your **Nuta** backend service
3. Navigate to **Environment** tab

### Required Backend Variables

Add the following environment variables in Render:

#### Server Configuration
```
PORT=3001
NODE_ENV=production
APP_NAME=NUTA
APP_URL=https://nuta.onrender.com
FRONTEND_URL=https://nuta-nine.vercel.app
```

#### Database Configuration
```
SUPABASE_URL=https://eoaxnqmesecvvmypkbby.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvYXhucW1lc2VjdnZteXBrYmJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NDQ0NjcsImV4cCI6MjA3NjUyMDQ2N30.ccBLoHpAv1g8X4lzhcuoOIs2b2w20BvVCeNAVRi_g-s
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvYXhucW1lc2VjdnZteXBrYmJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDk0NDQ2NywiZXhwIjoyMDc2NTIwNDY3fQ.CGpZOx8TM2oOTqEgBZOu2BUPUYKduQsziJbt9-D6uMQ
DATABASE_URL=postgresql://postgres:Nuta145600.@db.eoaxnqmesecvvmypkbby.supabase.co:5432/postgres
```

#### Authentication & Security
```
JWT_SECRET=9b53b0d1166db84d656035ae5586734cbd3bf43925d2d8eae36e725c98e608a5a48e6de1f6ac5183f3ba3505ef0cd456abf3f4d0c3f4e215bd6846908ddce6ad
```

#### CORS Configuration
```
CORS_ORIGIN=https://nuta-nine.vercel.app
```

#### Cloudinary Configuration
```
CLOUDINARY_CLOUD_NAME=da7oqe9it
CLOUDINARY_API_KEY=254924926596735
CLOUDINARY_API_SECRET=KvvT0cUv19Sl0JRAjrrbBjOasGc
```

#### Email Configuration (Gmail SMTP)
```
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=info.stevehaveit@gmail.com
MAIL_PASSWORD=zgesoewsmwynpauq
MAIL_FROM_ADDRESS=info.stevehaveit@gmail.com
MAIL_FROM_NAME=Nuta by Steve Have It
```

#### PayPal Configuration
```
PAYPAL_CLIENT_ID=AavUXOaxu89b4enrMtlnYchRzHTYQsOp8UrhBiQHJbmjTeTgV0bXucpidE3nnMjEpHFeKhBLQd1yxslZ
PAYPAL_CLIENT_SECRET=EI7NqAMfhc1lSHD4Mg8c3mDNkXDMBUkMc5swNUX6olr9gKUvQvN8Ql5is6PXCji7dZJPHv0cWbELDDFZ
PAYPAL_MODE=sandbox
PAYPAL_CALLBACK_URL=https://nuta.onrender.com/api/payment/paypal/callback
```

#### AI Configuration
```
AI_ENGINE=DeepSeek
AI_MODEL=deepseek-ai/DeepSeek-R1-0528
AI_API_KEY=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
AI_ENDPOINT=https://huggingface.co/spaces/SteveHaveit/deepseek-ai-DeepSeek-R1-0528/api/predict
AI_MAX_TOKENS=1000
AI_TEMPERATURE=0.7
```

#### Loyalty System Configuration
```
LOYALTY_ENABLED=true
LOYALTY_POINTS_PER_500KES=9
LOYALTY_POINT_VALUE=3
LOYALTY_WITHDRAWAL_PERIOD_DAYS=3
```

#### Spin Wheel Configuration
```
SPIN_ENABLED=true
SPIN_REWARD_TIERS=5:100,10:200,20:500,30:1000
SPIN_FESTIVE_MODE=true
SPIN_FESTIVE_BONUS_PERCENT=15
```

#### Affiliate System Configuration
```
AFFILIATE_ENABLED=true
AFFILIATE_BASE_PERCENT=5
AFFILIATE_RANK_BONUS=2
AFFILIATE_PAYOUT_DAY=1
AFFILIATE_ADMIN_APPROVAL_REQUIRED=true
```

#### Marketing Configuration
```
EMAIL_CAMPAIGNS_ENABLED=true
SMS_CAMPAIGNS_ENABLED=true
AI_MARKETING_ENABLED=true
POPUP_ENABLED=true
```

#### Feature Flags
```
ENABLE_GUEST_CHECKOUT=true
ENABLE_LOYALTY_SYSTEM=true
ENABLE_REFERRAL_SYSTEM=true
ENABLE_SPIN_WHEEL=true
ENABLE_AFFILIATE_TRACKING=true
ENABLE_AI_ASSISTANT=true
```

### Deploy Changes

After adding all environment variables:
1. Click **Save Changes**
2. Render will automatically redeploy your service

---

## Local Development Setup

### Prerequisites

- Node.js 18+ installed
- pnpm package manager
- Git

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/SteveHaveIt/Nuta.git
   cd Nuta
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file**
   - Open `.env` in your text editor
   - Fill in all required credentials
   - Use the values from the sections above

5. **Run database migrations**
   ```bash
   pnpm db:push
   ```

6. **Start development server**
   ```bash
   pnpm dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

---

## Environment Variables Reference

### Critical Variables (Must Configure)

| Variable | Description | Where Used |
|----------|-------------|------------|
| `DATABASE_URL` | PostgreSQL connection string | Backend |
| `JWT_SECRET` | Secret key for JWT tokens | Backend |
| `SUPABASE_URL` | Supabase project URL | Both |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Both |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Backend |
| `MAIL_PASSWORD` | Gmail app password | Backend |
| `PAYPAL_CLIENT_ID` | PayPal client ID | Both |
| `PAYPAL_CLIENT_SECRET` | PayPal secret | Backend |

### Optional Variables (Can Configure Later)

| Variable | Description | Status |
|----------|-------------|--------|
| `MPESA_CONSUMER_KEY` | M-PESA API key | Not configured |
| `TWILIO_ACCOUNT_SID` | Twilio account ID | Not configured |
| `WHATSAPP_API_KEY` | WhatsApp API key | Not configured |
| `VITE_APP_ID` | Manus OAuth app ID | Not configured |

### Business Logic Variables

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `LOYALTY_POINTS_PER_500KES` | 9 | Points earned per KES 500 spent |
| `LOYALTY_POINT_VALUE` | 3 | Value of 1 point in KES |
| `AFFILIATE_BASE_PERCENT` | 5 | Base commission percentage |
| `SPIN_REWARD_TIERS` | 5:100,10:200,20:500,30:1000 | Purchase tiers and rewards |
| `DELIVERY_FEE_NAIROBI` | 100 | Delivery fee in Nairobi (KES) |

---

## Security Best Practices

### ✅ DO

1. **Use environment-specific values**
   - Development: Use sandbox/test credentials
   - Production: Use live credentials

2. **Rotate secrets regularly**
   - Change JWT_SECRET periodically
   - Update API keys quarterly

3. **Use strong secrets**
   - JWT_SECRET should be 64+ characters
   - Use cryptographically secure random strings

4. **Limit access**
   - Only share credentials with authorized team members
   - Use role-based access in deployment platforms

5. **Monitor usage**
   - Check API usage in Cloudinary, PayPal, etc.
   - Set up alerts for unusual activity

### ❌ DON'T

1. **Never commit `.env` to Git**
   - Already protected by `.gitignore`
   - Double-check before pushing

2. **Don't share credentials publicly**
   - No screenshots with secrets
   - No posting in public forums

3. **Don't use production credentials in development**
   - Use separate databases
   - Use sandbox mode for payments

4. **Don't hardcode secrets in code**
   - Always use environment variables
   - Never put secrets in frontend code

5. **Don't reuse passwords**
   - Each service should have unique credentials
   - Use a password manager

---

## Troubleshooting

### Frontend Not Connecting to Backend

**Problem**: Frontend shows connection errors

**Solution**:
1. Verify `VITE_API_URL` in Vercel matches your Render backend URL
2. Check CORS settings in backend
3. Ensure backend is deployed and running

### Database Connection Errors

**Problem**: Backend can't connect to database

**Solution**:
1. Verify `DATABASE_URL` is correct
2. Check Supabase project is active
3. Ensure IP allowlist includes Render's IPs (or set to allow all)

### Email Not Sending

**Problem**: Email notifications not working

**Solution**:
1. Verify Gmail app password (not regular password)
2. Check `MAIL_USERNAME` and `MAIL_PASSWORD`
3. Ensure "Less secure app access" is enabled (or use app password)

### PayPal Payment Errors

**Problem**: PayPal payments failing

**Solution**:
1. Verify `PAYPAL_MODE` is set correctly (sandbox/live)
2. Check client ID and secret match the mode
3. Ensure callback URL is correct

### Image Upload Failing

**Problem**: Product images not uploading

**Solution**:
1. Verify Cloudinary credentials
2. Check API key permissions
3. Ensure upload preset is configured

---

## Getting Help

### Support Channels

- **Email**: info.stevehaveit@gmail.com
- **GitHub Issues**: https://github.com/SteveHaveIt/Nuta/issues
- **Documentation**: See README.md

### Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [PayPal Developer](https://developer.paypal.com)

---

## Checklist

Use this checklist to ensure all environment variables are configured:

### Vercel (Frontend)
- [ ] VITE_API_URL
- [ ] VITE_FRONTEND_URL
- [ ] VITE_SUPABASE_URL
- [ ] VITE_SUPABASE_ANON_KEY
- [ ] VITE_CLOUDINARY_CLOUD_NAME
- [ ] VITE_PAYPAL_CLIENT_ID

### Render (Backend)
- [ ] PORT
- [ ] NODE_ENV
- [ ] DATABASE_URL
- [ ] JWT_SECRET
- [ ] SUPABASE_URL
- [ ] SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] CORS_ORIGIN
- [ ] CLOUDINARY credentials (3 vars)
- [ ] MAIL credentials (5 vars)
- [ ] PAYPAL credentials (4 vars)
- [ ] AI configuration (4 vars)
- [ ] Feature flags (6 vars)

### Optional (Configure as needed)
- [ ] M-PESA credentials
- [ ] Twilio credentials
- [ ] WhatsApp API credentials
- [ ] Manus OAuth credentials

---

**Last Updated**: November 12, 2025  
**Version**: 1.0.0  
**Maintainer**: Steve Have It (info.stevehaveit@gmail.com)
