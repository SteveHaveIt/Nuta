# Render.com Build & Start Settings

## Overview

This document explains the exact build and start commands for your Nuta e-commerce platform on Render.

---

## Build Command

### Primary Build Command (Recommended)
```bash
pnpm install && pnpm build
```

### What This Does:
1. **`pnpm install`** - Installs all dependencies from `package.json`
   - Installs frontend dependencies (React, Tailwind, etc.)
   - Installs backend dependencies (Express, tRPC, Drizzle, etc.)
   - Creates `pnpm-lock.yaml` for reproducible builds

2. **`pnpm build`** - Builds the application
   - Compiles TypeScript to JavaScript
   - Bundles frontend with Vite
   - Optimizes assets for production
   - Creates `dist/` folder with compiled code

### Build Time:
- **First build:** 3-5 minutes (downloads all dependencies)
- **Subsequent builds:** 1-2 minutes (uses cache)

### Build Output:
```
dist/
├── client/          # Compiled frontend assets
├── server/          # Compiled backend code
└── public/          # Static files
```

---

## Start Command

### Primary Start Command (Required)
```bash
pnpm start
```

### What This Does:
1. **Starts Express server** on port 3000
2. **Serves frontend assets** from `dist/client`
3. **Initializes database connection** using `DATABASE_URL`
4. **Sets up OAuth** using provided credentials
5. **Listens for API requests** on `/api/trpc`

### Server Output:
```
[OAuth] Initialized with baseURL: https://api.manus.im
Server running on http://localhost:3000
```

### Port Configuration:
- Render automatically assigns **port 3000**
- Application listens on `0.0.0.0:3000`
- Accessible at `https://nuta-ecommerce.onrender.com`

---

## Alternative Build Commands

### If Build Fails with pnpm Not Found:
```bash
npm install -g pnpm && pnpm install && pnpm build
```

### If You Need to Run Migrations During Build:
```bash
pnpm install && pnpm db:push && pnpm build
```

### If You Need to Seed Initial Data:
```bash
pnpm install && pnpm seed && pnpm build
```

---

## Alternative Start Commands

### With Database Migrations:
```bash
pnpm db:push && pnpm start
```
**Use when:** You've updated database schema

### With Database Seeding:
```bash
pnpm seed && pnpm start
```
**Use when:** You need to populate initial data

### With Custom Port:
```bash
PORT=8080 pnpm start
```
**Use when:** Port 3000 is unavailable (Render handles this automatically)

### Development Mode (Not Recommended for Production):
```bash
pnpm dev
```
**Don't use:** Uses hot-reload, slower, uses more memory

---

## Build Configuration Files

### package.json Scripts
```json
{
  "scripts": {
    "dev": "tsx watch server/_core/index.ts",
    "build": "vite build && tsc --noEmit",
    "start": "node dist/server/_core/index.js",
    "test": "vitest run",
    "db:push": "drizzle-kit push",
    "db:generate": "drizzle-kit generate",
    "seed": "tsx server/seed.ts"
  }
}
```

### Build Process Flow
```
1. Install Dependencies
   ↓
2. TypeScript Compilation
   ↓
3. Vite Frontend Build
   ↓
4. Optimize Assets
   ↓
5. Create dist/ folder
   ↓
6. Ready for Deployment
```

---

## Environment Variables Required for Build

| Variable | Required | Purpose |
|----------|----------|---------|
| `NODE_ENV` | Yes | Set to `production` |
| `DATABASE_URL` | Yes | Database connection string |
| `JWT_SECRET` | Yes | Session signing secret |
| `VITE_APP_ID` | Yes | OAuth app ID |
| Other VITE_* | Yes | Frontend configuration |

### Note:
- Build variables are **NOT** baked into the build
- They're used at **runtime** by the server
- Render injects them from Environment Variables

---

## Performance Optimization

### Build Caching
- Render caches `node_modules` between builds
- First build: 3-5 minutes
- Subsequent builds: 1-2 minutes
- Cache invalidates when `package.json` changes

### Memory Usage During Build
- Standard plan: 1 GB RAM (sufficient)
- Pro plan: 2 GB RAM (faster builds)

### Build Optimization Tips
1. **Keep dependencies minimal** - Only install what you need
2. **Use production builds** - Smaller output size
3. **Enable caching** - Render does this automatically
4. **Avoid large assets** - Optimize images before committing

---

## Troubleshooting Build Issues

