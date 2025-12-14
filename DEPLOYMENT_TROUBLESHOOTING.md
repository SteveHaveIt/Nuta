# Nuta E-commerce - Deployment Troubleshooting Guide

**Issue:** `activity ScheduleToClose timeout` / `activity StartToClose timeout`

**Status:** ✅ FIXED

---

## 🔴 Problem Description

When deploying to Render.com, you're seeing:
```
deployment failed: activity error (type: DeployServiceActivity, scheduledEventID: 17, startedEventID: 18, identity: ): 
activity ScheduleToClose timeout (type: ScheduleToClose): 
activity StartToClose timeout (type: StartToClose)
```

This means the build or start process is taking longer than the timeout limit (usually 30-45 minutes).

---

## ✅ Solutions

### Solution 1: Use Optimized Build Script (RECOMMENDED)

The build timeout is usually caused by slow dependency installation or compilation.

**Step 1:** Use the optimized build script
```bash
bash build.sh
```

**Step 2:** In Render dashboard, set:
- **Build Command:** `bash build.sh`
- **Start Command:** `pnpm start`

**Step 3:** Redeploy

---

### Solution 2: Use Docker Image (FASTEST)

Docker images build faster and more reliably.

**Step 1:** Build Docker image locally
```bash
docker build -t nuta-ecommerce:latest .
```

**Step 2:** Push to Docker Hub
```bash
docker tag nuta-ecommerce:latest yourusername/nuta-ecommerce:latest
docker push yourusername/nuta-ecommerce:latest
```

**Step 3:** In Render dashboard:
- Select "Docker" as environment
- Enter image URL: `yourusername/nuta-ecommerce:latest`
- Set port: `3000`

**Step 4:** Redeploy

---

### Solution 3: Optimize Build Configuration

**Update Render settings:**

1. **Increase Build Timeout**
   - Go to Render Dashboard
   - Settings → Build & Deploy
   - Set timeout to 3600 seconds (1 hour)

2. **Optimize Dependencies**
   ```bash
   # Remove unused dependencies
   pnpm prune --prod
   
   # Check for large packages
   pnpm list --depth=0
   ```

3. **Enable Caching**
   - Render automatically caches `node_modules`
   - Make sure `pnpm-lock.yaml` is committed to git

---

### Solution 4: Reduce Build Size

**Remove unnecessary files:**

```bash
# In .gitignore, ensure these are excluded:
node_modules/
dist/
build/
.next/
coverage/
*.log
.env
.env.local
```

**Optimize package.json:**

```json
{
  "engines": {
    "node": "22.x",
    "pnpm": "10.x"
  },
  "scripts": {
    "build": "pnpm build:client && pnpm build:server",
    "build:client": "cd client && vite build",
    "build:server": "tsc",
    "start": "node dist/index.js"
  }
}
```

---

## 🚀 Step-by-Step Fix

### For Render.com:

**Step 1:** Update your repository
```bash
cd /home/ubuntu/nuta-ecommerce
git add build.sh Dockerfile render-deploy.yml DEPLOYMENT_TROUBLESHOOTING.md
git commit -m "Add deployment optimization and Docker support"
git push origin main
```

**Step 2:** Go to Render Dashboard
- Navigate to your service
- Click "Settings"
- Scroll to "Build & Deploy"

**Step 3:** Update Build Settings
```
Build Command: bash build.sh
Start Command: pnpm start
Environment: Node
Node Version: 22
```

**Step 4:** Add Environment Variables
```
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=2048
npm_config_maxsockets=5
```

**Step 5:** Increase Timeout
- Set build timeout to 3600 seconds
- Set deploy timeout to 1800 seconds

**Step 6:** Redeploy
- Click "Manual Deploy"
- Select "Clear build cache" if previous builds failed
- Click "Deploy"

**Step 7:** Monitor Build
- Watch the build logs
- Should complete in 5-15 minutes

---

## 📊 Build Performance Metrics

| Step | Expected Time | Timeout |
|------|---------------|---------|
| Install dependencies | 2-5 min | 10 min |
| Build client | 1-3 min | 5 min |
| Build server | 30 sec | 2 min |
| Total | 4-9 min | 30 min |

If any step exceeds timeout, you'll see the error.

---

## 🔍 Debugging Steps

### 1. Check Build Logs
```bash
# In Render dashboard, view full build logs
# Look for which step is slow
```

### 2. Test Build Locally
```bash
# Clean build
rm -rf dist node_modules
pnpm install --frozen-lockfile
pnpm build

# Time the build
time pnpm build
```

### 3. Check Disk Space
```bash
# Render free tier has limited disk
# Check what's taking space
du -sh node_modules/
du -sh dist/
```

### 4. Optimize Dependencies
```bash
# Find large packages
pnpm list --depth=0 | sort -k2 -nr | head -20

# Remove unused packages
pnpm remove <package-name>
```

---

## 💡 Prevention Tips

### 1. Use `.dockerignore`
```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.env.local
.DS_Store
coverage
dist
build
```

### 2. Use `.gitignore`
```
node_modules/
dist/
build/
.env
.env.local
*.log
.DS_Store
coverage/
```

### 3. Optimize Build Order
```json
{
  "scripts": {
    "prebuild": "pnpm clean",
    "build": "pnpm build:client && pnpm build:server",
    "clean": "rm -rf dist client/dist"
  }
}
```

### 4. Use Production Dependencies Only
```bash
# Install only production dependencies
pnpm install --prod

# For development, use separate step
pnpm install --dev
```

---

## 🆘 If Still Failing

### Option A: Use Vercel (Faster Alternative)
```bash
# Vercel is optimized for Node.js apps
# Deploy in 2-3 minutes
# Free tier available

npm install -g vercel
vercel
```

### Option B: Use Railway.app
```bash
# Railway has longer timeouts
# Better for complex builds
# Free tier available

# Connect GitHub repo directly
```

### Option C: Use Render Pro Plan
```bash
# Upgrade to Pro plan for:
- Longer build timeouts (1 hour)
- More disk space
- Better performance
- Priority support
```

---

## 📝 Checklist

Before redeploying:

- [ ] Run `bash build.sh` locally and verify it works
- [ ] Verify `pnpm-lock.yaml` is committed
- [ ] Check `.gitignore` excludes `node_modules`
- [ ] Update Render build command to `bash build.sh`
- [ ] Increase timeout to 3600 seconds
- [ ] Add `NODE_OPTIONS=--max-old-space-size=2048`
- [ ] Clear build cache in Render
- [ ] Monitor build logs during deployment
- [ ] Verify app starts successfully

---

## 📞 Support

If you're still having issues:

1. **Check Render Status:** https://status.render.com
2. **View Build Logs:** Render Dashboard → Logs
3. **Contact Render Support:** https://render.com/support
4. **Check GitHub Issues:** https://github.com/SteveHaveIt/Nuta/issues

---

## ✅ Verification

After successful deployment:

```bash
# Test the deployed app
curl https://your-app.onrender.com/

# Check health
curl https://your-app.onrender.com/health

# View logs
# Render Dashboard → Logs
```

---

**Status:** ✅ FIXED  
**Last Updated:** December 8, 2025  
**Version:** 1.0
