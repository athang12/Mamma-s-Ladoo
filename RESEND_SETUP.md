# Get Your Resend API Key (2 Minutes)

## Step 1: Sign Up for Resend (FREE)

1. Go to: **https://resend.com**
2. Click **"Sign Up"** 
3. Sign up with your email or GitHub
4. Verify your email

## Step 2: Get API Key

1. After login, you'll be on the dashboard
2. Click **"API Keys"** in the left sidebar
3. Click **"Create API Key"**
4. Name it: `Signwave Store OTP`
5. Click **"Create"**
6. **Copy the API key** (starts with `re_`)

## Step 3: Add API Key to .env.local

1. Open `.env.local` file
2. Replace this line:
   ```
   RESEND_API_KEY=re_123456789_YourResendAPIKey
   ```
   
   With your actual key:
   ```
   RESEND_API_KEY=re_abc123_your_actual_key_here
   ```

3. Save the file

## Step 4: Restart Dev Server

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

## Step 5: Test!

1. Go to checkout page
2. Fill form with your real email
3. Click "Verify Email & Place Order"
4. **Check your email inbox** 📧
5. You'll receive a beautiful email with 6-digit OTP
6. Enter the code and complete checkout!

## 🎁 Resend Free Tier

- **100 emails per day** (FREE forever)
- Perfect for testing and small projects
- No credit card required
- Emails arrive in 2-3 seconds

## Email Features

✅ Beautiful HTML email with gradient header
✅ Large, easy-to-read OTP code
✅ 10-minute expiration time
✅ Professional design
✅ Mobile-friendly

## Need More Emails?

**Free tier:** 100 emails/day (sufficient for most projects)

**Paid plans:**
- $20/month = 50,000 emails
- Perfect for production use

## Alternative: Use Your Own Domain

1. Add your domain in Resend dashboard
2. Add DNS records (MX, TXT)
3. Change email "from" address in code:
   ```typescript
   from: 'orders@yourdomain.com'
   ```

That's it! Now you'll receive real OTP emails! 🚀
