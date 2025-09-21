# Fix Email Verification Redirect for Vercel Deployment

## Problem
After users click the email verification link, they get "refused to connect" error instead of being redirected to the home page.

## Root Cause
The email verification redirect URL is not properly configured for your Vercel production environment.

## Solution

### Step 1: Configure Environment Variable in Vercel

1. **Go to your Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Navigate to your project dashboard

2. **Add Environment Variable**
   - Go to Settings → Environment Variables
   - Add a new environment variable:
     ```
     Key: VITE_SITE_URL
     Value: https://your-app-name.vercel.app
     ```
   - Replace `your-app-name.vercel.app` with your actual Vercel domain
   - Set it for **Production** environment

3. **Redeploy Your Application**
   - Go to Deployments tab
   - Click "Redeploy" on your latest deployment
   - Or push a new commit to trigger automatic deployment

### Step 2: Configure Supabase Redirect URLs (Important!)

1. **Go to your Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com/dashboard)
   - Open your project

2. **Update Site URL**
   - Go to Settings → General
   - Set **Site URL** to: `https://your-app-name.vercel.app`

3. **Add Redirect URLs**
   - Go to Authentication → URL Configuration
   - Add these redirect URLs:
     ```
     https://your-app-name.vercel.app/**
     http://localhost:8080/**
     ```
   - The localhost URL is for development
   - The vercel URL is for production

### Step 3: Verify the Fix

1. **Deploy and Test**
   - Register a new user on your Vercel deployment
   - Check email and click verification link
   - Should now redirect to your Vercel home page

2. **Debug if Still Not Working**
   - Check browser console for any errors
   - Verify the environment variable is set correctly in Vercel
   - Check Supabase auth logs for redirect attempts

## Alternative: Quick Manual Fix

If you know your Vercel domain, you can also update the `.env` file:

```bash
# In your .env file, change:
VITE_SITE_URL="http://localhost:8080"

# To your actual Vercel domain:
VITE_SITE_URL="https://your-actual-domain.vercel.app"
```

Then commit and push the changes.

## How the Fix Works

The updated code now:

1. **Checks for `VITE_SITE_URL` environment variable first** (most reliable)
2. **Auto-detects Vercel environment** using `VITE_VERCEL_URL`
3. **Falls back to current origin** if neither is available
4. **Provides detailed logging** for debugging

## Environment Variables Reference

```bash
# For Development (localhost)
VITE_SITE_URL="http://localhost:8080"

# For Production (your Vercel domain)
VITE_SITE_URL="https://your-domain.vercel.app"
```

## Verification Steps

After implementing the fix:

1. ✅ Environment variable set in Vercel
2. ✅ Supabase Site URL updated
3. ✅ Supabase redirect URLs added
4. ✅ Application redeployed
5. ✅ Email verification redirects correctly

Your email verification should now work perfectly in both development and production! 🎉