# Quick Fix: Enable Email OTP in Supabase

## Error: "Failed to send verification code"

This means email authentication is not enabled in your Supabase project. Here's how to fix it:

## Step-by-Step Fix (2 minutes)

### 1. Go to Supabase Dashboard
- Open: https://supabase.com/dashboard
- Select your project: `zvjieppjwztnjkifybmy`

### 2. Enable Email Authentication
1. Click **Authentication** in left sidebar
2. Click **Providers** 
3. Find **Email** provider
4. Make sure it's **ENABLED** (toggle should be ON/green)
5. Check the box: ✅ **Enable Email Sign In**
6. Click **Save**

### 3. Configure Email Settings (Optional but Recommended)

#### Default Settings (Works Immediately)
- Supabase sends emails from their domain
- Good for testing
- No setup needed

#### Custom Email (For Production)
1. Go to **Authentication** → **Email Templates**
2. Click **Email Settings** at the top
3. Configure SMTP:

**Using Gmail:**
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: your-email@gmail.com
SMTP Password: [Your Gmail App Password]
```

**Get Gmail App Password:**
- Google Account → Security → 2-Step Verification → App Passwords
- Generate new app password for "Mail"

### 4. Test It

1. Restart your Next.js dev server:
   ```bash
   npm run dev
   ```

2. Go to checkout page
3. Fill form with your real email
4. Click "Verify Email & Place Order"
5. Check your email (including spam folder)

## Common Issues

### "User already registered" Error
This is actually GOOD - it means emails are working! The error occurs if the email was already used for testing. Solution:
- Use a different email, OR
- Go to Supabase → Authentication → Users → Delete test users

### Email Not Received
1. Check spam folder
2. Check Supabase logs: Dashboard → Logs → Auth Logs
3. Verify email provider settings
4. Try a different email address

### Rate Limiting
Supabase free tier limits:
- 4 emails per hour per email address
- Wait 15 minutes and try again

## Verify Configuration

Run this in your browser console on the checkout page:
```javascript
fetch('/api/otp/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'your-test@email.com' })
}).then(r => r.json()).then(console.log)
```

Should return: `{ success: true, message: 'OTP sent successfully' }`

## Still Not Working?

Check server console for detailed error messages. The error will show:
```
Supabase OTP error: [specific error message]
```

Common errors:
- "Email not enabled" → Enable email provider in Supabase
- "Invalid configuration" → Check email settings
- "Rate limit exceeded" → Wait 15 minutes

## Success Indicators

✅ Email received with 6-digit code
✅ Code works in verification modal
✅ Order processes after verification
✅ No errors in browser or server console

After fixing, the OTP verification should work perfectly!
