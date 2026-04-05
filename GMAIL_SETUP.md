# Gmail SMTP Setup for OTP Emails

## ✅ Free Solution - No Domain Required!

This guide will help you set up Gmail to send OTP verification emails. This is **completely free** and works with any Gmail account.

---

## 📋 Prerequisites

- A Gmail account (any Gmail account works)
- 2-Step Verification enabled on your Google Account

---

## 🚀 Setup Steps (5 minutes)

### Step 1: Enable 2-Step Verification

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Find **"2-Step Verification"** section
3. If not enabled, click **"Get Started"** and follow the prompts
4. Complete the setup with your phone number

### Step 2: Generate App Password

1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Or navigate: Google Account → Security → 2-Step Verification → App passwords

2. You may need to sign in again

3. In the "Select app" dropdown, choose **"Mail"**

4. In the "Select device" dropdown, choose **"Other (Custom name)"**

5. Enter: **"Signwave OTP"** or any name you prefer

6. Click **"Generate"**

7. Google will show a 16-character password like: `xxxx xxxx xxxx xxxx`

8. **COPY THIS PASSWORD** - you won't see it again!

### Step 3: Update Environment Variables

1. Open `.env.local` in your project root

2. Add these two lines (replace with your Gmail and app password):

```env
# Gmail SMTP Configuration for OTP Emails
GMAIL_USER=your.email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

**Example:**
```env
GMAIL_USER=mystore@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
```

### Step 4: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## ✅ Testing

1. Go to checkout page: `http://localhost:3000/checkout`
2. Fill in all details with **any email address**
3. Click "Verify Email & Place Order"
4. Check your email inbox (should arrive within 5-10 seconds)
5. Enter the 6-digit OTP
6. Complete your order!

---

## 🎯 What Works Now

✅ Send OTP to **any email address** (not just yours)  
✅ **No domain or DNS required**  
✅ Completely **free** (Gmail's free tier)  
✅ **Fast delivery** (usually under 10 seconds)  
✅ Professional email template with your branding  
✅ Terminal backup (OTP still shows in console)  

---

## 📧 Email Details

- **From Name:** Signwave Store
- **From Email:** Your Gmail address
- **Subject:** Your Verification Code - Signwave Store
- **Template:** Beautiful HTML with gradient header and OTP box

---

## 🔧 Troubleshooting

### Issue: "Invalid credentials" error

**Solution:**
- Make sure you're using an **App Password**, not your regular Gmail password
- The app password should be 16 characters (with or without spaces)
- Check for typos in `.env.local`

### Issue: Email not arriving

**Check:**
1. Spam/Junk folder
2. Gmail credentials in `.env.local` are correct
3. 2-Step Verification is enabled
4. App Password is still active (check Google Account security)

### Issue: "Less secure app access" error

**Solution:**
- Use **App Passwords** instead (as shown in Step 2)
- Never use "Allow less secure apps" option

---

## 📝 Important Notes

- **App Passwords** are more secure than regular passwords
- Each app password is unique - you can revoke it anytime
- Gmail free tier allows up to **500 emails per day** (more than enough for testing)
- For production with high volume, consider upgrading to Google Workspace or using dedicated email services

---

## 🎉 Benefits Over Resend Testing Domain

| Feature | Resend (Testing) | Gmail SMTP |
|---------|-----------------|------------|
| Send to any email | ❌ No (only your signup email) | ✅ Yes |
| Custom domain required | ✅ Yes (for production) | ❌ No |
| Cost | Free (limited) | Free (500/day) |
| Setup time | 2 minutes | 5 minutes |
| Production ready | ❌ No (needs domain) | ✅ Yes (for small scale) |

---

## 🔐 Security Best Practices

1. **Never commit `.env.local`** to Git (already in `.gitignore`)
2. Use **App Passwords** instead of regular passwords
3. Revoke unused app passwords from [Google Account Security](https://myaccount.google.com/security)
4. For production, consider using environment variable management (Vercel, Railway, etc.)

---

## 🚀 Next Steps

After Gmail is working:

1. **Test thoroughly** with different email providers (Gmail, Outlook, Yahoo, etc.)
2. **Check spam folders** - first emails may land in spam
3. **Production deployment:** Add `GMAIL_USER` and `GMAIL_APP_PASSWORD` to your hosting environment variables
4. **Scaling:** If you need more than 500 emails/day, consider:
   - Google Workspace (paid)
   - SendGrid (free tier: 100 emails/day)
   - Amazon SES (pay as you go)

---

## ❓ Questions?

The OTP system is now fully functional with Gmail SMTP. If you have any issues, check:

1. Terminal output for OTP (backup method still works)
2. Google Account security page for active app passwords
3. `.env.local` file for correct credentials

**Need help?** Check the terminal logs - they show detailed error messages and always display the OTP as a backup!

---

## 📱 Example Email Preview

Recipients will see a beautiful email with:

```
┌─────────────────────────────────┐
│  🔐 Email Verification          │
│  [Gradient: Pink → Purple]      │
└─────────────────────────────────┘

Hello!

You requested to verify your email for 
checkout. Use the code below to complete 
your order:

┌─────────────────────────────────┐
│   Your verification code is:    │
│                                 │
│        1 2 3 4 5 6             │
│                                 │
└─────────────────────────────────┘

This code will expire in 10 minutes.

If you didn't request this code, please 
ignore this email.

© 2024 Signwave Store. All rights reserved.
```

---

**Done! Your OTP system is ready to send emails to anyone! 🎉**