### Error: "pnpm: command not found"
**Solution:**
```bash
npm install -g pnpm && pnpm install && pnpm build
```

### Error: "Cannot find module 'react'"
**Solution:**
1. Check `package.json` has react dependency
2. Run locally: `pnpm install`
3. Commit `pnpm-lock.yaml`
4. Redeploy

### Error: "TypeScript compilation failed"
**Solution:**
1. Check TypeScript errors locally: `pnpm tsc --noEmit`
2. Fix errors
3. Commit and push
4. Redeploy

### Error: "Vite build failed"
**Solution:**
1. Check build locally: `pnpm build`
2. Fix errors
3. Commit and push
4. Redeploy

### Build Timeout (>30 minutes)
**Solution:**
1. Upgrade to Pro plan (faster CPU)
2. Optimize dependencies
3. Remove large files
4. Contact Render support

---

## Deployment Checklist

### Before Deploying:
- [ ] All environment variables configured in Render
- [ ] `DATABASE_URL` tested and working
- [ ] Build command: `pnpm install && pnpm build`
- [ ] Start command: `pnpm start`
- [ ] Code pushed to GitHub main branch
- [ ] All tests passing locally

### After Deploying:
- [ ] Check Render logs for errors
- [ ] Verify app loads at live URL
- [ ] Test key features (products, cart, checkout)
- [ ] Check console for JavaScript errors
- [ ] Verify database connection works
- [ ] Test OAuth login

---

## Monitoring Build & Runtime

### View Build Logs:
1. Render Dashboard → Your Service
2. Click **"Logs"** tab
3. Scroll through build output

### View Runtime Logs:
1. Render Dashboard → Your Service
2. Click **"Logs"** tab
3. Monitor for errors

### Common Log Messages:

**Successful Build:**
```
[✓] Build completed successfully
[✓] Deploying...
[✓] Deployment successful
```

**Successful Start:**
```
[OAuth] Initialized with baseURL: https://api.manus.im
Server running on http://localhost:3000
```

**Database Connection:**
```
[Database] Connected to MySQL
[Database] Running migrations...
[Database] Ready for queries
```

---

## Advanced Configuration

### Custom Build Steps:
If you need additional build steps, create a `build.sh` file:

```bash
#!/bin/bash
set -e

# Install dependencies
pnpm install

# Run tests
pnpm test

# Build application
pnpm build

# Run migrations
pnpm db:push

echo "Build completed successfully!"
```

Then use as build command:
```bash
bash build.sh
```

### Pre-start Hooks:
If you need to run commands before starting:

```bash
pnpm db:push && pnpm start
```

### Health Check:
Render automatically checks if app is healthy:
- Sends HTTP request to `http://localhost:3000`
- Expects response within 30 seconds
- Restarts if unhealthy

---

## Performance Metrics

### Expected Build Performance:
| Metric | Value |
|--------|-------|
| First build time | 3-5 minutes |
| Subsequent builds | 1-2 minutes |
| Build size | ~50-100 MB |
| Startup time | 5-10 seconds |
| Memory usage | 200-400 MB |
| CPU usage | 0.5 vCPU sufficient |

### Expected Runtime Performance:
| Metric | Value |
|--------|-------|
| Response time | <200ms |
| Database queries | <100ms |
| API endpoints | <500ms |
| Page load | <2 seconds |
| Concurrent users | 100+ |

---

## Scaling Considerations

### When to Upgrade Plan:
- **Current:** Standard ($12/month) - 1000+ daily users
- **Upgrade to Pro:** ($19/month) - 10,000+ daily users
- **Upgrade to Pro+:** ($49/month) - 100,000+ daily users

### Scaling Database:
- Current: Supabase Standard
- Upgrade: Supabase Pro ($25/month)
- Enterprise: Supabase Enterprise (custom pricing)

---

## Quick Reference

### Build Command:
```bash
pnpm install && pnpm build
```

### Start Command:
```bash
pnpm start
```

### Test Locally:
```bash
pnpm dev
```

### Run Tests:
```bash
pnpm test
```

### Check Build:
```bash
pnpm build
```

---

## Support

- **Render Docs:** https://render.com/docs
- **Node.js Guide:** https://render.com/docs/deploy-node-express-app
- **GitHub:** https://github.com/SteveHaveIt/Nuta
- **Issues:** Check Render logs first, then contact support

---

**Last Updated:** December 8, 2025  
**Status:** Production Ready ✅
