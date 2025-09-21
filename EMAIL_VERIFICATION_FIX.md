# Email Verification Redirect Fix

## Problem
When users register and click the email verification link, they get "localhost refused to connect" instead of being redirected to the production site.

## Root Cause
The email redirect URL is generating localhost URLs instead of the production Vercel domain.

## Solutions Implemented

### 1. **Enhanced Site Configuration** (`src/lib/siteConfig.ts`)

Added multiple layers of URL detection:

```typescript
// 1. Environment variable (most reliable)
VITE_SITE_URL = "https://edvise-pathways-ai-dev.vercel.app"

// 2. Dynamic Vercel deployment detection  
if (hostname.includes('vercel.app') && !hostname.includes('localhost')) {
  return window.location.origin; // Uses whatever your actual Vercel URL is
}

// 3. Dynamic browser origin detection
if (hostname !== 'localhost') {
  return window.location.origin; // Uses current production URL
}
```

### 2. **Debug Logging Added**
- Console logs show exactly which URL is being generated
- Test function validates URL generation in production
- Warnings if localhost URLs are generated in production

### 3. **Environment Configuration**
Your `.env` file is correctly configured:
```
VITE_SITE_URL="https://edvise-pathways-ai-dev.vercel.app"
```

## What to Check Next

### **A. Supabase Dashboard Configuration**

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **URL Configuration**
3. Add your production URLs to **Redirect URLs**:
   ```
   https://edvise-pathways-ai-dev.vercel.app/auth/callback
   https://edvise-pathways-ai-dev.vercel.app/
   https://edvise-pathways-ai-dev.vercel.app/*
   ```

4. **Site URL** should be set to:
   ```
   https://edvise-pathways-ai-dev.vercel.app
   ```

### **B. Vercel Environment Variables**

1. In Vercel Dashboard, go to your project settings
2. Go to **Environment Variables**
3. Ensure `VITE_SITE_URL` is set for **Production** environment:
   ```
   VITE_SITE_URL = https://edvise-pathways-ai-dev.vercel.app
   ```

### **C. Testing the Fix**

After deployment, test the signup flow:

1. Register a new user
2. Check browser console for these logs:
   ```
   🌍 Site Configuration:
     Environment VITE_SITE_URL: https://edvise-pathways-ai-dev.vercel.app
     Current hostname: edvise-pathways-ai-dev.vercel.app
     Resolved site URL: https://edvise-pathways-ai-dev.vercel.app
   
   📧 Email redirect URL generated:
     Final Redirect URL: https://edvise-pathways-ai-dev.vercel.app/auth/callback
   
   🧪 Testing Email Redirect URL Generation:
     ✅ URL generation looks correct
   ```

3. Check email verification link - should point to your Vercel domain, not localhost

## If Still Getting Localhost URLs

If you still see localhost URLs being generated, it means the environment variable isn't being read. Try these steps:

### **Option 1: Redeploy**
```bash
git add .
git commit -m "Fix email verification redirect URLs"
git push origin main
```

### **Option 2: Force Environment Variable in Vercel**
1. Vercel Dashboard > Project > Settings > Environment Variables
2. Add: `VITE_SITE_URL` = `https://edvise-pathways-ai-dev.vercel.app`
3. Trigger a new deployment

### **Option 3: Manual Override**
If environment variables aren't working, the code now includes a hardcoded fallback for your specific domain.

## Expected Results

After the fix:
- ✅ Email verification links point to `https://edvise-pathways-ai-dev.vercel.app/auth/callback`
- ✅ Users can click email links and get redirected properly
- ✅ After email verification, users are redirected to the home page
- ✅ Console shows production URLs, not localhost

## Verification Steps

1. **Deploy the fixes**
2. **Check Supabase auth settings**
3. **Test user registration**
4. **Verify email link points to production domain**
5. **Confirm redirect works after clicking email link**

---

**Status**: Code fixes ready for deployment
**Next Step**: Deploy and configure Supabase redirect URLs