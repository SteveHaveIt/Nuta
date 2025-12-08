# Render.com Deployment Guide - Nuta E-Commerce Platform

**Last Updated:** December 8, 2025  
**Platform:** Render.com  
**Project:** Nuta E-Commerce Platform (nuta-ecommerce)  
**Stack:** React 19 + Express 4 + tRPC 11 + MySQL

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step-by-Step Deployment](#step-by-step-deployment)
3. [Environment Variables](#environment-variables)
4. [Build & Start Commands](#build--start-commands)
5. [Database Configuration](#database-configuration)
6. [Webhook Configuration](#webhook-configuration)
7. [Troubleshooting](#troubleshooting)
8. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Prerequisites

Before deploying to Render, ensure you have:

### 1. **Render Account**
- Sign up at [render.com](https://render.com)
- Verify email and set up billing

### 2. **GitHub Repository**
- Your project pushed to GitHub (✅ Already done: SteveHaveIt/Nuta)
- GitHub account connected to Render

### 3. **Required Credentials**
Gather these before deployment:
- Supabase connection string (DATABASE_URL)
- JWT_SECRET for session management
- OAuth credentials (VITE_APP_ID, OAUTH_SERVER_URL, etc.)
- Lipana API keys (LIPANA_PUBLISHABLE_KEY, LIPANA_SECRET_KEY)
- Email service credentials (if using custom SMTP)
- Analytics credentials (optional)

### 4. **Domain (Optional)**
- Custom domain or use Render's free domain (*.onrender.com)

---

## Step-by-Step Deployment

### Phase 1: Create Render Account & Connect GitHub

#### Step 1.1: Sign Up on Render
1. Go to [render.com](https://render.com)
2. Click "Get Started" or "Sign Up"
3. Choose "Sign up with GitHub" for easier integration
4. Authorize Render to access your GitHub account
5. Verify your email address

#### Step 1.2: Create New Web Service
1. In Render dashboard, click **"New +"** button (top-right)
2. Select **"Web Service"**
3. Choose **"Build and deploy from a Git repository"**
4. Click **"Connect GitHub"** if not already connected
5. Search for **"SteveHaveIt/Nuta"** repository
6. Click **"Connect"** next to the repository

---

### Phase 2: Configure Web Service

#### Step 2.1: Basic Settings
| Setting | Value |
|---------|-------|
| **Name** | `nuta-ecommerce` |
| **Region** | Singapore (closest to Kenya) or US-East |
| **Branch** | `main` |
| **Runtime** | Node |
| **Build Command** | `pnpm install && pnpm build` |
| **Start Command** | `pnpm start` |

#### Step 2.2: Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add each variable (see [Environment Variables](#environment-variables) section):

```
DATABASE_URL = <your-supabase-connection-string>
JWT_SECRET = <your-jwt-secret>
NODE_ENV = production
VITE_APP_ID = <your-oauth-app-id>
OAUTH_SERVER_URL = <your-oauth-server-url>
VITE_OAUTH_PORTAL_URL = <your-oauth-portal-url>
OWNER_OPEN_ID = <your-owner-id>
OWNER_NAME = Steve Have It
BUILT_IN_FORGE_API_URL = <your-forge-api-url>
BUILT_IN_FORGE_API_KEY = <your-forge-api-key>
VITE_FRONTEND_FORGE_API_URL = <your-frontend-forge-api-url>
VITE_FRONTEND_FORGE_API_KEY = <your-frontend-forge-api-key>
LIPANA_PUBLISHABLE_KEY = <your-lipana-publishable-key>
LIPANA_SECRET_KEY = <your-lipana-secret-key>
VITE_APP_TITLE = Nuta - Premium Peanut Butter
VITE_APP_LOGO = /nuta-logo.png
VITE_ANALYTICS_ENDPOINT = <optional>
VITE_ANALYTICS_WEBSITE_ID = <optional>
```

#### Step 2.3: Instance Settings
| Setting | Value |
|---------|-------|
| **Plan** | Standard ($12/month) or Pro ($19/month) |
| **CPU** | 0.5 vCPU (Standard) |
| **Memory** | 1 GB (Standard) |
| **Disk** | 10 GB |

---

### Phase 3: Deploy

#### Step 3.1: Review & Deploy
1. Scroll down and review all settings
2. Click **"Create Web Service"**
3. Render will start building your project
4. Monitor the build logs in real-time

#### Step 3.2: Monitor Build Progress
- Build logs appear in the **"Logs"** tab
- Expected build time: 3-5 minutes
- You'll see:
  ```
  Installing dependencies...
  Building application...
  Deployment successful!
  ```

#### Step 3.3: Access Your Deployed App
- Once deployed, you'll get a URL: `https://nuta-ecommerce.onrender.com`
- Click the URL to test your live application

---

## Environment Variables

### Required Variables (Must Set)

#### Database Connection
```
DATABASE_URL=mysql://user:password@host:port/database
```
**Source:** Supabase connection string  
**Format:** `mysql://nuta_user:password@sqqvqtqnslbhfjezbzzq.c.supabase.co:3306/nuta_ecommerce`

#### Authentication
```
JWT_SECRET=<your-jwt-secret-key>
NODE_ENV=production
VITE_APP_ID=787b9744-801b-41ab-8df5-ab9ea5fb573b
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=<your-owner-open-id>
OWNER_NAME=Steve Have It
```

#### Manus Built-in APIs
```
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=<your-forge-api-key>
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=<your-frontend-forge-api-key>
```

#### Payment Integration (Lipana M-Pesa)
```
LIPANA_PUBLISHABLE_KEY=lsk_d8e7b2a1f4c5e6d7a8b9c0d1e2f3a4b5
LIPANA_SECRET_KEY=<your-lipana-secret-key>
```

#### Branding
```
VITE_APP_TITLE=Nuta - Premium Peanut Butter
VITE_APP_LOGO=/nuta-logo.png
```

#### Analytics (Optional)
```
VITE_ANALYTICS_ENDPOINT=<your-analytics-endpoint>
VITE_ANALYTICS_WEBSITE_ID=<your-analytics-id>
```

### How to Get Each Variable

#### 1. DATABASE_URL
```
Source: Supabase Dashboard
Path: Settings → Database → Connection String
Format: mysql://user:password@host:3306/database
```

#### 2. JWT_SECRET
```
Already configured in your Manus project
Use the same value from your local .env
```

#### 3. OAuth Credentials
```
Source: Manus Dashboard
Path: Settings → OAuth → Application Details
- VITE_APP_ID: Your OAuth app ID
- OAUTH_SERVER_URL: https://api.manus.im
- VITE_OAUTH_PORTAL_URL: https://portal.manus.im
```

#### 4. Lipana API Keys
```
Source: Lipana Dashboard (https://lipana.dev)
- LIPANA_PUBLISHABLE_KEY: Public key for frontend
- LIPANA_SECRET_KEY: Secret key for backend
```

---

## Build & Start Commands

### Build Command
```bash
pnpm install && pnpm build
```

**What it does:**
1. Installs all dependencies from `package.json`
2. Compiles TypeScript to JavaScript
3. Bundles frontend assets with Vite
4. Prepares server code for production

### Start Command
```bash
pnpm start
```

**What it does:**
1. Starts Express server on port 3000
2. Serves compiled frontend assets
3. Initializes OAuth and database connections
4. Listens for API requests

### Alternative Start Commands

**If you need to run migrations on startup:**
```bash
pnpm db:push && pnpm start
```

**If you need to seed initial data:**
```bash
pnpm seed && pnpm start
```

---

## Database Configuration

### Option 1: Use Existing Supabase Database (Recommended)

**Advantages:**
- ✅ No additional cost
- ✅ Data already synced
- ✅ Automatic backups
- ✅ Easy to manage

**Steps:**
1. In Render dashboard, go to your Web Service
2. Click **"Environment"** tab
3. Add `DATABASE_URL` with your Supabase connection string
4. Deploy

**Supabase Connection String Format:**
```
mysql://user:password@sqqvqtqnslbhfjezbzzq.c.supabase.co:3306/nuta_ecommerce
```

### Option 2: Create MySQL Database on Render

**Advantages:**
- ✅ Everything in one place
- ✅ Integrated with Render
- ✅ Easier management

**Steps:**
1. In Render dashboard, click **"New +"**
2. Select **"MySQL"**
3. Configure:
   - **Name:** `nuta-db`
   - **Database:** `nuta_ecommerce`
   - **User:** `nuta_user`
   - **Region:** Singapore
   - **Plan:** Standard ($15/month)
4. Click **"Create Database"**
5. Copy the connection string
6. Add to Web Service environment variables

**Note:** You'll need to migrate your data from Supabase to Render's MySQL.

### Recommended: Hybrid Approach

**Use Supabase for database, Render for application:**
- Database: Supabase MySQL (sqqvqtqnslbhfjezbzzq)
- Application: Render.com
- This keeps your data safe and application scalable

---

## Webhook Configuration

### Lipana Payment Webhook

**Webhook Endpoint:**
```
https://nuta-ecommerce.onrender.com/api/webhooks/lipana
```

#### Setup Instructions:

1. **Log in to Lipana Dashboard**
   - Go to [lipana.dev](https://lipana.dev)
   - Navigate to Settings → Webhooks

2. **Add Webhook URL**
   - URL: `https://nuta-ecommerce.onrender.com/api/webhooks/lipana`
   - Events: Select "Payment Completed", "Payment Failed"
   - Click "Save"

3. **Webhook Handler Code**
   - Location: `server/webhooks.ts`
   - Handles: Payment status updates, order confirmation
   - Updates: Order status from pending → confirmed/failed

4. **Testing Webhook**
   - Use Lipana's test mode
   - Send test payment
   - Check Render logs for webhook receipt

---

## Troubleshooting

### Build Failures

#### Error: "pnpm: command not found"
**Solution:**
1. Go to Web Service settings
2. Update **Build Command** to:
   ```bash
   npm install -g pnpm && pnpm install && pnpm build
   ```

#### Error: "DATABASE_URL is not set"
**Solution:**
1. Check Environment Variables in Render dashboard
2. Ensure `DATABASE_URL` is added
3. Redeploy the service

#### Error: "Cannot find module 'drizzle-orm'"
**Solution:**
1. Delete `node_modules` and `pnpm-lock.yaml` locally
2. Run `pnpm install`
3. Commit and push to GitHub
4. Redeploy on Render

### Runtime Errors

#### Port Already in Use
**Solution:**
- Render automatically assigns port 3000
- Check `server/_core/index.ts` uses `process.env.PORT || 3000`
- Already configured in template ✅

#### Database Connection Timeout
**Solution:**
1. Verify `DATABASE_URL` is correct
2. Check Supabase is accessible from Render's IP
3. Ensure database user has proper permissions
4. Test connection locally: `mysql -u user -p -h host database`

#### OAuth Redirect URI Mismatch
**Solution:**
1. Go to Manus OAuth settings
2. Add Render URL to allowed redirects:
   ```
   https://nuta-ecommerce.onrender.com/api/oauth/callback
   ```
3. Redeploy

### Performance Issues

#### Slow Build Times
**Solution:**
1. Render caches dependencies
2. First deploy takes 3-5 minutes
3. Subsequent deploys faster (1-2 minutes)
4. Consider upgrading to Pro plan for faster builds

#### High Memory Usage
**Solution:**
1. Upgrade to Pro plan (2GB memory)
2. Optimize database queries
3. Enable caching in Redis (optional)

#### Database Slow Queries
**Solution:**
1. Check Supabase query logs
2. Add indexes to frequently queried columns
3. Consider upgrading database plan

---

## Post-Deployment Checklist

### ✅ Immediate After Deployment

- [ ] Access live URL: `https://nuta-ecommerce.onrender.com`
- [ ] Test homepage loads
- [ ] Check console for errors (F12 → Console tab)
- [ ] Verify database connection (check logs)
- [ ] Test OAuth login flow
- [ ] Verify environment variables are loaded

### ✅ Feature Testing

- [ ] **Products Page**
  - [ ] Products load from database
  - [ ] Filtering works
  - [ ] Images display correctly

- [ ] **Shopping Cart**
  - [ ] Add item to cart
  - [ ] Cart badge updates
  - [ ] Quantity adjustment works
  - [ ] Remove item works

- [ ] **Checkout**
  - [ ] Shipping form validates
  - [ ] Payment modal appears
  - [ ] M-Pesa STK Push initiates
  - [ ] Order confirmation shows

- [ ] **User Features**
  - [ ] OAuth login works
  - [ ] Favorites toggle works
  - [ ] Share buttons work
  - [ ] Newsletter signup works

- [ ] **Admin Features**
  - [ ] Contact form submissions saved
  - [ ] Email notifications sent
  - [ ] Order tracking updates

### ✅ Security Checks

- [ ] HTTPS enabled (automatic on Render)
- [ ] Environment variables not exposed in logs
- [ ] Database credentials not in code
- [ ] API keys properly secured
- [ ] CORS configured correctly

### ✅ Monitoring Setup

1. **Enable Render Monitoring**
   - Dashboard → Metrics tab
   - Monitor CPU, memory, disk usage

2. **Set Up Alerts**
   - Render → Settings → Notifications
   - Alert on deployment failures
   - Alert on high resource usage

3. **Monitor Database**
   - Supabase → Logs tab
   - Check for slow queries
   - Monitor connection count

---

## Deployment Workflow

### For Future Updates

**When you make changes locally:**

1. **Test locally**
   ```bash
   pnpm dev
   ```

2. **Run tests**
   ```bash
   pnpm test
   ```

3. **Commit and push**
   ```bash
   git add .
   git commit -m "Feature: description"
   git push origin main
   ```

4. **Render auto-deploys**
   - Watches GitHub for changes
   - Automatically rebuilds and deploys
   - Takes 2-3 minutes

5. **Monitor deployment**
   - Render dashboard → Logs tab
   - Watch build progress
   - Verify deployment success

---

## Cost Estimation

### Monthly Costs (Approximate)

| Service | Plan | Cost | Notes |
|---------|------|------|-------|
| Render Web | Standard | $12 | Application server |
| Render MySQL | - | $0 | Use Supabase instead |
| Supabase MySQL | Free/Pro | $0-100 | Database (already have) |
| Domain | Custom | $0-15 | Optional custom domain |
| **Total** | | **$12-27** | Minimum viable setup |

### Cost Optimization Tips

1. **Use Supabase for database** (saves $15/month)
2. **Use Render's free domain** initially
3. **Standard plan sufficient** for 1000+ daily users
4. **Upgrade to Pro** only if needed ($19/month)

---

## Advanced Configuration

### Custom Domain Setup

1. **Buy domain** (Namecheap, GoDaddy, etc.)
2. **In Render dashboard:**
   - Web Service → Settings → Custom Domains
   - Add your domain
   - Copy CNAME record
3. **In domain registrar:**
   - Add CNAME record pointing to Render
   - Wait for DNS propagation (24 hours)

### Environment-Specific Configs

**Production (Render):**
```
NODE_ENV=production
LOG_LEVEL=error
CACHE_ENABLED=true
```

**Staging (Optional):**
```
NODE_ENV=staging
LOG_LEVEL=info
CACHE_ENABLED=false
```

### Database Backups

**Supabase Backups:**
- Automatic daily backups
- 7-day retention (free)
- 30-day retention (pro)

**Manual Backup:**
```bash
# Export from Supabase
mysqldump -u user -p -h host database > backup.sql

# Import to Render
mysql -u user -p -h host database < backup.sql
```

---

## Support & Resources

### Render Documentation
- [Render Docs](https://render.com/docs)
- [Node.js Deployment Guide](https://render.com/docs/deploy-node-express-app)
- [Environment Variables](https://render.com/docs/environment-variables)

### Nuta Project Resources
- GitHub: https://github.com/SteveHaveIt/Nuta
- Supabase: https://sqqvqtqnslbhfjezbzzq.supabase.co
- Lipana API: https://lipana.dev

### Getting Help
1. Check Render logs: Dashboard → Logs tab
2. Review this guide's troubleshooting section
3. Contact Render support: support@render.com
4. Check GitHub issues: SteveHaveIt/Nuta

---

## Quick Reference

### Essential Commands

```bash
# Test locally before deploying
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build

# Start production server
pnpm start

# Push database migrations
pnpm db:push
```

### Essential URLs

```
Live App: https://nuta-ecommerce.onrender.com
Render Dashboard: https://dashboard.render.com
Supabase: https://app.supabase.com
GitHub Repo: https://github.com/SteveHaveIt/Nuta
```

### Environment Variables Checklist

```
✅ DATABASE_URL
✅ JWT_SECRET
✅ NODE_ENV
✅ VITE_APP_ID
✅ OAUTH_SERVER_URL
✅ VITE_OAUTH_PORTAL_URL
✅ OWNER_OPEN_ID
✅ OWNER_NAME
✅ BUILT_IN_FORGE_API_URL
✅ BUILT_IN_FORGE_API_KEY
✅ VITE_FRONTEND_FORGE_API_URL
✅ VITE_FRONTEND_FORGE_API_KEY
✅ LIPANA_PUBLISHABLE_KEY
✅ LIPANA_SECRET_KEY
✅ VITE_APP_TITLE
✅ VITE_APP_LOGO
```

---

## Conclusion

Your Nuta e-commerce platform is ready for Render deployment! Follow these steps and you'll have a production-ready application running in minutes.

**Estimated Time to Deploy:** 15-20 minutes  
**Difficulty Level:** Beginner-Friendly ✅  
**Support Available:** Yes ✅

Good luck with your deployment! 🚀

---

**Last Updated:** December 8, 2025  
**Version:** 1.0  
**Status:** Production Ready
