# 📧 Fix Email Verification Redirect for Vercel Deployment

## 🚨 Problem
When users click the email verification link, they get **"refused to connect"** error instead of being redirected to your app.

## ✅ Solution Implemented

I've already implemented the code fixes. Now you need to configure your deployment:

---

## 🔧 Step 1: Configure Vercel Environment Variables

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com/dashboard)
   - Select your `edvise-pathways-ai-dev` project

2. **Add Environment Variable**
   - Go to **Settings** → **Environment Variables**
   - Click **Add New**
   - Add this variable:
     ```
     Name: VITE_SITE_URL
     Value: https://edvise-pathways-ai-dev.vercel.app
     Environment: Production
     ```
   - Click **Save**

3. **Redeploy Your App**
   - Go to **Deployments** tab
   - Click **Redeploy** on your latest deployment
   - **OR** push any commit to trigger auto-deployment

---

## 🔧 Step 2: Configure Supabase Settings

1. **Go to Supabase Dashboard**
   - Visit [supabase.com/dashboard](https://supabase.com/dashboard)
   - Open your project: `oddfdtkpmgxpxdgieoqf`

2. **Update Site URL**
   - Go to **Settings** → **General**
   - Find **Site URL** field
   - Set it to: `https://edvise-pathways-ai-dev.vercel.app`
   - Click **Save**

3. **Add Redirect URLs**
   - Go to **Authentication** → **URL Configuration**
   - In **Redirect URLs** section, add:
     ```
     https://edvise-pathways-ai-dev.vercel.app/**
     http://localhost:8080/**
     ```
   - Click **Save**

---

## 🧪 Step 3: Test the Fix

1. **Deploy Your Changes**
   ```bash
   git add .
   git commit -m "Fix email verification redirect URLs"
   git push
   ```

2. **Test Registration**
   - Go to: https://edvise-pathways-ai-dev.vercel.app/auth
   - Register a new user with a test email
   - Check your email for verification link

3. **Click Verification Link**
   - Should now redirect to: `https://edvise-pathways-ai-dev.vercel.app/auth/callback`
   - You should see a success page, then auto-redirect to home

---

## 🎯 What Was Fixed

### Code Changes Made:
1. ✅ **Smart URL Detection**: Auto-detects Vercel environment
2. ✅ **Environment Variable Support**: Uses `VITE_SITE_URL` for reliable redirects
3. ✅ **Auth Callback Page**: Handles email verification gracefully
4. ✅ **Better Error Handling**: Shows clear success/error messages
5. ✅ **Fallback Logic**: Works even if environment variables aren't set

### Files Modified:
- `src/contexts/AuthContext.tsx` - Updated redirect logic
- `src/lib/siteConfig.ts` - New URL configuration utility
- `src/pages/AuthCallback.tsx` - New callback page
- `src/App.tsx` - Added callback route
- `.env` - Updated with your domain

---

## 🔍 Debug If Still Not Working

### Check Vercel Environment Variables:
1. Go to Vercel Settings → Environment Variables
2. Verify `VITE_SITE_URL` is set correctly
3. Ensure it's enabled for **Production** environment

### Check Supabase Settings:
1. **Site URL**: `https://edvise-pathways-ai-dev.vercel.app`
2. **Redirect URLs**: Must include `https://edvise-pathways-ai-dev.vercel.app/**`

### Check Browser Console:
- Look for any error messages
- Check if redirect URL is logged correctly

### Test Locally First:
```bash
# Test with localhost
npm run dev
# Register new user
# Should work locally before deploying
```

---

## 📋 Quick Deployment Checklist

- [ ] Environment variable `VITE_SITE_URL` added to Vercel
- [ ] Supabase Site URL updated
- [ ] Supabase redirect URLs added
- [ ] App redeployed on Vercel
- [ ] Test registration on live site
- [ ] Email verification redirects correctly

---

## 🚀 Expected Result

After implementing these steps:

1. **User registers** → Gets verification email
2. **Clicks email link** → Redirects to `https://edvise-pathways-ai-dev.vercel.app/auth/callback`
3. **Shows success message** → Auto-redirects to home page
4. **User is logged in** → Can access dashboard

## 🆘 Need Help?

If you're still having issues:

1. **Check the browser console** for error messages
2. **Verify environment variables** in Vercel dashboard
3. **Double-check Supabase settings** match exactly
4. **Test with a fresh email address** to avoid cached states

Your email verification should now work perfectly! 🎉