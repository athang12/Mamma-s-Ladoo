# 🚀 Quick Start Deployment Guide

## Deploy Your Store in 15 Minutes!

Follow these simple steps to get your store live on Vercel (100% FREE).

---

## Before You Start

✅ Make sure you have:
1. A GitHub account (create one at github.com if needed)
2. Your `.env.local` file with all credentials
3. Git installed on your computer

---

## Step 1: Push to GitHub (5 min)

### Option A: If you already have Git initialized

```bash
cd /Users/B0330702/Documents/sample_proj

# Check current status
git status

# If you see uncommitted changes:
git add .
git commit -m "Ready for deployment"

# Create new GitHub repo at github.com/new
# Then add remote (replace YOUR_USERNAME):
git remote add origin https://github.com/YOUR_USERNAME/signwave-store.git
git branch -M main
git push -u origin main
```

### Option B: Starting from scratch

```bash
cd /Users/B0330702/Documents/sample_proj

# Initialize Git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Signwave Store"

# Create new repo at github.com/new
# Then push (replace YOUR_USERNAME):
git remote add origin https://github.com/YOUR_USERNAME/signwave-store.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel (5 min)

1. **Go to** [vercel.com](https://vercel.com)

2. **Sign up** → "Continue with GitHub"

3. **Import Project:**
   - Click "Add New..." → "Project"
   - Select your `signwave-store` repository
   - Click "Import"

4. **Add Environment Variables** (IMPORTANT!):
   
   Copy these from your `.env.local` file and add them ONE BY ONE:

   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   GMAIL_USER
   GMAIL_APP_PASSWORD
   NEXT_PUBLIC_UPI_ID
   NEXT_PUBLIC_MERCHANT_NAME
   ```

5. **Click "Deploy"** and wait 2-3 minutes

---

## Step 3: Configure Supabase (2 min)

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Find **"Additional URLs"** or **"Site URL"**
5. Add your Vercel URL: `https://your-site.vercel.app`
6. Click "Save"

---

## Step 4: Test Your Site! (3 min)

Visit your deployed site and verify:

✅ Home page loads  
✅ Products display correctly  
✅ Cart works  
✅ Email OTP verification works  
✅ Admin login works  
✅ Customization editor works  

---

## 🎉 You're Live!

**Your site is now deployed at:**  
`https://your-project-name.vercel.app`

**Share with test users and collect feedback!**

---

## Need Help?

Check the detailed guide: **VERCEL_DEPLOYMENT_GUIDE.md**

---

## Making Updates

Whenever you make changes:

```bash
git add .
git commit -m "Your changes"
git push
```

Vercel automatically redeploys in 2-3 minutes! 🚀
