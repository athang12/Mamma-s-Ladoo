# 🚀 Vercel Deployment Guide - Signwave Store

## Complete Free Deployment on Vercel

This guide will walk you through deploying your e-commerce site to Vercel (100% free for hobby projects).

---

## 📋 What You'll Need

1. ✅ GitHub account (free)
2. ✅ Vercel account (free - sign up with GitHub)
3. ✅ Your Supabase credentials (already have)
4. ✅ Gmail SMTP credentials (already configured)
5. ⏱️ ~15 minutes

---

## 🎯 Step-by-Step Deployment

### **Step 1: Initialize Git Repository** (5 minutes)

If you haven't already set up Git:

```bash
cd /Users/B0330702/Documents/sample_proj

# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit - Signwave e-commerce store"
```

### **Step 2: Push to GitHub** (5 minutes)

1. Go to [github.com](https://github.com) and create a new repository
   - Repository name: `signwave-store` (or your choice)
   - Set to **Private** (recommended for now)
   - **DO NOT** initialize with README

2. Push your code:

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/signwave-store.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### **Step 3: Deploy to Vercel** (5 minutes)

1. **Sign up/Login to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Sign Up" and choose "Continue with GitHub"
   - Authorize Vercel to access your GitHub repos

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Find your `signwave-store` repository
   - Click "Import"

3. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (leave as is)
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `.next` (auto-filled)

4. **Add Environment Variables:**
   
   Click "Environment Variables" and add these (copy from your `.env.local`):

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://zvjieppjwztnjkifybmy.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   GMAIL_USER=your.email@gmail.com
   GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
   NEXT_PUBLIC_UPI_ID=athangyende459-3@okhdfcbank
   NEXT_PUBLIC_MERCHANT_NAME=Signwave Store
   ```

   **Important:** Add EACH variable separately by clicking "Add Another"

5. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes for build
   - 🎉 Your site will be live at: `https://signwave-store-xxx.vercel.app`

---

## 🔧 Post-Deployment Configuration

### **1. Update Supabase Allowed Origins**

Your site needs to connect to Supabase from the new domain:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Scroll to **"API Settings"** → **"Additional URLs"**
5. Add your Vercel URL: `https://your-site-name.vercel.app`
6. Click "Save"

### **2. Test All Features**

Visit your deployed site and test:

- ✅ Home page loads
- ✅ Products page displays items
- ✅ Cart functionality works
- ✅ Customization editor works
- ✅ Checkout with Email OTP works
- ✅ Admin login works
- ✅ UPI payment QR codes generate

### **3. Custom Domain (Optional)**

If you have a custom domain:

1. Go to Vercel Dashboard → Your Project → "Settings" → "Domains"
2. Add your domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-30 minutes)

---

## 🎨 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public/anon key | ✅ Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin key (for OTP emails) | ✅ Yes |
| `GMAIL_USER` | Your Gmail address for sending OTPs | ✅ Yes |
| `GMAIL_APP_PASSWORD` | Gmail app password (16 chars) | ✅ Yes |
| `NEXT_PUBLIC_UPI_ID` | Your UPI ID for payments | ✅ Yes |
| `NEXT_PUBLIC_MERCHANT_NAME` | Store name for UPI | ✅ Yes |

---

## 🔄 Making Updates

After deployment, to push updates:

```bash
# Make your changes in code

# Commit changes
git add .
git commit -m "Description of changes"

# Push to GitHub
git push

# Vercel automatically redeploys! 🚀
```

Vercel will automatically build and deploy your changes within 2-3 minutes.

---

## 📱 Sharing with Test Users

Once deployed, share your Vercel URL with users:

**Your live site:** `https://signwave-store-xxx.vercel.app`

**Admin login:** `https://signwave-store-xxx.vercel.app/admin/login`
- Use the credentials you set in Supabase

**What users can test:**
- Browse products
- Customize products with images
- Add to cart
- Complete checkout with email OTP
- Make UPI payments (they can test with ₹1)
- Receive order confirmation

---

## 🐛 Troubleshooting

### Build Fails

**Error:** "Module not found"
```bash
# Solution: Install missing dependencies locally
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Environment Variables Not Working

1. Check spelling (case-sensitive!)
2. Ensure no trailing spaces
3. Redeploy after adding variables:
   - Vercel Dashboard → Deployments → Click "..." → "Redeploy"

### Supabase Connection Issues

1. Verify environment variables are correct
2. Check Supabase allowed origins includes Vercel URL
3. Ensure anon key has correct permissions

### Email OTP Not Sending

1. Verify `GMAIL_USER` and `GMAIL_APP_PASSWORD` are correct
2. Check if Gmail app password is still active
3. Check Vercel deployment logs for errors

---

## 💰 Cost Breakdown

| Service | Cost | What You Get |
|---------|------|--------------|
| Vercel Hosting | **FREE** | Unlimited deployments, 100GB bandwidth/month |
| Supabase Database | **FREE** | 500MB database, 2GB file storage |
| Gmail SMTP | **FREE** | 500 emails per day |
| **Total Monthly** | **₹0** | Everything you need for testing! |

---

## 🎯 Free Tier Limits

**Vercel (Hobby Plan):**
- ✅ Unlimited projects
- ✅ 100GB bandwidth per month
- ✅ Automatic HTTPS
- ✅ Free `vercel.app` subdomain
- ✅ Custom domains (unlimited)

**Supabase (Free Tier):**
- ✅ 500MB database
- ✅ 2GB file storage
- ✅ Unlimited API requests
- ✅ Up to 50,000 monthly active users

**Gmail SMTP:**
- ✅ 500 emails per day
- ✅ Reliable delivery
- ✅ No sending fees

---

## 📈 Scaling Up (When Needed)

When you grow beyond free tiers:

**Vercel Pro ($20/month):**
- 1TB bandwidth
- Advanced analytics
- Password protection

**Supabase Pro ($25/month):**
- 8GB database
- 100GB file storage
- Daily backups

---

## ✅ Deployment Checklist

Before going live:

- [ ] All environment variables added to Vercel
- [ ] Supabase allowed origins updated with Vercel URL
- [ ] Test complete order flow (add to cart → checkout → payment)
- [ ] Verify email OTP working
- [ ] Check admin panel access
- [ ] Test customization editor
- [ ] Verify UPI QR code generation
- [ ] Test on mobile devices
- [ ] Share link with test users

---

## 🎉 You're Live!

Your e-commerce store is now deployed and accessible worldwide! 

**Next Steps:**
1. Share the URL with friends/family for feedback
2. Monitor Vercel analytics for visitor data
3. Check Supabase dashboard for orders
4. Iterate based on user feedback

**Need help?** Check:
- Vercel Dashboard → Your Project → "Logs" for errors
- Supabase Dashboard → Logs for database issues
- Browser console (F12) for frontend issues

---

**Congratulations! Your store is live! 🚀**
