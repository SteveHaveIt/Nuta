# Render.com Deployment - Quick Start (5 Minutes)

## Prerequisites Checklist
- [ ] Render.com account created
- [ ] GitHub account connected to Render
- [ ] All environment variables ready (see list below)
- [ ] Supabase connection string copied

---

## Step 1: Prepare Environment Variables (2 min)

Copy these and have them ready:

```
DATABASE_URL=mysql://nuta_user:PASSWORD@sqqvqtqnslbhfjezbzzq.c.supabase.co:3306/nuta_ecommerce
JWT_SECRET=E033AT1d3pysL3m5kxxTxyOcfeDpU+qLzTi4e4zzGKh0jL0HoVTJsfC8+r3Qp5VlgO/wNTlMCJ1CTG8kj6nGBw==
NODE_ENV=production
VITE_APP_ID=787b9744-801b-41ab-8df5-ab9ea5fb573b
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=<your-owner-id>
OWNER_NAME=Steve Have It
BUILT_IN_FORGE_API_URL=<your-forge-url>
BUILT_IN_FORGE_API_KEY=<your-forge-key>
VITE_FRONTEND_FORGE_API_URL=<your-frontend-forge-url>
VITE_FRONTEND_FORGE_API_KEY=<your-frontend-forge-key>
LIPANA_PUBLISHABLE_KEY=lsk_d8e7b2a1f4c5e6d7a8b9c0d1e2f3a4b5
LIPANA_SECRET_KEY=<your-lipana-secret>
VITE_APP_TITLE=Nuta - Premium Peanut Butter
VITE_APP_LOGO=/nuta-logo.png
```

---

## Step 2: Create Web Service on Render (3 min)

1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Select **"SteveHaveIt/Nuta"** repository
4. Fill in:
   - **Name:** `nuta-ecommerce`
   - **Region:** Singapore (or US-East)
   - **Branch:** `main`
   - **Runtime:** Node
   - **Build Command:** `pnpm install && pnpm build`
   - **Start Command:** `pnpm start`

5. Click **"Advanced"** and add all environment variables from Step 1
6. Click **"Create Web Service"**

---

## Step 3: Wait for Deployment (3-5 min)

- Monitor the "Logs" tab
- You'll see: "Deployment successful!"
- Copy your live URL: `https://nuta-ecommerce.onrender.com`

---

## Step 4: Test Your Deployment (2 min)

1. Click the live URL
2. Verify:
   - [ ] Homepage loads
   - [ ] Products display
   - [ ] Cart works
   - [ ] Login works
   - [ ] No console errors

---

## Done! 🎉

Your Nuta e-commerce platform is now live on Render!

### Next Steps:
1. Set up custom domain (optional)
2. Configure Lipana webhook: `https://nuta-ecommerce.onrender.com/api/webhooks/lipana`
3. Test payment flow
4. Monitor performance in Render dashboard

---

## Troubleshooting

**Build failed?**
- Check build logs in Render dashboard
- Ensure all env vars are set
- Verify GitHub repo is public

**App crashes?**
- Check logs for error messages
- Verify DATABASE_URL is correct
- Ensure all required env vars are set

**Database connection error?**
- Test connection string locally
- Check Supabase is accessible
- Verify firewall allows Render IP

---

## Support
- Full guide: See `RENDER_DEPLOYMENT_GUIDE.md`
- Render docs: https://render.com/docs
- GitHub: https://github.com/SteveHaveIt/Nuta
