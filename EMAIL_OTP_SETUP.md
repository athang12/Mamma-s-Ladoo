# Email OTP Verification Setup Guide

## Overview
Email OTP verification is now enabled for checkout. When customers click "Place Order", they will receive a 6-digit code via email to verify their email address before the order is processed.

## How it Works

1. **User fills checkout form** → enters name, email, phone, address
2. **Clicks "Verify Email & Place Order"** → OTP sent to their email
3. **OTP Modal appears** → user enters 6-digit code
4. **After verification** → order is processed automatically

## Supabase Configuration

### Option 1: Use Default Supabase Email (Quick Start)
Supabase provides default email sending - **no configuration needed!** It works out of the box for development.

**Limitations:**
- Daily sending limits
- Emails may go to spam
- Generic "Supabase" branding

### Option 2: Configure Custom SMTP (Production Ready)

1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **Authentication** → **Email Templates**
3. Click on **Email Settings**
4. Choose your email provider:

#### **Gmail SMTP**
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: your-email@gmail.com
SMTP Password: [App Password - see below]
```

**Get Gmail App Password:**
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Generate App Password for "Mail"
4. Use that password in SMTP settings

#### **SendGrid** (Recommended for production)
```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Password: [Your SendGrid API Key]
```

#### **AWS SES**
```
SMTP Host: email-smtp.[region].amazonaws.com
SMTP Port: 587
SMTP User: [Your SES SMTP Username]
SMTP Password: [Your SES SMTP Password]
```

### Customize Email Template

1. Go to **Authentication** → **Email Templates** → **Magic Link**
2. Edit the template to match your branding:

```html
<h2>Verify Your Email</h2>
<p>Your verification code for {{ .SiteURL }} is:</p>
<h1 style="font-size: 32px; font-weight: bold;">{{ .Token }}</h1>
<p>This code expires in 60 minutes.</p>
```

## Environment Variables

Add to your `.env.local` file:

```bash
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Optional: Service Role Key (for OTP operations)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**To get Service Role Key:**
1. Supabase Dashboard → Project Settings
2. API → Project API keys
3. Copy `service_role` key (keep it secret!)

## Testing

1. **Test in Development:**
   - Fill checkout form with your real email
   - Click "Verify Email & Place Order"
   - Check your email for 6-digit code
   - Enter code in modal
   - Order should process after verification

2. **Common Issues:**
   - **Email not received:** Check spam folder
   - **Invalid OTP:** OTP expires in 60 minutes
   - **Rate limiting:** Wait 60 seconds between resends

## Features

✅ **6-digit OTP** sent via email
✅ **Auto-focus** on OTP input fields
✅ **Paste support** for OTP codes
✅ **60-second cooldown** before resend
✅ **Error handling** for invalid/expired codes
✅ **Beautiful modal UI** with gradient design
✅ **Automatic order processing** after verification

## Security Benefits

- ✅ Confirms valid email address
- ✅ Prevents fake orders with invalid emails
- ✅ Reduces fraud and spam orders
- ✅ Builds customer trust
- ✅ GDPR compliant (no user account created)

## Customization

### Change OTP Length
Edit `/app/api/otp/verify/route.ts`:
```typescript
if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
  // Change to 4-digit: if (otp.length !== 4 || !/^\d{4}$/.test(otp))
}
```

### Change Cooldown Timer
Edit `/components/checkout/OTPVerificationModal.tsx`:
```typescript
setResendCooldown(60) // Change to 30 for 30 seconds
```

### Disable OTP (for testing)
Comment out the verification check in `/app/checkout/page.tsx`:
```typescript
// if (!emailVerified) { ... }
// setEmailVerified(true) // Auto-verify for testing
```

## Cost

- **Supabase Free Tier:** Includes email sending
- **Custom SMTP:**
  - Gmail: Free (with limits)
  - SendGrid: Free tier includes 100 emails/day
  - AWS SES: $0.10 per 1,000 emails

## Support

If emails are not being sent:
1. Check Supabase logs: Dashboard → Logs
2. Verify email settings are correct
3. Check spam folder
4. Try with a different email provider
5. Ensure `shouldCreateUser: false` in OTP config

## Next Steps

After testing, you can:
- Add phone OTP verification (MSG91/Twilio)
- Customize email templates with your logo
- Add order confirmation emails
- Set up shipping notifications
